import Image from "next/image";

export function SplashScreen() {
  return (
    <div
      className={
        "flex justify-center fixed top-0 left-0 w-full h-screen bg-background z-99999999"
      }
    >
      <div className="flex justify-center items-center flex-col h-fit m-auto gap-2">
        <Image
          className="animate-bounce"
          src="/images/logo-1.png"
          alt="splash-screen"
          width={160}
          height={160}
          priority
        />
        {/* <Spinner size={24} /> */}
      </div>
    </div>
  );
}
