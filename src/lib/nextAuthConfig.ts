import { compareSync } from "bcrypt";
import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import { CONSTANTS } from "@/shared/constants";
import { UserService } from "@/modules/user/service";

export const NextAuthOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const foundUser = await prisma.user.findUnique({
          where: { email: credentials?.email?.trim() },
        });

        const passwordIsMatch =
          credentials?.password && foundUser?.password
            ? compareSync(credentials?.password, foundUser?.password)
            : false;
        if (!foundUser || !passwordIsMatch) {
          throw new Error(CONSTANTS.API_RESPONSE_MESSAGES.INVALID_CREDENTIALS);
        }
        delete (foundUser as any)?.password;
        return foundUser;
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
  },
  callbacks: {
    async jwt({ token }) {
      return token;
    },
    async session({ session, token }) {
      session.user = await UserService.getOneById(String(token.sub));
      session.accessToken = token as any;
      return { ...session };
    },
  },
  session: {
    // Seconds - How long until an idle session expires and is no longer valid.
    maxAge: 30 * 24 * 60 * 60, // 30 days

    // Seconds - Throttle how frequently to write to database to extend a session.
    // Use it to limit write operations. Set to 0 to always update the database.
    // Note: This option is ignored if using JSON Web Tokens
    updateAge: 24 * 60 * 60, // 24 hours
  },
};
