"use client";

import { useState } from "react";
import { Button } from "@/shared/ui/button";
import { Plus } from "lucide-react";
import { PortfolioFormDialog } from "./PortfolioFormDialog";

export function CreatePortfolioButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus className="mr-2 h-4 w-4" />
        새 포트폴리오
      </Button>
      <PortfolioFormDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
