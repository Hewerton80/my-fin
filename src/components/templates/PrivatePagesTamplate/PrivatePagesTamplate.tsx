import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import { Sidebar } from "@/components/common/Sidebar";
import { Header } from "@/components/common/Header";

interface IPrivatePagesTamplateProps {
  children: ReactNode;
}

export function PrivatePagesTamplate({ children }: IPrivatePagesTamplateProps) {
  return (
    <div className="flex h-screen overflow-y-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-x-hidden">
        <Header />
        <div className={twMerge("h-full p-4 sm:p-8 overflow-y-auto flex-1")}>
          {children}
        </div>
      </div>
    </div>
  );
}
