import { type NextRequest, NextResponse } from "next/server";
import { AuthService } from "@/modules/auth/service";

export async function GET(request: NextRequest) {
  const { loggedUser, error } = await AuthService.getLoggedUser(request);
  if (error) {
    return NextResponse.json(error, { status: 401 });
  }
  delete (loggedUser as any)?.password;
  return NextResponse.json(loggedUser, { status: 201 });
}
