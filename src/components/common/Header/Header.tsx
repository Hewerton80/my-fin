"use client";
import { ProfilePopover } from "@/components/ui/overlay/ProfilePopover";
import { useMemo, useState } from "react";
import { FaBarsStaggered } from "react-icons/fa6";
import { Slot } from "@radix-ui/react-slot";
import { useSideBar } from "@/hooks/useSideBar";
import * as Popover from "@radix-ui/react-popover";
import { SideBarItems } from "../Sidebar";
import { twMerge } from "tailwind-merge";
import slideAndFadeANimation from "@/components/sharedStyles/slideAndFade.module.css";

export function Header() {
  const { toggleOnlyIcons } = useSideBar();

  const toogleSideBarButtonElement = useMemo(() => {
    return (
      <span className="items-center justify-center cursor-pointer">
        <FaBarsStaggered className="text-card-foreground text-3xl" />
      </span>
    );
  }, []);

  return (
    <header className="bg-card h-20 shadow-xs border-b">
      <div className="flex items-center h-full px-4 sm:px-8">
        <Popover.Root>
          <Popover.Trigger asChild>
            <Slot className="flex md:hidden">{toogleSideBarButtonElement}</Slot>
          </Popover.Trigger>
          <Popover.Content
            sideOffset={8}
            align="end"
            className={twMerge(
              "z-99999 outline-hidden",
              "bg-card shadow-lg",
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
