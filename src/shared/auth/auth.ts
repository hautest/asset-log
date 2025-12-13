import { betterAuth, BetterAuthPlugin } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../db/db";
import { createAuthMiddleware } from "better-auth/api";
import { unstable_getContextData } from "waku/server";
import { category } from "../db/schema";
import { nanoid } from "nanoid";
import { eq } from "drizzle-orm";

const BETTER_AUTH_SECRET = process.env.BETTER_AUTH_SECRET;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

if (!BETTER_AUTH_SECRET) {
  throw new Error("BETTER_AUTH_SECRET is not defined");
}

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
  throw new Error("GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET must be defined");
}

const DEFAULT_CATEGORIES = [
  { name: "주식", color: "hsl(220 70% 50%)", sortOrder: 0 },
  { name: "현금", color: "hsl(142 71% 45%)", sortOrder: 1 },
  { name: "코인", color: "hsl(280 87% 65%)", sortOrder: 2 },
];

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
  hooks: {
    after: createAuthMiddleware(async (ctx) => {
      if (ctx.path === "/callback/:id") {
        const newSession = ctx.context.newSession;

        if (newSession?.user) {
          const userId = newSession.user.id;

          // 이미 카테고리가 있는지 확인
          const existingCategories = await db
            .select()
            .from(category)
            .where(eq(category.userId, userId))
            .limit(1);

          // 카테고리가 없으면 기본 카테고리 생성 (= 새 사용자)
          if (existingCategories.length === 0) {
            console.log("Creating default categories for new user:", userId);
            await Promise.all(
              DEFAULT_CATEGORIES.map((cat) =>
                db.insert(category).values({
                  id: nanoid(),
                  userId,
                  name: cat.name,
                  color: cat.color,
                  isDefault: true,
                  sortOrder: cat.sortOrder,
                })
              )
            );
          }
        }
      }
    }),
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
