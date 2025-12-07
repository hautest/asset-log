import { MiddlewareHandler } from "hono";
import { getSessionCookie } from "better-auth/cookies";
import { unstable_getContextData } from "waku/server";
import { auth } from "@/shared/auth/auth";

export const authMiddleware = (): MiddlewareHandler => {
  return async (c, next) => {
    const url = new URL(c.req.url);

    // /api/auth/* 요청은 better-auth handler로 처리
    if (url.pathname.startsWith("/api/auth")) {
      return auth.handler(c.req.raw);
    }

    const sessionCookie = getSessionCookie(c.req.raw);

    // THIS IS NOT SECURE!
    // This is the recommended approach to optimistically redirect users
    // We recommend handling auth checks in each page/route
    if (!sessionCookie && url.pathname !== "/") {
      if (!url.pathname.endsWith(".txt")) {
        // Currently RSC requests end in .txt and don't handle redirect responses
        // The redirect needs to be encoded in the React flight stream somehow
        // There is some functionality in Waku to do this from a server component
        // but not from middleware.
        // return c.redirect("/");
      }
    }

    // TODO possible to inspect ctx.req.url and not do this on every request
    // Or skip starting the promise here and just invoke from server components and functions
    await auth.api.getSession({
      headers: c.req.raw.headers,
    });

    await next();

    const contextData = unstable_getContextData();
    if (contextData && contextData.betterAuthSetCookie) {
      c.header("set-cookie", contextData.betterAuthSetCookie as string, {
        append: true,
      });
    }
  };
};
