import prisma from "@/lib/prisma";
import { CONSTANTS } from "@/shared/constants";
import { isNull } from "@/shared/isType";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { handleZodValidationError } from "@/lib/zodHelpers";
import { AuthService } from "@/modules/auth/service";
import { payTransitionHistorySchema } from "@/modules/transitionHistory/schemas/apiFormTransitionHistoryReceiveSchema";
import { addMonths } from "date-fns";
import { TransitionHistoryService } from "@/modules/transitionHistory/service";

const {
  USER_HAS_NO_PERMISSION,
  TRANSTION_HISTORY_NOT_FOUND,
  EXPENSE_IS_CANCELED,
  EXPENSE_ALREADY_PAID,
} = CONSTANTS.API_RESPONSE_MESSAGES;

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { loggedUser } = await AuthService.getLoggedUser(request);
  if (!loggedUser) {
    return NextResponse.json(
      { message: USER_HAS_NO_PERMISSION },
      { status: 401 }
    );
  }
  const userId = loggedUser?.id;
  const transitionUpdateData = (await request.json()) as z.infer<
    typeof payTransitionHistorySchema
  >;
  try {
    payTransitionHistorySchema.parse(transitionUpdateData);
  } catch (error: any) {
    return NextResponse.json(handleZodValidationError(error), { status: 400 });
  }

  const transition = await prisma.transitionHistory.findUnique({
    where: { id: params?.id, userId },
    include: { creditCard: true },
  });

  if (!transition) {
    return NextResponse.json(
      { message: TRANSTION_HISTORY_NOT_FOUND },
      { status: 404 }
    );
  }

  if (transition?.status === "PAID") {
    return NextResponse.json(
      { message: EXPENSE_ALREADY_PAID },
      { status: 400 }
    );
  }
  if (transition?.status === "CANCELED") {
    return NextResponse.json({ message: EXPENSE_IS_CANCELED }, { status: 400 });
  }

  try {
    await prisma.transitionHistory.update({
      where: { id: params?.id },
      data: { status: "PAID", paidAt: new Date() },
    });
  } catch (error: any) {
    return NextResponse.json(error, { status: 500 });
  }
  const frequency = transition?.frequency;
  const dueDate = transition?.dueDate;
  const hasNotInstallments =
    isNull(transition?.totalInstallments) &&
    isNull(transition?.currentInstallment);

  if (frequency === "MONTHLY" && dueDate && hasNotInstallments) {
    try {
      const nextRegistrationDate = addMonths(
        new Date(transition?.registrationDate!),
        1
      );
      let nextDueDate = addMonths(new Date(dueDate), 1);
      let nextReferenceMonth = addMonths(
        new Date(transition?.referenceMonth!),
        1
      );
      if (transition?.creditCard!) {
        const { dueDate, referenceMonth } =
          TransitionHistoryService.getDueDateAndReferenceMonthByRegistrationDateAndCreditCard(
            nextRegistrationDate,
            transition?.creditCard!
          );
        nextDueDate = dueDate;
        nextReferenceMonth = referenceMonth;
      }
      delete (transition as any)?.id;
      delete (transition as any)?.createdAt;
      delete (transition as any)?.creditCard;
      await prisma.transitionHistory.create({
        data: {
          ...(transition as any),
          dueDate: nextDueDate,
          registrationDate: nextRegistrationDate,
          referenceMonth: nextReferenceMonth,
          status: TransitionHistoryService.getStatusByDueDate(nextDueDate),
        },
      });
    } catch (error: any) {
      await prisma.transitionHistory.update({
        where: { id: params?.id },
        data: { status: transition?.status },
      });
      return NextResponse.json(error, { status: 500 });
    }
  }
  return NextResponse.json({ message: "ok" }, { status: 200 });
}
