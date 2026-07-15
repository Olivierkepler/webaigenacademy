import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import type { Components } from "react-markdown";
import { accent } from "@/app/lib/typography";

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

const readingText =
  "text-[16px] leading-[1.8] text-zinc-700 dark:text-zinc-300 sm:text-[17px]";

function createComponents(headingIds: string[]): Components {
  const ids = [...headingIds];
  const takeHeadingId = () => ids.shift();

  return {
    h1: ({ children }) => (
      <h2 className="mt-14 scroll-mt-28 font-heading text-[1.65rem] font-bold tracking-tight text-zinc-950 first:mt-0 dark:text-zinc-50 sm:text-[1.85rem]">
        {children}
      </h2>
    ),
    h2: ({ children }) => {
      const id = takeHeadingId();
      return (
        <h2
          id={id}
          className="mt-14 scroll-mt-28 border-b border-zinc-200/90 pb-3 font-heading text-[1.65rem] font-bold tracking-tight text-zinc-950 first:mt-0 dark:border-zinc-800 dark:text-zinc-50 sm:text-[1.85rem]"
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
          className="mt-10 scroll-mt-28 font-heading text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100"
        >
          {children}
        </h3>
      );
    },
    h4: ({ children }) => (
      <h4 className="mt-8 scroll-mt-28 text-base font-semibold text-zinc-900 dark:text-zinc-100">
        {children}
      </h4>
    ),
    p: ({ children }) => <p className={`mt-5 ${readingText}`}>{children}</p>,
    strong: ({ children }) => (
      <strong className="font-semibold text-zinc-900 dark:text-zinc-50">
        {children}
      </strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
    a: ({ href, children }) => (
      <a
        href={href}
        className={`break-words rounded-sm font-medium underline underline-offset-[3px] decoration-[#0F766E]/35 transition-colors hover:decoration-[#0F766E] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F766E] dark:decoration-[#5EEAD4]/40 dark:hover:decoration-[#5EEAD4] dark:focus-visible:outline-[#5EEAD4] ${accent.text}`}
        {...(href?.startsWith("http")
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {})}
      >
        {children}
      </a>
    ),
    ul: ({ children }) => (
      <ul className="mt-5 list-disc space-y-2.5 pl-6 marker:text-[#0F766E] dark:marker:text-[#5EEAD4]">
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className="mt-5 list-decimal space-y-2.5 pl-6 marker:font-semibold marker:text-[#0F766E] dark:marker:text-[#5EEAD4]">
        {children}
      </ol>
    ),
    li: ({ children }) => (
      <li className={`${readingText} [&>p]:mt-2`}>{children}</li>
    ),
    blockquote: ({ children }) => (
      <blockquote className="mt-8 border-l-[3px] border-[#0F766E] bg-[#0F766E]/[0.04] px-5 py-4 text-[15px] leading-relaxed text-zinc-700 not-italic dark:border-[#5EEAD4] dark:bg-[#5EEAD4]/[0.06] dark:text-zinc-300 sm:px-6">
        {children}
      </blockquote>
    ),
    hr: () => (
      <hr className="my-12 border-0 border-t border-zinc-200 dark:border-zinc-800" />
    ),
    table: ({ children }) => (
      <div className="mt-8 -mx-1 overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800 sm:mx-0">
        <table className="w-full min-w-[32rem] border-collapse text-left text-sm">
          {children}
        </table>
      </div>
    ),
    thead: ({ children }) => (
      <thead className="bg-zinc-50/90 dark:bg-zinc-900/80">{children}</thead>
    ),
    th: ({ children }) => (
      <th className="border-b border-zinc-200 px-4 py-3 text-xs font-semibold uppercase tracking-[0.06em] text-zinc-700 dark:border-zinc-800 dark:text-zinc-200">
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td className="border-b border-zinc-100 px-4 py-3 align-top text-zinc-700 dark:border-zinc-800 dark:text-zinc-300">
        {children}
      </td>
    ),
    tr: ({ children }) => (
      <tr className="even:bg-zinc-50/40 dark:even:bg-zinc-900/40">{children}</tr>
    ),
    code: ({ className, children }) => {
      const isBlock = Boolean(className?.includes("language-"));

      if (isBlock) {
        return (
          <code
            className={`${className ?? ""} font-mono text-[13px] leading-7 text-zinc-100 sm:text-[13.5px]`}
          >
            {children}
          </code>
        );
      }

      return (
        <code className="rounded-md border border-zinc-200/80 bg-zinc-100 px-1.5 py-0.5 font-mono text-[0.86em] text-zinc-800 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100">
          {children}
        </code>
      );
    },
    pre: ({ children }) => (
      <pre className="mt-7 overflow-x-auto rounded-xl border border-zinc-800/80 bg-zinc-950 p-4 text-sm leading-7 text-zinc-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] dark:border-zinc-700 sm:p-5">
        {children}
      </pre>
    ),
    img: ({ src, alt }) => (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt ?? ""}
        className="mt-8 h-auto max-w-full rounded-xl border border-zinc-200 shadow-sm dark:border-zinc-800"
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
    <div className="blog-content min-w-0 overflow-x-clip">
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
