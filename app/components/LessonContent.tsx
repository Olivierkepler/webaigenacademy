import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import remarkGfm from "remark-gfm";
import rehypeKatex from "rehype-katex";
import type { Components } from "react-markdown";
import { typography } from "@/app/lib/typography";

type LessonContentProps = {
  content: string;
  hideTitle?: boolean;
};

function normalizeMathDelimiters(content: string): string {
  const withBlockMath = content.replace(
    /\\\[([\s\S]*?)\\\]/g,
    (_, math: string) => `\n$$\n${math.trim()}\n$$\n`
  );

  return withBlockMath.replace(
    /\\\(([\s\S]*?)\\\)/g,
    (_, math: string) => `$${math.trim()}$`
  );
}

function prepareContent(content: string, hideTitle: boolean): string {
  const trimmed = content.trim();

  let markdown = trimmed;

  if (hideTitle) {
    const lines = trimmed.split("\n");

    if (lines[0]?.startsWith("# ")) {
      markdown = lines.slice(1).join("\n").trim();
    }
  }

  return normalizeMathDelimiters(markdown);
}

const markdownComponents: Components = {
  h1: ({ children }) => (
    <h1 className={typography.sectionTitle}>{children}</h1>
  ),
  h2: ({ children }) => (
    <div className="border-l-4 border-emerald-500 pl-4">
      <h2 className={typography.cardTitle}>{children}</h2>
    </div>
  ),
  h3: ({ children }) => (
    <h3 className={typography.accentSubtitle}>{children}</h3>
  ),
  p: ({ children }) => <p className={typography.reading}>{children}</p>,
  strong: ({ children }) => (
    <strong className={typography.readingStrong}>{children}</strong>
  ),
  ul: ({ children }) => <ul className="space-y-4">{children}</ul>,
  li: ({ children }) => (
    <li className={`flex gap-3 ${typography.reading}`}>
      <span
        aria-hidden
        className="mt-3 h-2 w-2 shrink-0 rounded-full bg-emerald-500"
      />
      <span>{children}</span>
    </li>
  ),
  table: ({ children }) => (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-left text-sm">
        {children}
      </table>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="border-b border-zinc-200 dark:border-zinc-700">
      {children}
    </thead>
  ),
  th: ({ children }) => (
    <th className="px-4 py-3 font-semibold text-zinc-900 dark:text-white">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className={`px-4 py-3 ${typography.reading}`}>{children}</td>
  ),
  tr: ({ children }) => (
    <tr className="border-b border-zinc-100 dark:border-zinc-800">{children}</tr>
  ),
};

export default function LessonContent({
  content,
  hideTitle = false,
}: LessonContentProps) {
  const markdown = prepareContent(content, hideTitle);

  return (
    <div className="lesson-content space-y-8">
      <ReactMarkdown
        remarkPlugins={[remarkMath, remarkGfm]}
        rehypePlugins={[rehypeKatex]}
        components={markdownComponents}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
}
