import type { ReactNode } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import {
  extractPlainTextFromBlocks,
  getArticles,
  getHomepageLayout,
  getScientificTeam,
  getStrapiMediaUrl,
  type StrapiArticle,
} from "@/lib/strapi";
import { SectionHeading } from "@/components/SectionHeading";
import { Carousel } from "@/components/Carousel";
import { MiniArticleCard } from "@/components/MiniArticleCard";
import { HeroArticleCard } from "@/components/HeroArticleCard";
import { OverlayArticleCard } from "@/components/OverlayArticleCard";
import { PlaceholderCard } from "@/components/PlaceholderCard";
import { Top5ArticleCard } from "@/components/Top5ArticleCard";
import Link from "next/link";
/** Slug-et e kategorive në Strapi (fusha `slug` te content-type `Category`). */
const CATEGORY_SLUG_LATEST = "publikime-mjekesore";
const CATEGORY_SLUG_FEATURED = "publikime-te-zgjedhura";
const CATEGORY_SLUG_TOP5 = "iatromedia-top-5";
const CATEGORY_SLUG_FOCUS = "qendrat-e-fokusit";
const CATEGORY_SLUG_INTERVIEWS = "intervista";

/** Strapi max pageSize is typically 100 per request. */
const STRAPI_PAGE_SIZE = 100;

/**
 * Gjerësia e kartës në carousel.
 * `gap-6` = 1.5rem; për N karta në një rresht ka (N - 1) gap-e.
 */
const CAROUSEL_ITEM_4UP =
  "w-[min(18rem,calc(100%-0px))] sm:w-[calc((100%-1.5rem)/2)] md:w-[calc((100%-3rem)/3)] lg:w-[calc((100%-4.5rem)/4)]";

/** “Publikimet më të reja …”: ~3 karta të dukshme në desktop; të tjerat vetëm me slide. */
const CAROUSEL_ITEM_LATEST =
  "w-[min(22rem,calc(100%-0px))] sm:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-3rem)/3)]";

/** “Intervista”: ~3 karta të dukshme në desktop; të tjerat me slide. */
const CAROUSEL_ITEM_3UP =
  "w-[min(18rem,calc(100%-0px))] sm:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-3rem)/3)]";


function miniImageUrl(a: StrapiArticle) {
  return getStrapiMediaUrl(
    a.featuredImage?.formats?.medium?.url ||
      a.featuredImage?.formats?.small?.url ||
      a.featuredImage?.url ||
      ""
  );
}

function cardExcerpt(a: StrapiArticle, layout: "default" | "tall") {
  const e = (a.excerpt || "").trim();
  if (layout !== "tall") return e;

  // Për kartat "tall" duam të mbushet pjesa poshtë me tekst.
  // Nëse excerpt është i shkurtër, nxirr tekst nga content.
  const minLen = 160;
  if (e.length >= minLen) return e;

  const fromContent = extractPlainTextFromBlocks(a.content || []).replace(/\s+/g, " ").trim();
  const combined = [e, fromContent].filter(Boolean).join(" ");
  const maxLen = 520;
  if (combined.length <= maxLen) return combined;
  return `${combined.slice(0, maxLen).trim()}...`;
}

function padThreeUpMini(
  articles: StrapiArticle[],
  categorySlug: string,
  layout: "default" | "tall" = "default"
): ReactNode[] {
  const cards: ReactNode[] = articles.map((a) => (
    <MiniArticleCard
      key={a.id}
      slug={a.slug}
      title={a.title}
      excerpt={cardExcerpt(a, layout)}
      layout={layout}
      imageUrl={miniImageUrl(a)}
      imageAlt={a.featuredImage?.alternativeText || a.title}
    />
  ));
  for (let i = cards.length; i < 3; i += 1) {
    cards.push(
      <PlaceholderCard
        key={`pad-3-${categorySlug}-${i}`}
        title={`Shto artikuj me kategori slug: “${categorySlug}”`}
      />
    );
  }
  return cards;
}

