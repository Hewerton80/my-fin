import { CONSTANTS } from "@/shared/constants";
import { NextRequest, NextResponse } from "next/server";
import { AuthService } from "@/modules/auth/service";
import { TransitionHistoryService } from "@/modules/transitionHistory/service";

export async function GET(request: NextRequest) {
  const { loggedUser } = await AuthService.getLoggedUser(request);
  if (!loggedUser) {
    return NextResponse.json(
      { message: CONSTANTS.API_RESPONSE_MESSAGES.USER_HAS_NO_PERMISSION },
      { status: 401 }
    );
  }
  const userId = loggedUser?.id;

  const { searchParams } = new URL(request.url);
  const paginedransitionsHistory =
    await TransitionHistoryService.getListByUserId(
      String(userId),
      searchParams
    );
  return NextResponse.json(paginedransitionsHistory, { status: 200 });
}
