const STRAPI_URL = "http://localhost:1337";

type StrapiTextNode = {
  type: "text";
  text: string;
};

type StrapiParagraphNode = {
  type: "paragraph";
  children: StrapiTextNode[];
};

type StrapiContentBlock = StrapiParagraphNode;

type StrapiImageFormat = {
  url: string;
  width: number;
  height: number;
};

type StrapiImage = {
  id: number;
  documentId: string;
  name: string;
  alternativeText: string | null;
  caption: string | null;
  width: number;
  height: number;
  url: string;
  formats?: {
    thumbnail?: StrapiImageFormat;
    small?: StrapiImageFormat;
  };
};

export type StrapiArticle = {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  excerpt: string;
  content: StrapiContentBlock[];
  category: string;
  publishedDate: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  featuredImage?: StrapiImage | null;
};

type StrapiListResponse<T> = {
  data: T[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
};

export async function getArticles(): Promise<StrapiArticle[]> {
  const response = await fetch(`${STRAPI_URL}/api/articles?populate=*`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch articles");
  }

  const json: StrapiListResponse<StrapiArticle> = await response.json();
  return json.data;
}

export async function getArticleBySlug(
  slug: string
): Promise<StrapiArticle | null> {
  const params = new URLSearchParams({
    "filters[slug][$eq]": slug,
    populate: "*",
  });

  const response = await fetch(
    `${STRAPI_URL}/api/articles?${params.toString()}`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch article");
  }

  const json: StrapiListResponse<StrapiArticle> = await response.json();
  return json.data.length > 0 ? json.data[0] : null;
}

export function extractPlainTextFromBlocks(
  blocks: StrapiContentBlock[]
): string {
  return blocks
    .map((block) => block.children.map((child) => child.text).join(""))
    .join("\n\n");
}

export function getStrapiMediaUrl(path?: string | null): string {
  if (!path) return "";

  if (path.startsWith("http")) {
    return path;
  }

  return `${STRAPI_URL}${path}`;
}