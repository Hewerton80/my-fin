import prisma from "@/lib/prisma";
import { handleZodValidationError } from "@/lib/zodHelpers";
import { CONSTANTS } from "@/shared/constants";
import { endOfDay } from "date-fns/endOfDay";
import { ExpenseStatus, Frequency, PaymantType, Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { isNumber } from "@/shared/isType";
import { createApiExpenseSchema } from "@/modules/expenses/schemas/apiFormExpenseSchema";
import { ExpenseServices } from "@/modules/expenses/service";
import { AuthService } from "@/modules/auth/service";
import { ExpenseUtils } from "@/modules/expenses/utils";

const {
  USER_HAS_NO_PERMISSION,
  CREDIT_CARD_NOT_FOUND,
  CATEGORY_NOT_FOUND,
  USER_NOT_FOUND,
  SUB_CATEGORY_NOT_FOUND,
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
  const paginedExpenses = await ExpenseServices.getListByUserId(
    String(userId),
    searchParams
  );
  return NextResponse.json(paginedExpenses, { status: 200 });
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
  const expense = (await request.json()) as z.infer<
    typeof createApiExpenseSchema
  >;

  try {
    createApiExpenseSchema.parse(expense);
  } catch (error: any) {
    return NextResponse.json(handleZodValidationError(error), { status: 400 });
  }
  try {
    const {
      name,
      categoryId,
      description,
      amount,
      isPaid,
      paymentType,
      frequency,
      totalInstallments,
      creditCardId,
      registrationDate,
    } = expense;

    let createExpenseData: any = {
      userId,
      categoryId,
      name,
      description,
      amount,
      isPaid,
      registrationDate: registrationDate
        ? new Date(`${registrationDate!} 12:00`)
        : undefined,
    };

    if (isPaid) {
      createExpenseData.status = ExpenseStatus.PAID;
      createExpenseData.paymentType = paymentType as PaymantType;
      createExpenseData.transitionHistory = {
        create: { amount, paidAt: createExpenseData.registrationDate, userId },
      };
      if (paymentType === PaymantType.CREDIT_CARD) {
        createExpenseData.creditCardId = creditCardId;
      }
    } else {
      createExpenseData.frequency = frequency as Frequency;
      createExpenseData.creditCardId = creditCardId;
      if (
        frequency !== Frequency.DO_NOT_REPEAT &&
        isNumber(totalInstallments)
      ) {
        createExpenseData.totalInstallments = totalInstallments;
        createExpenseData.currentInstallment = 1;
      }
    }

    if (createExpenseData?.creditCardId) {
      createExpenseData.paymentType = PaymantType.CREDIT_CARD;

      createExpenseData.dueDate =
        await ExpenseServices.getDueDateAndReferenceMonthByRegistrationDateAndCreditCardId(
          new Date(registrationDate!),
          createExpenseData?.creditCardId
        );

      if (!isPaid) {
        createExpenseData.status = ExpenseUtils.getExpenseStatusByDueDate({
          dueDate: createExpenseData.dueDate,
        });
      }
    }
    await prisma.expense.create({ data: createExpenseData });
    return NextResponse.json(expense, { status: 201 });
  } catch (error: any) {
    console.log({ apiError: error });
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error?.code === "P2018") {
        return NextResponse.json(
          { message: SUB_CATEGORY_NOT_FOUND },
          { status: 404 }
        );
      }
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
