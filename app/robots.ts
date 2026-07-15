import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/app/lib/siteUrl";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/dashboard"],
    },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
