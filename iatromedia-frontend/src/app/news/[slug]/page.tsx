import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import {
  extractPlainTextFromBlocks,
  getArticleBySlug,
  getStrapiMediaUrl,
} from "@/lib/strapi";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return {
      title: "Article Not Found",
      description: "The requested article could not be found.",
    };
  }

  return {
    title: article.title,
    description: article.excerpt,
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const contentText = extractPlainTextFromBlocks(article.content);
  const imageUrl = article.featuredImage?.url
    ? getStrapiMediaUrl(article.featuredImage.url)
    : null;

  return (
    <main className="min-h-screen bg-white text-black">
      <Header />

      <article className="mx-auto max-w-4xl px-6 py-16">
        <p className="text-sm uppercase tracking-wider text-sky-700">
          {article.category}
        </p>

        <h1 className="mt-4 text-4xl font-bold leading-tight text-gray-900">
          {article.title}
        </h1>

        <p className="mt-3 text-sm text-gray-500">{article.publishedDate}</p>

        {imageUrl ? (
          <div className="mt-8 overflow-hidden rounded-2xl">
            <img
              src={imageUrl}
              alt={article.featuredImage?.alternativeText || article.title}
              className="h-auto w-full object-cover"
            />
          </div>
        ) : null}

        <div className="mt-8 whitespace-pre-line text-lg leading-8 text-gray-700">
          {contentText}
        </div>
      </article>

      <Footer />
    </main>
  );
}