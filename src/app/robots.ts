import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/dashboard/my"],
    },
    sitemap: "https://asset-log.org/sitemap.xml",
  };
}
