import Link from "next/link";
import { notFound } from "next/navigation";
import { sql } from "@/lib/db";

export const dynamic = "force-dynamic";

type VerificationRow = {
  certificate_number: string;
  issued_at: string | Date;
  learner_name: string | null;
  course_title: string;
  course_slug: string;
};

type PageProps = {
  params: Promise<{
    certificateNumber: string;
  }>;
};

export default async function CertificateVerificationPage({
  params,
}: PageProps) {
  const { certificateNumber } = await params;

  const rows = (await sql`
    SELECT
      cert.certificate_number,
      cert.issued_at,
      u.name AS learner_name,
      c.title AS course_title,
      c.slug AS course_slug
    FROM certificates cert
    INNER JOIN users u
      ON u.id = cert.user_id
    INNER JOIN courses c
      ON c.id = cert.course_id
    WHERE cert.certificate_number = ${certificateNumber}
    LIMIT 1
  `) as VerificationRow[];

  const certificate = rows[0];

  if (!certificate) {
    notFound();
  }

  const issuedDate = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(certificate.issued_at));

  return (
    <main className="min-h-[calc(100vh-var(--navbar-height))] bg-zinc-50 px-6 py-12 dark:bg-zinc-950">
      <div className="mx-auto max-w-3xl">
        <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="border-b border-zinc-200 px-8 py-7 dark:border-zinc-800 sm:px-10">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#0E5C58] dark:text-[#85D7CE]">
              WebAIgen Academy
            </p>

            <h1 className="mt-3 text-3xl font-bold tracking-tight text-zinc-950 dark:text-white">
              Certificate verification
            </h1>

            <p className="mt-2 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
              This certificate was issued by WebAIgen Academy.
            </p>
          </div>

          <div className="px-8 py-8 sm:px-10">
            <div className="flex items-start gap-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 dark:border-emerald-900/60 dark:bg-emerald-950/30">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-lg font-bold text-white">
                ✓
              </div>

              <div>
                <p className="font-semibold text-emerald-900 dark:text-emerald-200">
                  Certificate verified
                </p>

                <p className="mt-1 text-sm text-emerald-700 dark:text-emerald-300">
                  The certificate ID matches an official WebAIgen Academy record.
                </p>
              </div>
            </div>

            <dl className="mt-8 divide-y divide-zinc-200 border-y border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800">
              <div className="grid gap-2 py-5 sm:grid-cols-[180px_1fr]">
                <dt className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                  Recipient
                </dt>
                <dd className="font-semibold text-zinc-950 dark:text-white">
                  {certificate.learner_name || "WebAIgen Academy learner"}
                </dd>
              </div>

              <div className="grid gap-2 py-5 sm:grid-cols-[180px_1fr]">
                <dt className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                  Course
                </dt>
                <dd className="font-semibold text-zinc-950 dark:text-white">
                  {certificate.course_title}
                </dd>
              </div>

              <div className="grid gap-2 py-5 sm:grid-cols-[180px_1fr]">
                <dt className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                  Completion date
                </dt>
                <dd className="font-semibold text-zinc-950 dark:text-white">
                  {issuedDate}
                </dd>
              </div>

              <div className="grid gap-2 py-5 sm:grid-cols-[180px_1fr]">
                <dt className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                  Certificate ID
                </dt>
                <dd className="break-all font-mono text-sm font-semibold text-zinc-950 dark:text-white">
                  {certificate.certificate_number}
                </dd>
              </div>
            </dl>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={`/learn/${certificate.course_slug}`}
                className="rounded-xl bg-[#0E5C58] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#003334]"
              >
                View course
              </Link>

              <Link
                href="/learn"
                className="rounded-xl border border-zinc-300 px-5 py-3 text-sm font-semibold text-zinc-700 transition hover:border-[#0E5C58] hover:text-[#0E5C58] dark:border-zinc-700 dark:text-zinc-200 dark:hover:border-[#85D7CE] dark:hover:text-[#85D7CE]"
              >
                WebAIgen Academy
              </Link>
            </div>
          </div>
        </div>

        <p className="mt-5 text-center text-xs leading-5 text-zinc-400">
          Verification confirms that this certificate ID exists in the
          official WebAIgen Academy certificate records.
        </p>
      </div>
    </main>
  );
}