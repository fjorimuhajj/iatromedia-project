import Link from "next/link";

type MiniArticleCardProps = {
  slug: string;
  title: string;
  excerpt?: string;
  imageUrl?: string;
  imageAlt?: string;
  className?: string;
  variant?: "default" | "compact" | "masonry";
  layout?: "default" | "tall";
};

export function MiniArticleCard({
  slug,
  title,
  excerpt,
  imageUrl,
  imageAlt,
  className,
  variant = "default",
  layout = "default",
}: MiniArticleCardProps) {
  const isMasonry = variant === "masonry";
  const isTall = layout === "tall";

  return (
    <article
      className={[
        "h-full overflow-hidden bg-transparent transition-[transform,filter] duration-150 hover:brightness-[0.985]",
        className || "",
      ].join(" ")}
    >
      <Link href={`/news/${slug}`} className="group block">
        <div
          className={[
            "relative w-full bg-[#c9c3c3]",
            isMasonry ? "" : isTall ? "aspect-[5/3]" : "aspect-[2/1]",
          ].join(" ")}
        >
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={imageAlt || title}
              className={[
                isMasonry ? "h-auto w-full object-cover" : "h-full w-full object-cover",
                "transition-transform duration-300 group-hover:scale-[1.01]",
              ].join(" ")}
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
          isTall ? "min-h-[360px] sm:min-h-[400px] md:min-h-[520px]" : "",
        ].join(" ")}
      >
        <Link href={`/news/${slug}`}>
          <h3
            className={[
              "mb-3 text-[16px] font-semibold leading-snug text-[#1d1d1d]",
              isTall ? "line-clamp-4" : "line-clamp-3",
            ].join(" ")}
          >
            {title}
          </h3>
        </Link>

        {(variant === "default" || variant === "masonry") && excerpt ? (
          <p
            className={[
              "mb-4 text-[13px] leading-[1.8] text-[#2f2f2f]",
              isMasonry ? "line-clamp-6" : isTall ? "line-clamp-14" : "line-clamp-4",
            ].join(" ")}
          >
            {excerpt}
          </p>
        ) : null}

        <Link
          href={`/news/${slug}`}
          className="mt-auto inline-flex items-center gap-2 text-[13px] font-semibold text-[#1f1f1f] hover:underline"
        >
          Lexo më shumë <span className="text-[11px]">▸</span>
        </Link>
      </div>
    </article>
  );
}

