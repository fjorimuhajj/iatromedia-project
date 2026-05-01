import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { MiniArticleCard } from "@/components/MiniArticleCard";
import {
  extractPlainTextFromBlocks,
  getArticles,
  getScientificMemberBySlug,
  getStrapiMediaUrl,
} from "@/lib/strapi";
import { SPECIALTIES_NAV } from "@/lib/specialtiesNav";

const SLUG_INTERVISTA = "intervista";
const SLUG_ANGJILOGJIA = "angjilogjia";
const SLUG_GASTROENTEROLOGJIA = "gastroenterologjia";
const SLUG_GJIRI = "gjiri";
const SLUG_GJINEKOLOGJIA = "gjinekologjia";
const SLUG_KARDIOLOGJIA = "kardiologjia";
const SLUG_MJEKESIA_E_PERGJITHSHME = "mjekesia-e-pergjithshme";
const SLUG_NEUROLOGJI = "neurologji";
const SLUG_ORTOPEDJIA = "ortopedjia";
const SLUG_STOMATOLOGJIA = "stomatologjia";
const SLUG_UROLOGJIA_DHE_ANDROLOGJIA = "urologjia-dhe-andrologjia";
const SLUG_KIRURGJIA_PLASTIKE = "kirurgjia-plastike";
const SLUG_OFTALMOLOGJIA = "oftalmologjia";
const SLUG_ORL = "orl";
const ANGJILOGJIA_MEMBER_SLUGS = ["alexandros-matthaiou-angiokirurg"] as const;
const GASTROENTEROLOGJIA_MEMBER_SLUGS = ["nina-markoutsaki-gastroenterologe"] as const;
const GJIRI_MEMBER_SLUGS = [
  "fiorita-a-poulakaki-kirurge-e-gjirit",
  "ioanna-galanou-kirurge-gjirit-onkoplastike",
] as const;
const GJINEKOLOGJIA_MEMBER_SLUGS = [
  "georgios-marios-makris-gjinekolog-onkolog",
  "konstandinos-kyriakopoulos-gjinekolog-endometrioze-laparoskopi",
] as const;
const KARDIOLOGJIA_MEMBER_SLUGS = ["nikolaos-michalopoulos-kardiokirurg"] as const;
const ORTOPEDJIA_MEMBER_SLUGS = [
  "panagiotis-v-kouloumentas-kirurg-ortoped-mjek-sportiv",
  "panagiotis-pantos-kirurg-ortoped-gjymtyra-e-siperme",
] as const;
const MJEKESIA_E_PERGJITHSHME_MEMBER_SLUGS = [
  "charalampos-spyropoulos-kirurg-i-pergjithshem",
  "vasileios-kontostolis-kirurg-pergjithshem",
] as const;
const STOMATOLOGJIA_MEMBER_SLUGS = ["michail-tsitsikopoulos-kirurg-stomatolog-implantolog"] as const;
const UROLOGJIA_DHE_ANDROLOGJIA_MEMBER_SLUGS = [
  "christos-fliatouras-kirurg-androlog-urolog",
] as const;
const KIRURGJIA_PLASTIKE_MEMBER_SLUGS = [
  "aris-damagkas-kirurg-plastik",
  "dr-kanellos-gesakis-kirurg-plastik",
  "maria-skolarikou-kirurge-plastike",
  "margarita-moustaki-kirurge-plastike-londer",
] as const;
const OFTALMOLOGJIA_MEMBER_SLUGS = [
  "dimitra-portaliou-kirurge-oftalmologe-oftalmoplastike",
] as const;
const ORL_MEMBER_SLUGS = ["eirini-mantzari-kirurge-orl-rinoplastike"] as const;
const NEUROLOGJI_MEMBER_SLUGS = [
  "panagiotis-kyriakongonas-neurokirurg-shtylla-kurrizore",
  "pantelis-stavrinou-profesor-neurokirurg",
  "konstantinos-gousias-neurokirurg-trurit",
] as const;

