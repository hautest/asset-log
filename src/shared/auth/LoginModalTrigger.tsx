"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useLoginModal } from "./useLoginModal";

export function LoginModalTrigger() {
  const searchParams = useSearchParams();
  const { openModal, isLoggedIn } = useLoginModal();

  useEffect(() => {
    if (searchParams.get("login") === "true" && !isLoggedIn) {
      openModal();
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, [searchParams, isLoggedIn, openModal]);

  return null;
}
