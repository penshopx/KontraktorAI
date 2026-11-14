const WORDPRESS_SITE = "kontraktorai.wordpress.com";
const WORDPRESS_POSTS_ENDPOINT = `https://public-api.wordpress.com/wp/v2/sites/${encodeURIComponent(WORDPRESS_SITE)}/posts`;

export type PublicWordPressPost = {
  id: number;
  slug: string;
  url: string;
  title: string;
  excerpt: string;
  date: string;
};

type WordPressPostRecord = {
  id?: unknown;
  date?: unknown;
  slug?: unknown;
  link?: unknown;
  title?: { rendered?: unknown };
  excerpt?: { rendered?: unknown };
};

export class WordPressSitePendingError extends Error {
  constructor() {
    super("Situs WordPress belum aktif atau belum tersedia untuk publik.");
    this.name = "WordPressSitePendingError";
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function htmlToText(value: unknown): string {
  if (typeof value !== "string") return "";
  return new DOMParser()
    .parseFromString(value, "text/html")
    .body.textContent?.replace(/\s+/g, " ")
    .trim() ?? "";
}

function parsePost(value: unknown): PublicWordPressPost {
  if (!isRecord(value)) {
    throw new Error("WordPress API mengirim format artikel yang tidak dikenali.");
  }

  const post = value as WordPressPostRecord;
  if (
    typeof post.id !== "number" ||
    !Number.isInteger(post.id) ||
    typeof post.slug !== "string" ||
    typeof post.date !== "string" ||
    typeof post.link !== "string"
  ) {
    throw new Error("WordPress API mengirim data artikel yang tidak lengkap.");
  }

  const title = htmlToText(post.title?.rendered);
  const excerpt = htmlToText(post.excerpt?.rendered);
  const date = new Date(post.date);
  const link = new URL(post.link);

  if (!title || Number.isNaN(date.getTime())) {
    throw new Error("WordPress API mengirim judul atau tanggal artikel yang tidak valid.");
  }
  if (link.protocol !== "https:" || link.hostname !== WORDPRESS_SITE) {
    throw new Error("WordPress API mengirim tautan artikel di luar situs yang dipilih.");
  }

  return {
    id: post.id,
    slug: post.slug,
    url: link.toString(),
    title,
    excerpt,
    date: date.toISOString(),
  };
}

export async function fetchPublicWordPressPosts(
  signal?: AbortSignal,
): Promise<PublicWordPressPost[]> {
  const endpoint = new URL(WORDPRESS_POSTS_ENDPOINT);
  endpoint.searchParams.set("per_page", "12");
  endpoint.searchParams.set("_fields", "id,date,slug,link,title,excerpt");

  const response = await fetch(endpoint, {
    method: "GET",
    headers: { Accept: "application/json" },
    credentials: "omit",
    cache: "no-store",
    signal,
  });

  let payload: unknown;
  try {
    payload = await response.json();
  } catch {
    throw new Error("Respons WordPress bukan JSON yang valid.");
  }

  if (!response.ok) {
    const code = isRecord(payload) ? payload.code : undefined;
    if (
      response.status === 404 &&
      (code === "invalid_site" || code === "unknown_blog")
    ) {
      throw new WordPressSitePendingError();
    }
    throw new Error(`WordPress API merespons dengan status ${response.status}.`);
  }

  if (!Array.isArray(payload)) {
    throw new Error("WordPress API mengirim daftar artikel dalam format yang tidak dikenali.");
  }

  return payload.map(parsePost);
}
