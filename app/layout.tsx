import type { Metadata } from "next";
import "./globals.css";
import StyledComponentsRegistry from "@/src/utils/SCRegistery";
import { PoppinsFont } from "@/src/statics/fonts";

export const metadata: Metadata = {
  title: "Next Styled TS",
  description: "NextJs with Styled Components and TypeScript",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body>
        <div id="bimboApp" className={PoppinsFont.className}>
          <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
        </div>
      </body>
    </html>
  );
}
