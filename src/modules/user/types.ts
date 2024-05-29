import { User } from "@prisma/client";

export interface UserWithComputedFields extends Partial<User> {}
