"use client";
import { navItems } from "@/utils/navItems";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, forwardRef } from "react";
import { twMerge } from "tailwind-merge";
import { Slot } from "@radix-ui/react-slot";
import { Resizable } from "re-resizable";
import { useSideBar } from "@/hooks/useSideBar";

export const SideBarItems = forwardRef((_, ref?: any) => {
  const currentPath = usePathname();
  const { showOnlyIcons } = useSideBar();

  return (
    <ul
      ref={ref}
      className={twMerge(
        "flex flex-col w-full space-y-1 p-2",
        showOnlyIcons && "items-center"
      )}
    >
      {navItems.map(({ title, icon, path, basePath }, i) => {
        const isActive = currentPath.startsWith(`/${basePath}`);
        return (
          <li
            key={`${title}-${i}`}
            className={twMerge("flex", showOnlyIcons ? "w-fit" : "w-full")}
          >
            <Link
              href={path}
              className={twMerge(
                "flex items-center w-full gap-4 relative px-2 py-1.5",
                "whitespace-nowrap font-medium text-sm",
                "duration-100 ease-linear rounded-md text-card-foreground",
                "hover:bg-accent hover:text-accent-foreground",
                isActive &&
                  twMerge(
                    "text-dark-foreground hover:text-dark-foreground bg-dark hover:bg-dark/90",
                    "dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white"
                  ),
                showOnlyIcons && "max-w-fit"
              )}
            >
              <span className={twMerge(showOnlyIcons ? "text-xl" : "text-lg")}>
                {icon}
              </span>
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
          "bg-card shadow-xs",
          "duration-100 ease-linear overflow-hidden",
          "border-r dark:border-muted"
        )}
      >
        <Resizable
          className={twMerge(
            "flex flex-col duration-100 ease-linear overflow-hidden",
            "border-card dark:border-card/70"
          )}
          enable={{ right: !showOnlyIcons }}
          size={{
            width: showOnlyIcons ? 56 : sideBarWidth,
            height: "100vh",
          }}
          onResizeStart={() => setResizingSideBar(true)}
          onResizeStop={(e, direction, ref, d) => {
            setResizingSideBar(false);
            setSideBarWidth(sideBarWidth + d.width);
          }}
          handleWrapperClass={twMerge(
            "[&>div]:duration-100 [&>div]:ease-linear",
            "[&>div]:border-r-8 [&>div]:border-r-card dark:[&>div]:border-r-card/70",
            "hover:[&>div]:border-r-primary",
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
          className="block md:hidden fixed inset-0 bg-black/50 z-9998"
          onClick={() => setShowSideBar(false)}
        />
      )} */}
      <Slot className="hidden md:flex">{sideBarElement}</Slot>
      {/* <Slot
        className={twMerge(
          "flex md:hidden fixed top-0 left-0 -translate-x-full z-9999",
          showSideBar && "translate-x-0"
        )}
      >
        {sideBarElement}
      </Slot> */}
    </>
  );
}
