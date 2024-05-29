import { UserWithComputedFields } from "@/modules/user/types";
import { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    accessToken?: JWT;
    user: UserWithComputedFields;
  }
}
