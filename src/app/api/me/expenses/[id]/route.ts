import { NextAuthOptions } from "@/lib/nextAuthConfig";
import { ExpenseServices } from "@/modules/expenses/service";
import { CONSTANTS } from "@/shared/constants";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { handleZodValidationError } from "@/lib/zodHelpers";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { updateApiExpenseSchema } from "@/modules/expenses/schemas/apiFormExpenseSchema";

const { USER_HAS_NO_PERMISSION, USER_NOT_FOUND, SUB_CATEGORY_NOT_FOUND } =
  CONSTANTS.API_RESPONSE_MESSAGES;
export async function GET(
  _: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(NextAuthOptions);
  if (!session) {
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
  const session = await getServerSession(NextAuthOptions);
  if (!session) {
    return NextResponse.json(
      { message: USER_HAS_NO_PERMISSION },
      { status: 401 }
    );
  }
  const userId = session?.user?.id;

  const expense = (await request.json()) as z.infer<
    typeof updateApiExpenseSchema
  >;

  try {
    updateApiExpenseSchema.parse(expense);
  } catch (error: any) {
    return NextResponse.json(handleZodValidationError(error), { status: 400 });
  }
  try {
    const { name, subCategories, description, amount } = expense;

    let createExpenseData: any = {
      userId,
      name,
      description,
      amount,
    };

    if (Array.isArray(subCategories)) {
      createExpenseData = {
        ...createExpenseData,
        ...(await ExpenseServices.getParsedSubCategoriesByIds(subCategories)),
      };
    }

    await prisma.expense.update({
      where: { id: params?.id },
      data: createExpenseData,
    });
    const expenseWitchComputedFields = await ExpenseServices.getOneById(
      params?.id
    );
    return NextResponse.json(expenseWitchComputedFields, { status: 201 });
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
