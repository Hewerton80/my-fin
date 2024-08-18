import { CONSTANTS } from "@/shared/constants";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { AuthService } from "@/modules/auth/service";
import { z } from "zod";
import { updateApiTransitionHistorySchema } from "@/modules/transitionHistory/schemas/apiFormTransitionHistoryReceiveSchema";
import { handleZodValidationError } from "@/lib/zodHelpers";
import { TransitionHistoryService } from "@/modules/transitionHistory/service";
import { Prisma } from "@prisma/client";

const {
  USER_HAS_NO_PERMISSION,
  CATEGORY_NOT_FOUND,
  USER_NOT_FOUND,
  TRANSTION_HISTORY_NOT_FOUND,
} = CONSTANTS.API_RESPONSE_MESSAGES;

export async function GET(
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

  const transitionId = params?.id;

  const transition = await prisma.transitionHistory.findUnique({
    where: {
      id: transitionId,
      userId: loggedUser.id,
    },
    include: {
      expense: { select: { id: true, name: true } },
      category: { select: { id: true, name: true, iconName: true } },
      creditCard: { select: { id: true, name: true, color: true } },
    },
  });

  if (!transition) {
    return NextResponse.json(
      { message: TRANSTION_HISTORY_NOT_FOUND },
      { status: 404 }
    );
  }

  return NextResponse.json(transition, { status: 200 });
}

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
  const transition = (await request.json()) as z.infer<
    typeof updateApiTransitionHistorySchema
  >;

  try {
    updateApiTransitionHistorySchema.parse(transition);
  } catch (error: any) {
    return NextResponse.json(handleZodValidationError(error), { status: 400 });
  }

  try {
    const currentTransition = await prisma.transitionHistory.findUnique({
      where: { id: params?.id, userId },
    });

    if (!currentTransition) {
      return NextResponse.json(
        { message: TRANSTION_HISTORY_NOT_FOUND },
        { status: 404 }
      );
    }
    const { name, categoryId, amount, registrationDate } = transition;
    const updateTransitionData: any = {
      userId,
      categoryId,
      name,
      amount,
      registrationDate: registrationDate
        ? new Date(`${registrationDate!} 12:00`)
        : undefined,
    };
    if (
      updateTransitionData?.registrationDate &&
      currentTransition?.creditCardId
    ) {
      const { dueDate, referenceMonth } =
        await TransitionHistoryService.getDueDateAndReferenceMonthByRegistrationDateAndCreditCardId(
          updateTransitionData?.registrationDate,
          currentTransition?.creditCardId
        );
      updateTransitionData.dueDate = dueDate;
      updateTransitionData.referenceMonth = referenceMonth;
      updateTransitionData.status = TransitionHistoryService.getStatusByDueDate(
        new Date(currentTransition?.dueDate!)
      );
    }
    await prisma.transitionHistory.update({
      where: { id: params?.id },
      data: updateTransitionData,
    });
    return NextResponse.json({ message: "ok" }, { status: 201 });
  } catch (error: any) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error?.meta?.field_name === "categoryId") {
        return NextResponse.json(
          { message: CATEGORY_NOT_FOUND },
          { status: 404 }
        );
      }
      if (error?.meta?.field_name === "userId") {
        return NextResponse.json({ message: USER_NOT_FOUND }, { status: 404 });
      }
    }
    return NextResponse.json(error, { status: 500 });
  }
}
