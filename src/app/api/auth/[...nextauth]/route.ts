import NextAuth from "next-auth";
import { NextAuthOptions } from "./nextAuthOptions";

const handler = NextAuth(NextAuthOptions);

export { handler as GET, handler as POST };
