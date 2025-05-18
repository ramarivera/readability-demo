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
import CodeMirror from "@uiw/react-codemirror";
import { html as beautifyHtml } from "js-beautify";
import Image from "next/image";
import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeUnwrapImages from "rehype-unwrap-images";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";

interface ArticleResult {
  title?: string;
  byline?: string;
  dir?: string;
  excerpt?: string;
  content: string;
  textContent: string;
}
// Extend parser union to include empty state
type ParserTypeUnion = "" | "readability" | "simple" | "postlight" | "defuddle";

interface ReadabilityDemoProps {
  sampleHtml: string;
}
export default function ReadabilityDemo({ sampleHtml }: ReadabilityDemoProps) {
  const [htmlInput, setHtmlInput] = useState("");
  const [parser, setParser] = useState<ParserTypeUnion>("");
  const [parseResult, setParseResult] = useState<ArticleResult | null>(null);
  const [markdownOutput, setMarkdownOutput] = useState("");
  const [activeTab, setActiveTab] = useState<"preview" | "raw">("preview");
  const [loading, setLoading] = useState(false);

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
  const loadSample = () => setHtmlInput(sampleHtml);

  const parseArticle = async () => {
    if (!parser) {
      toast.error("Please select a parser");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("/api/parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ html: htmlInput, parserType: parser }),
      });
      const data = await response.json();
      setParseResult(data.result);
      setMarkdownOutput(data.markdown);
      toast.success(`Parsing using ${parser} was successful`);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      toast.error(`Parsing failed: ${message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster position="bottom-center" />
      <div className="flex flex-col gap-4">
        <div>
          <div className="mb-2 font-medium">HTML Input</div>
          <CodeMirror
            value={htmlInput}
            height="200px"
            extensions={[htmlLang()]}
            onChange={(value) => setHtmlInput(value)}
          />
          <div className="flex gap-2 mt-2">
            <Button variant="outline" onClick={formatHtml}>
              Auto Format HTML
            </Button>
            <Button variant="outline" onClick={loadSample}>
              Load Sample HTML
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Select value={parser} onValueChange={(value) => setParser(value as ParserTypeUnion)}>
            <SelectTrigger disabled={loading}>
              <SelectValue placeholder="Select parser" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="readability">Readability</SelectItem>
              <SelectItem value="simple">Simple</SelectItem>
              <SelectItem value="postlight">Postlight</SelectItem>
              <SelectItem value="defuddle">Defuddle</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={parseArticle} disabled={loading}>
            {loading ? "Parsing..." : "Parse HTML"}
          </Button>
        </div>
        <div>
          <div className="mb-2 font-medium">Parsed Result (JSON)</div>
          <Textarea
            className="font-mono text-sm h-40"
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
            <div className="border rounded p-4 max-w-full max-h-80 overflow-auto break-words prose">
              <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkBreaks]}
                rehypePlugins={[rehypeRaw, rehypeUnwrapImages]}
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
                  p: ({ children, ...props }) => {
                    // If this paragraph contains a block-level child (e.g., a div), unwrap it
                    const hasBlock = React.Children.toArray(children).some(
                      (child) => React.isValidElement(child) && child.type === "div",
                    );
                    if (hasBlock) {
                      return <>{children}</>;
                    }
                    return (
                      <p className="mb-4" {...props}>
                        {children}
                      </p>
                    );
                  },
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
                  img: ({ src, alt }) =>
                    typeof src === "string" ? (
                      <div className="relative w-full h-60 mb-4">
                        <Image
                          src={src}
                          alt={alt || ""}
                          fill
                          className="object-contain"
                          unoptimized
                        />
                      </div>
                    ) : null,
                }}
              >
                {markdownOutput}
              </ReactMarkdown>
            </div>
          ) : (
            <Textarea className="font-mono text-sm h-40" readOnly value={markdownOutput} />
          )}
        </div>
      </div>
    </>
  );
}
