"use client";

import { forwardRef, ComponentProps, MouseEvent } from "react";
import Link from "next/link";
import { useLoginModal } from "./useLoginModal";

interface AuthLinkProps extends ComponentProps<typeof Link> {
  requireAuth?: boolean;
}

export const AuthLink = forwardRef<HTMLAnchorElement, AuthLinkProps>(
  ({ requireAuth = true, onClick, children, ...props }, ref) => {
    const { isLoggedIn, openModal } = useLoginModal();

    const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
      if (requireAuth && !isLoggedIn) {
        e.preventDefault();
        openModal();
        return;
      }
      onClick?.(e);
    };

    return (
      <Link ref={ref} onClick={handleClick} {...props}>
        {children}
      </Link>
    );
  }
);

AuthLink.displayName = "AuthLink";
