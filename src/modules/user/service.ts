import prisma from "@/lib/prisma";
import { UserWithComputedFields } from "./types";

const getById = async (id: string) => {
  const foundUser = prisma.user.findUnique({ where: { id } });
  delete (foundUser as any)?.password;
  return foundUser as UserWithComputedFields;
};

export const UserService = { getById };