function padFourUpMini(
  articles: StrapiArticle[],
  categorySlug: string,
  layout: "default" | "tall" = "default"
): ReactNode[] {
  const cards: ReactNode[] = articles.map((a) => (
    <MiniArticleCard
      key={a.id}
      slug={a.slug}
      title={a.title}
      excerpt={cardExcerpt(a, layout)}
      layout={layout}
      imageUrl={miniImageUrl(a)}
      imageAlt={a.featuredImage?.alternativeText || a.title}
    />
  ));
  for (let i = cards.length; i < 4; i += 1) {
    cards.push(
      <PlaceholderCard
        key={`pad-4m-${categorySlug}-${i}`}
        title={`Shto artikuj me kategori slug: “${categorySlug}”`}
      />
    );
  }
  return cards;
}

function padFourUpTop5(
  articles: StrapiArticle[],
  categorySlug: string,
  layout: "default" | "tall" = "default"
): ReactNode[] {
  const cards: ReactNode[] = articles.map((a) => (
    <Top5ArticleCard
      key={a.id}
      slug={a.slug}
      title={a.title}
      excerpt={cardExcerpt(a, layout)}
      layout={layout}
      imageUrl={miniImageUrl(a)}
      imageAlt={a.featuredImage?.alternativeText || a.title}
    />
  ));
  for (let i = cards.length; i < 4; i += 1) {
    cards.push(
      <PlaceholderCard
        key={`pad-4t-${categorySlug}-${i}`}
        title={`Shto artikuj me kategori slug: “${categorySlug}”`}
      />
    );
  }
  return cards;
}

