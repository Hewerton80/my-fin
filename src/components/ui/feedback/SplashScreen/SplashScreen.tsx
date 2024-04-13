import Image from "next/image";
import { Spinner } from "@/components/ui/feedback/Spinner";

export function SplashScreen() {
  return (
    <div
      className={
        "flex justify-center fixed top-0 left-0 w-full h-screen bg-white dark:bg-dark-body z-[99999999]"
      }
    >
      <div className="flex justify-center items-center flex-col h-fit m-auto gap-8">
        <Image
          src="/images/logo-1.png"
          alt="logo"
          width={80}
          height={80}
          priority
        />
        <Spinner size={48} />
      </div>
    </div>
  );
}
