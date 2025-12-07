import { unstable_getContext } from "waku/server";
import { auth } from "./auth";

export const getSession = async () => {
  const session = await auth.api.getSession({
    headers: new Headers(unstable_getContext().req.headers),
  });
  return session;
};
