import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SPECIALTIES_NAV } from "@/lib/specialtiesNav";

export const metadata: Metadata = {
  title: "Specialitetet | Iatromedia Group",
  description: "Specialitetet mjekësore.",
};

export default function SpecialistetPage() {
  return (
    <main className="min-h-screen bg-white text-black">
      <Header />

      <div className="bg-sky-600 text-white">
        <div className="mx-auto flex max-w-[1280px] flex-col gap-3 px-4 py-5 sm:flex-row sm:items-center sm:justify-between md:px-6 md:py-6">
          <h1 className="text-[22px] font-semibold tracking-tight md:text-[28px]">
            Specialitetet
          </h1>
          <nav className="text-[13px] text-white/95 md:text-sm" aria-label="Breadcrumb">
            <Link href="/" className="hover:underline">
              Kreu
            </Link>
            <span className="mx-2 text-white/70">/</span>
            <span className="font-medium">Specialitetet</span>
          </nav>
        </div>
      </div>

      <section className="mx-auto max-w-[1280px] px-4 py-10 md:py-14">
        <p className="mb-8 max-w-2xl text-[15px] leading-relaxed text-gray-700">
          Zgjidh një specialitet për të parë lajmet dhe publikimet e lidhura (sipas kategorisë në
          Strapi).
        </p>
        <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {SPECIALTIES_NAV.map((s) => (
            <li key={s.slug}>
              <Link
                href={`/news?kategoria=${encodeURIComponent(s.slug)}`}
                className="block border border-gray-200 bg-white px-4 py-3 text-[15px] font-medium text-gray-900 shadow-sm transition hover:border-sky-300 hover:bg-sky-50/50 hover:text-sky-700"
              >
                {s.label}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <Footer />
    </main>
  );
}
