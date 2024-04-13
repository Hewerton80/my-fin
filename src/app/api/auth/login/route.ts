import { LoginCredentials } from "@/dtos/loginCredentials";
import prisma from "@/lib/prisma";
import { type NextRequest, NextResponse } from "next/server";
import { compareSync } from "bcrypt";
import { signJWT } from "@/lib/auth";
import { CONSTANTS } from "@/shared/constants";
import { getUserWithComputedFields } from "@/types/User";

export async function POST(request: NextRequest) {
  const loginCredentials = (await request.json()) as LoginCredentials;

  const foundUser = await prisma.user.findUnique({
    where: { email: loginCredentials?.email?.trim() },
    include: {
      trainingPlans: { where: { isActive: true } },
    },
  });

  const passwordIsMatch =
    loginCredentials?.password && foundUser?.password
      ? compareSync(loginCredentials?.password, foundUser?.password)
      : false;

  if (!foundUser || !passwordIsMatch) {
    return NextResponse.json(
      { message: CONSTANTS.API_RESPONSE_MENSSAGES.INVALID_CREDENTIALS },
      { status: 401 }
    );
  }
  const token = await signJWT({ sub: foundUser?.id });
  const userWithComputedFields = getUserWithComputedFields(foundUser);
  return NextResponse.json(
    { token, user: userWithComputedFields },
    { status: 201 }
  );
}
