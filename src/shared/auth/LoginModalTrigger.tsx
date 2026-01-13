"use client";

import { useEffect } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useLoginModal } from "./useLoginModal";

export function LoginModalTrigger() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const { openModal, isLoggedIn } = useLoginModal();

  useEffect(() => {
    if (searchParams.get("login") === "true" && !isLoggedIn) {
      openModal();
      router.replace(pathname);
    }
  }, [searchParams, isLoggedIn, openModal, pathname, router]);

  return null;
}
