import type { MetadataRoute } from "next";
import { readdirSync, statSync } from "fs";
import { join } from "path";
import { db } from "@/shared/db/db";
import { portfolio, monthlySnapshot } from "@/shared/db/schema";
import { desc } from "drizzle-orm";

const SITE_URL = "https://asset-log.org";
const APP_DIR = join(process.cwd(), "src/app");

// noindex 페이지들 (sitemap에서 제외)
const EXCLUDED_ROUTES = ["/dashboard/my", "/api"];

// 동적 라우트 패턴들 (별도 처리)
const DYNAMIC_ROUTE_PATTERNS = ["[yearMonth]", "[id]"];

function discoverRoutes(dir: string, basePath = ""): string[] {
  const routes: string[] = [];

  try {
    const entries = readdirSync(dir);

    for (const entry of entries) {
      const fullPath = join(dir, entry);
      const stat = statSync(fullPath);

      if (stat.isDirectory()) {
        // _components, api 등 제외
        if (entry.startsWith("_") || entry === "api") continue;

        // 동적 라우트는 건너뜀 (별도 처리)
        if (DYNAMIC_ROUTE_PATTERNS.some((p) => entry.includes(p))) continue;

        const newBasePath = `${basePath}/${entry}`;
        routes.push(...discoverRoutes(fullPath, newBasePath));
      } else if (entry === "page.tsx") {
        // page.tsx 발견 시 라우트 추가
        const route = basePath || "/";
        if (!EXCLUDED_ROUTES.some((ex) => route.startsWith(ex))) {
          routes.push(route);
        }
      }
    }
  } catch {
    // 에러 무시
  }

  return routes;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const currentDate = new Date().toISOString();

  // 파일 시스템에서 정적 라우트 자동 감지
  const staticRoutes = discoverRoutes(APP_DIR);

  const staticPages: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: currentDate,
    changeFrequency: "weekly" as const,
    priority: route === "/" ? 1 : 0.8,
  }));

  // 동적 라우트: 포트폴리오
  const portfolios = await db
    .select({ id: portfolio.id, updatedAt: portfolio.updatedAt })
    .from(portfolio);

  const portfolioPages: MetadataRoute.Sitemap = portfolios.map((p) => ({
    url: `${SITE_URL}/dashboard/portfolio/${p.id}`,
    lastModified: p.updatedAt?.toISOString() || currentDate,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // 동적 라우트: 월별 자산
  const yearMonths = await db
    .selectDistinct({ yearMonth: monthlySnapshot.yearMonth })
    .from(monthlySnapshot)
    .orderBy(desc(monthlySnapshot.yearMonth));

  const assetPages: MetadataRoute.Sitemap = yearMonths.map((a) => ({
    url: `${SITE_URL}/dashboard/monthly/assets/${a.yearMonth}`,
    lastModified: currentDate,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...portfolioPages, ...assetPages];
}
