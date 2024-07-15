import prisma from "@/lib/prisma";
import { AuthService } from "@/modules/auth/service";
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
  const categories = await prisma.groupCategory.findMany({
    include: {
      categories: { select: { id: true, name: true, iconName: true } },
    },
  });
  return NextResponse.json(categories, { status: 200 });
}
