import prisma from "@/lib/prisma";
import { AuthService } from "@/modules/auth/service";
import { CreditCardService } from "@/modules/creditCard/service";
import { CONSTANTS } from "@/shared/constants";
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
  const year = new Date().getFullYear();

  const creditCards = await CreditCardService.getListByUserId(userId);

  const { oweCreditCardInsights, paidCreditCardInsights } =
    await CreditCardService.getInsightsByUserId(userId, { year });

  return NextResponse.json(
    {
      creditCards,
      oweCreditCardInsights,
      paidCreditCardInsights,
    },
    { status: 200 }
  );
}
