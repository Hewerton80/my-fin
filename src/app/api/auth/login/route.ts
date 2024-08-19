import prisma from "@/lib/prisma";
import { type NextRequest, NextResponse } from "next/server";
import { compareSync } from "bcrypt";
import { CONSTANTS } from "@/utils/constants";
import { LoginCredentials } from "@/modules/auth/types";
import { AuthService } from "@/modules/auth/service";

export async function POST(request: NextRequest) {
  const loginCredentials = (await request.json()) as LoginCredentials;

  const foundUser = await prisma.user.findUnique({
    where: { email: loginCredentials?.email?.trim() },
  });

  const passwordIsMatch =
    loginCredentials?.password && foundUser?.password
      ? compareSync(loginCredentials?.password, foundUser?.password)
      : false;

  if (!foundUser || !passwordIsMatch) {
    return NextResponse.json(
      { message: CONSTANTS.API_RESPONSE_MESSAGES.INVALID_CREDENTIALS },
      { status: 401 }
    );
  }

  const token = await AuthService.signJWT({ sub: foundUser?.id });
  return NextResponse.json(token, { status: 201 });
}
