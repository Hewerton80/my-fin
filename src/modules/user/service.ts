import prisma from "@/lib/prisma";
import { UserWithComputedFields } from "./types";

const getOneById = async (id: string) => {
  const foundUser = prisma.user.findUnique({ where: { id } });
  delete (foundUser as any)?.password;
  return foundUser as UserWithComputedFields;
};

export const UserService = { getOneById };
