"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ParsedArticle, parseWithReadability, parseWithSimple } from "@/lib/parser";
import pretty from "pretty";
import { useState } from "react";
import TurndownService from "turndown";

const PARSERS: { key: string; label: string }[] = [
  { key: "readability", label: "Readability" },
  { key: "simple", label: "Plain Text" },
];

export default function Home() {
  const [htmlInput, setHtmlInput] = useState("");
  const [parserKey, setParserKey] = useState(PARSERS[0].key);
  const [article, setArticle] = useState<ParsedArticle | null>(null);
  const [markdown, setMarkdown] = useState("");

  const handleFormat = () => {
    setHtmlInput(pretty(htmlInput));
  };

  const handleParse = () => {
    let parsed: ParsedArticle;
    if (parserKey === "readability") {
      parsed = parseWithReadability(htmlInput);
    } else {
      parsed = parseWithSimple(htmlInput);
    }
    setArticle(parsed);
    const turndownService = new TurndownService();
    setMarkdown(turndownService.turndown(parsed.content));
  };

  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>HTML Input</CardTitle>
            <CardDescription>Paste your HTML here</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Label htmlFor="html-input">HTML</Label>
            <Textarea
              id="html-input"
              className="h-64 font-mono"
              value={htmlInput}
              onChange={(e) => setHtmlInput(e.target.value)}
            />
            <Button variant="secondary" onClick={handleFormat}>
              Auto format HTML
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Parse HTML</CardTitle>
            <CardDescription>Select a parser and run</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-end space-x-2">
              <div className="flex-1">
                <Label htmlFor="parser-select">Parser</Label>
                <Select
                  id="parser-select"
                  value={parserKey}
                  onValueChange={(value) => setParserKey(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select parser" />
                  </SelectTrigger>
                  <SelectContent>
                    {PARSERS.map((p) => (
                      <SelectItem key={p.key} value={p.key}>
                        {p.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleParse}>Parse HTML</Button>
            </div>

            {article && (
              <pre className="max-h-48 overflow-auto rounded bg-muted p-4 text-sm">
                <code>{JSON.stringify(article, null, 2)}</code>
              </pre>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Markdown Output</CardTitle>
            <CardDescription>Extracted content as Markdown</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Label htmlFor="markdown-output">Markdown</Label>
            <Textarea id="markdown-output" className="h-64 font-mono" value={markdown} readOnly />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
