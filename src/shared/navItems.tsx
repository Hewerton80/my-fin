import { SlWallet } from "react-icons/sl";
import { CgHome } from "react-icons/cg";

enum BASE_PATHS {
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
    icon: <CgHome />,
  },
  {
    title: "Expenses",
    basePath: BASE_PATHS.BASE_EXPENSES_PATH,
    path: `/${BASE_PATHS.BASE_EXPENSES_PATH}`,
    icon: <SlWallet />,
  },
];
