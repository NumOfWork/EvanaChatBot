import type { Metadata } from "next";
import "./globals.css";
import StyledComponentsRegistry from "@/src/utils/SCRegistery";

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
        <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
      </body>
    </html>
  );
}
