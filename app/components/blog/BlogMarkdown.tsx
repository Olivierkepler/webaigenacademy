import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import type { Components } from "react-markdown";
import { accent, typography } from "@/app/lib/typography";

type BlogMarkdownProps = {
  content: string;
  /** Heading IDs in document order for Markdown h2/h3 (from `extractBlogToc`). */
  headingIds?: string[];
};

const remarkPlugins = [remarkGfm, remarkMath];
const rehypePlugins = [rehypeKatex];

/** Normalize math delimiters before TOC extraction and Markdown render share one source. */
export function prepareBlogMarkdownContent(content: string): string {
  const withBlockMath = content.replace(
    /\\\[([\s\S]*?)\\\]/g,
    (_, math: string) => `\n$$\n${math.trim()}\n$$\n`
  );

  return withBlockMath.replace(
    /\\\(([\s\S]*?)\\\)/g,
    (_, math: string) => `$${math.trim()}$`
  );
}

function createComponents(headingIds: string[]): Components {
  const ids = [...headingIds];
  const takeHeadingId = () => ids.shift();

  return {
    h1: ({ children }) => (
      <h2 className={`mt-12 scroll-mt-28 first:mt-0 ${typography.sectionTitle}`}>
        {children}
      </h2>
    ),
    h2: ({ children }) => {
      const id = takeHeadingId();
      return (
        <h2
          id={id}
          className={`mt-12 scroll-mt-28 border-b border-zinc-200 pb-3 first:mt-0 dark:border-zinc-800 ${typography.sectionTitle}`}
        >
          {children}
        </h2>
      );
    },
    h3: ({ children }) => {
      const id = takeHeadingId();
      return (
        <h3
          id={id}
          className={`mt-8 scroll-mt-28 ${typography.cardTitle}`}
        >
          {children}
        </h3>
      );
    },
    h4: ({ children }) => (
      <h4 className="mt-6 scroll-mt-28 text-base font-semibold text-zinc-900 dark:text-zinc-100">
        {children}
      </h4>
    ),
    p: ({ children }) => (
      <p className={`mt-5 ${typography.reading}`}>{children}</p>
    ),
    strong: ({ children }) => (
      <strong className={typography.readingStrong}>{children}</strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
    a: ({ href, children }) => (
      <a
        href={href}
        className={`rounded-sm font-medium underline underline-offset-4 decoration-[#0F766E]/40 hover:decoration-[#0F766E] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F766E] ${accent.text}`}
        {...(href?.startsWith("http")
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {})}
      >
        {children}
      </a>
    ),
    ul: ({ children }) => (
      <ul className="mt-5 list-disc space-y-2 pl-6 marker:text-[#0F766E]">
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className="mt-5 list-decimal space-y-2 pl-6 marker:font-semibold marker:text-[#0F766E]">
        {children}
      </ol>
    ),
    li: ({ children }) => (
      <li className={`${typography.reading} [&>p]:mt-2`}>{children}</li>
    ),
    blockquote: ({ children }) => (
      <blockquote
        className={`mt-6 border-l-4 ${accent.border} bg-zinc-50 px-5 py-3 text-zinc-700 italic dark:bg-zinc-900/70 dark:text-zinc-300`}
      >
        {children}
      </blockquote>
    ),
    hr: () => <hr className="my-10 border-zinc-200 dark:border-zinc-800" />,
    table: ({ children }) => (
      <div className="mt-6 overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800">
        <table className="w-full min-w-[32rem] border-collapse text-left text-sm">
          {children}
        </table>
      </div>
    ),
    thead: ({ children }) => (
      <thead className="bg-zinc-50 dark:bg-zinc-900">{children}</thead>
    ),
    th: ({ children }) => (
      <th
        className={`border-b border-zinc-200 px-4 py-3 font-semibold text-zinc-900 dark:border-zinc-800 dark:text-zinc-50 ${typography.small}`}
      >
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td className="border-b border-zinc-100 px-4 py-3 text-zinc-700 dark:border-zinc-800 dark:text-zinc-300">
        {children}
      </td>
    ),
    tr: ({ children }) => <tr>{children}</tr>,
    code: ({ className, children }) => {
      const isBlock = Boolean(className?.includes("language-"));

      if (isBlock) {
        return (
          <code className={`${className ?? ""} ${typography.code}`}>
            {children}
          </code>
        );
      }

      return (
        <code className="rounded-md bg-zinc-100 px-1.5 py-0.5 font-mono text-[0.9em] text-zinc-800 dark:bg-zinc-800 dark:text-zinc-100">
          {children}
        </code>
      );
    },
    pre: ({ children }) => (
      <pre className="mt-6 overflow-x-auto rounded-xl border border-zinc-200 bg-zinc-950 p-4 text-sm leading-7 text-zinc-100 dark:border-zinc-700">
        {children}
      </pre>
    ),
    img: ({ src, alt }) => (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt ?? ""}
        className="mt-6 h-auto max-w-full rounded-xl border border-zinc-200 dark:border-zinc-800"
        loading="lazy"
      />
    ),
  };
}

export default function BlogMarkdown({
  content,
  headingIds = [],
}: BlogMarkdownProps) {
  if (!content.trim()) {
    return null;
  }

  return (
    <div className="blog-content">
      <ReactMarkdown
        remarkPlugins={remarkPlugins}
        rehypePlugins={rehypePlugins}
        components={createComponents(headingIds)}
      >
        {prepareBlogMarkdownContent(content)}
      </ReactMarkdown>
    </div>
  );
}
