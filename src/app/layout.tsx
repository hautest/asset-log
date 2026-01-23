import type { ReactNode } from "react";
import { Suspense } from "react";
import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Toaster } from "@/shared/ui/sonner";
import { getIsLoggedIn } from "@/shared/auth/getSession";
import { AuthInitializer } from "@/shared/auth/AuthInitializer";
import { LoginModal } from "@/shared/auth/LoginModal";
import { LoginModalTrigger } from "@/shared/auth/LoginModalTrigger";

const SITE_URL = "https://asset-log.org";
const SITE_NAME = "자산로그";
const DEFAULT_DESCRIPTION =
  "마이데이터가 못 잡는 숨은 자산까지 포함한 전체 자산을 차트로 시각화. 전세 보증금, 코인, 해외 자산 등 모든 자산을 한눈에 관리하세요.";
const DEFAULT_KEYWORDS =
  "자산관리, 자산로그, 자산추적, 재테크, 자산현황, 포트폴리오, 전세보증금, 코인, 주식, 부동산";

export const metadata: Metadata = {
  title: {
    default: `${SITE_NAME} - 모든 자산을 한눈에`,
    template: `%s | ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  keywords: DEFAULT_KEYWORDS,
  authors: [{ name: SITE_NAME }],
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} - 모든 자산을 한눈에`,
    description: DEFAULT_DESCRIPTION,
    images: [
      {
        url: `${SITE_URL}/images/og-image.png`,
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} - 모든 자산을 한눈에`,
    description: DEFAULT_DESCRIPTION,
    images: [`${SITE_URL}/images/og-image.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  icons: {
    icon: "/images/favicon.png",
    apple: "/images/favicon.png",
  },
  metadataBase: new URL(SITE_URL),
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#059669",
};

interface RootLayoutProps {
  children: ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
  const isLoggedIn = await getIsLoggedIn();

  return (
    <html lang="ko">
      <body className="font-sans antialiased">
        <AuthInitializer isLoggedIn={isLoggedIn} />
        {children}
        <LoginModal />
        <Suspense fallback={null}>
          <LoginModalTrigger />
        </Suspense>
        <Toaster />
      </body>
    </html>
  );
}
