import Link from "next/link";

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
  const shortExcerpt =
    excerpt.length > 220 ? `${excerpt.slice(0, 220)}...` : excerpt;

  return (
    <article className="overflow-hidden bg-transparent transition-[filter] duration-150 hover:brightness-[0.985]">
      <Link href={`/news/${slug}`} className="group block">
        <div className="relative w-full bg-[#c9c3c3] aspect-[1150/460]">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={imageAlt || title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.01]"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-gray-600">
              Nuk ka imazh
            </div>
          )}
        </div>
      </Link>

      <div className="bg-[#e0e0e0] px-5 py-5 md:px-6">
        {category ? (
          <p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.12em] text-[#4d4d4d]">
            {category}
          </p>
        ) : null}

        <Link href={`/news/${slug}`}>
          <h2 className="mb-5 text-[24px] font-semibold leading-[1.3] text-[#1d1d1d]">
            {title}
          </h2>
        </Link>

        <p className="mb-6 text-[16px] leading-[1.9] text-[#2f2f2f]">
          {shortExcerpt}
        </p>

        <div className="flex items-center justify-between gap-4">
          <span className="text-[14px] text-[#555]">{date}</span>

          <Link
            href={`/news/${slug}`}
            className="inline-flex items-center gap-2 text-[15px] font-semibold text-[#1f1f1f] hover:underline"
          >
            Lexo më shumë
            <span className="text-[12px]">▶</span>
          </Link>
        </div>
      </div>
    </article>
  );
}