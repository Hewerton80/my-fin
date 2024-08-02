import { CONSTANTS } from "@/shared/constants";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { AuthService } from "@/modules/auth/service";

const { USER_HAS_NO_PERMISSION, TRANSTION_HISTORY_NOT_FOUND } =
  CONSTANTS.API_RESPONSE_MESSAGES;

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { loggedUser } = await AuthService.getLoggedUser(request);
  if (!loggedUser) {
    return NextResponse.json(
      { message: USER_HAS_NO_PERMISSION },
      { status: 401 }
    );
  }

  const transitionId = params?.id;

  const transition = await prisma.transitionHistory.findUnique({
    where: {
      id: transitionId,
      userId: loggedUser.id,
    },
    include: { expense: { select: { name: true, id: true } } },
  });

  if (!transition) {
    return NextResponse.json(
      { message: TRANSTION_HISTORY_NOT_FOUND },
      { status: 404 }
    );
  }

  return NextResponse.json(transition, { status: 200 });
}
