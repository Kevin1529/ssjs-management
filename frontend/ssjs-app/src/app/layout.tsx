import type { Metadata } from "next";
import GlobalApiLoader from "@/components/GlobalApiLoader";
import SiteHeader from "@/components/SiteHeader";
import "./globals.css";

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
      <body>
        <SiteHeader />
        <GlobalApiLoader />
        {children}
      </body>
    </html>
  );
}
