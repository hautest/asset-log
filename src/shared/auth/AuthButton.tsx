"use client";

import { forwardRef, ComponentProps, MouseEvent } from "react";
import { Button } from "@/shared/ui/button";
import { useLoginModal } from "./useLoginModal";

interface AuthButtonProps extends ComponentProps<typeof Button> {
  requireAuth?: boolean;
}

export const AuthButton = forwardRef<HTMLButtonElement, AuthButtonProps>(
  ({ requireAuth = true, onClick, ...props }, ref) => {
    const { isLoggedIn, openModal } = useLoginModal();

    const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
      if (requireAuth && !isLoggedIn) {
        e.preventDefault();
        openModal();
        return;
      }
      onClick?.(e);
    };

    return <Button ref={ref} onClick={handleClick} {...props} />;
  }
);

AuthButton.displayName = "AuthButton";
