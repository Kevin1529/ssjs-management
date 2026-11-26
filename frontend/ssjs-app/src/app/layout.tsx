import type { Metadata } from "next";
import { Suspense } from "react";
import GlobalApiLoader from "@/components/GlobalApiLoader";
import SiteHeader from "@/components/SiteHeader";
import "./globals.css";
import { RefreshCw } from "lucide-react";

export const metadata: Metadata = {
  title: "Mosaic | Membership Community",
  description: "Your community. Your membership. Your journey.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <Suspense
          fallback={
            <main className="flex min-h-screen items-center justify-center bg-[#F6F5EF]">
              <RefreshCw
                className="animate-spin text-[#173F35]"
                size={28}
              />
            </main>
          }
        >
          <SiteHeader />
        </Suspense>
        <GlobalApiLoader />
        {children}
      </body>
    </html>
  );
}
