import { ReactNode } from "react";

export default async function AuthLayout({
  children,
}: {
  children: ReactNode;
}) {
  // const userSessions = await getServerSession(NextAuthOptions);
  // if (userSessions?.user) {
  //   return redirect("/home");
  // }
  return <> {children}</>;
}
