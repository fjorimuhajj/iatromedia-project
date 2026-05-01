"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { LAJME_DROPDOWN_ITEMS } from "@/lib/newsNav";
import { SPECIALTIES_NAV, SPECIALTY_SLUG_SET } from "@/lib/specialtiesNav";

export type NavItemConfig = {
  label: string;
  href: string;
  hasDropdown?: boolean;
  isActive?: (pathname: string) => boolean;
};

export const HEADER_NAV_ITEMS: NavItemConfig[] = [
  { label: "Kreu", href: "/", isActive: (p) => p === "/" },
  {
    label: "Leksionet",
    href: "/leksionet",
    isActive: (p) => p === "/leksionet" || p.startsWith("/scientific-team"),
  },
  { label: "Specialistet", href: "/specialistet" },
  {
    label: "Lajme",
    href: "/news?kategoria=intervista",
    hasDropdown: true,
  },
  {
    label: "Gazeta e mjekut",
    href: "/gazeta-e-mjekut",
    isActive: (p) => p === "/gazeta-e-mjekut",
  },
  { label: "Top 5", href: "/top-5", isActive: (p) => p === "/top-5" },
  { label: "Kontakt", href: "/kontakt", isActive: (p) => p === "/kontakt" },
];

function defaultIsActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function specialistetActive(pathname: string, kategoria: string | null) {
  if (pathname === "/specialistet") return true;
  if (pathname === "/news" && kategoria && SPECIALTY_SLUG_SET.has(kategoria)) return true;
  return false;
}

/** “Lajme” aktiv për listë / detaj lajmesh, jo kur filtri është specialitet mjekësor. */
function lajmeActive(pathname: string, kategoria: string | null) {
  if (pathname.startsWith("/news/")) return true;
  if (pathname !== "/news") return false;
  if (kategoria && SPECIALTY_SLUG_SET.has(kategoria)) return false;
  return true;
}

export function HeaderNav() {
  const pathname = usePathname() || "/";
  const searchParams = useSearchParams();
  const kategoria = searchParams.get("kategoria");
  const last = HEADER_NAV_ITEMS.length - 1;

  return (
    <nav className="grid grid-cols-7 overflow-visible">
      {HEADER_NAV_ITEMS.map((item, index) => {
        const isSpecialist = item.href === "/specialistet";
        const isLajmeDropdown = item.href === "/news" && item.hasDropdown;
        const isActive = isSpecialist
          ? specialistetActive(pathname, kategoria)
          : isLajmeDropdown
            ? lajmeActive(pathname, kategoria)
            : (item.isActive ?? ((p: string) => defaultIsActive(p, item.href)))(pathname);

        const borderLast = index === last ? "border-r-0" : "border-r border-gray-300";
        const activeCls = isActive
          ? "border-t-sky-500 bg-white text-sky-600"
          : "border-t-transparent text-gray-900";

        if (isSpecialist) {
          return (
            <div
              key={item.href}
              className={[
                "group relative flex min-h-[50px] min-w-0 items-stretch justify-center border-t-[3px] transition hover:bg-gray-50",
                borderLast,
                activeCls,
              ].join(" ")}
            >
              <div className="relative flex w-full min-w-0 flex-col items-center justify-center">
                <Link
                  href="/specialistet"
                  className="flex w-full items-center justify-center gap-1 px-2 py-3 text-center text-[15px] font-medium sm:px-4"
                >
                  {item.label}
                  <span className="text-xs text-gray-400 group-hover:text-sky-500">∨</span>
                </Link>

                <div
                  className={[
                    "invisible absolute left-0 right-0 top-full z-50 w-full max-w-full pt-1 opacity-0 transition-all duration-150",
                    "group-hover:visible group-hover:opacity-100",
                    "focus-within:visible focus-within:opacity-100",
                  ].join(" ")}
                >
                  <ul
                    className="box-border max-h-[min(70vh,520px)] w-full max-w-full overflow-y-auto border border-gray-200 bg-white py-2 text-left shadow-lg [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                    role="list"
                  >
                    {SPECIALTIES_NAV.map((s) => (
                      <li key={s.slug}>
                        <Link
                          href={`/news?kategoria=${encodeURIComponent(s.slug)}`}
                          className="block break-words px-3 py-2.5 text-left text-[13px] font-normal leading-snug text-gray-900 hover:bg-gray-50 hover:text-sky-700 sm:px-4 sm:text-[14px]"
                        >
                          {s.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          );
        }

        if (isLajmeDropdown) {
          return (
            <div
              key={item.href}
              className={[
                "group relative flex min-h-[50px] min-w-0 items-stretch justify-center border-t-[3px] transition hover:bg-gray-50",
                borderLast,
                activeCls,
              ].join(" ")}
            >
              <div className="relative flex w-full min-w-0 flex-col items-center justify-center">
                <Link
                  href="/news"
                  className="flex w-full items-center justify-center gap-1 px-2 py-3 text-center text-[15px] font-medium sm:px-4"
                >
                  {item.label}
                  <span className="text-xs text-gray-400 group-hover:text-sky-500">∨</span>
                </Link>

                <div
                  className={[
                    "invisible absolute left-0 right-0 top-full z-50 w-full max-w-full pt-1 opacity-0 transition-all duration-150",
                    "group-hover:visible group-hover:opacity-100",
                    "focus-within:visible focus-within:opacity-100",
                  ].join(" ")}
                >
                  <ul
                    className="box-border w-full max-w-full border border-gray-200 bg-white py-2 text-left shadow-lg"
                    role="list"
                  >
                    {LAJME_DROPDOWN_ITEMS.map((entry) => (
                      <li key={entry.href}>
                        <Link
                          href={entry.href}
                          className="block break-words px-3 py-2.5 text-left text-[14px] font-normal text-gray-900 hover:bg-gray-50 hover:text-sky-700 sm:px-4"
                        >
                          {entry.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          );
        }

        return (
          <Link
            key={item.href}
            href={item.href}
            className={[
              "flex min-h-[50px] items-center justify-center border-t-[3px] px-4 text-center text-[15px] font-medium transition hover:bg-gray-50",
              borderLast,
              activeCls,
            ].join(" ")}
          >
            <span className="flex items-center gap-1">
              {item.label}
              {item.hasDropdown ? (
                <span className="text-xs text-gray-400">∨</span>
              ) : null}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
