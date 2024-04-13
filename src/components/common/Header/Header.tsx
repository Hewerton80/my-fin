"use client";
import { ProfilePopover } from "@/components/ui/overlay/ProfilePopover";
import { useMemo, useState } from "react";
import { FaBarsStaggered } from "react-icons/fa6";
import { Slot } from "@radix-ui/react-slot";
import { useSideBar } from "@/hooks/utils/useSideBar";
import * as Popover from "@radix-ui/react-popover";
import { SideBarItems } from "../Sidebar";
import { twMerge } from "tailwind-merge";
import slideAndFadeANimation from "@/components/sharedStyles/slideAndFade.module.css";

export function Header() {
  const { toggleOnlyIcons } = useSideBar();
  const [showPopoverMenu, setShowPopoverMenu] = useState(false);

  const toogleSideBarButtonElement = useMemo(() => {
    return (
      <span className="items-center justify-center cursor-pointer">
        <FaBarsStaggered className="text-primary dark:text-light text-3xl" />
      </span>
    );
  }, []);

  return (
    <header className="bg-card dark:bg-dark-card/70 h-20 shadow-sm">
      <div className="flex items-center h-full px-4 sm:px-8">
        <Popover.Root open={showPopoverMenu} onOpenChange={setShowPopoverMenu}>
          <Popover.Trigger asChild>
            <Slot className="flex md:hidden">{toogleSideBarButtonElement}</Slot>
          </Popover.Trigger>
          <Popover.Content
            onClick={() => setShowPopoverMenu(false)}
            sideOffset={8}
            align="end"
            className={twMerge(
              "z-[99999] outline-none",
              "bg-card dark:bg-dark-card dark:md:bg-dark-card/70 shadow-lg",
              "origin-top-left",
              slideAndFadeANimation.root
            )}
          >
            <SideBarItems />
          </Popover.Content>
        </Popover.Root>
        <Slot className="hidden md:flex" onClick={toggleOnlyIcons}>
          {toogleSideBarButtonElement}
        </Slot>
        <div className="flex gap-4 items-center ml-auto">
          <ProfilePopover />
        </div>
      </div>
    </header>
  );
}