function kategoriaDisplayTitle(slug: string): string {
  if (slug === SLUG_INTERVISTA) return "Intervista";
  return SPECIALTIES_NAV.find((s) => s.slug === slug)?.label || slug;
}

type NewsPageProps = {
  searchParams: Promise<{ kategoria?: string }>;
};

export async function generateMetadata({
  searchParams,
}: NewsPageProps): Promise<Metadata> {
  const { kategoria } = await searchParams;
  const label = kategoria ? kategoriaDisplayTitle(kategoria) : null;
  return {
    title: label ? `${label} | Lajme` : "Lajme",
    description: "Shfleto lajmet dhe artikujt më të fundit mjekësorë.",
  };
}

export default async function NewsPage({ searchParams }: NewsPageProps) {
  const { kategoria } = await searchParams;
  const articles = await getArticles({
    pageSize: 100,
    allPages: true,
    ...(kategoria ? { categorySlug: kategoria } : {}),
  });

  // Special-case: te Neurologjia shfaq edhe 3 mjekë të përzgjedhur (Ekipi Shkencor),
  // pa pasur nevojë që Strapi t'i ketë si Articles me category=neurologji.
  const angjilogjiaMembers =
    kategoria === SLUG_ANGJILOGJIA
      ? (
          await Promise.all(
            ANGJILOGJIA_MEMBER_SLUGS.map((slug) => getScientificMemberBySlug(slug).catch(() => null))
          )
        ).filter(Boolean)
      : [];
  const gastroenterologjiaMembers =
    kategoria === SLUG_GASTROENTEROLOGJIA
      ? (
          await Promise.all(
            GASTROENTEROLOGJIA_MEMBER_SLUGS.map((slug) =>
              getScientificMemberBySlug(slug).catch(() => null)
            )
          )
        ).filter(Boolean)
      : [];
  const gjiriMembers =
    kategoria === SLUG_GJIRI
      ? (
          await Promise.all(
            GJIRI_MEMBER_SLUGS.map((slug) => getScientificMemberBySlug(slug).catch(() => null))
          )
        ).filter(Boolean)
      : [];
  const gjinekologjiaMembers =
    kategoria === SLUG_GJINEKOLOGJIA
      ? (
          await Promise.all(
            GJINEKOLOGJIA_MEMBER_SLUGS.map((slug) => getScientificMemberBySlug(slug).catch(() => null))
          )
        ).filter(Boolean)
      : [];
  const kardiologjiaMembers =
    kategoria === SLUG_KARDIOLOGJIA
      ? (
          await Promise.all(
            KARDIOLOGJIA_MEMBER_SLUGS.map((slug) => getScientificMemberBySlug(slug).catch(() => null))
          )
        ).filter(Boolean)
      : [];
  const ortopedjiaMembers =
    kategoria === SLUG_ORTOPEDJIA
      ? (
          await Promise.all(
            ORTOPEDJIA_MEMBER_SLUGS.map((slug) => getScientificMemberBySlug(slug).catch(() => null))
          )
        ).filter(Boolean)
      : [];
  const mjekesiaEPergjithshmeMembers =
    kategoria === SLUG_MJEKESIA_E_PERGJITHSHME
      ? (
          await Promise.all(
            MJEKESIA_E_PERGJITHSHME_MEMBER_SLUGS.map((slug) =>
              getScientificMemberBySlug(slug).catch(() => null)
            )
          )
        ).filter(Boolean)
      : [];
  const stomatologjiaMembers =
    kategoria === SLUG_STOMATOLOGJIA
      ? (
          await Promise.all(
            STOMATOLOGJIA_MEMBER_SLUGS.map((slug) => getScientificMemberBySlug(slug).catch(() => null))
          )
        ).filter(Boolean)
      : [];
  const urologjiaDheAndrologjiaMembers =
    kategoria === SLUG_UROLOGJIA_DHE_ANDROLOGJIA
      ? (
          await Promise.all(
            UROLOGJIA_DHE_ANDROLOGJIA_MEMBER_SLUGS.map((slug) =>
              getScientificMemberBySlug(slug).catch(() => null)
            )
          )
        ).filter(Boolean)
      : [];
  const kirurgjiaPlastikeMembers =
    kategoria === SLUG_KIRURGJIA_PLASTIKE
      ? (
          await Promise.all(
            KIRURGJIA_PLASTIKE_MEMBER_SLUGS.map((slug) =>
              getScientificMemberBySlug(slug).catch(() => null)
            )
          )
        ).filter(Boolean)
      : [];
  const oftalmologjiaMembers =
    kategoria === SLUG_OFTALMOLOGJIA
      ? (
          await Promise.all(
            OFTALMOLOGJIA_MEMBER_SLUGS.map((slug) => getScientificMemberBySlug(slug).catch(() => null))
          )
        ).filter(Boolean)
      : [];
  const orlMembers =
    kategoria === SLUG_ORL
      ? (
          await Promise.all(
            ORL_MEMBER_SLUGS.map((slug) => getScientificMemberBySlug(slug).catch(() => null))
          )
        ).filter(Boolean)
      : [];
  const neurologjiMembers =
    kategoria === SLUG_NEUROLOGJI
      ? (
          await Promise.all(
            NEUROLOGJI_MEMBER_SLUGS.map((slug) => getScientificMemberBySlug(slug).catch(() => null))
          )
        ).filter(Boolean)
      : [];

  const filterTitle = kategoria ? kategoriaDisplayTitle(kategoria) : null;
  const extraMembers = [
    ...angjilogjiaMembers,
    ...gastroenterologjiaMembers,
    ...gjiriMembers,
    ...gjinekologjiaMembers,
    ...kardiologjiaMembers,
    ...ortopedjiaMembers,
    ...mjekesiaEPergjithshmeMembers,
    ...stomatologjiaMembers,
    ...urologjiaDheAndrologjiaMembers,
    ...kirurgjiaPlastikeMembers,
    ...oftalmologjiaMembers,
    ...orlMembers,
    ...neurologjiMembers,
  ];

  return (
    <main className="min-h-screen bg-white text-black">
      <Header />

      {kategoria ? (
        <div className="bg-sky-600 text-white">
          <div className="mx-auto flex max-w-[1280px] flex-col gap-3 px-4 py-5 sm:flex-row sm:items-center sm:justify-between md:px-6 md:py-6">
            <h1 className="text-[22px] font-semibold tracking-tight md:text-[28px]">
              {filterTitle}
            </h1>
            <nav
              className="text-[13px] text-white/95 md:text-sm"
              aria-label="Breadcrumb"
            >
              <Link href="/" className="hover:underline">
                Kreu
              </Link>
              <span className="mx-2 text-white/70">/</span>
              <Link href="/news" className="hover:underline">
                Lajme
              </Link>
              <span className="mx-2 text-white/70">/</span>
              <span className="font-medium">{filterTitle}</span>
            </nav>
          </div>
        </div>
      ) : null}

      <section className="mx-auto max-w-[1280px] px-4 py-10">
        <div className="mx-auto max-w-[1280px]">
          {kategoria && articles.length === 0 && extraMembers.length === 0 ? (
            <p className="mb-8 text-[15px] text-amber-900">
              Nuk u gjetën artikuj për &quot;{filterTitle}&quot;. Kontrollo në Strapi që
              kategoria të ketë slug <code className="rounded bg-amber-100 px-1">{kategoria}</code>{" "}
              dhe që artikujt të jenë të publikuar.
            </p>
          ) : null}
          {articles.length === 0 && extraMembers.length === 0 ? (
            <p className="text-[15px] text-gray-600">
              {!kategoria
                ? "Nuk u gjet asnjë artikull."
                : "Nuk u gjet asnjë artikull për këtë filtrim."}
            </p>
          ) : kategoria ? (
            <>
              {extraMembers.length > 0 ? (
                <div className="mb-10 columns-1 gap-6 sm:columns-2 lg:columns-3 lg:gap-8">
                  {extraMembers.map((m) => {
                    const photoUrl = m?.photo?.url ? getStrapiMediaUrl(m.photo.url) : "";
                    const subtitle = [m?.role, m?.speciality].filter(Boolean).join(" · ");
                    const bioRaw = m?.bio ? extractPlainTextFromBlocks(m.bio) : "";
                    const bioSnippet =
                      bioRaw.length > 220 ? `${bioRaw.slice(0, 220).trim()}...` : bioRaw;
                    return (
                      <article
                        key={m!.id}
                        className="mb-6 break-inside-avoid overflow-hidden bg-transparent lg:mb-8"
                      >
                        <Link href={`/scientific-team/${m!.slug}`} className="group block">
                          <div className="relative w-full bg-[#c9c3c3]">
                            {photoUrl ? (
                              <div className="relative aspect-[4/3] w-full">
                                <Image
                                  src={photoUrl}
                                  alt={m!.photo?.alternativeText || m!.name}
                                  fill
                                  unoptimized
                                  className="object-cover transition-transform duration-300 group-hover:scale-[1.01]"
                                />
                              </div>
                            ) : (
                              <div className="aspect-[4/3] w-full" />
                            )}
                          </div>
                          <div className="bg-[#e0e0e0] px-4 py-4">
                            <h3 className="mb-2 text-[16px] font-semibold leading-snug text-[#1d1d1d]">
                              {m!.name}
                            </h3>
                            {subtitle ? (
                              <p className="mb-3 text-[12px] font-semibold text-[#2f2f2f]">
                                {subtitle}
                              </p>
                            ) : null}
                            {bioSnippet ? (
                              <p className="mb-4 line-clamp-6 text-[13px] leading-[1.8] text-[#2f2f2f]">
                                {bioSnippet}
                              </p>
                            ) : null}
                            <div className="inline-flex items-center gap-2 text-[13px] font-semibold text-[#1f1f1f] hover:underline">
                              Lexo më shumë <span className="text-[11px]">▸</span>
                            </div>
                          </div>
                        </Link>
                      </article>
                    );
                  })}
                </div>
              ) : null}
            <div className="columns-1 gap-6 sm:columns-2 lg:columns-3 lg:gap-8">
              {articles.map((article) => (
                <MiniArticleCard
                  key={article.id}
                  slug={article.slug}
                  title={article.title}
                  excerpt={article.excerpt}
                  variant="masonry"
                  className="mb-6 break-inside-avoid lg:mb-8"
                  imageUrl={getStrapiMediaUrl(
                    article.featuredImage?.formats?.medium?.url ||
                      article.featuredImage?.formats?.small?.url ||
                      article.featuredImage?.url ||
                      ""
                  )}
                  imageAlt={article.featuredImage?.alternativeText || article.title}
                />
              ))}
            </div>
            </>
          ) : (
            <div className="columns-1 gap-6 sm:columns-2 lg:columns-3 lg:gap-8">
              {articles.map((article) => (
                <MiniArticleCard
                  key={article.id}
                  slug={article.slug}
                  title={article.title}
                  excerpt={article.excerpt}
                  variant="masonry"
                  className="mb-6 break-inside-avoid lg:mb-8"
                  imageUrl={getStrapiMediaUrl(
                    article.featuredImage?.formats?.medium?.url ||
                      article.featuredImage?.formats?.small?.url ||
                      article.featuredImage?.url ||
                      ""
                  )}
                  imageAlt={article.featuredImage?.alternativeText || article.title}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}