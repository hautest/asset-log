import "../styles.css";

import type { ReactNode } from "react";
import { unstable_getContext } from "waku/server";
import { unstable_redirect } from "waku/router/server";

import { DefaultMeta } from "../shared/components/DefaultMeta";
import { Toaster } from "../shared/ui/sonner";
import { getIsLogginIn } from "../shared/auth/getSession";

// 인증 없이 접근 가능한 경로
const PUBLIC_PATHS = ["/", "/login"];

const isPublicPath = (pathname: string) => {
  return PUBLIC_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );
};

type RootLayoutProps = { children: ReactNode };

export default async function RootLayout({ children }: RootLayoutProps) {
  const context = unstable_getContext();
  const currentPath = new URL(context.req.url).pathname;

  const isLoggedIn = await getIsLogginIn();

  // 인증되지 않은 사용자가 보호된 경로 접근 시 홈으로 리다이렉트
  if (!isLoggedIn && !isPublicPath(currentPath)) {
    unstable_redirect("/");
  }

  return (
    <div className="font-sans antialiased">
      <DefaultMeta />
      {children}
      <Toaster />
    </div>
  );
}

export const getConfig = async () => {
  return {
    render: "dynamic",
  } as const;
};
