"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { PortfolioFormDialog } from "./PortfolioFormDialog";
import { AuthButton } from "@/shared/auth/AuthButton";

export function CreatePortfolioButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <AuthButton onClick={() => setOpen(true)}>
        <Plus className="mr-2 h-4 w-4" />
        새 포트폴리오
      </AuthButton>
      <PortfolioFormDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
