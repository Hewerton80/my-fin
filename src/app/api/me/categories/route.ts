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
  const userId = session.user.id;
  const categories = await prisma.category.findMany({
    where: {
      expenses: { some: { userId } },
    },
  });
  return NextResponse.json(categories, { status: 200 });
}
