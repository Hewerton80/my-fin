import prisma from "@/lib/prisma";
import { AuthService } from "@/modules/auth/service";
import { CONSTANTS } from "@/utils/constants";
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
  const categories = await prisma.category.findMany({
    where: {
      TransitionHistory: { some: { userId } },
    },
  });
  return NextResponse.json(categories, { status: 200 });
}
