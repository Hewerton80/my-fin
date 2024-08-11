import { CgHome } from "react-icons/cg";
import { TbCategory2 } from "react-icons/tb";
import { HiMiniArrowsUpDown } from "react-icons/hi2";
import { MdCreditCard } from "react-icons/md";

enum BASE_PATHS {
  BASE_AUTH_PATH = "auth",
  BASE_HOME_PATH = "home",
  BASE_EXPENSES_PATH = "expenses",
  BASE_CATEGORIES_PATCH = "categories",
  BASE_TRANSITIONS_PATCH = "transitions",
  BASE_CREDIT_CARDS_PATCH = "credit-cards",
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
  // {
  //   title: "Expenses",
  //   basePath: BASE_PATHS.BASE_EXPENSES_PATH,
  //   path: `/${BASE_PATHS.BASE_EXPENSES_PATH}`,
  //   icon: <SlWallet />,
  // },
  {
    title: "Transitions",
    basePath: BASE_PATHS.BASE_TRANSITIONS_PATCH,
    path: `/${BASE_PATHS.BASE_TRANSITIONS_PATCH}`,
    icon: <HiMiniArrowsUpDown />,
  },
  {
    title: "Credit Cards",
    basePath: BASE_PATHS.BASE_CREDIT_CARDS_PATCH,
    path: `/${BASE_PATHS.BASE_CREDIT_CARDS_PATCH}`,
    icon: <MdCreditCard />,
  },
  {
    title: "Categories",
    basePath: BASE_PATHS.BASE_CATEGORIES_PATCH,
    path: `/${BASE_PATHS.BASE_CATEGORIES_PATCH}`,
    icon: <TbCategory2 />,
  },
];
