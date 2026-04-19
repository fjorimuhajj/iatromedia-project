import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { NewsCard } from "@/components/NewsCard";
import { getArticles } from "@/lib/strapi";

export default async function HomePage() {
  const articles = await getArticles();
  const latestArticles = articles.slice(0, 3);

  return (
    <main className="min-h-screen bg-white text-black">
      <Header />

      <section className="border-b border-gray-200 bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:py-24">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">
            Medical Media Platform
          </p>

          <h1 className="max-w-4xl text-4xl font-bold leading-tight text-gray-900 md:text-5xl">
            Healthcare news, insights, and expert medical content in one place
          </h1>

          <p className="mt-5 max-w-2xl text-lg leading-8 text-gray-600">
            Stay updated with the latest developments in healthcare, medical
            specialties, prevention, and expert-driven editorial content.
          </p>

          <div className="mt-8">
            <Link
              href="/news"
              className="inline-flex items-center rounded-full bg-sky-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-sky-800"
            >
              Explore News
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.15em] text-sky-700">
              Latest News
            </p>

            <h2 className="mt-2 text-3xl font-bold text-gray-900">
              Recent articles and healthcare updates
            </h2>
          </div>

          <Link
            href="/news"
            className="text-sm font-semibold text-sky-700 hover:underline"
          >
            View all
          </Link>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {latestArticles.map((article) => (
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