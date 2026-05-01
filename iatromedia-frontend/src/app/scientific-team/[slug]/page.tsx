import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import {
  getScientificMemberBySlug,
  getStrapiMediaUrl,
} from "@/lib/strapi";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const member = await getScientificMemberBySlug(slug);

  if (!member) {
    return { title: "Anëtari nuk u gjet" };
  }

  return {
    title: member.name,
    description: member.role || member.speciality || "",
  };
}

export default async function ScientificMemberPage({ params }: PageProps) {
  const { slug } = await params;
  const member = await getScientificMemberBySlug(slug);

  if (!member) notFound();

  const photoUrl = member.photo?.url ? getStrapiMediaUrl(member.photo.url) : "";
  const gallery = Array.isArray(member.gallery) ? member.gallery : [];

  type ParagraphBlock = { type: "paragraph"; children?: { type?: string; text?: string }[] };
  const bioBlocks = (Array.isArray(member.bio) ? member.bio : []) as ParagraphBlock[];

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
    if (/^https?:\/\//i.test(t)) return false;
    const wordCount = t.split(/\s+/).filter(Boolean).length;
    if (wordCount < 2) return true;
    if (wordCount > 14) return false;
    return true;
  }

  const headingItems = bioBlocks
    .map((b) => getParagraphText(b))
    .filter((t) => isHeadingLike(t))
    .map((title) => ({ id: slugifyId(title), title }));

  function renderBio(): ReactNode {
    const nodes: ReactNode[] = [];

    if (headingItems.length >= 2) {
      nodes.push(
        <div
          key="toc"
          className="mt-6 inline-block border border-gray-200 bg-white px-4 py-3 text-left shadow-sm"
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

    for (let i = 0; i < bioBlocks.length; i += 1) {
      const raw = getParagraphText(bioBlocks[i]);
      if (!raw) continue;

      if (isHeadingLike(raw)) {
        const id = slugifyId(raw);
        nodes.push(
          <h2
            key={`h-${i}`}
            id={id}
            className="mt-10 scroll-mt-24 text-[16px] font-bold leading-snug text-[#1d1d1d] md:text-[18px]"
          >
            {raw}
          </h2>
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

  return (
    <main className="min-h-screen bg-white text-black">
      <Header />

      <section className="mx-auto max-w-[1280px] px-4 py-10">
        <div className="mx-auto max-w-[1000px]">
          <Link href="/leksionet" className="text-sm font-medium text-sky-600 hover:underline">
            ← Kthehu te ekipi
          </Link>

          <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-start">
            {photoUrl ? (
              <div className="relative h-44 w-44 shrink-0 overflow-hidden bg-[#c9c3c3]">
                <Image
                  src={photoUrl}
                  alt={member.photo?.alternativeText || member.name}
                  fill
                  unoptimized
                  className="object-cover"
                />
              </div>
            ) : null}

            <div>
              <h1 className="text-[28px] font-semibold leading-tight text-[#1d1d1d] md:text-[34px]">
                {member.name}
              </h1>
              {(member.role || member.speciality) ? (
                <p className="mt-2 text-[14px] leading-7 text-gray-600">
                  {[member.role, member.speciality].filter(Boolean).join(" • ")}
                </p>
              ) : null}

              {bioBlocks.length > 0 ? <div className="mt-3">{renderBio()}</div> : null}

              {gallery.length > 0 ? (
                <div className="mt-8">
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                    {gallery.map((img) => {
                      const url = img?.url ? getStrapiMediaUrl(img.url) : "";
                      if (!url) return null;
                      return (
                        <div
                          key={img.id}
                          className="relative aspect-[4/3] overflow-hidden bg-[#c9c3c3]"
                        >
                          <Image
                            src={url}
                            alt={img.alternativeText || member.name}
                            fill
                            unoptimized
                            className="object-cover"
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

