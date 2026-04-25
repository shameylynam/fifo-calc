import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://fifocalculator.net"
).replace(/\/$/, "");
const lastModified = new Date(
  process.env.BUILD_DATE ?? "2025-01-01T00:00:00.000Z",
);

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteUrl,
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${siteUrl}/how-it-works`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/privacy-policy`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${siteUrl}/terms-of-use`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
