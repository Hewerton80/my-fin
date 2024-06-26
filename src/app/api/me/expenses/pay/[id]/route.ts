import prisma from "@/lib/prisma";
import { CONSTANTS } from "@/shared/constants";
import { Frequency, Prisma } from "@prisma/client";

import { isNumber } from "@/shared/isType";
import { ExpenseUtils } from "@/modules/expenses/utils";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { NextAuthOptions } from "@/lib/nextAuthConfig";
import { payExpenseSchema } from "@/modules/expenses/schemas/apiFormExpenseSchema";
import { z } from "zod";
import { handleZodValidationError } from "@/lib/zodHelpers";

const { USER_HAS_NO_PERMISSION, EXPENSE_NOT_FOUND, EXPENSE_ALREADY_PAID } =
  CONSTANTS.API_RESPONSE_MESSAGES;

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(NextAuthOptions);
  if (!session) {
    return NextResponse.json(
      { message: USER_HAS_NO_PERMISSION },
      { status: 401 }
    );
  }
  const userId = session?.user?.id;
  const expenseUpdateData = (await request.json()) as z.infer<
    typeof payExpenseSchema
  >;
  try {
    payExpenseSchema.parse(expenseUpdateData);
  } catch (error: any) {
    return NextResponse.json(handleZodValidationError(error), { status: 400 });
  }

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
    hasInstallments && currentInstallment === totalInstallments;

  const transitionHistory = {
    create: {
      name: expense?.name,
      amount: expense?.amount || null,
      totalInstallments: expense?.totalInstallments || null,
      currentInstallment: expense?.currentInstallment || null,
      paidAt: expenseUpdateData?.paidAt
        ? new Date(`${expenseUpdateData?.paidAt!} 12:00`)
        : undefined,
    },
  };

  let expenseData: Prisma.ExpenseUpdateInput = { transitionHistory };

  if (isLastInstallment) {
    expenseData = { ...expenseData, isPaid: true };
  } else if (hasInstallments && !isLastInstallment) {
    expenseData = {
      ...expenseData,
      currentInstallment: nextInstallment,
    };
  }

  if (frequency === Frequency.DO_NOT_REPEAT) {
    expenseData = { ...expenseData, isPaid: true };
  }
  if (dueDate && frequency && !isLastInstallment) {
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
    const updatedExpense = await prisma.expense.update({
      where: { id: params?.id },
      data: expenseData,
      include: {
        creditCard: { select: { id: true, name: true } },
      },
    });
    const expenseWitchComputedFields =
      ExpenseUtils.getWitchComputedFields(updatedExpense);
    return NextResponse.json(expenseWitchComputedFields, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(error, { status: 500 });
  }
}
