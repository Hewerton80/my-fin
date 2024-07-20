import { PrivatePagesTamplate } from "@/components/templates/PrivatePagesTamplate";
import { AuthService } from "@/modules/auth/service";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const redirectTologinPage = () => {
    return redirect("/auth/login");
  };

  try {
    const { user } = await AuthService.fetchUser();
    console.log({ userService: user });
    if (!user) {
      return redirectTologinPage();
    }
    return <PrivatePagesTamplate user={user}>{children}</PrivatePagesTamplate>;
  } catch (error) {
    console.error("catchError", error);
    return redirectTologinPage();
  }
}
