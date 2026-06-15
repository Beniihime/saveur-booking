import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SAVEUR Booking",
  description: "Online table booking test task for SAVEUR"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
