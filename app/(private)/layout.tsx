import { Metadata } from "next";
import { authWithUserSession } from "../lib/server/auth";

export const metadata: Metadata = {
  title: "Home",
};

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await authWithUserSession();

  return <main>{children}</main>;
}
