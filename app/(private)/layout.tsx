import { authWithUserSession } from "../lib/server/auth";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await authWithUserSession();

  return <main>{children}</main>;
}
