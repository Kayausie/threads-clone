import type { Metadata } from "next";
import {ClerkProvider} from '@clerk/nextjs';
import localFont from "next/font/local";
import "../globals.css";
import Head from "next/head";
import Bottombar from "@/components/shared/Bottombar";
import Topbar from "@/components/shared/Topbar";
import Leftsidebar from "@/components/shared/Leftsidebar";
import Rightsidebar from "@/components/shared/Rightsidebar";
const geistSans = localFont({
  src: "../fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "../fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Threads",
  description: "A NextJS 15 Threads Clone Application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    
    <ClerkProvider>
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Topbar/>
        <main className="flex flex-row">
          <Leftsidebar/>
          <section className="main-container">
            <div className="w-full max-w-4xl">
            {children}
            </div>
          </section>
          <Rightsidebar/>
        </main>
        <Bottombar/>
      </body>
    </html>
    </ClerkProvider>
  );
}
