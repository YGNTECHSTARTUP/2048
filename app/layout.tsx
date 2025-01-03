import type { Metadata } from "next";

import "./globals.css";
import { Press_Start_2P } from "next/font/google";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};
const pressStart2P = Press_Start_2P({
  subsets: ["latin"],
  weight: "400"
});
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body

        className={pressStart2P.className}
        
      >
        {children}
      </body>
    </html>
  );
}
