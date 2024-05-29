import { User } from "@prisma/client";

export type LoginCredentials = Pick<User, "email" | "password">;
