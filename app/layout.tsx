import type { Metadata } from "next";

import "./globals.css";

import localFont from "next/font/local";

// ${geistSans.variable} ${geistMono.variable} antialiased

const pretendardFont = localFont({
  src: [
    { path: "../fonts/Pretendard-Bold.otf", weight: "700", style: "normal" },
    {
      path: "../fonts/Pretendard-SemiBold.otf",
      weight: "600",
      style: "normal",
    },
    { path: "../fonts/Pretendard-Medium.otf", weight: "500", style: "normal" },
    { path: "../fonts/Pretendard-Regular.otf", weight: "400", style: "normal" },
  ],
});
export const metadata: Metadata = {
  title: "Next App",
  description: "Private Animation Site",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="kr">
      <body className={`${pretendardFont.className} antialiased`}>
        <main className="relative z-10">{children}</main>
      </body>
    </html>
  );
}
