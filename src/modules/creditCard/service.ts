import prisma from "@/lib/prisma";
import { endOfYear, startOfYear } from "date-fns";
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

  const startOfYearDate = startOfYear(date).toISOString();
  const endOfYearDate = endOfYear(date).toISOString();
  const paidCreditCardInsights =
    (await prisma.$queryRaw<CreditCardInsights[]>`
      SELECT CreditCard.name, CreditCard.color as color, ROUND(SUM(TransitionHistory.amount), 2) as amount
      FROM TransitionHistory 
      JOIN  CreditCard on TransitionHistory.creditCardId  = CreditCard.id
      WHERE TransitionHistory.paidAt BETWEEN ${startOfYearDate} and ${endOfYearDate} AND 
      TransitionHistory.userId = ${userId} AND TransitionHistory.type = 'PAYMENT' AND
      TransitionHistory.status = 'PAID'
      GROUP BY CreditCard.name;
  `) || [];

  const oweCreditCardInsights =
    (await prisma.$queryRaw<CreditCardInsights[]>`
    SELECT CreditCard.name, CreditCard.color as color, ROUND(SUM(TransitionHistory.amount), 2) as amount, CAST(COUNT(TransitionHistory.id) AS CHAR(32)) as count
    FROM TransitionHistory 
    JOIN  CreditCard on TransitionHistory.creditCardId  = CreditCard.id
    WHERE TransitionHistory.dueDate <= ${endOfYearDate} AND 
    TransitionHistory.status <> 'PAID' AND TransitionHistory.status <> 'CANCELED' AND
    TransitionHistory.userId = ${userId}
    GROUP BY CreditCard.id;
  `) || [];
  return { paidCreditCardInsights, oweCreditCardInsights };
};

export const CreditCardService = { getListByUserId, getInsightsByUserId };
