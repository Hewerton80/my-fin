"use client";
import { useAuth } from "@/hooks/api/useAuth";
import { navItems } from "@/shared/navItems";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, forwardRef } from "react";
import { twMerge } from "tailwind-merge";
import { Slot } from "@radix-ui/react-slot";
import { Resizable } from "re-resizable";
import { useSideBar } from "@/hooks/utils/useSideBar";
import style from "@/components/sharedStyles/menu.module.css";
export const SideBarItems = forwardRef((_, ref?: any) => {
  const currentPath = usePathname();

  const { loggedUser } = useAuth();
  const { showOnlyIcons } = useSideBar();

  // const avaliableNavItems = useMemo<INavItem[]>(() => {
  //   return getAvaliableNavItems(loggedUser);
  // }, [loggedUser]);

  return (
    <ul ref={ref} className="flex flex-col w-full space-y-1 p-2">
      {navItems.map(({ title, icon, path, basePath }, i) => {
        const isActive = currentPath.startsWith(`/${basePath}`);
        return (
          <li key={`${title}-${i}`} className="flex w-full">
            <Link
              href={path}
              className={twMerge(style.item, isActive && style["is-active"])}
            >
              <span className="text-base">{icon}</span>
              {!showOnlyIcons && <span>{title}</span>}
            </Link>
          </li>
        );
      })}
    </ul>
  );
});

export function Sidebar() {
  const {
    showOnlyIcons,
    sideBarWidth,
    resizingSideBar,
    setResizingSideBar,
    setSideBarWidth,
  } = useSideBar();

  const sideBarElement = useMemo(() => {
    return (
      <aside
        className={twMerge(
          "bg-card dark:bg-dark-card dark:md:bg-dark-card/70 shadow-sm",
          "duration-100 ease-linear overflow-hidden",
          "border-r border-border dark:border-dark-border"
        )}
      >
        <Resizable
          className={twMerge(
            "flex flex-col duration-100 ease-linear overflow-hidden",
            "border-card dark:border-dark-card/70"
          )}
          enable={{ right: !showOnlyIcons }}
          size={{
            width: showOnlyIcons ? 56 : sideBarWidth,
            height: "100vh",
          }}
          onResizeStart={() => setResizingSideBar(true)}
          onResizeStop={(e, direction, ref, d) => {
            setResizingSideBar(false);
            console.log({ futureW: sideBarWidth + d.width });
            setSideBarWidth(sideBarWidth + d.width);
          }}
          handleWrapperClass={twMerge(
            "[&>div]:duration-100 [&>div]:ease-linear",
            "[&>div]:border-r-8 [&>div]:border-r-card [&>div]:dark:border-r-dark-card/70",
            "[&>div]:hover:border-r-primary",
            resizingSideBar && "[&>div]:border-r-primary"
          )}
        >
          <div className="flex items-center px-6 gap-3 h-20 w-full">
            {/* <Image
              src="/images/logo-1.png"
              alt="logo"
              width={52}
              height={52}
              priority
            />
            <Image
              className={twMerge(
                "dark:brightness-[35.5]",
                "h-6",
                showOnlyIcons ? "hidden" : "block"
              )}
              src="/images/logo-2.png"
              alt="logo2"
              width={108}
              height={24}
              priority
            /> */}
          </div>
          <nav className="flex w-full h-full">
            <SideBarItems />
          </nav>
        </Resizable>
      </aside>
    );
  }, [
    sideBarWidth,
    showOnlyIcons,
    resizingSideBar,
    setResizingSideBar,
    setSideBarWidth,
  ]);

  return (
    <>
      {/* {showSideBar && (
        <div
          className="block md:hidden fixed inset-0 bg-black/50 z-[9998]"
          onClick={() => setShowSideBar(false)}
        />
      )} */}
      <Slot className="hidden md:flex">{sideBarElement}</Slot>
      {/* <Slot
        className={twMerge(
          "flex md:hidden fixed top-0 left-0 -translate-x-full z-[9999]",
          showSideBar && "translate-x-0"
        )}
      >
        {sideBarElement}
      </Slot> */}
    </>
  );
}
