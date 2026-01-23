import type { MetadataRoute } from "next";
import { readdirSync, statSync } from "fs";
import { join } from "path";

const SITE_URL = "https://asset-log.org";
const APP_DIR = join(process.cwd(), "src/app");

// noindex 페이지들 (sitemap에서 제외)
// 동적 라우트([id], [yearMonth])는 사용자별 개인 데이터이므로 sitemap에 포함하지 않음
const EXCLUDED_ROUTES = ["/dashboard/my", "/api"];

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

        // 동적 라우트([id], [yearMonth])는 사용자별 개인 데이터이므로 제외
        if (entry.startsWith("[") && entry.endsWith("]")) continue;

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

export default function sitemap(): MetadataRoute.Sitemap {
  const currentDate = new Date().toISOString();

  // 파일 시스템에서 정적 라우트 자동 감지
  const staticRoutes = discoverRoutes(APP_DIR);

  return staticRoutes.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: currentDate,
    changeFrequency: "weekly" as const,
    priority: route === "/" ? 1 : 0.8,
  }));
}
