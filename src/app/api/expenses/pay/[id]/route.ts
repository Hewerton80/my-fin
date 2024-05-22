import prisma from "@/lib/prisma";
import {
  parseExpenseSearchParams,
  prismaPagination,
} from "@/lib/prismaHelpers";
import { handleZodValidationError } from "@/lib/zodHelpers";
import { CONSTANTS } from "@/shared/constants";
import { endOfDay } from "date-fns/endOfDay";
import { startOfDay } from "date-fns/startOfDay";
import { Frequency, PaymantType, Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { isNumber } from "@/shared/isType";
import { createApiExpenseSchema } from "@/modules/expenses/schemas/apiFormExpenseSchema";
import { getLoggedUser } from "@/lib/auth";

const {
  USER_HAS_NO_PERMISSION,
  EXPENSE_NOT_FOUND,
  INTERNAL_SERVER_ERROR,
  VALIDATION_ERROR,
  EXPENSE_ALREADY_PAID,
} = CONSTANTS.API_RESPONSE_MESSAGES;

const userId = "clw3lfm92001z20gvmiux3f4h";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // if (!(await verifyIfUserIsTeacher(request))) {
  //   return NextResponse.json(
  //     { message: USER_HAS_NO_PERMISSION },
  //     { status: 401 }
  //   );
  // }
  //   const loggedUser = getLoggedUser(request);
  const expense = await prisma.expense.findUnique({
    where: { id: params?.id, userId },
  });
  if (!expense) {
    return NextResponse.json({ message: EXPENSE_NOT_FOUND }, { status: 404 });
  }
  if (expense?.isPaid) {
    return NextResponse.json(
      { message: EXPENSE_ALREADY_PAID },
      { status: 400 }
    );
  }

  const frequency = expense?.frequency;
  const dueDate = expense?.dueDate;
  const totalInstallments = expense?.totalInstallments;
  const currentInstallment = expense?.currentInstallment;
  const hasInstallments =
    isNumber(totalInstallments) && isNumber(currentInstallment);
  const nextInstallment = hasInstallments ? currentInstallment! + 1 : null;
  const isLastInstallment =
    hasInstallments && nextInstallment === totalInstallments;

  const transitionHistory = {
    create: {
      name: expense?.name,
      amount: expense?.amount || null,
      totalInstallments: expense?.totalInstallments || null,
      currentInstallment: expense?.currentInstallment || null,
    },
  };

  let expenseData: Prisma.ExpenseUpdateInput = { transitionHistory };

  if (isLastInstallment) {
    expenseData = { ...expenseData, isPaid: true, dueDate: null };
  } else if (hasInstallments && !isLastInstallment) {
    expenseData = {
      ...expenseData,
      currentInstallment: currentInstallment! + 1,
    };
  }

  if (frequency === Frequency.DO_NOT_REPEAT) {
    expenseData = { ...expenseData, isPaid: true, dueDate: null };
  } else if (dueDate && frequency) {
    const newDueDate = new Date(dueDate);
    switch (frequency) {
      case Frequency.DAILY:
        newDueDate.setDate(newDueDate.getDate() + 1);
        break;
      case Frequency.MONTHLY:
        newDueDate.setMonth(newDueDate.getMonth() + 1);
        break;
      case Frequency.YEARLY:
        newDueDate.setFullYear(newDueDate.getFullYear() + 1);
        break;
    }
    expenseData = { ...expenseData, dueDate: newDueDate };
  }
  try {
    await prisma.expense.update({
      where: { id: params?.id },
      data: expenseData,
    });
    return NextResponse.json(expenseData, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(error, { status: 500 });
  }
}
