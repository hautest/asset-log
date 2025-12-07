import "../styles.css";

import type { ReactNode } from "react";
import { unstable_getContext } from "waku/server";
import { unstable_redirect } from "waku/router/server";

import { Toaster } from "../shared/ui/sonner";
import { getSession, getIsLogginIn } from "../shared/auth/getSession";

// 인증 없이 접근 가능한 경로
const PUBLIC_PATHS = ["/", "/login"];

const isPublicPath = (pathname: string) => {
  return PUBLIC_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );
};

type RootLayoutProps = { children: ReactNode };

export default async function RootLayout({ children }: RootLayoutProps) {
  const data = await getData();
  const context = unstable_getContext();
  const currentPath = new URL(context.req.url).pathname;

  const isLoggedIn = await getIsLogginIn();

  // 인증되지 않은 사용자가 보호된 경로 접근 시 홈으로 리다이렉트
  if (!isLoggedIn && !isPublicPath(currentPath)) {
    unstable_redirect("/");
  }

  return (
    <div className="font-sans antialiased">
      <meta name="description" content={data.description} />
      <link rel="icon" type="image/png" href={data.icon} />
      {children}
      <Toaster />
    </div>
  );
}

const getData = async () => {
  const data = {
    description: "An internet website!",
    icon: "/images/favicon.png",
  };

  return data;
};

export const getConfig = async () => {
  return {
    render: "dynamic",
  } as const;
};
