import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { NewsCard } from "@/components/NewsCard";
import { getArticles } from "@/lib/strapi";

export const metadata: Metadata = {
  title: "News",
  description: "Browse the latest medical news and healthcare articles.",
};

export default async function NewsPage() {
  const articles = await getArticles();

  return (
    <main className="min-h-screen bg-white text-black">
      <Header />

      <section className="border-b border-gray-200 bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">
            Newsroom
          </p>

          <h1 className="max-w-3xl text-4xl font-bold leading-tight text-gray-900">
            Latest medical news and healthcare insights
          </h1>

          <p className="mt-4 max-w-2xl text-lg text-gray-600">
            Explore articles, expert commentary, and the latest developments
            across major medical specialties.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <NewsCard
              key={article.id}
              slug={article.slug}
              category={article.category}
              title={article.title}
              excerpt={article.excerpt}
              date={article.publishedDate}
              imageUrl={
                article.featuredImage?.formats?.small?.url ||
                article.featuredImage?.url
              }
              imageAlt={article.featuredImage?.alternativeText || article.title}
            />
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}