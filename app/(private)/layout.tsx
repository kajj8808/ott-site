import { Metadata } from "next";

export const metadata: Metadata = {
  title: "streemo",
};

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <main>{children}</main>;
}
