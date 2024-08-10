import prisma from "@/lib/prisma";
import { CONSTANTS } from "@/shared/constants";
import { NextRequest, NextResponse } from "next/server";
import { endOfYear } from "date-fns/endOfYear";
import { startOfYear } from "date-fns/startOfYear";
import {
  CreditCardInsights,
  CategoryInsights,
  HistoricPaymentsInsights,
  HistoricReceiptsInsights,
  ExpenseStatusInsights,
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
      FROM TransitionHistory
      JOIN  Category on TransitionHistory.categoryId  = Category.id
      WHERE TransitionHistory.paidAt BETWEEN ${startOfYearDate} and ${endOfYearDate} AND 
      TransitionHistory.userId = ${userId} AND TransitionHistory.type = 'PAYMENT'
      GROUP BY Category.name;
  `) || [];

  const paidCreditCardExpensesInsights =
    (await prisma.$queryRaw<CreditCardInsights[]>`
      SELECT CreditCard.name, CreditCard.color as color, ROUND(SUM(TransitionHistory.amount), 2) as amount
      FROM TransitionHistory 
      JOIN  CreditCard on TransitionHistory.creditCardId  = CreditCard.id
      WHERE TransitionHistory.paidAt BETWEEN ${startOfYearDate} and ${endOfYearDate} AND 
      TransitionHistory.userId = ${userId} AND TransitionHistory.type = 'PAYMENT' AND
      TransitionHistory.status = 'PAID'
      GROUP BY CreditCard.name;
  `) || [];

  const oweCreditCardExpensesInsights =
    (await prisma.$queryRaw<CreditCardInsights[]>`
    SELECT CreditCard.name, CreditCard.color as color, ROUND(SUM(TransitionHistory.amount), 2) as amount, CAST(COUNT(TransitionHistory.id) AS CHAR(32)) as count
    FROM TransitionHistory 
    JOIN  CreditCard on TransitionHistory.creditCardId  = CreditCard.id
    WHERE TransitionHistory.dueDate <= ${endOfYearDate} AND 
    TransitionHistory.status <> 'PAID' AND TransitionHistory.status <> 'CANCELED' AND
    TransitionHistory.userId = ${userId}
    GROUP BY CreditCard.id;
  `) || [];

  const historicPaymentsInsights =
    (await prisma.$queryRaw<HistoricPaymentsInsights[]>`
    SELECT DATE_FORMAT(TransitionHistory.paidAt, '%b') AS name, ROUND(SUM(TransitionHistory.amount), 2) as amount, CAST(COUNT(TransitionHistory.id) AS CHAR(32)) as count
    FROM TransitionHistory
    WHERE TransitionHistory.paidAt BETWEEN ${startOfYearDate} and ${endOfYearDate} AND 
    TransitionHistory.userId = ${userId} AND TransitionHistory.type = 'PAYMENT'
    GROUP BY DATE_FORMAT(TransitionHistory.paidAt, '%b')
    ORDER BY DATE_FORMAT(TransitionHistory.paidAt, '%m')
  `) || [];

  const historicReceiptsInsights =
    (await prisma.$queryRaw<HistoricReceiptsInsights[]>`
   SELECT DATE_FORMAT(TransitionHistory.paidAt, '%b') AS name, ROUND(SUM(TransitionHistory.amount), 2) as amount, CAST(COUNT(TransitionHistory.id) AS CHAR(32)) as count
    FROM TransitionHistory
    WHERE TransitionHistory.paidAt BETWEEN ${startOfYearDate} and ${endOfYearDate} AND 
    TransitionHistory.userId = ${userId} AND TransitionHistory.type = 'RECEIPT'
    GROUP BY DATE_FORMAT(TransitionHistory.paidAt, '%b')
    ORDER BY DATE_FORMAT(TransitionHistory.paidAt, '%m')
  `) || [];

  const historicInsights =
    (await prisma.$queryRaw<HistoricReceiptsInsights[]>`
    SELECT 
    	DATE_FORMAT(TransitionHistory.paidAt, '%b') AS name,     
	    ROUND(SUM(CASE WHEN type = 'RECEIPT' THEN amount ELSE 0 END), 2) AS receiptsAmount,
	    ROUND(SUM(CASE WHEN type = 'PAYMENT' THEN amount ELSE 0 END), 2) AS paymentsAmount
    FROM TransitionHistory
    WHERE TransitionHistory.paidAt BETWEEN ${startOfYearDate} and ${endOfYearDate} AND 
    TransitionHistory.userId = ${userId}    
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
      paidCreditCardExpensesInsights,
      oweCreditCardExpensesInsights,
      historicPaymentsInsights,
      historicReceiptsInsights,
      historicInsights,
    },
    { status: 200 }
  );
}
