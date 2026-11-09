import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { RoleProvider } from "@/context/RoleProvider";
import { ToastProvider } from "@/context/ToastProvider";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "E-CR | Class Representative Portal",
  description: "Announcements, Deadlines, and Google Drive Resources for University Classes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth" className={`${inter.variable} antialiased`}>
      <body suppressHydrationWarning>
        <RoleProvider>
          <ToastProvider>{children}</ToastProvider>
        </RoleProvider>
      </body>
    </html>
  );
}
