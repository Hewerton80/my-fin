import { NextAuthOptions } from "@/lib/nextAuthConfig";
import prisma from "@/lib/prisma";
import { CONSTANTS } from "@/shared/constants";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { endOfYear } from "date-fns/endOfYear";
import { startOfYear } from "date-fns/startOfYear";
import { Prisma } from "@prisma/client";
import { Dashboard, Insights } from "@/modules/dashboard/types";
import { sortObjectsByProperty } from "@/shared/array";

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

  const startOfYearDate = startOfYear(date).toISOString();
  const endOfYearDate = endOfYear(date).toISOString();

  const insights =
    (await prisma.$queryRaw<Insights[]>`
    select Category.name, ROUND(SUM(TransitionHistory.amount), 2) as amount, CAST(COUNT(TransitionHistory.name) AS CHAR(32)) as count
    FROM Expense
    JOIN TransitionHistory on Expense.id = TransitionHistory.expenseId
    JOIN  Category on Expense.categoryId  = Category.id
    where TransitionHistory.paidAt BETWEEN ${startOfYearDate} and ${endOfYearDate} AND 
    Expense.userId = ${userId}
    GROUP BY Category.name;
  `) || [];
  return NextResponse.json(
    {
      insights: sortObjectsByProperty({
        array: insights,
        sortBy: "amount",
        order: "desc",
      }),
    },
    { status: 200 }
  );
}