export default async function HomePage() {
  const [
    homeArticles,
    latestMedicalArticles,
    featuredArticles,
    focusHubArticles,
    interviewArticles,
    top5Articles,
    scientificTeam,
    homepageLayout,
  ] = await Promise.all([
    getArticles({
      pageSize: STRAPI_PAGE_SIZE,
      allPages: true,
      sort: ["publishedDate:desc", "createdAt:desc"],
    }).catch(() => []),
    getArticles({
      categorySlug: CATEGORY_SLUG_LATEST,
      pageSize: STRAPI_PAGE_SIZE,
      allPages: true,
      sort: ["publishedDate:desc", "createdAt:desc"],
    }).catch(() => []),
    getArticles({
      categorySlug: CATEGORY_SLUG_FEATURED,
      pageSize: STRAPI_PAGE_SIZE,
      allPages: true,
      sort: ["publishedDate:desc", "createdAt:desc"],
    }).catch(() => []),
    getArticles({
      categorySlug: CATEGORY_SLUG_FOCUS,
      pageSize: STRAPI_PAGE_SIZE,
      allPages: true,
      sort: ["publishedDate:desc", "createdAt:desc"],
    }).catch(() => []),
    getArticles({
      categorySlug: CATEGORY_SLUG_INTERVIEWS,
      pageSize: STRAPI_PAGE_SIZE,
      allPages: true,
      sort: ["publishedDate:desc", "createdAt:desc"],
    }).catch(() => []),
    getArticles({
      categorySlug: CATEGORY_SLUG_TOP5,
      pageSize: STRAPI_PAGE_SIZE,
      allPages: true,
      sort: ["publishedDate:desc", "createdAt:desc"],
    }).catch(() => []),
    getScientificTeam().catch(() => []),
    getHomepageLayout().catch(() => null),
  ]);

  // Në “Kreu” duam të shfaqim vetëm ekipin aktual (fixed allowlist),
  // që anëtarët e rinj të shfaqen vetëm te “Leksionet”.
  const HOME_TEAM_ALLOWLIST = new Set<string>([
    "angeliki-nikolopoulou-ortodonte-invisalign",
    "dimitrios-mousiolis-kirurg-proktolog-laser",
    "eirini-mantzari-kirurge-orl-rinoplastike",
    "georgios-georgiou-kirurg-pergjithshem-robotik-laparoskopik",
    "georgios-mavrogenis-endoskopi-intervencioniste",
    "georgios-zontos-transplant-flokesh",
    "ioanna-galanou-kirurge-gjirit-onkoplastike",
    "ioannis-kotrogiannis-kirurg-pergjithshem",
    "konstandina-daggli-dermatologe-afrodiziologe",
    "konstandinos-kyriakopoulos-gjinekolog-endometrioze-laparoskopi",
    "nikolaos-michalopoulos-kardiokirurg",
    "panagiotis-kyriakongonas-neurokirurg-shtylla-kurrizore",
    "panagiotis-pantos-kirurg-ortoped-gjymtyra-e-siperme",
    "pantelis-valvis-transplant-flokesh",
    "ekipi-shkencor",
    "spyridon-martinis-kirurg-urolog",
    "vasileios-kontostolis-kirurg-pergjithshem",
  ]);
  const scientificTeamHome = scientificTeam.filter((m) => HOME_TEAM_ALLOWLIST.has(m.slug));

  // Në “Kreu” duam të shfaqim vetëm intervistat aktuale (fixed allowlist),
  // që intervistat e reja të dalin vetëm te “Lajme”.
  const HOME_INTERVIEWS_ALLOWLIST = new Set<string>([
    "hemorroide-te-brendshme-apo-te-jashtme-cila-eshte-me-serioze",
    "facelift-si-ruajne-pamjen-e-re-pas-te-60",
    "renia-e-flokeve-trajtimet-dhe-si-zgjidhen",
  ]);
  const interviewArticlesHome = interviewArticles.filter((a) =>
    HOME_INTERVIEWS_ALLOWLIST.has(a.slug)
  );

  /**
   * Nëse në Strapi ke përzgjedhur artikuj te “Homepage”, ata kanë përparësi.
   * Përndryshe: të zgjedhurat + lista mjekësore si më parë.
   */
  const usedForTop = new Set<number>();
  const firstUnused = (list: StrapiArticle[]) => list.find((a) => !usedForTop.has(a.id));
  const validArticle = (a: StrapiArticle | null | undefined) =>
    a?.slug && a.title ? a : null;

  let heroArticle =
    validArticle(homepageLayout?.heroArticle) ??
    firstUnused(featuredArticles) ??
    homeArticles[0] ??
    null;
  if (heroArticle) usedForTop.add(heroArticle.id);

  let gridLeftArticle = validArticle(homepageLayout?.spotlightArticle) ?? null;
  if (gridLeftArticle && usedForTop.has(gridLeftArticle.id)) gridLeftArticle = null;
  if (!gridLeftArticle) {
    gridLeftArticle =
      firstUnused(featuredArticles) ?? firstUnused(homeArticles) ?? null;
  }
  if (gridLeftArticle) usedForTop.add(gridLeftArticle.id);

  const sideArticles: StrapiArticle[] = [];
  for (const manual of [homepageLayout?.sideArticle1, homepageLayout?.sideArticle2]) {
    const a = validArticle(manual);
    if (a && !usedForTop.has(a.id) && sideArticles.length < 2) {
      sideArticles.push(a);
      usedForTop.add(a.id);
    }
  }

  const fromLatestMedical = latestMedicalArticles.filter((a) => !usedForTop.has(a.id));
  for (const a of fromLatestMedical) {
    if (sideArticles.length >= 2) break;
    if (!sideArticles.some((s) => s.id === a.id)) sideArticles.push(a);
  }
  if (sideArticles.length < 2) {
    const fill = homeArticles.filter(
      (a) =>
        !usedForTop.has(a.id) && !sideArticles.some((s) => s.id === a.id)
    );
    sideArticles.push(...fill.slice(0, 2 - sideArticles.length));
  }

  return (
    <main className="min-h-screen bg-white text-black">
      <Header />

      {/* Hero: foto e gjerë + bllok gri nën të (jo overlay) */}
      <section className="mx-auto max-w-[1280px] px-4 pt-6 pb-8 md:pb-10">
        <div className="mx-auto max-w-[1160px]">
          {heroArticle ? (
            <HeroArticleCard
              slug={heroArticle.slug}
              title={heroArticle.title}
              excerpt={heroArticle.excerpt}
              imageUrl={getStrapiMediaUrl(
                heroArticle.featuredImage?.formats?.large?.url ||
                  heroArticle.featuredImage?.formats?.medium?.url ||
                  heroArticle.featuredImage?.url ||
                  ""
              )}
              imageAlt={heroArticle.featuredImage?.alternativeText || heroArticle.title}
            />
          ) : (
            <div className="overflow-hidden border border-dashed border-gray-300 bg-white">
              <div className="min-h-[240px] bg-[#e8e8e8] sm:min-h-[300px] md:min-h-[380px]" />
              <div className="bg-[#e0e0e0] px-5 py-5">
                <p className="text-sm font-semibold text-[#1d1d1d]">
                  Shto dhe publiko artikuj në Strapi për të shfaqur hero-n.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ~2/3: overlay djathtas-poshtë + ~1/3: 2 mini (imazh + gri poshtë) */}
      <section className="mx-auto max-w-[1280px] px-4 pb-10 md:pb-12">
        <div className="mx-auto max-w-[1160px] grid items-start gap-6 lg:grid-cols-[2fr_1fr] lg:gap-8">
          <div>
            {gridLeftArticle ? (
              <OverlayArticleCard
                slug={gridLeftArticle.slug}
                title={gridLeftArticle.title}
                excerpt={gridLeftArticle.excerpt}
                imageUrl={getStrapiMediaUrl(
                  gridLeftArticle.featuredImage?.formats?.large?.url ||
                    gridLeftArticle.featuredImage?.formats?.medium?.url ||
                    gridLeftArticle.featuredImage?.url ||
                    ""
                )}
                imageAlt={
                  gridLeftArticle.featuredImage?.alternativeText || gridLeftArticle.title
                }
              />
            ) : (
              <PlaceholderCard title="Publikim i veçuar" />
            )}
          </div>

          <div className="grid gap-8">
            {sideArticles.map((a) => (
              <MiniArticleCard
                key={a.id}
                slug={a.slug}
                title={a.title}
                excerpt={a.excerpt}
                variant="compact"
                imageUrl={getStrapiMediaUrl(
                  a.featuredImage?.formats?.medium?.url ||
                    a.featuredImage?.formats?.small?.url ||
                    a.featuredImage?.url ||
                    ""
                )}
                imageAlt={a.featuredImage?.alternativeText || a.title}
              />
            ))}

            {Array.from({ length: Math.max(0, 2 - sideArticles.length) }).map((_, i) => (
              <PlaceholderCard key={`side-empty-${i}`} title="Publikim" compact />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1280px] border-t border-gray-200 px-4 pt-10 pb-2 md:pt-14">
        <SectionHeading title="Publikimet më të reja mjekësore" />
        <div className="mx-auto max-w-[1160px]">
          <Carousel
            ariaLabel="Publikimet më të reja mjekësore"
            controls="flank"
            className="px-10 md:px-12"
            itemWidthClassName={CAROUSEL_ITEM_LATEST}
          >
            {latestMedicalArticles.length > 0
              ? padThreeUpMini(latestMedicalArticles, CATEGORY_SLUG_LATEST)
              : padThreeUpMini([], CATEGORY_SLUG_LATEST)}
          </Carousel>
        </div>
      </section>

      <section className="mx-auto max-w-[1280px] px-4 pb-2">
        <SectionHeading title="Publikime të zgjedhura" />
        <div className="mx-auto max-w-[1160px]">
          <Carousel
            ariaLabel="Publikime të zgjedhura"
            controls="flank"
            className="px-10 md:px-12"
            itemWidthClassName={CAROUSEL_ITEM_4UP}
            lockHeight
          >
            {featuredArticles.length > 0
              ? padFourUpMini(featuredArticles, CATEGORY_SLUG_FEATURED, "tall")
              : padFourUpMini([], CATEGORY_SLUG_FEATURED, "tall")}
          </Carousel>
        </div>
      </section>

      <section className="mx-auto max-w-[1280px] px-4 pb-2">
        <SectionHeading title="IATROMEDIA TOP 5" />
        <div className="mx-auto max-w-[1160px]">
          <Carousel
            ariaLabel="Iatromedia Top 5"
            controls="flank"
            className="px-10 md:px-12"
            itemWidthClassName={CAROUSEL_ITEM_4UP}
            lockHeight
          >
            {top5Articles.length > 0
              ? padFourUpTop5(top5Articles, CATEGORY_SLUG_TOP5, "tall")
              : padFourUpTop5([], CATEGORY_SLUG_TOP5, "tall")}
          </Carousel>
        </div>
      </section>

      <section className="mx-auto max-w-[1280px] px-4 pb-2">
        <SectionHeading title="Qendrat e fokusit" />
        <div className="mx-auto max-w-[1160px]">
          <Carousel
            ariaLabel="Qendrat e fokusit"
            controls="flank"
            className="px-10 md:px-12"
            itemWidthClassName={CAROUSEL_ITEM_4UP}
            lockHeight
          >
            {focusHubArticles.length > 0
              ? padFourUpMini(focusHubArticles, CATEGORY_SLUG_FOCUS, "tall")
              : padFourUpMini([], CATEGORY_SLUG_FOCUS, "tall")}
          </Carousel>
        </div>
      </section>

      <section className="mx-auto max-w-[1280px] px-4 pb-10">
        <SectionHeading title="Intervista" />
        <div className="mx-auto max-w-[1160px]">
          <Carousel
            ariaLabel="Intervista"
            controls="flank"
            className="px-10 md:px-12"
            itemWidthClassName={CAROUSEL_ITEM_4UP}
            hideArrows
            lockHeight
          >
            {interviewArticlesHome.length > 0
              ? padThreeUpMini(interviewArticlesHome, CATEGORY_SLUG_INTERVIEWS, "tall")
              : padThreeUpMini([], CATEGORY_SLUG_INTERVIEWS, "tall")}
          </Carousel>
        </div>

        <div className="pt-10">
          <SectionHeading title="Ekipi shkencor" className="py-0 pb-6" />
          <div className="mx-auto max-w-[1160px]">
            <Carousel
              ariaLabel="Ekipi shkencor"
              controls="inset"
              buttonVariant="white"
              className="px-0"
              autoScrollMs={2600}
              itemWidthClassName="w-[110px] sm:w-[120px] md:w-[140px]"
              showArrowsOnHover
            >
              {scientificTeamHome.length > 0
                ? scientificTeamHome.map((m) => {
                    const photoUrl = m.photo?.formats?.small?.url || m.photo?.url || "";
                    const href = m.slug ? `/scientific-team/${m.slug}` : "/scientific-team";
                    return (
                      <Link
                        key={m.id}
                        href={href}
                        className="group relative aspect-square w-full overflow-hidden bg-[#c9c3c3]"
                        aria-label={m.name}
                        title={m.name}
                      >
                        {photoUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={getStrapiMediaUrl(photoUrl)}
                            alt={m.photo?.alternativeText || m.name}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                            loading="lazy"
                          />
                        ) : null}
                      </Link>
                    );
                  })
                : Array.from({ length: 8 }).map((_, i) => (
                    <div
                      key={i}
                      className="aspect-square w-full bg-[#c9c3c3]"
                      aria-label="Anëtar i ekipit shkencor"
                    />
                  ))}
            </Carousel>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}