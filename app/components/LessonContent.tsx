import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import remarkGfm from "remark-gfm";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import type { Components } from "react-markdown";
import { accent, typography } from "@/app/lib/typography";

type LessonContentProps = {
  content: string;
  hideTitle?: boolean;
};

type ContentPart =
  | { type: "markdown"; content: string }
  | { type: "details"; open: boolean; summary: string; body: string };

const remarkPlugins = [remarkMath, remarkGfm];
const rehypePlugins = [rehypeRaw, rehypeKatex];
const remarkRehypeOptions = { allowDangerousHtml: true };

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

function splitContentByDetails(content: string): ContentPart[] {
  const parts: ContentPart[] = [];
  const detailsRegex = /<details(\s+open)?\s*>([\s\S]*?)<\/details>/gi;

  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = detailsRegex.exec(content)) !== null) {
    const before = content.slice(lastIndex, match.index);

    if (before.trim()) {
      parts.push({ type: "markdown", content: before });
    }

    const open = Boolean(match[1]);
    const inner = match[2];
    const summaryMatch = inner.match(/<summary>([\s\S]*?)<\/summary>/i);
    const summary = summaryMatch?.[1]?.trim() ?? "";
    const body = inner.replace(/<summary>[\s\S]*?<\/summary>/i, "").trim();

    parts.push({ type: "details", open, summary, body });
    lastIndex = match.index + match[0].length;
  }

  const after = content.slice(lastIndex);

  if (after.trim()) {
    parts.push({ type: "markdown", content: after });
  }

  return parts;
}

const markdownComponents: Components = {
  h1: ({ children }) => (
    <h1 className={typography.sectionTitle}>{children}</h1>
  ),
  h2: ({ children }) => (
    <div className={`border-l-4 ${accent.border} pl-4`}>
      <h2 className={typography.sectionTitle}>{children}</h2>
    </div>
  ),
  h3: ({ children }) => (
    <h3 className={typography.cardTitle}>{children}</h3>
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
        className={`mt-3 h-2 w-2 shrink-0 rounded-full ${accent.bg}`}
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
    <th className={`px-4 py-3 font-semibold text-zinc-900 dark:text-white ${typography.small}`}>
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className={`px-4 py-3 ${typography.reading}`}>{children}</td>
  ),
  tr: ({ children }) => (
    <tr className="border-b border-zinc-100 dark:border-zinc-800">{children}</tr>
  ),
  details: ({ children, open, ...props }) => (
    <details
      {...props}
      open={open}
      className={`group/details rounded-xl border ${accent.borderSubtle} bg-white p-5 shadow-sm dark:bg-zinc-950`}
    >
      {children}
    </details>
  ),
  summary: ({ children, ...props }) => (
    <summary
      {...props}
      className={`flex cursor-pointer list-none items-center gap-3 select-none marker:content-none [&::-webkit-details-marker]:hidden ${accent.text}`}
    >
      <span
        aria-hidden
        className={`inline-flex h-5 w-5 shrink-0 items-center justify-center transition-transform duration-200 group-open/details:rotate-90 ${accent.text} ${typography.small}`}
      >
        ▸
      </span>
      <span className="flex-1">{children}</span>
    </summary>
  ),
};

const summaryComponents: Components = {
  p: ({ children }) => <span className="font-semibold">{children}</span>,
  strong: ({ children }) => (
    <strong className="font-semibold">{children}</strong>
  ),
};

type LessonMarkdownProps = {
  content: string;
  components?: Components;
};

function LessonMarkdown({ content, components }: LessonMarkdownProps) {
  if (!content.trim()) {
    return null;
  }

  return (
    <ReactMarkdown
      remarkPlugins={remarkPlugins}
      rehypePlugins={rehypePlugins}
      remarkRehypeOptions={remarkRehypeOptions}
      components={components ?? markdownComponents}
    >
      {content}
    </ReactMarkdown>
  );
}

type CollapsibleSectionProps = {
  open: boolean;
  summary: string;
  body: string;
};

function CollapsibleSection({ open, summary, body }: CollapsibleSectionProps) {
  return (
    <details
      open={open}
      className={`group/details rounded-xl border ${accent.borderSubtle} bg-white p-5 shadow-sm dark:bg-zinc-950`}
    >
      <summary className={`flex cursor-pointer list-none items-center gap-3 font-medium select-none marker:content-none [&::-webkit-details-marker]:hidden ${accent.text} ${typography.small}`}>
        <span
          aria-hidden
          className={`inline-flex h-5 w-5 shrink-0 items-center justify-center transition-transform duration-200 group-open/details:rotate-90 ${accent.text} ${typography.small}`}
        >
          ▸
        </span>
        <span className="flex-1">
          <LessonMarkdown content={summary} components={summaryComponents} />
        </span>
      </summary>
      <div className={`mt-4 space-y-4 border-t ${accent.borderSubtle} pt-4`}>
        <LessonMarkdown content={body} />
      </div>
    </details>
  );
}

export default function LessonContent({
  content,
  hideTitle = false,
}: LessonContentProps) {
  const markdown = prepareContent(content, hideTitle);
  const parts = splitContentByDetails(markdown);

  if (parts.length === 0) {
    return null;
  }

  if (parts.length === 1 && parts[0].type === "markdown") {
    return (
      <div className="lesson-content space-y-8">
        <LessonMarkdown content={parts[0].content} />
      </div>
    );
  }

  return (
    <div className="lesson-content space-y-8">
      {parts.map((part, index) => {
        if (part.type === "markdown") {
          return <LessonMarkdown key={index} content={part.content} />;
        }

        return (
          <CollapsibleSection
            key={index}
            open={part.open}
            summary={part.summary}
            body={part.body}
          />
        );
      })}
    </div>
  );
}
