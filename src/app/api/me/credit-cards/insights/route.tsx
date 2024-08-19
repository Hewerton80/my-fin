import prisma from "@/lib/prisma";
import { AuthService } from "@/modules/auth/service";
import { CreditCardService } from "@/modules/creditCard/service";
import { CreditCardInsights } from "@/modules/dashboard/types";
import { TransitionHistoryService } from "@/modules/transitionHistory/service";
import { CONSTANTS } from "@/utils/constants";
import { isNumberable } from "@/utils/isType";
import { startOfMonth, format, isValid as isValidDate } from "date-fns";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { loggedUser } = await AuthService.getLoggedUser(request);
  if (!loggedUser) {
    return NextResponse.json(
      { message: CONSTANTS.API_RESPONSE_MESSAGES.USER_HAS_NO_PERMISSION },
      { status: 401 }
    );
  }
  const userId = loggedUser?.id;
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");
  let now = new Date();
  if (date && isValidDate(new Date(date as string))) {
    now = new Date(date as string);
  }
  const startOfMonthDate = startOfMonth(now);
  const creditCards = await CreditCardService.getListByUserId(userId);
  let graterDueDate = new Date();
  for (const creditCard of creditCards) {
    const { dueDate } =
      TransitionHistoryService.getDueDateAndReferenceMonthByRegistrationDateAndCreditCard(
        startOfMonthDate,
        creditCard
      );
    if (graterDueDate < dueDate) {
      graterDueDate = dueDate;
    }
  }
  const formatedgraterDueDate = format(graterDueDate, "yyyy-MM-dd");
  const oweCreditCardInsights =
    (await prisma.$queryRaw<CreditCardInsights[]>`
    SELECT CreditCard.name, CreditCard.color as color, ROUND(SUM(TransitionHistory.amount), 2) as amount, CAST(COUNT(TransitionHistory.id) AS CHAR(32)) as count
    FROM TransitionHistory 
    JOIN  CreditCard on TransitionHistory.creditCardId  = CreditCard.id
    WHERE TransitionHistory.dueDate <= LAST_DAY(${formatedgraterDueDate}) AND 
    TransitionHistory.status <> 'PAID' AND TransitionHistory.status <> 'CANCELED' AND
    TransitionHistory.userId = ${userId}
    GROUP BY CreditCard.id;
  `) || [];

  return NextResponse.json(
    {
      creditCards,
      oweCreditCardInsights,
    },
    { status: 200 }
  );
}
