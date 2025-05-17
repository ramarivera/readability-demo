import { Readability } from "@mozilla/readability";

/**
 * ParsedArticle defines a normalized interface for article extraction results.
 */
export interface ParsedArticle {
  title: string;
  content: string;
  textContent: string;
  length: number;
  excerpt: string;
  byline?: string;
  dir?: string;
  siteName?: string;
}

/**
 * parseWithReadability extracts article content using Mozilla Readability.
 */
export function parseWithReadability(html: string): ParsedArticle {
  const doc = new DOMParser().parseFromString(html, "text/html");
  const reader = new Readability(doc);
  const result = reader.parse();
  if (!result) {
    return {
      title: "",
      content: "",
      textContent: "",
      length: 0,
      excerpt: "",
    };
  }
  const { title, content, textContent, length, excerpt, byline, dir, siteName } = result;
  return { title, content, textContent, length, excerpt, byline, dir, siteName };
}

/**
 * parseWithSimple strips HTML to plaintext as a fallback parser.
 */
export function parseWithSimple(html: string): ParsedArticle {
  const text = new DOMParser().parseFromString(html, "text/html").body.textContent || "";
  return {
    title: "",
    content: text,
    textContent: text,
    length: text.length,
    excerpt: text.substring(0, 200),
  };
}
