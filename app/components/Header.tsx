import Link from "next/link";

export default function Header() {
  return (
    <header className="fixed top-0 z-30 w-full backdrop-blur-sm">
      <h3 className="px-8 py-5 text-lg font-semibold text-white">
        <Link href={"/"}>Streemo </Link>
      </h3>
    </header>
  );
}
