import { User, Gender } from "@prisma/client";
import { TrainingPlanWithComputedFields } from "./TrainingPlans";
import { differenceInYears } from "date-fns";
import { IPaginateArgs } from "@/lib/prismaHelpers";

export enum UserRole {
  ADMIN = "Administrador",
  TEACHER = "Professor",
  STUDENT = "Estudante",
}

type GenderMap = {
  [key in keyof typeof Gender]: string;
};

export const GenderPtBr: GenderMap = {
  M: "Masculino",
  F: "Feminino",
  O: "Outro",
};

export type UserRolesNamesType = keyof typeof UserRole;

export interface UserWithComputedFields
  extends Partial<Omit<User, "dateOfBirth">> {
  title?: string;
  age?: number;
  trainingPlan?: TrainingPlanWithComputedFields;
  roles: UserRolesNamesType[];
  dateOfBirth?: Date | string;
}

export interface IGetStudentsQueryParams extends IPaginateArgs {
  keyword?: string;
  gender?: string;
  isActive?: string;
  orderBy?: string;
  role?: string;
}

export const getUserWithComputedFields = (
  user: any
): UserWithComputedFields => {
  const userWitchComputedFields: UserWithComputedFields = { ...user };
  const roles: UserRolesNamesType[] = ["STUDENT"];
  if (user?.isAdmin) {
    roles.push("ADMIN");
  }
  if (user?.isTeacher) {
    roles.push("TEACHER");
  }
  userWitchComputedFields.roles = roles;
  if (user?.dateOfBirth) {
    userWitchComputedFields.age = differenceInYears(
      new Date(),
      new Date(user.dateOfBirth)
    );
  }
  if (user?.trainingPlans?.length > 0) {
    userWitchComputedFields.trainingPlan = user
      .trainingPlans[0] as TrainingPlanWithComputedFields;
  }
  delete (userWitchComputedFields as any)?.isAdmin;
  delete (userWitchComputedFields as any)?.isTeacher;
  delete (userWitchComputedFields as any)?.password;
  delete (userWitchComputedFields as any)?.trainingPlans;
  return userWitchComputedFields;
};

export const getUsersWithComputedFields = (users: any[]) =>
  users.map((user) => getUserWithComputedFields(user));
