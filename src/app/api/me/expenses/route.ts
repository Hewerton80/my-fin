import prisma from "@/lib/prisma";
import { handleZodValidationError } from "@/lib/zodHelpers";
import { CONSTANTS } from "@/shared/constants";
import { endOfDay } from "date-fns/endOfDay";
import { Frequency, PaymantType, Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { isNumber } from "@/shared/isType";
import { createApiExpenseSchema } from "@/modules/expenses/schemas/apiFormExpenseSchema";
import { ExpenseServices } from "@/modules/expenses/service";
import { AuthService } from "@/modules/auth/service";

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
      createExpenseData.paymentType = paymentType as PaymantType;
      createExpenseData.transitionHistory = {
        create: { amount, paidAt: createExpenseData.registrationDate },
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
      const creditCard = await prisma.creditCard.findUnique({
        where: { id: creditCardId },
      });

      if (!creditCard) {
        return NextResponse.json(
          { message: CREDIT_CARD_NOT_FOUND },
          { status: 404 }
        );
      }

      createExpenseData.paymentType = PaymantType.CREDIT_CARD;
      const _registrationDate = new Date(registrationDate!);
      const currentDayOfMonth = _registrationDate.getDate();
      const creditCardDueDay = creditCard?.dueDay!;
      const creditCardInvoiceClosingDay = creditCard?.invoiceClosingDay!;
      const handledDueDate = new Date(
        _registrationDate.getFullYear(),
        _registrationDate.getMonth(),
        creditCardDueDay
      );
      if (creditCardInvoiceClosingDay <= creditCardDueDay) {
        if (currentDayOfMonth > creditCardInvoiceClosingDay) {
          handledDueDate.setMonth(handledDueDate.getMonth() + 1);
        }
      } else {
        if (currentDayOfMonth > creditCardInvoiceClosingDay) {
          handledDueDate.setMonth(handledDueDate.getMonth() + 2);
        } else {
          handledDueDate.setMonth(handledDueDate.getMonth() + 1);
        }
      }
      createExpenseData.dueDate = endOfDay(handledDueDate);
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
