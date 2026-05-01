import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import {
  getArticleBySlug,
  getCategoryLabel,
  getStrapiMediaUrl,
} from "@/lib/strapi";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return {
      title: "Artikulli nuk u gjet",
      description: "Ky artikull nuk ekziston.",
    };
  }

  const title = article.seoTitle || article.title;
  const description = article.seoDescription || article.excerpt || "";
  const keywords = article.seoKeywords
    ?.split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  const imageUrl = article.featuredImage?.url
    ? getStrapiMediaUrl(article.featuredImage.url)
    : undefined;

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      type: "article",
      images: imageUrl ? [{ url: imageUrl }] : [],
    },
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const imageUrl = article.featuredImage?.url
    ? getStrapiMediaUrl(article.featuredImage.url)
    : "";

  const secondaryImageUrl = article.secondaryImage?.url
    ? getStrapiMediaUrl(article.secondaryImage.url)
    : "";

  const videoUrl = article.videoUrl?.trim() || "";
  const uploadedVideoUrl = article.video?.url
    ? getStrapiMediaUrl(article.video.url)
    : "";

  type ParagraphBlock = { type: "paragraph"; children?: { type?: string; text?: string }[] };
  const contentBlocks = (Array.isArray(article.content) ? article.content : []) as ParagraphBlock[];

  function slugifyId(input: string) {
    return input
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/&/g, "dhe")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }

  function getParagraphText(block: ParagraphBlock): string {
    const text = (block.children || [])
      .map((c) => (typeof c?.text === "string" ? c.text : ""))
      .join("");
    return text.replace(/\s+\n/g, "\n").trim();
  }

  function isHeadingLike(text: string): boolean {
    const t = text.trim();
    if (!t) return false;
    if (t.length > 80) return false;
    if (t.endsWith(".")) return false;
    if (t.includes("http://") || t.includes("https://")) return false;
    if (/^(pyetje|përgjigje)\s*:/i.test(t)) return false;
    // Prefer headings that look like standalone titles (few words, no long commas)
    const wordCount = t.split(/\s+/).filter(Boolean).length;
    if (wordCount < 2) return true;
    if (wordCount > 14) return false;
    return true;
  }

  function splitLabel(text: string, label: string) {
    const rx = new RegExp(`^${label}\\s*:`, "i");
    if (!rx.test(text)) return null;
    return text.replace(rx, "").trim();
  }

  const headingItems = contentBlocks
    .map((b) => getParagraphText(b))
    .filter((t) => isHeadingLike(t))
    .map((title) => ({ id: slugifyId(title), title }));

  function renderContent(): ReactNode {
    const nodes: ReactNode[] = [];

    // TOC (si në referencë) kur ka mjaft nën-tituj
    if (headingItems.length >= 2) {
      nodes.push(
        <div
          key="toc"
          className="mb-10 inline-block border border-gray-200 bg-white px-4 py-3 text-left shadow-sm"
        >
          <p className="mb-2 text-[12px] font-semibold uppercase tracking-[0.12em] text-gray-600">
            Përmbajtja
          </p>
          <ol className="list-decimal pl-5 text-[13px] leading-6 text-sky-700">
            {headingItems.slice(0, 10).map((h) => (
              <li key={h.id}>
                <a href={`#${h.id}`} className="hover:underline">
                  {h.title}
                </a>
              </li>
            ))}
          </ol>
        </div>
      );
    }

    // Render i strukturuar: heading / Q&A / paragrafë
    for (let i = 0; i < contentBlocks.length; i += 1) {
      const raw = getParagraphText(contentBlocks[i]);
      if (!raw) continue;

      if (isHeadingLike(raw)) {
        const id = slugifyId(raw);
        nodes.push(
          <h2
            key={`h-${i}`}
            id={id}
            className="mt-10 scroll-mt-24 text-[18px] font-bold leading-snug text-[#1d1d1d] md:text-[20px]"
          >
            {raw}
          </h2>
        );
        continue;
      }

      const q = splitLabel(raw, "Pyetje");
      if (q != null) {
        nodes.push(
          <p key={`q-${i}`} className="mt-6 text-[15px] leading-7 text-[#2d2d2d]">
            <span className="font-semibold text-[#1d1d1d]">Pyetje:</span> {q}
          </p>
        );
        continue;
      }

      const a = splitLabel(raw, "Përgjigje");
      if (a != null) {
        nodes.push(
          <p key={`a-${i}`} className="mt-3 text-[15px] leading-7 text-[#2d2d2d]">
            <span className="font-semibold text-[#1d1d1d]">Përgjigje:</span> {a}
          </p>
        );
        continue;
      }

      nodes.push(
        <p key={`p-${i}`} className="mt-6 text-[15px] leading-7 text-[#2d2d2d]">
          {raw}
        </p>
      );
    }

    return <div>{nodes}</div>;
  }

  function getEmbedUrl(
    url: string
  ): { embedUrl: string; variant: "shorts" | "wide" } {
    try {
      const u = new URL(url);
      const host = u.hostname.replace(/^www\./, "");
      if (host === "youtu.be") {
        const id = u.pathname.replace("/", "");
        return id
          ? { embedUrl: `https://www.youtube.com/embed/${id}`, variant: "wide" }
          : { embedUrl: "", variant: "wide" };
      }
      if (host === "youtube.com" || host === "m.youtube.com") {
        const shortsMatch = u.pathname.match(/^\/shorts\/([^/]+)/);
        if (shortsMatch?.[1]) {
          return {
            embedUrl: `https://www.youtube.com/embed/${shortsMatch[1]}`,
            variant: "shorts",
          };
        }

        const id = u.searchParams.get("v");
        return id
          ? { embedUrl: `https://www.youtube.com/embed/${id}`, variant: "wide" }
          : { embedUrl: "", variant: "wide" };
      }
      if (host === "vimeo.com") {
        const id = u.pathname.split("/").filter(Boolean)[0];
        return id
          ? { embedUrl: `https://player.vimeo.com/video/${id}`, variant: "wide" }
          : { embedUrl: "", variant: "wide" };
      }
      return { embedUrl: "", variant: "wide" };
    } catch {
      return { embedUrl: "", variant: "wide" };
    }
  }

  const embed = videoUrl ? getEmbedUrl(videoUrl) : { embedUrl: "", variant: "wide" };
  const embedUrl = embed.embedUrl;

  return (
    <main className="min-h-screen bg-white text-black">
      <Header />

      <section className="mx-auto max-w-[1280px] px-4 py-8">
        <article className="mx-auto max-w-[1000px]">
          {imageUrl ? (
            <div className="relative mb-8 h-[280px] w-full md:h-[420px] lg:h-[520px]">
              <Image
                src={imageUrl}
                alt={article.featuredImage?.alternativeText || article.title}
                fill
                priority
                unoptimized
                className="object-cover"
              />
            </div>
          ) : null}

          <div className="mb-4">
            {getCategoryLabel(article.category) ? (
              <p className="mb-3 text-sm font-medium uppercase tracking-[0.15em] text-gray-500">
                {getCategoryLabel(article.category)}
              </p>
            ) : null}

            <h1 className="mb-4 text-[30px] font-semibold leading-tight text-[#1d1d1d] md:text-[42px]">
              {article.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
              {article.publishedDate ? <span>{article.publishedDate}</span> : null}
              {article.readTime ? <span>{article.readTime} min lexim</span> : null}
            </div>
          </div>

          {article.excerpt ? (
            <p className="mb-8 text-lg leading-8 text-gray-700">
              {article.excerpt}
            </p>
          ) : null}

          {secondaryImageUrl ? (
            <div className="relative mb-10 h-[340px] w-full md:h-[520px]">
              <Image
                src={secondaryImageUrl}
                alt={article.secondaryImage?.alternativeText || article.title}
                fill
                unoptimized
                className="object-cover"
              />
            </div>
          ) : null}

          {embedUrl ? (
            <div className="mb-10">
              <div
                className={[
                  "overflow-hidden rounded-sm bg-black",
                  embed.variant === "shorts"
                    ? "w-full max-w-[360px] md:mr-auto md:ml-6 md:max-w-[420px]"
                    : "w-full",
                ].join(" ")}
              >
                <div
                  className={[
                    "relative w-full",
                    embed.variant === "shorts" ? "aspect-[9/16]" : "aspect-video",
                  ].join(" ")}
                >
                  <iframe
                    src={embedUrl}
                    title={article.title}
                    className="absolute inset-0 h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
              </div>
            </div>
          ) : uploadedVideoUrl ? (
            <div className="mb-10 overflow-hidden rounded-sm bg-black">
              <video
                controls
                className="w-full"
                src={uploadedVideoUrl}
                preload="metadata"
              />
            </div>
          ) : null}

          <div className="mt-8">{renderContent()}</div>

          {article.author ? (
            <section className="mt-12 border border-gray-200 bg-white p-5 md:mt-16 md:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
                {article.author.image?.url ? (
                  <img
                    src={getStrapiMediaUrl(article.author.image.url)}
                    alt={article.author.name}
                    className="h-24 w-24 shrink-0 object-cover"
                    loading="lazy"
                  />
                ) : null}

                <div>
                  <p className="mb-2 text-[15px] font-semibold text-[#1d1d1d]">
                    {article.author.name}
                  </p>
                  {article.author.bio ? (
                    <p className="text-[13px] leading-[1.9] text-gray-700">
                      {article.author.bio}
                    </p>
                  ) : null}
                </div>
              </div>
            </section>
          ) : null}
        </article>
      </section>

      <Footer />
    </main>
  );
}