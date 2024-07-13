import { NextAuthOptions } from "@/lib/nextAuthConfig";
import prisma from "@/lib/prisma";
import { AuthService } from "@/modules/auth/service";
import { CONSTANTS } from "@/shared/constants";
import { getServerSession } from "next-auth";
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
  const creditCards = await prisma.creditCard.findMany({ where: { userId } });
  return NextResponse.json(creditCards, { status: 200 });
}
