import prisma from "@/lib/prisma";
import { endOfYear, startOfYear, format } from "date-fns";
import { CreditCardInsights } from "../dashboard/types";

const getListByUserId = async (userId: string) => {
  return prisma.creditCard.findMany({ where: { userId } });
};

const getInsightsByUserId = async (
  userId: string,
  {
    year,
  }: {
    year: number;
  }
) => {
  const date = new Date();
  date.setFullYear(year);

  const startOfYearDate = format(startOfYear(date), "yyyy-MM-dd");
  const endOfYearDate = format(endOfYear(date), "yyyy-MM-dd");
  const paidCreditCardInsights =
    (await prisma.$queryRaw<CreditCardInsights[]>`
      SELECT CreditCard.name, CreditCard.color as color, ROUND(SUM(TransitionHistory.amount), 2) as amount
      FROM TransitionHistory 
      JOIN  CreditCard on TransitionHistory.creditCardId  = CreditCard.id
      WHERE TransitionHistory.paidAt BETWEEN LAST_DAY(${startOfYearDate}) and LAST_DAY(LAST_DAY(${endOfYearDate})) AND 
      TransitionHistory.userId = ${userId} AND TransitionHistory.type = 'PAYMENT' AND
      TransitionHistory.status = 'PAID'
      GROUP BY CreditCard.name;
  `) || [];

  const oweCreditCardInsights =
    (await prisma.$queryRaw<CreditCardInsights[]>`
    SELECT CreditCard.name, CreditCard.color as color, ROUND(SUM(TransitionHistory.amount), 2) as amount, CAST(COUNT(TransitionHistory.id) AS CHAR(32)) as count
    FROM TransitionHistory 
    JOIN  CreditCard on TransitionHistory.creditCardId  = CreditCard.id
    WHERE TransitionHistory.dueDate <= LAST_DAY(${endOfYearDate}) AND 
    TransitionHistory.status <> 'PAID' AND TransitionHistory.status <> 'CANCELED' AND
    TransitionHistory.userId = ${userId}
    GROUP BY CreditCard.id;
  `) || [];
  return { paidCreditCardInsights, oweCreditCardInsights };
};

export const CreditCardService = { getListByUserId, getInsightsByUserId };
