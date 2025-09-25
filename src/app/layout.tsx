import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ReactNode } from "react";
import {Providers} from "./providers"


export const metadata: Metadata = {
  title: "TS Sender UI",
};

export default function RootLayout(props: {children: ReactNode}) {


  return (
    <html lang="en">
      <body>

        <Providers>
          {props.children}
        </Providers>

      </body>
    </html>
  );
}
