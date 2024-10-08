import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "@/providers";
import { AlertModal } from "@/components/ui/overlay/AlertModal";
import { Toast } from "@/components/ui/feedback/Toast";
import { ptBR } from "date-fns/locale/pt-BR";
import { setDefaultOptions } from "date-fns/setDefaultOptions";
import { ThemeTamplate } from "@/components/templates/ThemeTamplate";
import { CookiesProvider } from "next-client-cookies/server";
import "./globals.css";

// setDefaultOptions({ locale: ptBR });

const inter = Inter({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
});

export const metadata: Metadata = {
  title: "My Fin",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CookiesProvider>
      <ThemeTamplate>
        <html lang="pt-bt" suppressHydrationWarning={true}>
          <body className={inter.className}>
            <Providers>
              {children}
              <AlertModal />
              <Toast />
            </Providers>
          </body>
        </html>
      </ThemeTamplate>
    </CookiesProvider>
  );
}
