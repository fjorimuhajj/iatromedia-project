const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

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
    medium?: StrapiImageFormat;
    large?: StrapiImageFormat;
  };
};

type StrapiMediaFile = {
  id: number;
  documentId: string;
  name: string;
  alternativeText?: string | null;
  caption?: string | null;
  url: string;
  mime?: string;
};

export type StrapiCategory = {
  id: number;
  documentId: string;
  text?: string;
  slug: string;
};

export type StrapiAuthor = {
  id: number;
  documentId: string;
  name: string;
  bio?: string | null;
  image?: StrapiImage | null;
};

export type StrapiScientificMember = {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  role?: string | null;
  speciality?: string | null;
  bio?: StrapiContentBlock[] | null;
  photo?: StrapiImage | null;
  gallery?: StrapiImage[] | null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
};

export type StrapiArticle = {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  excerpt: string;
  content: StrapiContentBlock[];
  category?: StrapiCategory | null;
  publishedDate: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  featuredImage?: StrapiImage | null;
  secondaryImage?: StrapiImage | null;
  video?: StrapiMediaFile | null;
  videoUrl?: string | null;

  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  author?: StrapiAuthor | null;
  readTime?: number | string;
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

type GetArticlesOptions = {
  /** Filter by related Category.slug (Strapi relation field `category`). */
  categorySlug?: string;
  page?: number;
  pageSize?: number;
  /**
   * Offset pagination (`pagination[start]` + `pagination[limit]`).
   * Prefer page-based pagination unless you explicitly need offsets.
   */
  limit?: number;
  start?: number;
  sort?: string | string[];
  /** If true, fetches all pages (up to optional `maxItems`) using page-based pagination. */
  allPages?: boolean;
  /** Safety cap when `allPages` is true (default: unlimited). */
  maxItems?: number;
};

function buildArticlesQueryParams(options?: GetArticlesOptions) {
  const params = new URLSearchParams();
  /**
   * Strapi populate:
   * - `populate=*` is convenient but cannot be safely combined with nested populates here
   *   (e.g. `populate[author][populate]=image` was triggering a 500).
   * - Use explicit populate keys instead.
   */
  params.set("populate[featuredImage]", "true");
  params.set("populate[secondaryImage]", "true");
  params.set("populate[video]", "true");
  params.set("populate[category]", "true");
  params.set("populate[author][populate]", "image");

  const sort = options?.sort ?? ["publishedDate:desc", "createdAt:desc"];
  const sorts = Array.isArray(sort) ? sort : [sort];
  sorts.forEach((s, idx) => params.set(`sort[${idx}]`, s));

  if (options?.categorySlug) {
    params.set("filters[category][slug][$eq]", options.categorySlug);
  }

  const useOffset =
    typeof options?.limit === "number" && typeof options?.start === "number";

  if (useOffset) {
    params.set("pagination[start]", String(options.start));
    params.set("pagination[limit]", String(options.limit));
    return params;
  }

  const page = options?.page ?? 1;

  /**
   * If caller passes only `limit`, treat it as `pageSize` on page 1.
   * (Using `pagination[limit]` without `pagination[start]` is easy to get wrong across Strapi versions.)
   */
  const pageSize =
    options?.pageSize ??
    (typeof options?.limit === "number" ? options.limit : undefined) ??
    100;

  params.set("pagination[page]", String(page));
  params.set("pagination[pageSize]", String(pageSize));

  return params;
}

export function getCategoryLabel(category?: StrapiCategory | null): string {
  if (!category) return "";
  return category.text || category.slug || "";
}

export async function getArticles(
  options?: GetArticlesOptions
): Promise<StrapiArticle[]> {
  if (!options?.allPages) {
    const params = buildArticlesQueryParams(options);
    const response = await fetch(`${STRAPI_URL}/api/articles?${params.toString()}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Nuk u morën dot artikujt nga Strapi");
    }

    const json: StrapiListResponse<StrapiArticle> = await response.json();
    return json.data;
  }

  const { allPages: _all, maxItems, ...rest } = options;
  const pageSize =
    rest.pageSize ??
    (typeof rest.limit === "number" ? rest.limit : undefined) ??
    100;

  const aggregated: StrapiArticle[] = [];

  let page = rest.page ?? 1;
  let pageCount = 1;

  do {
    const params = buildArticlesQueryParams({
      ...rest,
      page,
      pageSize,
    });

    const response = await fetch(`${STRAPI_URL}/api/articles?${params.toString()}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Nuk u morën dot artikujt nga Strapi");
    }

    const json: StrapiListResponse<StrapiArticle> = await response.json();
    pageCount = json.meta?.pagination?.pageCount ?? 1;

    aggregated.push(...json.data);

    if (typeof maxItems === "number" && aggregated.length >= maxItems) {
      return aggregated.slice(0, maxItems);
    }

    page += 1;
  } while (page <= pageCount);

  return aggregated;
}

export async function getArticleBySlug(
  slug: string
): Promise<StrapiArticle | null> {
  const params = new URLSearchParams({
    "filters[slug][$eq]": slug,
  });
  params.set("populate[featuredImage]", "true");
  params.set("populate[secondaryImage]", "true");
  params.set("populate[video]", "true");
  params.set("populate[category]", "true");
  params.set("populate[author][populate]", "image");

  const response = await fetch(
    `${STRAPI_URL}/api/articles?${params.toString()}`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Nuk u mor dot artikulli nga Strapi");
  }

  const json: StrapiListResponse<StrapiArticle> = await response.json();
  return json.data.length > 0 ? json.data[0] : null;
}

export type StrapiHomepageLayout = {
  heroArticle: StrapiArticle | null;
  spotlightArticle: StrapiArticle | null;
  sideArticle1: StrapiArticle | null;
  sideArticle2: StrapiArticle | null;
};

function normalizeArticleRelation(raw: unknown): StrapiArticle | null {
  if (raw == null) return null;
  if (typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;

  if ("data" in o && o.data != null) {
    return normalizeArticleRelation(o.data);
  }

  if (
    "attributes" in o &&
    o.attributes != null &&
    typeof o.attributes === "object"
  ) {
    const attrs = o.attributes as Record<string, unknown>;
    const merged: Record<string, unknown> = {
      ...attrs,
    };
    if (typeof o.id === "number") merged.id = o.id;
    if (typeof o.documentId === "string") merged.documentId = o.documentId;
    return normalizeArticleRelation(merged);
  }

  if (typeof o.title === "string" && typeof o.slug === "string") {
    return o as unknown as StrapiArticle;
  }

  return null;
}

function buildHomepagePopulateParams(): URLSearchParams {
  const params = new URLSearchParams();
  const fields: Array<keyof StrapiHomepageLayout> = [
    "heroArticle",
    "spotlightArticle",
    "sideArticle1",
    "sideArticle2",
  ];
  for (const field of fields) {
    const p = `populate[${field}]`;
    params.set(`${p}[populate][featuredImage]`, "true");
    params.set(`${p}[populate][secondaryImage]`, "true");
    params.set(`${p}[populate][video]`, "true");
    params.set(`${p}[populate][category]`, "true");
    params.set(`${p}[populate][author][populate]`, "image");
  }
  return params;
}

/**
 * Lidhjet e zgjedhura në Strapi → Content Manager → Homepage (single type).
 * Kërkon `find` për rolin Public te `Homepage`.
 */
export async function getHomepageLayout(): Promise<StrapiHomepageLayout | null> {
  const params = buildHomepagePopulateParams();
  const response = await fetch(
    `${STRAPI_URL}/api/homepage?${params.toString()}`,
    { cache: "no-store" }
  );

  if (response.status === 404) return null;
  if (!response.ok) return null;

  const json: { data?: Record<string, unknown> } = await response.json();
  const root = json.data;
  if (root == null) return null;

  const flat: Record<string, unknown> = {
    ...root,
    ...(typeof root.attributes === "object" && root.attributes !== null
      ? (root.attributes as Record<string, unknown>)
      : {}),
  };

  return {
    heroArticle: normalizeArticleRelation(flat.heroArticle),
    spotlightArticle: normalizeArticleRelation(flat.spotlightArticle),
    sideArticle1: normalizeArticleRelation(flat.sideArticle1),
    sideArticle2: normalizeArticleRelation(flat.sideArticle2),
  };
}

export async function getScientificTeam(): Promise<StrapiScientificMember[]> {
  const params = new URLSearchParams();
  params.set("pagination[page]", "1");
  params.set("pagination[pageSize]", "100");
  params.set("sort[0]", "name:asc");
  params.set("populate[photo]", "true");
  params.set("populate[gallery]", "true");

  const response = await fetch(
    `${STRAPI_URL}/api/ekipi-shkencors?${params.toString()}`,
    { cache: "no-store" }
  );

  if (!response.ok) {
    throw new Error("Nuk u mor dot ekipi shkencor nga Strapi");
  }

  const json: StrapiListResponse<StrapiScientificMember> = await response.json();
  return json.data;
}

export async function getScientificMemberBySlug(
  slug: string
): Promise<StrapiScientificMember | null> {
  const params = new URLSearchParams({
    "filters[slug][$eq]": slug,
  });
  params.set("populate[photo]", "true");
  params.set("populate[gallery]", "true");

  const response = await fetch(
    `${STRAPI_URL}/api/ekipi-shkencors?${params.toString()}`,
    { cache: "no-store" }
  );

  if (!response.ok) {
    throw new Error("Nuk u mor dot anëtari nga Strapi");
  }

  const json: StrapiListResponse<StrapiScientificMember> = await response.json();
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