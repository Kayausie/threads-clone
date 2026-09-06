import { ClerkProvider } from "@clerk/nextjs";
import localFont from "next/font/local";
import type { Metadata } from "next";
import '../globals.css';
// Trigger a preview deployment to verify the E2E workflow.
export const metadata: Metadata = {
    title: "Threads",
    description: "A NextJS 15 Threads Clone Application",
  };
  const geist = localFont({
  src: "../fonts/GeistVF.woff",
  weight: "100 900",
})
  export default function RootLayout({children}:{children:React.ReactNode;}){
    return(
        <ClerkProvider>
            <html lang='en'>
                <body className={`${geist.className} bg-dark-1`} >
                    {children}
                </body>
            </html>
    </ClerkProvider>
    )
  }