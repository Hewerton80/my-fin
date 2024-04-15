import { verifyIfUserIsTeacher } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { CONSTANTS } from "@/shared/constants";
import { getExpensesWitchComputedFields } from "@/types/Expense";
import { NextRequest, NextResponse } from "next/server";
const { USER_HAS_NO_PERMISSION, INTERNAL_SERVER_ERROR, VALIDATION_ERROR } =
  CONSTANTS.API_RESPONSE_MENSSAGES;

export async function GET(request: NextRequest) {
  //   if (!(await verifyIfUserIsTeacher(request))) {
  //     return NextResponse.json(
  //       { message: USER_HAS_NO_PERMISSION },
  //       { status: 401 }
  //     );
  //   }
  const expenses = await prisma.expense.findMany({
    include: {
      subCategories: { select: { id: true, name: true } },
      creditCard: { select: { id: true, name: true } },
    },
    // include: {  },
  });
  const expensesWithComputedFields = getExpensesWitchComputedFields(expenses);
  return NextResponse.json(expensesWithComputedFields, { status: 200 });
}
