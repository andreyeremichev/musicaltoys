"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/today", label: "Today" },
  { href: "/toys", label: "Toys" },
  { href: "/cards", label: "Cards" },
];

export function SiteHeader() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto w-full max-w-6xl px-4 md:px-8">
        {/* Top row: logo */}
        <div className="flex h-14 items-center justify-between md:h-16">
          <div className="flex items-center gap-2 md:gap-3">
            <Link href="/" className="flex items-center gap-2">
              {/* Simple logo mark placeholder – swap with SVG later */}
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-teal-400 to-pink-500 text-[13px] font-bold text-slate-950 shadow-sm">
                ♪
              </span>
              <span className="text-sm font-semibold tracking-tight text-slate-900">
                MusicalToys
              </span>
            </Link>
            <span className="hidden rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-amber-700 md:inline-flex">
              beta
            </span>
          </div>
        </div>

        {/* Bottom row: tabs nav */}
        <nav className="flex items-center gap-1 pb-2 pt-1 text-xs sm:text-sm overflow-x-auto">
          <div className="flex min-w-full items-center gap-1 md:justify-end">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`inline-flex items-center rounded-full px-3 py-1.5 font-medium transition whitespace-nowrap ${
                  isActive(item.href)
                    ? "bg-slate-900 text-slate-50 shadow-sm"
                    : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </header>
  );
}