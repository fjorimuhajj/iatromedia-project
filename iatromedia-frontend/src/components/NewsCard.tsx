import Link from "next/link";
import { getStrapiMediaUrl } from "@/lib/strapi";

type NewsCardProps = {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  date: string;
  imageUrl?: string;
  imageAlt?: string;
};

export function NewsCard({
  slug,
  category,
  title,
  excerpt,
  date,
  imageUrl,
  imageAlt,
}: NewsCardProps) {
  return (
    <article className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md">
      {imageUrl ? (
        <Link href={`/news/${slug}`} className="block">
          <img
            src={getStrapiMediaUrl(imageUrl)}
            alt={imageAlt || title}
            className="h-56 w-full object-cover"
          />
        </Link>
      ) : null}

      <div className="p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-sky-700">
          {category}
        </p>

        <h2 className="mt-3 text-xl font-bold leading-snug text-gray-900">
          <Link href={`/news/${slug}`} className="transition hover:text-sky-700">
            {title}
          </Link>
        </h2>

        <p className="mt-3 text-sm leading-6 text-gray-600">{excerpt}</p>

        <div className="mt-6 flex items-center justify-between">
          <span className="text-sm text-gray-500">{date}</span>

          <Link
            href={`/news/${slug}`}
            className="text-sm font-semibold text-sky-700 hover:underline"
          >
            Read more
          </Link>
        </div>
      </div>
    </article>
  );
}