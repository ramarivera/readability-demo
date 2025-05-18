import fs from "fs";
import path from "path";
import ReadabilityDemo from "@/components/ReadabilityDemo";

// Read sample HTML file at build time
const sampleHtml = fs.readFileSync(path.join(process.cwd(), "src/components/sample.html"), "utf8");
export default function Home() {
  return (
    <div className="min-h-screen p-8">
      <ReadabilityDemo sampleHtml={sampleHtml} />
    </div>
  );
}
