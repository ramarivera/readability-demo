import { Readability } from "@mozilla/readability";
import Mercury from "@postlight/mercury-parser";
import { JSDOM } from "jsdom";
import { NextResponse } from "next/server";
import TurndownService from "turndown";

export type ParserType = "readability" | "simple" | "postlight" | "defuddle";

export interface ArticleResult {
  title?: string;
  byline?: string;
  dir?: string;
  excerpt?: string;
  content: string;
  textContent: string;
}

export async function POST(request: Request) {
  try {
    const { html, parserType } = (await request.json()) as {
      html: string;
      parserType: ParserType;
    };

    const dom = new JSDOM(html);
    const document = dom.window.document;

    let result: ArticleResult;

    if (parserType === "readability") {
      const parsed = new Readability(document).parse();
      result = {
        title: parsed?.title || "",
        byline: parsed?.byline || "",
        dir: parsed?.dir || document.dir || "ltr",
        excerpt: parsed?.excerpt || "",
        content: parsed?.content || "",
        textContent: parsed?.textContent || "",
      };
    } else if (parserType === "simple") {
      const articleEl = document.querySelector("article");
      const content = articleEl
        ? articleEl.innerHTML
        : Array.from(document.querySelectorAll("p"))
            .map((p) => p.outerHTML)
            .join("");
      const textContent = articleEl
        ? articleEl.textContent || ""
        : Array.from(document.querySelectorAll("p"))
            .map((p) => p.textContent || "")
            .join("\n");
      result = {
        title: document.title || "",
        byline: "",
        dir: document.dir || "ltr",
        excerpt: textContent.slice(0, 200),
        content,
        textContent,
      };
    } else if (parserType === "postlight") {
      // Use dummy URL and explicit html contentType to force HTML parsing
      const parsed = await Mercury.parse("http://localhost", { html, contentType: "html" });
      const content = parsed.content || "";
      const textContent = new JSDOM(content).window.document.body.textContent || "";
      result = {
        title: parsed.title || "",
        byline: parsed.author || "",
        dir: document.dir || "ltr",
        excerpt: parsed.excerpt || "",
        content,
        textContent,
      };
    } else if (parserType === "defuddle") {
      const { Defuddle } = await import("defuddle/node");
      const parsed = await Defuddle(html, undefined, { markdown: false });
      const content = parsed.content || "";
      const textContent = new JSDOM(content).window.document.body.textContent || "";
      result = {
        title: parsed.title || "",
        byline: parsed.author || "",
        dir: document.dir || "ltr",
        excerpt: parsed.description || "",
        content,
        textContent,
      };
    } else {
      return NextResponse.json({ error: "Unsupported parser type" }, { status: 400 });
    }

    const td = new TurndownService();
    td.addRule("imageLink", {
      filter: (node) => node.nodeName === "A" && (node as Element).querySelector("img") !== null,
      replacement: (content, node) => {
        const el = node as Element;
        const img = el.querySelector("img");
        if (!img) {
          return content;
        }
        const alt = img.getAttribute("alt") ?? "";
        const src = img.getAttribute("src") ?? img.getAttribute("data-src") ?? "";
        return `![${alt}](${src})`;
      },
    });
    td.addRule("img", {
      filter: ["img"],
      replacement: (_content, node) => {
        const imgNode = node as Element;
        const alt = imgNode.getAttribute("alt") || imgNode.getAttribute("aria-label") || "";
        const src = imgNode.getAttribute("src") || imgNode.getAttribute("data-src") || "";
        return `![${alt}](${src})`;
      },
    });

    let markdown = "";
    if (result.title) {
      markdown += `# ${result.title}\n\n`;
    }
    if (result.byline) {
      markdown += `_${result.byline}_\n\n`;
    }
    markdown += td.turndown(result.content);

    return NextResponse.json({ result, markdown });
  } catch (error) {
    console.error("Error parsing article:", error);
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
