"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { href: "/buy", label: "Buy" },
  { href: "/rent", label: "Rent" },
  { href: "/sell", label: "Sell" },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="flex-shrink-0 h-14 bg-white border-b border-gray-200 flex items-center px-4 gap-4 shadow-sm z-10">
      <Link href="/" className="flex items-center gap-2">
        <span className="text-xl">🏡</span>
        <span className="font-bold text-gray-900 text-base">
          Real Estate Map
        </span>
      </Link>

      <div className="flex-1" />

      <nav className="hidden md:flex items-center gap-4 text-sm text-gray-600">
        {NAV_LINKS.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={`hover:text-emerald-600 transition-colors ${
              pathname === href ? "text-emerald-600 font-semibold" : ""
            }`}
          >
            {label}
          </Link>
        ))}
      </nav>

      <div className="flex items-center gap-2">
        <Link
          href="/sign-in"
          className={`text-sm font-medium px-4 py-2 rounded-lg border transition-colors ${
            pathname === "/sign-in"
              ? "border-emerald-500 text-emerald-600"
              : "border-gray-200 text-gray-700 hover:border-emerald-400 hover:text-emerald-600"
          }`}
        >
          Sign In
        </Link>
        <Link
          href="/sign-up"
          className={`text-sm font-medium px-4 py-2 rounded-lg transition-colors ${
            pathname === "/sign-up"
              ? "bg-emerald-600 text-white"
              : "bg-emerald-500 hover:bg-emerald-600 text-white"
          }`}
        >
          Sign Up
        </Link>
      </div>
    </header>
  );
}
