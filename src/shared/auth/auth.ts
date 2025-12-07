import { betterAuth, BetterAuthPlugin } from "better-auth";
import { createAuthClient } from "better-auth/client";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../db/db";
import { createAuthMiddleware } from "better-auth/api";
import { unstable_getContextData } from "waku/server";

const BETTER_AUTH_SECRET = process.env.BETTER_AUTH_SECRET;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

if (!BETTER_AUTH_SECRET) {
  throw new Error("BETTER_AUTH_SECRET is not defined");
}

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
  throw new Error("GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET must be defined");
}

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  secret: BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  plugins: [wakuCookies()],
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7일
    updateAge: 60 * 60 * 24, // 1일
  },
  socialProviders: {
    google: {
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
    },
  },
});

export type Session = typeof auth.$Infer.Session.session;
export type User = typeof auth.$Infer.Session.user;

function wakuCookies() {
  return {
    id: "waku-cookies",
    hooks: {
      after: [
        {
          matcher(ctx) {
            return true;
          },
          handler: createAuthMiddleware(async (ctx) => {
            const returned = ctx.context.responseHeaders;
            if ("_flag" in ctx && ctx._flag === "router") {
              return;
            }
            if (returned instanceof Headers) {
              const setCookieHeader = returned?.get("set-cookie");
              if (!setCookieHeader) return;
              const contextData = unstable_getContextData();
              contextData.betterAuthSetCookie = setCookieHeader;
            }
          }),
        },
      ],
    },
  } satisfies BetterAuthPlugin;
}
