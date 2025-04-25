import Link from "next/link";

export default function Header() {
  return (
    <header className="fixed top-0 w-full backdrop-blur-md z-50">
      <h3 className="text-white font-semibold text-lg px-8 py-5">
        <Link href={"/"}>Streemo </Link>
      </h3>
    </header>
  );
}
