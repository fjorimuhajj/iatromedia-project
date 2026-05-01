import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { HeaderNav } from "@/components/HeaderNav";

type HeaderNavFallbackItem = {
  label: string;
  href: string;
  hasDropdown?: boolean;
};

const HEADER_NAV_FALLBACK_ITEMS: HeaderNavFallbackItem[] = [
  { label: "Kreu", href: "/" },
  { label: "Leksionet", href: "/leksionet" },
  { label: "Specialistet", href: "/specialistet", hasDropdown: true },
  { label: "Lajme", href: "/news?kategoria=intervista", hasDropdown: true },
  { label: "Gazeta e mjekut", href: "/gazeta-e-mjekut" },
  { label: "Top 5", href: "/top-5" },
  { label: "Kontakt", href: "/kontakt" },
];

function HeaderNavFallback() {
  return (
    <nav className="grid grid-cols-7 overflow-visible">
      {HEADER_NAV_FALLBACK_ITEMS.map((item, index) => (
        <Link
          key={item.href}
          href={item.href}
          className={[
            "flex min-h-[50px] items-center justify-center border-r border-gray-300 border-t-[3px] border-t-transparent px-4 text-center text-[15px] font-medium text-gray-900",
            index === HEADER_NAV_FALLBACK_ITEMS.length - 1 ? "border-r-0" : "",
          ].join(" ")}
        >
          <span className="flex items-center gap-1">
            {item.label}
            {item.hasDropdown ? (
              <span className="text-xs text-gray-400">∨</span>
            ) : null}
          </span>
        </Link>
      ))}
    </nav>
  );
}

export function Header() {
  return (
    <header className="bg-white">
      <div className="mx-auto max-w-[1240px]">

        {/* Logo */}
        <div className="flex items-center justify-center py-4">
          <Link href="/" className="block">
            <Image
              src="/iatromedia-logo.png"
              alt="Iatromedia Group"
              width={980}
              height={255}
              className="h-auto w-[280px] md:w-[340px]"
              priority
            />
          </Link>
        </div>
      </div>

      {/* Vetëm vija sipër full-width; pa vijë poshtë menysë */}
      <div className="w-full border-t border-gray-300">
        <div className="mx-auto max-w-[1240px] border-x border-gray-300">
          <Suspense fallback={<HeaderNavFallback />}>
            <HeaderNav />
          </Suspense>
        </div>
      </div>
    </header>
  );
}