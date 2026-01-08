import { headers } from "next/headers";
import { auth } from "./auth";

export const getSession = async () => {
  const headersList = await headers();
  const session = await auth.api.getSession({
    headers: headersList,
  });
  return session;
};

export const getIsLoggedIn = async () => {
  const session = await getSession();
  return session !== null;
};
