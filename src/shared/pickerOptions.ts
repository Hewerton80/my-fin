import { GenderPtBr } from "@/modules/user/User";
import { UserRole, UserRolesNamesType } from "@/modules/user/User";

export const genderOptions = Object.entries(GenderPtBr).map(([key, value]) => ({
  value: key,
  label: value,
}));

export const orderByUserOptions = [
  { label: "Nome  ↓", value: "name asc" },
  { label: "Nome  ↑", value: "name desc" },
];

export const usersRolesOptions = Object.keys(UserRole).map((key) => ({
  value: key,
  label: UserRole[key as UserRolesNamesType],
}));
