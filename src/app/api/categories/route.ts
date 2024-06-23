// import { verifyIfUserIsTeacher } from "@/lib/auth";
import { NextAuthOptions } from "@/lib/nextAuthConfig";
import prisma from "@/lib/prisma";
import { CONSTANTS } from "@/shared/constants";
import { getServerSession } from "next-auth";

import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(NextAuthOptions);
  if (!session) {
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
