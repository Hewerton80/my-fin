import prisma from "@/lib/prisma";
import { CONSTANTS } from "@/utils/constants";
import { NextRequest, NextResponse } from "next/server";
import {
  CategoryInsights,
  HistoricPaymentsInsights,
  HistoricReceiptsInsights,
} from "@/modules/dashboard/types";
import { sortObjectsByProperty } from "@/utils/array";
import { AuthService } from "@/modules/auth/service";
import { CreditCardService } from "@/modules/creditCard/service";
import { format, startOfYear, endOfYear } from "date-fns";

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

  const startOfYearDate = format(startOfYear(date), "yyyy-MM-dd HH:mm");
  const endOfYearDate = format(endOfYear(date), "yyyy-MM-dd HH:mm");

  const categoriesInsights =
    (await prisma.$queryRaw<CategoryInsights[]>`
      SELECT Category.id, Category.name, Category.iconName, ROUND(SUM(TransitionHistory.amount), 2) as amount, CAST(COUNT(TransitionHistory.id) AS CHAR(32)) as count
      FROM TransitionHistory
      JOIN  Category on TransitionHistory.categoryId  = Category.id
      WHERE TransitionHistory.paidAt BETWEEN ${startOfYearDate} and ${endOfYearDate} AND 
      TransitionHistory.userId = ${userId} AND TransitionHistory.type = 'PAYMENT'
      GROUP BY Category.name;
  `) || [];

  const { oweCreditCardInsights, paidCreditCardInsights } =
    await CreditCardService.getInsightsByUserId(userId, { year });

  const historicPaymentsInsights =
    (await prisma.$queryRaw<HistoricPaymentsInsights[]>`
    SELECT DATE_FORMAT(TransitionHistory.paidAt, '%b') AS name, ROUND(SUM(TransitionHistory.amount), 2) as amount, CAST(COUNT(TransitionHistory.id) AS CHAR(32)) as count
    FROM TransitionHistory
    WHERE TransitionHistory.paidAt BETWEEN ${startOfYearDate} and ${endOfYearDate} AND 
    TransitionHistory.userId = ${userId} AND TransitionHistory.type = 'PAYMENT'
    GROUP BY DATE_FORMAT(TransitionHistory.paidAt, '%b')
    ORDER BY DATE_FORMAT(TransitionHistory.paidAt, '%m')
  `) || [];

  console.log("historicPaymentsInsights", historicPaymentsInsights);

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
        array: categoriesInsights,
        sortBy: "amount",
        order: "desc",
      }),
      paidCreditCardInsights,
      oweCreditCardInsights,
      historicPaymentsInsights,
      historicReceiptsInsights,
      historicInsights,
    },
    { status: 200 }
  );
}
