import type { Metadata } from "next";
import "./globals.css";
import StyledComponentsRegistry from "@/src/utils/SCRegistery";
import { PoppinsFont } from "@/src/statics/fonts";
import { ComicFont } from "@/src/statics/fonts";

export const metadata: Metadata = {
  title: "EVana ChatBot",
  description: "EVana ChatBot Assistant",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body>
        <div id="EVana" className={PoppinsFont.className}>
          <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
        </div>
      </body>
    </html>
  );
}
