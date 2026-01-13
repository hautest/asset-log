"use client";

import { useHydrateAtoms } from "jotai/utils";
import { isLoggedInAtom } from "./loginModalAtom";

interface AuthInitializerProps {
  isLoggedIn: boolean;
}

export function AuthInitializer({ isLoggedIn }: AuthInitializerProps) {
  useHydrateAtoms([[isLoggedInAtom, isLoggedIn]]);
  return null;
}
