import { NextAuthOptions } from "@/lib/nextAuthConfig";
import prisma from "@/lib/prisma";
import { CONSTANTS } from "@/shared/constants";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { endOfYear } from "date-fns/endOfYear";
import { startOfYear } from "date-fns/startOfYear";

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

  const transitionsHistory = await prisma.transitionHistory.findMany({
    where: {
      expense: {
        userId,
        subCategories: { every: { id: params["category-id"] } },
        registrationDate: { gte: startOfYearDate, lte: endOfYearDate },
      },
    },
    orderBy: {
      expense: { registrationDate: "asc" },
    },
    include: { expense: true },
  });
  return NextResponse.json(transitionsHistory, { status: 200 });
}
