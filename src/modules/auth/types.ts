import { User } from "@prisma/client";

export enum AuthQueryKeys {
  ME = "ME",
}
export type LoginCredentials = Pick<User, "email" | "password">;
export type JwtDto = { sub: string; iat: number; exp: number };
