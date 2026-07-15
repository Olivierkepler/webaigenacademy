import { serializeJsonLd } from "@/app/lib/seo";

type JsonLdProps = {
  data: Record<string, unknown>;
};

/** Server-only JSON-LD script. One schema object per script tag. */
export default function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
    />
  );
}
