import Link from "next/link";

type OverlayArticleCardProps = {
  slug: string;
  title: string;
  excerpt?: string;
  imageUrl?: string;
  imageAlt?: string;
  /** Hero kryesor: imazh më i lartë + kutia e bardhë mbi foto (si në fillim të projektit). */
  variant?: "default" | "hero";
};

export function OverlayArticleCard({
  slug,
  title,
  excerpt,
  imageUrl,
  imageAlt,
  variant = "default",
}: OverlayArticleCardProps) {
  const excerptLimit = variant === "hero" ? 240 : 150;
  const shortExcerpt =
    excerpt && excerpt.length > excerptLimit
      ? `${excerpt.slice(0, excerptLimit)}...`
      : excerpt;

  const isHero = variant === "hero";
  const imageHeightClass = isHero
    ? "h-[280px] md:h-[420px] lg:h-[518px]"
    : "h-[320px] md:h-[420px] lg:h-[440px]";
  /** Default: kartë e qendërsuar, ~75–80% gjerësi, përgjysmë mbi fundin e fotos (stili img 2). */
  const overlayClass = isHero
    ? "bottom-5 left-1/2 w-[min(94%,48rem)] -translate-x-1/2 px-5 py-4 md:bottom-8 md:px-7 md:py-6"
    : [
        "bottom-0 left-1/2 z-10 w-[min(80%,42rem)] -translate-x-1/2 translate-y-1/2",
        "px-8 py-8 text-left md:px-10 md:py-10",
      ].join(" ");
  const titleClass = isHero
    ? "mb-3 text-[17px] font-semibold leading-snug text-[#1d1d1d] md:text-[20px] lg:text-[22px]"
    : "mb-3 text-[17px] font-bold leading-snug text-[#1a1a1a] md:text-[1.125rem] lg:text-[1.25rem]";

  const HeadingTag = isHero ? "h1" : "h3";

  return (
    <article
      className={[
        "relative bg-transparent",
        isHero ? "overflow-hidden" : "overflow-visible pb-20 sm:pb-24 md:pb-28 lg:pb-32",
      ].join(" ")}
    >
      <Link href={`/news/${slug}`} className="group relative block">
        <div
          className={[
            `relative w-full bg-[#c9c3c3] ${imageHeightClass}`,
            "transition-[filter] duration-150 group-hover:brightness-[0.985]",
          ].join(" ")}
        >
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={imageAlt || title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.01]"
              loading={isHero ? "eager" : "lazy"}
              fetchPriority={isHero ? "high" : undefined}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-gray-600">
              Nuk ka imazh
            </div>
          )}
        </div>

        <div
          className={[
            "absolute",
            isHero
              ? "bg-white shadow-[0_8px_30px_rgba(0,0,0,0.12)] ring-1 ring-gray-900/10"
              : "bg-[#D9D9D9]",
            overlayClass,
          ].join(" ")}
        >
          <HeadingTag className={titleClass}>{title}</HeadingTag>

          {shortExcerpt ? (
            <p
              className={[
                "mb-4 text-[13px] leading-[1.8] md:text-[14px]",
                isHero ? "text-[#2f2f2f]" : "font-normal text-[#5a5a5a]",
              ].join(" ")}
            >
              {shortExcerpt}
            </p>
          ) : null}

          <div
            className={[
              "inline-flex items-center gap-2 text-[13px] md:text-[14px]",
              isHero ? "font-semibold text-[#1f1f1f]" : "font-bold text-black",
            ].join(" ")}
          >
            Lexo më shumë <span className="text-[11px]">▸</span>
          </div>
        </div>
      </Link>
    </article>
  );
}

