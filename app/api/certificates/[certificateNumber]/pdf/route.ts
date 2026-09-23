import {
  PDFDocument,
  StandardFonts,
  rgb,
} from "pdf-lib";

import { auth } from "@/auth";
import { sql } from "@/lib/db";
import {
  isSignedIn,
  resolveSessionUserId,
} from "@/lib/sessionUser";

import QRCode from "qrcode";
import { getCertificateVerificationUrl } from "@/lib/certificates";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteContext = {
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
};

function formatDate(
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

function drawCenteredText(
  page: ReturnType<PDFDocument["addPage"]>,
  text: string,
  y: number,
  font: Awaited<
    ReturnType<PDFDocument["embedFont"]>
  >,
  size: number,
  color = rgb(0.08, 0.08, 0.09)
) {
  const width =
    font.widthOfTextAtSize(text, size);

  page.drawText(text, {
    x: (page.getWidth() - width) / 2,
    y,
    size,
    font,
    color,
  });
}

export async function GET(
  _request: Request,
  { params }: RouteContext
) {
  const session = await auth();

  if (!isSignedIn(session)) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }

  const userId =
    await resolveSessionUserId(session);

  if (!userId) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }

  const { certificateNumber } =
    await params;

  const rows = (await sql`
    SELECT
      cert.certificate_number,
      cert.issued_at,
      u.name AS learner_name,
      u.email AS learner_email,
      c.title AS course_title
    FROM certificates cert

    INNER JOIN users u
      ON u.id = cert.user_id

    INNER JOIN courses c
      ON c.id = cert.course_id

    WHERE
      cert.certificate_number =
        ${certificateNumber}
      AND cert.user_id = ${userId}

    LIMIT 1
  `) as CertificateRow[];

  const certificate = rows[0];

  if (!certificate) {
    return new Response(
      "Certificate not found",
      {
        status: 404,
      }
    );
  }

  const verificationUrl =
    getCertificateVerificationUrl(
      certificate.certificate_number
    );

  const qrDataUrl = await QRCode.toDataURL(
    verificationUrl,
    {
      errorCorrectionLevel: "M",
      margin: 1,
      width: 240,
    }
  );

  const qrBase64 = qrDataUrl.replace(
    /^data:image\/png;base64,/,
    ""
  );

  const qrBytes = Uint8Array.from(
    Buffer.from(qrBase64, "base64")
  );

  const learnerName =
    certificate.learner_name?.trim() ||
    certificate.learner_email
      .split("@")[0] ||
    "Learner";

  const completionDate =
    formatDate(certificate.issued_at);

  const pdf = await PDFDocument.create();

  const qrImage = await pdf.embedPng(qrBytes);

  const page = pdf.addPage([
    842,
    595,
  ]);

  const regular =
    await pdf.embedFont(
      StandardFonts.Helvetica
    );

  const bold =
    await pdf.embedFont(
      StandardFonts.HelveticaBold
    );

  const width = page.getWidth();
  const height = page.getHeight();

  const teal = rgb(
    14 / 255,
    92 / 255,
    88 / 255
  );

  const dark = rgb(
    24 / 255,
    24 / 255,
    27 / 255
  );

  const muted = rgb(
    100 / 255,
    116 / 255,
    139 / 255
  );

  const border = rgb(
    212 / 255,
    212 / 255,
    216 / 255
  );

  /*
   * Outer certificate frame.
   */
  page.drawRectangle({
    x: 28,
    y: 28,
    width: width - 56,
    height: height - 56,
    borderWidth: 1.5,
    borderColor: border,
  });

  page.drawRectangle({
    x: 38,
    y: 38,
    width: width - 76,
    height: height - 76,
    borderWidth: 0.7,
    borderColor: border,
  });

  /*
   * Brand.
   */
  drawCenteredText(
    page,
    "WEBAIGEN ACADEMY",
    height - 92,
    bold,
    12,
    teal
  );

  drawCenteredText(
    page,
    "CERTIFICATE OF COMPLETION",
    height - 138,
    bold,
    14,
    teal
  );

  drawCenteredText(
    page,
    "WebAIgen Academy",
    height - 192,
    bold,
    32,
    dark
  );

  drawCenteredText(
    page,
    "This certificate is presented to",
    height - 238,
    regular,
    12,
    muted
  );

  drawCenteredText(
    page,
    learnerName,
    height - 288,
    bold,
    30,
    dark
  );

  /*
   * Divider under learner name.
   */
  page.drawLine({
    start: {
      x: 180,
      y: height - 310,
    },
    end: {
      x: width - 180,
      y: height - 310,
    },
    thickness: 0.8,
    color: border,
  });

  drawCenteredText(
    page,
    "for successfully completing all learning requirements and assessments for",
    height - 350,
    regular,
    11,
    muted
  );

  drawCenteredText(
    page,
    certificate.course_title,
    height - 392,
    bold,
    22,
    dark
  );

  /*
   * Completion metadata.
   */
  page.drawLine({
    start: {
      x: 130,
      y: 150,
    },
    end: {
      x: width - 130,
      y: 150,
    },
    thickness: 0.8,
    color: border,
  });

  page.drawText(
    "COMPLETION DATE",
    {
      x: 130,
      y: 122,
      size: 9,
      font: bold,
      color: muted,
    }
  );

  page.drawText(
    completionDate,
    {
      x: 130,
      y: 98,
      size: 12,
      font: bold,
      color: dark,
    }
  );

  const certificateBlockX = 560;

  page.drawText(
    "CERTIFICATE ID",
    {
      x: certificateBlockX,
      y: 122,
      size: 9,
      font: bold,
      color: muted,
    }
  );

  page.drawText(
    certificate.certificate_number,
    {
      x: certificateBlockX,
      y: 98,
      size: 11,
      font: bold,
      color: dark,
    }
  );

  /*
   * Public certificate verification QR code.
   */
  const qrSize = 72;
  const qrX = (width - qrSize) / 2;
  const qrY = 78;

  page.drawImage(qrImage, {
    x: qrX,
    y: qrY,
    width: qrSize,
    height: qrSize,
  });

  const verifyLabel = "SCAN TO VERIFY";
  const verifyLabelSize = 6.5;

  const verifyLabelWidth =
    bold.widthOfTextAtSize(
      verifyLabel,
      verifyLabelSize
    );

  page.drawText(verifyLabel, {
    x: (width - verifyLabelWidth) / 2,
    y: 67,
    size: verifyLabelSize,
    font: bold,
    color: muted,
  });

  drawCenteredText(
    page,
    "Issued by WebAIgen Academy upon successful completion of the course requirements.",
    48,
    regular,
    9,
    muted
  );

  const pdfBytes =
    await pdf.save();

  const safeCertificateNumber =
    certificate.certificate_number.replace(
      /[^A-Za-z0-9_-]/g,
      ""
    );

  return new Response(
    new Uint8Array(pdfBytes),
    {
      status: 200,
      headers: {
        "Content-Type":
          "application/pdf",
        "Content-Disposition":
          `attachment; filename="WebAIgen-Certificate-${safeCertificateNumber}.pdf"`,
        "Cache-Control":
          "private, no-store",
      },
    }
  );
}