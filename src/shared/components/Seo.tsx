const SITE_URL = "https://assetlog.kr";
const SITE_NAME = "자산로그";
const DEFAULT_DESCRIPTION =
  "마이데이터가 못 잡는 숨은 자산까지 포함한 전체 자산을 차트로 시각화. 전세 보증금, 코인, 해외 자산 등 모든 자산을 한눈에 관리하세요.";
const DEFAULT_KEYWORDS =
  "자산관리, 자산로그, 자산추적, 재테크, 자산현황, 포트폴리오, 전세보증금, 코인, 주식, 부동산";

interface SeoProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogType?: "website" | "article";
  canonicalUrl?: string;
  noIndex?: boolean;
}

export function Seo({
  title,
  description = DEFAULT_DESCRIPTION,
  keywords = DEFAULT_KEYWORDS,
  ogImage = `${SITE_URL}/images/og-image.png`,
  ogType = "website",
  canonicalUrl = SITE_URL,
  noIndex = false,
}: SeoProps) {
  const pageTitle = title
    ? `${title} | ${SITE_NAME}`
    : `${SITE_NAME} - 모든 자산을 한눈에`;

  return (
    <>
      {/* 페이지 타이틀 */}
      <title>{pageTitle}</title>

      {/* 기본 메타 태그 */}
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={SITE_NAME} />
      <meta
        name="robots"
        content={noIndex ? "noindex, nofollow" : "index, follow"}
      />

      {/* Open Graph 메타 태그 */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="ko_KR" />

      {/* Twitter Card 메타 태그 */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />
    </>
  );
}
