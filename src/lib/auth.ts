import { JwtDto } from "@/dtos/JwtDto";
import { verify } from "jsonwebtoken";
import { NextRequest } from "next/server";
import * as jose from "jose";
import { CONSTANTS } from "@/shared/constants";
import prisma from "./prisma";

export const signJWT = async (payload: { sub: string }) => {
  try {
    const secret = new TextEncoder().encode(String(process.env.TOKEN_SECRET));
    const alg = "HS256";
    return new jose.SignJWT(payload)
      .setProtectedHeader({ alg })
      .setExpirationTime("1d")
      .setIssuedAt()
      .setSubject(payload.sub)
      .sign(secret);
  } catch (error) {
    throw error;
  }
};

export const verifyJWT = async (
  request: NextRequest
): Promise<{ payload?: JwtDto; token?: string; error?: string }> => {
  try {
    const secret = new TextEncoder().encode(String(process.env.TOKEN_SECRET));
    const bearerToken = request.headers.get("Authorization") as string;
    const token = bearerToken?.replace("Bearer ", "");
    if (!token || token === "null" || token === "undefined") {
      return { error: CONSTANTS.API_RESPONSE_MENSSAGES.TOKEN_NOT_PROVIDED };
    }
    const { payload } = await jose.jwtVerify<JwtDto>(token, secret);

    return { payload, token };
  } catch (error) {
    console.log({ error });
    return { error: CONSTANTS.API_RESPONSE_MENSSAGES.INVALID_TOKEN };
  }
};

export const getLoggedUser = async (request: NextRequest) => {
  const { payload, error } = await verifyJWT(request);
  if (error) {
    return { error };
  }
  const loggedUser = await prisma.user.findUnique({
    where: { id: payload?.sub },
  });
  if (!loggedUser) {
    return { error: CONSTANTS.API_RESPONSE_MENSSAGES.USER_NOT_FOUND };
  }
  return { loggedUser };
};

export const verifyIfUserIsAdmin = async (request: NextRequest) => {
  const { loggedUser, error } = await getLoggedUser(request);
  if (error || !loggedUser?.isAdmin) {
    return false;
  }
  return true;
};

export const verifyIfUserIsTeacher = async (request: NextRequest) => {
  const { loggedUser, error } = await getLoggedUser(request);
  if (error || !loggedUser?.isTeacher) {
    return false;
  }
  return true;
};
