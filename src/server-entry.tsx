import { contextStorage } from "hono/context-storage";
import { fsRouter } from "waku";
import adapter from "waku/adapters/default";
import { authMiddleware } from "./middleware/auth";

export default adapter(
  fsRouter(import.meta.glob("./**/*.{ts,tsx}", { base: "./pages" })),
  { middlewareFns: [contextStorage, authMiddleware] }
);
