import prisma from "@/lib/prisma";
import { type NextRequest, NextResponse } from "next/server";
import { compareSync } from "bcrypt";
import { CONSTANTS } from "@/shared/constants";
import { LoginCredentials } from "@/modules/auth/types";
import { AuthService } from "@/modules/auth/service";

export async function GET(request: NextRequest) {
  const { loggedUser, error } = await AuthService.getLoggedUser(request);
  if (error) {
    return NextResponse.json(error, { status: 401 });
  }
  return NextResponse.json(loggedUser, { status: 201 });
}
