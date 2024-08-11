import { CONSTANTS } from "@/shared/constants";
import { NextRequest, NextResponse } from "next/server";
import { AuthService } from "@/modules/auth/service";
import { TransitionHistoryService } from "@/modules/transitionHistory/service";
import {
  Prisma,
  TransitionHistoryFrequency,
  TransitionHistoryPaymantType,
  TransitionHistoryStatus,
  TransitionType,
} from "@prisma/client";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { createApiTransitionHistorySchema } from "@/modules/transitionHistory/schemas/apiFormTransitionHistoryReceiveSchema";
import { handleZodValidationError } from "@/lib/zodHelpers";
import { isNumber } from "@/shared/isType";
import { getRange } from "@/shared/getRange";
import { addMonths } from "date-fns";

const {
  USER_HAS_NO_PERMISSION,
  USER_NOT_FOUND,
  CREDIT_CARD_NOT_FOUND,
  CATEGORY_NOT_FOUND,
} = CONSTANTS.API_RESPONSE_MESSAGES;

export async function GET(request: NextRequest) {
  const { loggedUser } = await AuthService.getLoggedUser(request);
  if (!loggedUser) {
    return NextResponse.json(
      { message: USER_HAS_NO_PERMISSION },
      { status: 401 }
    );
  }
  const userId = loggedUser?.id;

  const { searchParams } = new URL(request.url);
  const paginedransitionsHistory =
    await TransitionHistoryService.getListByUserId(String(userId), {
      searchParams,
    });
  return NextResponse.json(paginedransitionsHistory, { status: 200 });
}

export async function POST(request: NextRequest) {
  const { loggedUser } = await AuthService.getLoggedUser(request);
  if (!loggedUser) {
    return NextResponse.json(
      { message: USER_HAS_NO_PERMISSION },
      { status: 401 }
    );
  }
  const userId = loggedUser?.id;
  const transitionHistory = (await request.json()) as z.infer<
    typeof createApiTransitionHistorySchema
  >;

  try {
    createApiTransitionHistorySchema.parse(transitionHistory);
  } catch (error: any) {
    return NextResponse.json(handleZodValidationError(error), { status: 400 });
  }
  try {
    const {
      name,
      categoryId,
      amount,
      isPaid,
      type,
      paymentType,
      frequency,
      totalInstallments,
      creditCardId,
      registrationDate,
    } = transitionHistory;

    let createTranstionHistoryData: any = {
      userId,
      categoryId,
      name,
      frequency,
      amount,
      type,
      registrationDate: new Date(`${registrationDate} 12:00`),
    };

    if (type === TransitionType.RECEIPT) {
      createTranstionHistoryData.status = TransitionHistoryStatus.PAID;
      createTranstionHistoryData.paymentType =
        paymentType as TransitionHistoryPaymantType;
      createTranstionHistoryData.paidAt =
        createTranstionHistoryData.registrationDate;
    } else if (isPaid) {
      createTranstionHistoryData.status = TransitionHistoryStatus.PAID;
      createTranstionHistoryData.paymentType =
        paymentType as TransitionHistoryPaymantType;
    }

    if (creditCardId) {
      createTranstionHistoryData.creditCardId = creditCardId;
      createTranstionHistoryData.paymentType =
        TransitionHistoryPaymantType.CREDIT_CARD;

      createTranstionHistoryData.dueDate =
        await TransitionHistoryService.getDueDateByRegistrationDateAndCreditCardId(
          new Date(registrationDate),
          creditCardId
        );

      createTranstionHistoryData.status =
        TransitionHistoryService.getStatusByDueDate(
          new Date(createTranstionHistoryData.dueDate)
        );
    }

    const createTranstionHistoryDataArray = [createTranstionHistoryData];

    if (
      !isPaid &&
      createTranstionHistoryData?.creditCardId &&
      createTranstionHistoryData?.frequency ===
        TransitionHistoryFrequency.MONTHLY &&
      isNumber(totalInstallments)
    ) {
      createTranstionHistoryDataArray[0].totalInstallments = totalInstallments;
      createTranstionHistoryDataArray[0].currentInstallment = 1;
      getRange(2, totalInstallments as number).forEach(
        (currentInstallment, index) => {
          const newDueDate = addMonths(
            new Date(createTranstionHistoryDataArray[0]?.dueDate),
            index + 1
          );
          const newStatus =
            TransitionHistoryService.getStatusByDueDate(newDueDate);
          createTranstionHistoryDataArray.push({
            ...createTranstionHistoryDataArray[0],
            dueDate: newDueDate,
            status: newStatus,
            currentInstallment,
          });
        }
      );
    }

    await prisma.transitionHistory.createMany({
      data: createTranstionHistoryDataArray,
    });
    return NextResponse.json(transitionHistory, { status: 201 });
  } catch (error: any) {
    console.log({ apiError: error });
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error?.meta?.field_name === "creditCardId") {
        return NextResponse.json(
          { message: CREDIT_CARD_NOT_FOUND },
          { status: 404 }
        );
      }
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
