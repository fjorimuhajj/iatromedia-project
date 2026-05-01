import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MiniArticleCard } from "@/components/MiniArticleCard";
import { getArticles, getStrapiMediaUrl } from "@/lib/strapi";
import Link from "next/link";

/** Duhet të përputhet me slug të kategorisë “Qendrat e fokusit” në Strapi. */
const CATEGORY_SLUG_FOCUS = "qendrat-e-fokusit";

export const metadata: Metadata = {
  title: "Qendrat e fokusit | Iatromedia Group",
  description: "Qendrat e fokusit — Gazeta e mjekut.",
};

export default async function GazetaEMjekutPage() {
  const articles = await getArticles({
    categorySlug: CATEGORY_SLUG_FOCUS,
    pageSize: 100,
    allPages: true,
    sort: ["publishedDate:desc", "createdAt:desc"],
  }).catch(() => []);

  return (
    <main className="min-h-screen bg-white text-black">
      <Header />

      <div className="bg-sky-600 text-white">
        <div className="mx-auto flex max-w-[1280px] flex-col gap-3 px-4 py-5 sm:flex-row sm:items-center sm:justify-between md:px-6 md:py-6">
          <h1 className="text-[22px] font-semibold tracking-tight md:text-[28px]">
            Qendrat e fokusit
          </h1>
          <nav className="text-[13px] text-white/95 md:text-sm" aria-label="Breadcrumb">
            <Link href="/" className="hover:underline">
              Kreu
            </Link>
            <span className="mx-2 text-white/70">/</span>
            <span className="font-medium">Qendrat e fokusit</span>
          </nav>
        </div>
      </div>

      <section className="mx-auto max-w-[1280px] px-4 py-10 md:py-14">
        {articles.length === 0 ? (
          <p className="text-center text-[15px] text-gray-600">
            Nuk ka artikuj për këtë kategori. Kontrollo në Strapi që kategoria të ketë slug{" "}
            <code className="rounded bg-gray-100 px-1 text-sm">{CATEGORY_SLUG_FOCUS}</code> dhe që
            artikujt të jenë të publikuar.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {articles.map((a) => (
              <MiniArticleCard
                key={a.id}
                slug={a.slug}
                title={a.title}
                excerpt={a.excerpt}
                variant="default"
                imageUrl={getStrapiMediaUrl(
                  a.featuredImage?.formats?.medium?.url ||
                    a.featuredImage?.formats?.small?.url ||
                    a.featuredImage?.url ||
                    ""
                )}
                imageAlt={a.featuredImage?.alternativeText || a.title}
              />
            ))}
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}
