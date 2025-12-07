const THEME_COLOR = "#059669";
const FAVICON = "/images/favicon.png";

export function DefaultMeta() {
  return (
    <>
      {/* 기본 메타 태그 */}
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="theme-color" content={THEME_COLOR} />
      <meta name="googlebot" content="index, follow" />

      {/* 파비콘 */}
      <link rel="icon" type="image/png" href={FAVICON} />
      <link rel="apple-touch-icon" href={FAVICON} />

      {/* 언어 설정 */}
      <meta httpEquiv="content-language" content="ko" />
    </>
  );
}
