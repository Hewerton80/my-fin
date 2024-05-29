import { compareSync } from "bcrypt";
import NextAuth, { AuthOptions } from "next-auth";
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
      // token.user = await UserService.getById(String(token.sub));
      return token;
    },
    async session({ session, token }) {
      session.user = await UserService.getById(String(token.sub));
      session.accessToken = token as any;
      console.log({ session });
      return { ...session };
    },
  },
};
