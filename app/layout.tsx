import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Toast from "@/components/ui/toaster";
import Providers from "./providers";

const parkinsans = localFont({
  src: [
    {
      path: "./fonts/Parkinsans/Parkinsans-Light.ttf",
      weight: "200",
      style: "normal",
    },
    {
      path: "./fonts/Parkinsans//Parkinsans-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/Parkinsans/Parkinsans-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/Parkinsans/Parkinsans-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "./fonts/Parkinsans/Parkinsans-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "./fonts/Parkinsans/Parkinsans-ExtraBold.ttf",
      weight: "800",
      style: "normal",
    },
  ],
  variable: "--font-parkinsans",
});

const notosans = localFont({
  src: [
    {
      path: "./fonts/NotoSans/NotoSansJP-Light.ttf",
      weight: "200",
      style: "normal",
    },
    {
      path: "./fonts/NotoSans/NotoSansJP-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/NotoSans/NotoSansJP-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/NotoSans/NotoSansJP-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "./fonts/NotoSans/NotoSansJP-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "./fonts/NotoSans/NotoSansJP-ExtraBold.ttf",
      weight: "800",
      style: "normal",
    },
  ],
  variable: "--font-notosans",
});

export const metadata: Metadata = {
  title: "Ghibli Magic in Motion",
  description: "An immersive animation showcase inspired by Studio Ghibli",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${parkinsans.variable} ${notosans.variable} antialiased`}
      >
        <Providers>
          {children}
          <Toast />
        </Providers>
      </body>
    </html>
  );
}
