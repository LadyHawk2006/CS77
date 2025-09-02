import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { BackgroundSettingsProvider } from "@/hooks/use-background-settings";
import ClientLayoutWrapper from "@/components/client-layout-wrapper";
import Header from "@/components/header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "The Swiftie FanSite",
  description: "A fan site for Swifties.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <BackgroundSettingsProvider>
          <ClientLayoutWrapper>
            <Header />
            {children}
          </ClientLayoutWrapper>
        </BackgroundSettingsProvider>
      </body>
    </html>
  );
}