import { GiMuscleUp } from "react-icons/gi";
import { CgGym } from "react-icons/cg";

export enum BASE_PATHS {
  BASE_AUTH_PATH = "auth",
  BASE_HOME_PATH = "home",
  BASE_EXPENSES_PATH = "expenses",
}

export interface INavItem {
  title: string;
  path: string;
  icon: JSX.Element;
  basePath: BASE_PATHS;
}

export const navItems: INavItem[] = [
  {
    title: "Home",
    basePath: BASE_PATHS.BASE_HOME_PATH,
    path: `/${BASE_PATHS.BASE_HOME_PATH}`,
    icon: <CgGym />,
  },
  {
    title: "Expenses",
    basePath: BASE_PATHS.BASE_EXPENSES_PATH,
    path: `/${BASE_PATHS.BASE_EXPENSES_PATH}`,
    icon: <GiMuscleUp />,
  },
  // {
  //   title: "Treinos",
  //   path: "/teacher/trainings",
  //   basePath: BASE_PATHS.BASE_TEACHER_PATH,
  //   icon: <FaDumbbell />,
  //   avaliablesRoles: { TEACHER: true },
  // },
];

// export const getAvaliableNavItems = (user: UserWithComputedFields | null) => {
//   if (!user) {
//     return [];
//   }
//   return navItems.filter((navItems) =>
//     user?.roles?.some((role) => navItems.avaliablesRoles[role])
//   );
// };
