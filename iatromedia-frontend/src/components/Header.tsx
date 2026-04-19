import Link from "next/link";

export function Header() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-sky-700">
          Iatromedia
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-6 text-sm font-medium text-gray-700">
          <Link href="/" className="hover:text-sky-700 transition">
            Home
          </Link>

          <Link href="/news" className="hover:text-sky-700 transition">
            News
          </Link>

          {/* këto i aktivizojmë më vonë kur t’i krijojmë faqet */}
          <span className="text-gray-400 cursor-not-allowed">
            Scientific Team
          </span>

          <span className="text-gray-400 cursor-not-allowed">
            Specialties
          </span>

          <span className="text-gray-400 cursor-not-allowed">
            Contact
          </span>
        </nav>
      </div>
    </header>
  );
}