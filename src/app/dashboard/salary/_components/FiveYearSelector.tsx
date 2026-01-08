"use client";

import { Button } from "@/shared/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

interface FiveYearSelectorProps {
  startYear: number;
}

const MIN_YEAR = 1950;
const YEARS_PER_PAGE = 5;

export function FiveYearSelector({ startYear }: FiveYearSelectorProps) {
  const router = useRouter();
  const currentYear = new Date().getFullYear();
  const endYear = startYear + YEARS_PER_PAGE - 1;

  const maxStartYear = Math.floor(currentYear / YEARS_PER_PAGE) * YEARS_PER_PAGE;

  const handlePrevPage = () => {
    const newStartYear = startYear - YEARS_PER_PAGE;
    if (newStartYear >= MIN_YEAR) {
      router.push(`/dashboard/salary?startYear=${newStartYear}`);
    }
  };

  const handleNextPage = () => {
    const newStartYear = startYear + YEARS_PER_PAGE;
    if (newStartYear <= maxStartYear) {
      router.push(`/dashboard/salary?startYear=${newStartYear}`);
    }
  };

  const canGoPrev = startYear - YEARS_PER_PAGE >= MIN_YEAR;
  const canGoNext = startYear + YEARS_PER_PAGE <= maxStartYear;

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="icon"
        onClick={handlePrevPage}
        disabled={!canGoPrev}
        aria-label="이전 5년"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <div className="min-w-[120px] text-center font-medium">
        {startYear} - {endYear}
      </div>

      <Button
        variant="outline"
        size="icon"
        onClick={handleNextPage}
        disabled={!canGoNext}
        aria-label="다음 5년"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
