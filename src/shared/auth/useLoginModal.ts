"use client";

import { useAtom } from "jotai";
import { useCallback } from "react";
import { loginModalOpenAtom, isLoggedInAtom } from "./loginModalAtom";

export function useLoginModal() {
  const [isOpen, setIsOpen] = useAtom(loginModalOpenAtom);
  const [isLoggedIn] = useAtom(isLoggedInAtom);

  const openModal = useCallback(() => setIsOpen(true), [setIsOpen]);
  const closeModal = useCallback(() => setIsOpen(false), [setIsOpen]);

  const requireAuth = useCallback(
    (callback: () => void) => {
      if (!isLoggedIn) {
        openModal();
        return;
      }
      callback();
    },
    [isLoggedIn, openModal]
  );

  return {
    isOpen,
    isLoggedIn,
    openModal,
    closeModal,
    requireAuth,
  };
}
