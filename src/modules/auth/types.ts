import { User } from "@prisma/client";

export enum AuthQueryKeys {
  LOGGED_USER = "LOGGED_USER",
}
export type LoginCredentials = Pick<User, "email" | "password">;
export type JwtDto = { sub: string; iat: number; exp: number };
