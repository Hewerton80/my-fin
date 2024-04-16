import { verifyIfUserIsTeacher } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { parseExpenseSearchParams, prismaPagination } from "@/lib/prismaHelpers";
import { CONSTANTS } from "@/shared/constants";
import { ExpernseWithComputedFields, getExpensesWitchComputedFields } from "@/types/Expense";
import { Prisma } from "@prisma/client";
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
  const { searchParams } = new URL(request.url);
  const { currentPage,perPage} = parseExpenseSearchParams(searchParams);
  const expenses = await prisma.expense.findMany({
    include: {
      subCategories: { select: { id: true, name: true } },
      creditCard: { select: { id: true, name: true } },
    },

    // include: {  },
  });
  const paginedExpenses = await prismaPagination<
  ExpernseWithComputedFields,
  Prisma.ExpenseWhereInput,
  Prisma.ExpenseOrderByWithRelationInput,
  Prisma.ExpenseInclude
>({
  model: prisma.expense,
  paginationArgs: { currentPage, perPage },
  include: {
    subCategories: { select: { id: true, name: true } },
    creditCard: { select: { id: true, name: true } },
  },
  // orderBy,
  // where: {
  //   isTeacher: role === "TEACHER" || undefined,
  //   isAdmin: role === "ADMIN" || undefined,
  //   gender,
  //   isActive,
  //   OR: [{ name: { contains: keyword } }, { email: { contains: keyword } }],
  // },
});
  paginedExpenses.docs = getExpensesWitchComputedFields(paginedExpenses.docs);
  return NextResponse.json(paginedExpenses, { status: 200 });
}
