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
import { z } from "zod";
import { isNumber } from "@/shared/isType";
import { createApiExpenseSchema } from "@/modules/expenses/schemas/apiFormExpenseSchema";
import { getLoggedUser } from "@/lib/auth";
import { getParsedSubCategoriesByIds } from "@/modules/expenses/services";

const {
  USER_HAS_NO_PERMISSION,
  CREDIT_CARD_NOT_FOUND,
  USER_NOT_FOUND,
  INTERNAL_SERVER_ERROR,
  SUB_CATEGORY_NOT_FOUND,
  VALIDATION_ERROR,
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
      subCategories,
      description,
      amount,
      isPaid,
      registrationDate,
    } = expense;

    let createExpenseData: any = {
      userId,
      name,
      description,
      registrationDate: startOfDay(new Date(registrationDate!)),
    };

    if (Array.isArray(subCategories)) {
      createExpenseData = {
        ...createExpenseData,
        ...(await getParsedSubCategoriesByIds(subCategories)),
      };
    }

    await prisma.expense.update({
      where: { id: params?.id },
      data: createExpenseData,
    });
    return NextResponse.json(expense, { status: 201 });
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
