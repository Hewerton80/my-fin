import { JwtDto } from "./types";
import { NextRequest } from "next/server";
import * as jose from "jose";
import { CONSTANTS } from "@/shared/constants";
import prisma from "@/lib/prisma";
import { UserWithComputedFields } from "../user/types";
import { cookies } from "next/headers";

const signJWT = async (payload: { sub: string }) => {
  try {
    const secret = new TextEncoder().encode(String(process.env.TOKEN_SECRET));
    const alg = "HS256";
    return new jose.SignJWT(payload)
      .setProtectedHeader({ alg })
      .setExpirationTime("7d")
      .setIssuedAt()
      .setSubject(payload.sub)
      .sign(secret);
  } catch (error) {
    return error;
  }
};

const verifyJWT = async (
  request: NextRequest
): Promise<{ payload?: JwtDto; token?: string; error?: string }> => {
  try {
    const secret = new TextEncoder().encode(String(process.env.TOKEN_SECRET));
    const bearerToken = request.headers.get("Authorization") as string;
    const token = bearerToken?.replace("Bearer ", "");
    if (!token || token === "null" || token === "undefined") {
      return { error: CONSTANTS.API_RESPONSE_MESSAGES.TOKEN_NOT_PROVIDED };
    }
    const { payload } = await jose.jwtVerify<JwtDto>(token, secret);

    return { payload, token };
  } catch (error) {
    console.log({ error });
    return { error: CONSTANTS.API_RESPONSE_MESSAGES.INVALID_TOKEN };
  }
};

const getLoggedUser = async (request: NextRequest) => {
  const { payload, error } = await verifyJWT(request);
  if (error) {
    return { error };
  }
  const loggedUser = await prisma.user.findUnique({
    where: { id: payload?.sub },
  });
  if (!loggedUser) {
    return { error: CONSTANTS.API_RESPONSE_MESSAGES.USER_NOT_FOUND };
  }
  return { loggedUser };
};

const fetchUser = async (): Promise<{
  user?: UserWithComputedFields;
  error?: any;
}> => {
  // console.log({ allCokies: Cookies.get() });
  const cookieStore = cookies();

  const token = cookieStore.get(CONSTANTS.COOKIES_KEYS.TOKEN);

  console.log({ fetchUserToken: token?.value });
  if (!token?.value) {
    return { error: CONSTANTS.API_RESPONSE_MESSAGES.TOKEN_NOT_PROVIDED };
  }
  try {
    const response = await fetch(`${process.env.CLIENT_URL}/api/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token?.value}`,
      },
    });
    const user = (await response.json()) as UserWithComputedFields;
    console.log({ fetchUser: user });
    return { user };
  } catch (error) {
    console.log({ fetchUserError: error });
    return { error };
  }
};

export const AuthService = {
  signJWT,
  verifyJWT,
  getLoggedUser,
  fetchUser,
};
