import { ExpenseServices } from "@/modules/expenses/service";
import { CONSTANTS } from "@/shared/constants";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { handleZodValidationError } from "@/lib/zodHelpers";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { updateApiExpenseSchema } from "@/modules/expenses/schemas/apiFormExpenseSchema";
import { AuthService } from "@/modules/auth/service";
import { ExpenseUtils } from "@/modules/expenses/utils";

const {
  USER_HAS_NO_PERMISSION,
  USER_NOT_FOUND,
  SUB_CATEGORY_NOT_FOUND,
  EXPENSE_NOT_FOUND,
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
  const expenseWitchComputedFields = await ExpenseServices.getOneById(
    params?.id
  );
  return NextResponse.json(expenseWitchComputedFields, { status: 200 });
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

  const expense = (await request.json()) as z.infer<
    typeof updateApiExpenseSchema
  >;

  try {
    updateApiExpenseSchema.parse(expense);
  } catch (error: any) {
    return NextResponse.json(handleZodValidationError(error), { status: 400 });
  }
  try {
    const currentExpense = await ExpenseServices.getOneById(params?.id);

    if (!currentExpense) {
      return NextResponse.json({ message: EXPENSE_NOT_FOUND }, { status: 404 });
    }

    const { name, categoryId, description, amount, registrationDate } = expense;

    let updateExpenseData: any = {
      userId,
      categoryId,
      name,
      description,
      amount,
      registrationDate: registrationDate
        ? new Date(`${registrationDate!} 12:00`)
        : undefined,
    };
    if (updateExpenseData?.registrationDate) {
      updateExpenseData.dueDate =
        await ExpenseServices.getDueDateAndReferenceMonthByRegistrationDateAndCreditCardId(
          updateExpenseData?.registrationDate,
          currentExpense?.creditCardId!
        );

      updateExpenseData.status = ExpenseUtils.getExpenseStatusByDueDate({
        dueDate: new Date(currentExpense?.dueDate!),
        status: currentExpense?.status,
      });
    }

    await prisma.expense.update({
      where: { id: params?.id },
      data: updateExpenseData,
    });

    return NextResponse.json({ message: "ok" }, { status: 201 });
  } catch (error: any) {
    console.log(error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error?.code === "P2018") {
        return NextResponse.json(
          { message: SUB_CATEGORY_NOT_FOUND },
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
