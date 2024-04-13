import { UserRolesNamesType, UserWithComputedFields } from "@/types/User";
import { FaUsers } from "react-icons/fa";
import { GiMuscleUp } from "react-icons/gi";
import { CgGym } from "react-icons/cg";

export enum BASE_PATHS {
  BASE_AUTH_PATH = "auth",
  BASE_ADMIN_PATH = "admin",
  BASE_STUDENT_PATH = "student",
  BASE_TEACHER_PATH = "teacher",
}

type AvaliablesRoles = {
  [key in UserRolesNamesType]?: Boolean;
};

export interface INavItem {
  title: string;
  path: string;
  icon: JSX.Element;
  basePath: BASE_PATHS;
  avaliablesRoles: AvaliablesRoles;
}

export const navItems: INavItem[] = [
  {
    title: "Usuários",
    path: `/${BASE_PATHS.BASE_ADMIN_PATH}/users`,
    basePath: BASE_PATHS.BASE_ADMIN_PATH,
    icon: <FaUsers />,
    avaliablesRoles: { ADMIN: true },
  },
  // {
  //   title: "Treinos",
  //   path: "/teacher/trainings",
  //   basePath: BASE_PATHS.BASE_TEACHER_PATH,
  //   icon: <FaDumbbell />,
  //   avaliablesRoles: { TEACHER: true },
  // },
  {
    title: "Alunos",
    path: `/${BASE_PATHS.BASE_TEACHER_PATH}/students`,
    basePath: BASE_PATHS.BASE_TEACHER_PATH,
    icon: <GiMuscleUp />,
    avaliablesRoles: { TEACHER: true },
  },
  {
    title: "Área do aluno",
    path: `/${BASE_PATHS.BASE_STUDENT_PATH}/home`,
    basePath: BASE_PATHS.BASE_STUDENT_PATH,
    icon: <CgGym />,
    avaliablesRoles: { TEACHER: true, STUDENT: true, ADMIN: true },
  },
];

export const getAvaliableNavItems = (user: UserWithComputedFields | null) => {
  if (!user) {
    return [];
  }
  return navItems.filter((navItems) =>
    user?.roles?.some((role) => navItems.avaliablesRoles[role])
  );
};
