import prisma from "@/lib/prisma";
import { CONSTANTS } from "@/shared/constants";
import { NextRequest, NextResponse } from "next/server";
import { endOfYear } from "date-fns/endOfYear";
import { startOfYear } from "date-fns/startOfYear";
import {
  CreditCardInsights,
  CategoryInsights,
} from "@/modules/dashboard/types";
import { sortObjectsByProperty } from "@/shared/array";
import { AuthService } from "@/modules/auth/service";

export async function GET(request: NextRequest) {
  const { loggedUser } = await AuthService.getLoggedUser(request);
  if (!loggedUser) {
    return NextResponse.json(
      { message: CONSTANTS.API_RESPONSE_MESSAGES.USER_HAS_NO_PERMISSION },
      { status: 401 }
    );
  }
  const userId = loggedUser?.id;
  const year = new Date().getFullYear();
  const date = new Date();
  date.setFullYear(year);

  const startOfYearDate = startOfYear(date).toISOString();
  const endOfYearDate = endOfYear(date).toISOString();

  const insights =
    (await prisma.$queryRaw<CategoryInsights[]>`
      SELECT Category.id, Category.name, Category.iconName, ROUND(SUM(TransitionHistory.amount), 2) as amount, CAST(COUNT(TransitionHistory.id) AS CHAR(32)) as count
      FROM Expense
      JOIN TransitionHistory on Expense.id = TransitionHistory.expenseId
      JOIN  Category on Expense.categoryId  = Category.id
      WHERE TransitionHistory.paidAt BETWEEN ${startOfYearDate} and ${endOfYearDate} AND 
      Expense.userId = ${userId}
      GROUP BY Category.name;
  `) || [];

  const creditCardInsights =
    (await prisma.$queryRaw<CreditCardInsights[]>`
      SELECT CreditCard.name, CreditCard.color as color, ROUND(SUM(TransitionHistory.amount), 2) as amount, CAST(COUNT(TransitionHistory.id) AS CHAR(32)) as count
      FROM Expense 
      JOIN TransitionHistory on Expense.id = TransitionHistory.expenseId
      JOIN  CreditCard on Expense.creditCardId  = CreditCard.id
      WHERE TransitionHistory.paidAt BETWEEN ${startOfYearDate} and ${endOfYearDate} AND 
      Expense.userId = ${userId}
      GROUP BY CreditCard.name;
  `) || [];

  const frequencyInsights =
    (await prisma.$queryRaw<CreditCardInsights[]>`
    SELECT Expense.frequency as name, ROUND(SUM(TransitionHistory.amount), 2) as amount, CAST(COUNT(Expense.id) AS CHAR(32)) as count
    FROM Expense
    JOIN TransitionHistory on Expense.id = TransitionHistory.expenseId
    WHERE TransitionHistory.paidAt BETWEEN ${startOfYearDate} and ${endOfYearDate} AND 
    Expense.userId = ${userId}
    GROUP BY Expense.frequency;
  `) || [];

  const historicInsights =
    (await prisma.$queryRaw<CreditCardInsights[]>`
    SELECT DATE_FORMAT(TransitionHistory.paidAt, '%b') AS name, ROUND(SUM(TransitionHistory.amount), 2) as amount, CAST(COUNT(TransitionHistory.id) AS CHAR(32)) as count
    FROM Expense
    JOIN TransitionHistory on Expense.id = TransitionHistory.expenseId
    WHERE TransitionHistory.paidAt BETWEEN ${startOfYearDate} and ${endOfYearDate} AND 
    Expense.userId = ${userId}
    GROUP BY DATE_FORMAT(TransitionHistory.paidAt, '%b')
    ORDER BY DATE_FORMAT(TransitionHistory.paidAt, '%m')
  `) || [];

  return NextResponse.json(
    {
      categoryInsights: sortObjectsByProperty({
        array: insights,
        sortBy: "amount",
        order: "desc",
      }),
      creditCardInsights,
      frequencyInsights,
      historicInsights,
    },
    { status: 200 }
  );
}
