import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { auth } from "@/auth";
import { sql } from "@/lib/db";
import {
  isSignedIn,
  resolveSessionUserId,
} from "@/lib/sessionUser";

import QRCode from "qrcode";
import { getCertificateVerificationUrl } from "@/lib/certificates";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{
    certificateNumber: string;
  }>;
};

type CertificateRow = {
  certificate_number: string;
  issued_at: Date | string;
  learner_name: string | null;
  learner_email: string;
  course_title: string;
  course_slug: string;
};

function formatCertificateDate(
  value: Date | string
): string {
  const date =
    value instanceof Date
      ? value
      : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

export default async function CertificatePage({
  params,
}: PageProps) {
  const { certificateNumber } = await params;

  const session = await auth();

  if (!isSignedIn(session)) {
    redirect("/signin");
  }

  const userId =
    await resolveSessionUserId(session);

  if (!userId) {
    redirect("/signin");
  }

  const rows = (await sql`
    SELECT
      cert.certificate_number,
      cert.issued_at,
      u.name AS learner_name,
      u.email AS learner_email,
      c.title AS course_title,
      c.slug AS course_slug
    FROM certificates cert
    INNER JOIN users u
      ON u.id = cert.user_id
    INNER JOIN courses c
      ON c.id = cert.course_id
    WHERE cert.certificate_number =
      ${certificateNumber}
      AND cert.user_id = ${userId}
    LIMIT 1
  `) as CertificateRow[];

  const certificate = rows[0];

  if (!certificate) {
    notFound();
  }

  const learnerName =
    certificate.learner_name?.trim() ||
    certificate.learner_email
      .split("@")[0] ||
    "Learner";

  const issuedDate =
    formatCertificateDate(
      certificate.issued_at
    );

  const verificationUrl = getCertificateVerificationUrl(
    certificate.certificate_number
  );

  const verificationQrCode = await QRCode.toDataURL(
    verificationUrl,
    {
      errorCorrectionLevel: "M",
      margin: 1,
      width: 180,
    }
  );

  return (
    <main className="min-h-screen bg-zinc-100 px-4 py-10 text-zinc-950 dark:bg-zinc-950 dark:text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/dashboard"
            className="text-sm font-semibold text-zinc-600 transition hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white"
          >
            ← Back to dashboard
          </Link>

          <div className="flex items-center gap-3">
            <a
              href={`/api/certificates/${certificate.certificate_number}/pdf`}
              className="rounded-xl bg-[#0E5C58] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#003334]"
            >
              Download PDF
            </a>

            <Link
              href={`/learn/${certificate.course_slug}`}
              className="rounded-xl border border-zinc-300 px-4 py-2.5 text-sm font-semibold text-zinc-700 transition hover:border-[#0E5C58] hover:text-[#0E5C58] dark:border-zinc-700 dark:text-zinc-200 dark:hover:border-[#85D7CE] dark:hover:text-[#85D7CE]"
            >
              Review course
            </Link>
          </div>
        </div>

        <section className="overflow-hidden rounded-[2rem] border border-zinc-200 bg-white shadow-[0_24px_80px_rgba(0,0,0,0.10)] dark:border-white/10 dark:bg-zinc-900">
          <div className="border-b border-zinc-200 px-6 py-5 dark:border-white/10 sm:px-10">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#0E5C58] dark:text-[#85D7CE]">
                  WebAIgen Academy
                </p>

                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                  Learning credential
                </p>
              </div>

              <div className="rounded-full border border-zinc-200 px-4 py-2 text-xs font-semibold text-zinc-600 dark:border-white/10 dark:text-zinc-300">
                Verified completion
              </div>
            </div>
          </div>

          <div className="relative px-6 py-14 sm:px-12 sm:py-20 lg:px-20 lg:py-24">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-[0.035] dark:opacity-[0.06]"
              style={{
                backgroundImage:
                  "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
                backgroundSize: "32px 32px",
              }}
            />

            <div className="relative mx-auto max-w-4xl text-center">
              <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#0E5C58] dark:text-[#85D7CE]">
                Certificate of Completion
              </p>

              <h1 className="mt-7 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                WebAIgen Academy
              </h1>

              <p className="mx-auto mt-8 max-w-2xl text-base leading-7 text-zinc-500 dark:text-zinc-400">
                This certificate is presented to
              </p>

              <div className="mx-auto mt-5 max-w-3xl border-b border-zinc-300 pb-5 dark:border-white/20">
                <p className="text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
                  {learnerName}
                </p>
              </div>

              <p className="mx-auto mt-8 max-w-2xl text-base leading-7 text-zinc-500 dark:text-zinc-400">
                for successfully completing all learning
                requirements and assessments for
              </p>

              <h2 className="mx-auto mt-5 max-w-3xl text-2xl font-bold tracking-tight sm:text-3xl">
                {certificate.course_title}
              </h2>

              <div className="mx-auto mt-12 grid max-w-3xl gap-6 border-t border-zinc-200 pt-8 text-left dark:border-white/10 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-zinc-400">
                    Completion date
                  </p>

                  <p className="mt-2 text-base font-semibold">
                    {issuedDate}
                  </p>
                </div>

                <div className="sm:justify-self-end sm:text-left">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-zinc-400">
                    Certificate ID
                  </p>

                  <p className="mt-2 break-all font-mono text-sm font-semibold">
                    {certificate.certificate_number}
                  </p>
                </div>
              </div>

              <div className="mt-8 flex flex-col items-center">
                <div className="rounded-xl border border-zinc-200 bg-white p-2">
                  <img
                    src={verificationQrCode}
                    alt={`Verify certificate ${certificate.certificate_number}`}
                    width={112}
                    height={112}
                    className="h-28 w-28"
                  />
                </div>

                <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-400">
                  Scan to verify
                </p>
              </div>

              <p className="mt-12 text-xs leading-6 text-zinc-400">
                Issued by WebAIgen Academy upon successful
                completion of the course requirements.
              </p>
            </div>
          </div>
        </section>

        <div className="mt-6 flex justify-center">
          <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
            Your certificate is securely associated with
            your WebAIgen Academy account.
          </p>
        </div>
      </div>
    </main>
  );
}