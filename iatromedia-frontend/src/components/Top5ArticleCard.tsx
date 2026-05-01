import Link from "next/link";

type Top5ArticleCardProps = {
  slug: string;
  title: string;
  excerpt?: string;
  imageUrl?: string;
  imageAlt?: string;
  layout?: "default" | "tall";
};

export function Top5ArticleCard({
  slug,
  title,
  excerpt,
  imageUrl,
  imageAlt,
  layout = "default",
}: Top5ArticleCardProps) {
  const isTall = layout === "tall";
  return (
    <article className="h-full overflow-hidden bg-transparent transition-[filter] duration-150 hover:brightness-[0.985]">
      <Link href={`/news/${slug}`} className="group block">
        <div
          className={[
            "relative w-full bg-[#c9c3c3]",
            isTall ? "aspect-[5/3]" : "aspect-[2/1]",
          ].join(" ")}
        >
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={imageAlt || title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.01]"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm text-gray-600">
              Nuk ka imazh
            </div>
          )}
        </div>
      </Link>

      <div
        className={[
          "flex flex-1 flex-col bg-[#e0e0e0] px-4 py-4",
          // E njëjta gjatësi si `MiniArticleCard` kur është `layout=\"tall\"`
          isTall ? "min-h-[360px] sm:min-h-[400px] md:min-h-[520px]" : "",
        ].join(" ")}
      >
        <Link href={`/news/${slug}`}>
          <h3
            className={[
              "mb-4 text-[16px] font-semibold leading-snug text-[#1d1d1d]",
              isTall ? "line-clamp-4" : "line-clamp-3",
            ].join(" ")}
          >
            {title}
          </h3>
        </Link>

        {excerpt ? (
          <p
            className={[
              "mb-5 text-[13px] leading-[1.9] text-[#2f2f2f]",
              isTall ? "line-clamp-[14]" : "line-clamp-[9]",
            ].join(" ")}
          >
            {excerpt}
          </p>
        ) : null}

        <Link
          href={`/news/${slug}`}
          className="mt-auto inline-flex items-center gap-2 text-[13px] font-semibold text-[#1f1f1f] hover:underline"
        >
          Lexo më shumë <span className="text-[11px]">▶</span>
        </Link>
      </div>
    </article>
  );
}

