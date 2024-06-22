import { NextAuthOptions } from "@/lib/nextAuthConfig";
import prisma from "@/lib/prisma";
import { CONSTANTS } from "@/shared/constants";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { endOfYear } from "date-fns/endOfYear";
import { startOfYear } from "date-fns/startOfYear";
import { Prisma } from "@prisma/client";

export async function GET(
  _: NextRequest,
  { params }: { params: { "category-id": string } }
) {
  const session = await getServerSession(NextAuthOptions);
  if (!session) {
    return NextResponse.json(
      { message: CONSTANTS.API_RESPONSE_MESSAGES.USER_HAS_NO_PERMISSION },
      { status: 401 }
    );
  }
  const userId = session?.user?.id;
  const year = new Date().getFullYear();
  const date = new Date();
  date.setFullYear(year);
  const startOfYearDate = startOfYear(date);
  const endOfYearDate = endOfYear(date);
  // console.log({ startOfYearDate, endOfYearDate });
  // const totalAmount = await prisma.transitionHistory.aggregate({
  //   _sum: { amount: true },
  //   _count: true,
  //   where: {
  //     expense: { userId },
  //     paidAt: { gte: startOfYearDate, lte: endOfYearDate },
  //   },
  // });
  // const isights = await prisma.$queryRaw`
  //   select SubCategory.name, SUM(TransitionHistory.amount) as amount, COUNT(TransitionHistory.name) as count
  //   FROM Expense
  //   JOIN TransitionHistory on Expense.id = TransitionHistory.expenseId
  //   JOIN _ExpenseToSubCategory on Expense.id = _ExpenseToSubCategory.A
  //   JOIN  SubCategory on _ExpenseToSubCategory.B = SubCategory.id
  //   where TransitionHistory.paidAt BETWEEN '2024-01-01 00:00:00' and '2024-12-31 23:59:59'
  //   GROUP BY SubCategory.name;
  // `;

  return NextResponse.json({}, { status: 200 });
}
