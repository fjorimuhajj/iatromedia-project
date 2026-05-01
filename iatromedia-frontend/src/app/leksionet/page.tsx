import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import {
  extractPlainTextFromBlocks,
  getScientificTeam,
  getStrapiMediaUrl,
} from "@/lib/strapi";

export const metadata: Metadata = {
  title: "Ekipi shkencor | Iatromedia Group",
  description: "Ekipi shkencor i Iatromedia Group.",
};

export default async function LeksionetPage() {
  const team = await getScientificTeam().catch(() => []);

  return (
    <main className="min-h-screen bg-white text-black">
      <Header />

      <div className="bg-sky-600 text-white">
        <div className="mx-auto flex max-w-[1280px] flex-col gap-3 px-4 py-5 sm:flex-row sm:items-center sm:justify-between md:px-6 md:py-6">
          <h1 className="text-[22px] font-semibold tracking-tight md:text-[28px]">
            Ekipi shkencor
          </h1>
          <nav className="text-[13px] text-white/95 md:text-sm" aria-label="Breadcrumb">
            <Link href="/" className="hover:underline">
              Kreu
            </Link>
            <span className="mx-2 text-white/70">/</span>
            <span className="font-medium">Ekipi shkencor</span>
          </nav>
        </div>
      </div>

      <section className="mx-auto max-w-[1280px] px-4 py-10 md:py-14">
        {team.length === 0 ? (
          <p className="text-center text-[15px] text-gray-600">
            Nuk ka anëtarë të ekipit. Shto dhe publiko të dhëna te Strapi → Ekipi Shkencor.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {team.map((m) => {
              const photoUrl = getStrapiMediaUrl(
                m.photo?.formats?.medium?.url ||
                  m.photo?.formats?.small?.url ||
                  m.photo?.url ||
                  ""
              );
              const bioRaw = m.bio ? extractPlainTextFromBlocks(m.bio) : "";
              const bioSnippet =
                bioRaw.length > 200 ? `${bioRaw.slice(0, 200).trim()}…` : bioRaw;
              const subtitle = [m.role, m.speciality].filter(Boolean).join(" · ");
              const href = m.slug ? `/scientific-team/${m.slug}` : "/leksionet";

              return (
                <article
                  key={m.id}
                  className="flex flex-col overflow-hidden border border-gray-200/80 bg-white shadow-sm"
                >
                  <Link href={href} className="group relative block bg-[#c9c3c3]">
                    <div className="relative aspect-[3/4] w-full max-h-[340px]">
                      {photoUrl ? (
                        <Image
                          src={photoUrl}
                          alt={m.photo?.alternativeText || m.name}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                          sizes="(max-width: 1024px) 50vw, 33vw"
                          unoptimized
                        />
                      ) : (
                        <div className="flex h-full min-h-[240px] items-center justify-center text-sm text-gray-600">
                          Pa foto
                        </div>
                      )}
                    </div>
                  </Link>

                  <div className="flex flex-1 flex-col bg-[#eeeeee] px-4 py-4 md:px-5 md:py-5">
                    <Link href={href}>
                      <h2 className="text-[16px] font-bold leading-snug text-black md:text-[17px]">
                        {m.name}
                      </h2>
                    </Link>
                    {subtitle ? (
                      <p className="mt-1.5 text-[13px] font-semibold leading-snug text-[#1a1a1a]">
                        {subtitle}
                      </p>
                    ) : null}
                    {bioSnippet ? (
                      <p className="mt-3 line-clamp-4 text-[13px] leading-[1.65] text-[#333]">
                        {bioSnippet}
                      </p>
                    ) : null}
                    <Link
                      href={href}
                      className="mt-auto pt-4 inline-flex items-center gap-1.5 text-[13px] font-semibold text-black hover:underline"
                    >
                      Lexo më shumë <span className="text-[11px]">▸</span>
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}
