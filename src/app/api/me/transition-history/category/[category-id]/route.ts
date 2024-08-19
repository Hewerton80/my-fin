import prisma from "@/lib/prisma";
import { CONSTANTS } from "@/utils/constants";
import { NextRequest, NextResponse } from "next/server";
import { endOfYear } from "date-fns/endOfYear";
import { startOfYear } from "date-fns/startOfYear";
import { AuthService } from "@/modules/auth/service";

export async function GET(
  request: NextRequest,
  { params }: { params: { "category-id": string } }
) {
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
  const startOfYearDate = startOfYear(date);
  const endOfYearDate = endOfYear(date);
  // console.log({ startOfYearDate, endOfYearDate });
  const transitionsHistory = await prisma.transitionHistory.findMany({
    where: {
      userId,
      categoryId: { equals: params["category-id"] },
      paidAt: { gte: startOfYearDate, lte: endOfYearDate },
    },
    orderBy: { paidAt: "asc" },
    select: {
      id: true,
      name: true,
      amount: true,
      paidAt: true,
      currentInstallment: true,
      totalInstallments: true,
    },
  });
  return NextResponse.json(transitionsHistory, { status: 200 });
}
