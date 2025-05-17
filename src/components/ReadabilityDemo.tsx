"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { html as htmlLang } from "@codemirror/lang-html";
import { Readability } from "@mozilla/readability";
import CodeMirror from "@uiw/react-codemirror";
import { html as beautifyHtml } from "js-beautify";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";
import TurndownService from "turndown";

interface ArticleResult {
  title?: string;
  byline?: string;
  dir?: string;
  excerpt?: string;
  content: string;
  textContent: string;
}

export default function ReadabilityDemo() {
  const [htmlInput, setHtmlInput] = useState("");
  const [parser, setParser] = useState<"readability" | "simple">("readability");
  const [parseResult, setParseResult] = useState<ArticleResult | null>(null);
  const [markdownOutput, setMarkdownOutput] = useState("");
  const [activeTab, setActiveTab] = useState<"preview" | "raw">("preview");

  const formatHtml = () => {
    const formatted = beautifyHtml(htmlInput, {
      indent_size: 2,
    });
    const noEmptyLines = formatted
      .split("\n")
      .filter((line) => line.trim() !== "")
      .join("\n");
    setHtmlInput(noEmptyLines);
  };

  const parseArticle = () => {
    let result: ArticleResult;
    const doc = new DOMParser().parseFromString(htmlInput, "text/html");
    if (parser === "readability") {
      const parsed = new Readability(doc).parse();
      result = {
        title: parsed?.title || "",
        byline: parsed?.byline || "",
        dir: parsed?.dir || doc.dir || "ltr",
        excerpt: parsed?.excerpt || "",
        content: parsed?.content || "",
        textContent: parsed?.textContent || "",
      };
    } else {
      const articleEl = doc.querySelector("article");
      const content = articleEl
        ? articleEl.innerHTML
        : Array.from(doc.querySelectorAll("p"))
            .map((p) => p.outerHTML)
            .join("");
      const textContent = articleEl
        ? articleEl.textContent || ""
        : Array.from(doc.querySelectorAll("p"))
            .map((p) => p.textContent || "")
            .join("\n");
      result = {
        title: doc.title || "",
        byline: "",
        dir: doc.dir || "ltr",
        excerpt: textContent.slice(0, 200),
        content,
        textContent,
      };
    }
    setParseResult(result);
    const td = new TurndownService();
    // Handle images wrapped in anchor tags first
    td.addRule("imageLink", {
      filter: (node) => node.nodeName === "A" && (node as Element).querySelector("img") !== null,
      replacement: (content, node) => {
        const img = (node as Element).querySelector("img")!;
        const alt = img.getAttribute("alt") || "";
        const src = img.getAttribute("src") || img.getAttribute("data-src") || "";
        return `![${alt}](${src})`;
      },
    });
    td.addRule("img", {
      filter: ["img"],
      replacement: (content, node) => {
        const imgNode = node as Element;
        const alt = imgNode.getAttribute("alt") || imgNode.getAttribute("aria-label") || "";
        const src = imgNode.getAttribute("src") || imgNode.getAttribute("data-src") || "";
        return `![${alt}](${src})`;
      },
    });
    // Prepend title and byline to markdown output
    let md = "";
    if (result.title) {
      md += `# ${result.title}\n\n`;
    }
    if (result.byline) {
      md += `_${result.byline}_\n\n`;
    }
    md += td.turndown(result.content);
    setMarkdownOutput(md);
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <div className="mb-2 font-medium">HTML Input</div>
        <CodeMirror
          value={htmlInput}
          height="200px"
          extensions={[htmlLang()]}
          onChange={(value) => setHtmlInput(value)}
        />
        <Button variant="outline" className="mt-2" onClick={formatHtml}>
          Auto Format HTML
        </Button>
      </div>
      <div className="flex items-center gap-2">
        <Select onValueChange={(value) => setParser(value as "readability" | "simple")}>
          <SelectTrigger>
            <SelectValue placeholder="Select parser" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="readability">Readability</SelectItem>
            <SelectItem value="simple">Simple</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={parseArticle}>Parse HTML</Button>
      </div>
      <div>
        <div className="mb-2 font-medium">Parsed Result (JSON)</div>
        <Textarea
          className="font-mono h-40"
          readOnly
          value={parseResult ? JSON.stringify(parseResult, null, 2) : ""}
        />
      </div>
      <div>
        <div className="mb-2 font-medium">Markdown Output</div>
        <div className="flex space-x-4 border-b mb-2">
          <button
            className={`px-4 py-2 -mb-px border-b-2 ${
              activeTab === "preview"
                ? "border-blue-500 text-blue-500"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("preview")}
          >
            Preview
          </button>
          <button
            className={`px-4 py-2 -mb-px border-b-2 ${
              activeTab === "raw"
                ? "border-blue-500 text-blue-500"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("raw")}
          >
            Markdown
          </button>
        </div>
        {activeTab === "preview" ? (
          <div className="border rounded p-4 max-w-full overflow-auto break-words prose max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm, remarkBreaks]}
              rehypePlugins={[rehypeRaw]}
              skipHtml={false}
              urlTransform={(url) => url}
              components={{
                h1: ({ children, ...props }) => (
                  <h1 className="text-3xl font-bold mb-4" {...props}>
                    {children}
                  </h1>
                ),
                h2: ({ children, ...props }) => (
                  <h2 className="text-2xl font-semibold mb-3" {...props}>
                    {children}
                  </h2>
                ),
                h3: ({ children, ...props }) => (
                  <h3 className="text-xl font-semibold mb-2" {...props}>
                    {children}
                  </h3>
                ),
                p: ({ children, ...props }) => (
                  <p className="mb-4" {...props}>
                    {children}
                  </p>
                ),
                ul: ({ children, ...props }) => (
                  <ul className="list-disc pl-5 mb-4" {...props}>
                    {children}
                  </ul>
                ),
                ol: ({ children, ...props }) => (
                  <ol className="list-decimal pl-5 mb-4" {...props}>
                    {children}
                  </ol>
                ),
                a: ({ href, children, ...props }) => (
                  <a
                    href={href}
                    {...props}
                    className="text-blue-500 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {children}
                  </a>
                ),
                img: ({ src, alt, ...props }) =>
                  src ? <img src={src} alt={alt} {...props} className="max-w-full" /> : null,
              }}
            >
              {markdownOutput}
            </ReactMarkdown>
          </div>
        ) : (
          <Textarea className="font-mono h-40" readOnly value={markdownOutput} />
        )}
      </div>
    </div>
  );
}
