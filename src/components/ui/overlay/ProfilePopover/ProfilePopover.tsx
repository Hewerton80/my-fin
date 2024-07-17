"use client";
import * as Menubar from "@radix-ui/react-menubar";
import { Avatar } from "@/components/ui/dataDisplay/Avatar";
import { twMerge } from "tailwind-merge";
import Link from "next/link";
import { FiLogOut, FiUser } from "react-icons/fi";
import slideAndFadeANimation from "@/components/sharedStyles/slideAndFade.module.css";
import { useTheme } from "@/hooks/useTheme";
import { FaMoon, FaSun, FaChevronRight } from "react-icons/fa";
import menuStyle from "@/components/sharedStyles/menu.module.css";
import { LuPaintbrush2 } from "react-icons/lu";
import { getContrastColor } from "@/shared/colors";
import { useGetLoggedUser } from "@/modules/auth/hooks/useGetLoggedUser";
import { useAuthLogin } from "@/modules/auth/hooks/useAuthLogin";
import assets from "../../../../../assets.json";

export function ProfilePopover() {
  const { theme, setTheme } = useTheme();
  // const { data: session } = useSession();
  const { loggedUser } = useGetLoggedUser();
  const { logout } = useAuthLogin();

  return (
    <Menubar.Root>
      <Menubar.Menu>
        <Menubar.Trigger asChild>
          <div className="flex gap-2 sm:gap-4 items-center cursor-pointer max-w-[220px]">
            {loggedUser && (
              <>
                <Avatar
                  username={loggedUser?.name}
                  bgColor={loggedUser?.avatarBgColor}
                  color={
                    loggedUser?.avatarBgColor
                      ? getContrastColor(loggedUser?.avatarBgColor!)
                      : assets.colors.primary
                  }
                />
                <div className="flex flex-col">
                  <strong className="text-black dark:text-white text-sm sm:text-base line-clamp-1">
                    {loggedUser?.name}
                  </strong>
                </div>
              </>
            )}
          </div>
        </Menubar.Trigger>
        <Menubar.Portal>
          <Menubar.Content
            className={twMerge(
              menuStyle.root,
              "origin-top-right w-52",
              slideAndFadeANimation.root
            )}
            sideOffset={8}
            align="end"
          >
            <Menubar.Item className={menuStyle.item} asChild>
              <Link href="/profile">
                <FiUser size={20} /> Perfil
              </Link>
            </Menubar.Item>
            <Menubar.Sub>
              <Menubar.SubTrigger className={menuStyle.item}>
                <LuPaintbrush2 size={20} /> Tema
                <FaChevronRight className="ml-auto text-primary" />
              </Menubar.SubTrigger>
              <Menubar.Portal>
                <Menubar.SubContent className={twMerge(menuStyle.root)}>
                  <Menubar.Item
                    className={twMerge(
                      menuStyle.item,
                      "justify-between",
                      theme === "light" && "bg-light dark:bg-dark-card/60"
                    )}
                    onClick={() => setTheme("light")}
                  >
                    Claro <FaSun />
                  </Menubar.Item>
                  <Menubar.Item
                    className={twMerge(
                      menuStyle.item,
                      "justify-between",
                      theme === "dark" && "bg-light dark:bg-dark-card/60"
                    )}
                    onClick={() => setTheme("dark")}
                  >
                    Escuro <FaMoon />
                  </Menubar.Item>
                </Menubar.SubContent>
              </Menubar.Portal>
            </Menubar.Sub>
            <Menubar.Separator className={menuStyle.separator} />
            <Menubar.Item className={menuStyle.item} onClick={logout}>
              <FiLogOut size={20} /> Sair
            </Menubar.Item>
          </Menubar.Content>
        </Menubar.Portal>
      </Menubar.Menu>
    </Menubar.Root>
  );
}
