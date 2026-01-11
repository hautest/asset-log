"use client";

import { authClient } from "@/shared/auth/authClient";
import { Button } from "@/shared/ui/button";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();
  const handleLogout = async () => {
    const { error } = await authClient.signOut();
    if (!error) {
      router.replace("/");
    }
  };

  return (
    <Button onClick={handleLogout} variant="outline" size="sm">
      <LogOut className="mr-2 h-4 w-4" />
      로그아웃
    </Button>
  );
}
