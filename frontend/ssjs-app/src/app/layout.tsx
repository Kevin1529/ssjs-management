import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mosaic | Membership Portal",
  description: "Your community. Your membership. Your journey.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
