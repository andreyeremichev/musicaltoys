"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/* =========================
   Primary navigation (entry points)
========================= */
const PRIMARY_NAV = [
  { href: "/toys/text-to-tone", label: "Toys" },
  { href: "/cards/postcard/birthday", label: "Postcards" },
];

/* =========================
   Secondary navigation (context)
========================= */
const SECONDARY_NAV = [
  { href: "/today", label: "Today" },
  { href: "/fireplace", label: "Fireplace" },
  { href: "/calendar", label: "Calendar" },
];

export function SiteHeader() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto w-full max-w-6xl px-4 md:px-8">
        {/* =========================
            ROW 1 — Brand + Primary nav
        ========================= */}
        <div className="flex h-14 items-center justify-between md:h-16">
          {/* Brand (Home) */}
          <Link href="/" className="flex items-center gap-2">
            <img
              src="/brand/musicaltoys-logo.svg"
              alt="MusicalToys"
              className="h-7 w-7"
            />
            <span className="text-sm font-semibold tracking-tight text-slate-900">
              MusicalToys
            </span>
          </Link>

          {/* Primary nav */}
          <nav className="flex items-center gap-1 sm:gap-2">
            {PRIMARY_NAV.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`inline-flex items-center rounded-full px-3 py-1.5 text-sm font-medium transition ${
                    active
                      ? "bg-slate-900 text-slate-50 shadow-sm"
                      : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* =========================
            ROW 2 — Secondary (quiet context)
        ========================= */}
        <div className="flex items-center gap-4 pb-2 pt-1 text-xs sm:text-sm">
          {SECONDARY_NAV.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative font-medium transition ${
                  active
                    ? "text-slate-900"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {item.label}

                {/* Active indicator */}
                {active && (
                  <span className="absolute -bottom-1 left-0 right-0 mx-auto h-[2px] w-4 rounded-full bg-slate-900" />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
}