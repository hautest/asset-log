"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/shared/ui/button";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";
import { useRouter } from "next/navigation";

interface YearSelectorProps {
  selectedYear: number;
}

const START_YEAR = 2020;
const YEARS_PER_PAGE = 12;

export function YearSelector({ selectedYear }: YearSelectorProps) {
  const currentYear = new Date().getFullYear();
  const endYear = currentYear;

  const [isOpen, setIsOpen] = useState(false);
  const [displayYear, setDisplayYear] = useState(selectedYear);
  const [pageStartYear, setPageStartYear] = useState(() => {
    const page = Math.floor((selectedYear - START_YEAR) / YEARS_PER_PAGE);
    return START_YEAR + page * YEARS_PER_PAGE;
  });

  const selectedYearRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();

  const years = Array.from({ length: YEARS_PER_PAGE }, (_, i) => {
    const year = pageStartYear + i;
    return year <= endYear ? year : null;
  }).filter((year): year is number => year !== null);

  useEffect(() => {
    setDisplayYear(selectedYear);
    const page = Math.floor((selectedYear - START_YEAR) / YEARS_PER_PAGE);
    setPageStartYear(START_YEAR + page * YEARS_PER_PAGE);
  }, [selectedYear]);

  useEffect(() => {
    if (isOpen && selectedYearRef.current) {
      selectedYearRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [isOpen]);

  const handleYearChange = (year: number) => {
    if (year < START_YEAR || year > endYear) return;
    setDisplayYear(year);
    setIsOpen(false);
    router.push(`/dashboard/monthly?year=${year}`);
  };

  const handlePrevYear = () => {
    const newYear = displayYear - 1;
    if (newYear < START_YEAR) return;
    setDisplayYear(newYear);

    if (newYear < pageStartYear) {
      setPageStartYear(pageStartYear - YEARS_PER_PAGE);
    }

    if (!isOpen) {
      router.push(`/dashboard/monthly?year=${newYear}`);
    }
  };

  const handleNextYear = () => {
    const newYear = displayYear + 1;
    if (newYear > endYear) return;
    setDisplayYear(newYear);

    if (newYear >= pageStartYear + YEARS_PER_PAGE) {
      setPageStartYear(pageStartYear + YEARS_PER_PAGE);
    }

    if (!isOpen) {
      router.push(`/dashboard/monthly?year=${newYear}`);
    }
  };

  const handlePrevPage = () => {
    const newStartYear = pageStartYear - YEARS_PER_PAGE;
    if (newStartYear >= START_YEAR) {
      setPageStartYear(newStartYear);
    }
  };

  const handleNextPage = () => {
    const newStartYear = pageStartYear + YEARS_PER_PAGE;
    if (newStartYear <= endYear) {
      setPageStartYear(newStartYear);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open && displayYear !== selectedYear) {
      router.push(`/dashboard/monthly?year=${displayYear}`);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="icon"
        onClick={handlePrevYear}
        disabled={displayYear <= START_YEAR}
        aria-label="이전 연도"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <Popover open={isOpen} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="gap-2">
            <Calendar className="h-4 w-4" />
            {displayYear}년
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-3" align="center">
          <div className="mb-3 flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePrevPage}
              disabled={pageStartYear <= START_YEAR}
              aria-label="이전 연도 페이지"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium">
              {pageStartYear} - {Math.min(pageStartYear + YEARS_PER_PAGE - 1, endYear)}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleNextPage}
              disabled={pageStartYear + YEARS_PER_PAGE > endYear}
              aria-label="다음 연도 페이지"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {years.map((year) => (
              <Button
                key={year}
                ref={year === displayYear ? selectedYearRef : null}
                variant={year === displayYear ? "default" : "outline"}
                size="sm"
                onClick={() => handleYearChange(year)}
                className="w-20"
              >
                {year}
              </Button>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      <Button
        variant="outline"
        size="icon"
        onClick={handleNextYear}
        disabled={displayYear >= endYear}
        aria-label="다음 연도"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
