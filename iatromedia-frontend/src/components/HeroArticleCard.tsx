import Link from "next/link";

type HeroArticleCardProps = {
  slug: string;
  title: string;
  excerpt?: string;
  imageUrl?: string;
  imageAlt?: string;
};

export function HeroArticleCard({
  slug,
  title,
  excerpt,
  imageUrl,
  imageAlt,
}: HeroArticleCardProps) {
  const excerptLimit = 280;
  const shortExcerpt =
    excerpt && excerpt.length > excerptLimit
      ? `${excerpt.slice(0, excerptLimit)}...`
      : excerpt;

  return (
    <article className="overflow-hidden bg-transparent transition-[filter] duration-150 hover:brightness-[0.985]">
      <Link href={`/news/${slug}`} className="group block">
        <div className="relative h-[240px] w-full bg-[#c9c3c3] sm:h-[300px] md:h-[380px] lg:h-[460px]">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={imageAlt || title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.01]"
              loading="eager"
              fetchPriority="high"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-gray-600">
              Nuk ka imazh
            </div>
          )}
        </div>

        <div className="bg-[#e0e0e0] px-5 py-5 md:px-7 md:py-6">
          <h1 className="mb-3 text-[18px] font-semibold leading-snug text-[#1d1d1d] md:text-[22px] lg:text-[24px]">
            {title}
          </h1>

          {shortExcerpt ? (
            <p className="mb-4 text-[13px] leading-[1.8] text-[#2f2f2f] md:text-[14px]">
              {shortExcerpt}
            </p>
          ) : null}

          <div className="inline-flex items-center gap-2 text-[13px] font-semibold text-[#1f1f1f]">
            Lexo më shumë <span className="text-[11px]">▸</span>
          </div>
        </div>
      </Link>
    </article>
  );
}
