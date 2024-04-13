import { CONSTANTS } from "@/shared/constants";
import Cookies from "js-cookie";

export const getCurretToken = () => {
  return Cookies.get(CONSTANTS.COOKIES_KEYS.TOKEN);
};

export const removeAllCookies = () => {
  const cookies = Cookies.get();
  // delete cookies?.[CONSTANTS.COOKIES_KEYS.THEME];
  for (const cookie in cookies) {
    console.log({ cookie });
    if (cookies.hasOwnProperty(cookie)) {
      Cookies.remove(cookie);
    }
  }
};
