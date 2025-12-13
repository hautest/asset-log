"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/shared/ui/button";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";
import { useRouter } from "waku";

interface YearSelectorProps {
  selectedYear: number;
}

export function YearSelector({ selectedYear }: YearSelectorProps) {
  const currentYear = new Date().getFullYear();
  const startYear = 2020;
  const endYear = currentYear + 5;
  const selectedYearRef = useRef<HTMLButtonElement>(null);

  const router = useRouter();

  const years = Array.from(
    { length: endYear - startYear + 1 },
    (_, i) => startYear + i
  );

  useEffect(() => {
    if (selectedYearRef.current) {
      selectedYearRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, []);

  const handleYearChange = (year: number) => {
    router.push(`/dashboard?year=${year}`);
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="icon"
        onClick={() => handleYearChange(selectedYear - 1)}
        disabled={selectedYear <= startYear}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="gap-2">
            <Calendar className="h-4 w-4" />
            {selectedYear}년
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-3" align="center">
          <div className="grid max-h-[300px] grid-cols-3 gap-2 overflow-y-auto">
            {years.map((year) => (
              <Button
                key={year}
                ref={year === selectedYear ? selectedYearRef : null}
                variant={year === selectedYear ? "default" : "outline"}
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
        onClick={() => handleYearChange(selectedYear + 1)}
        disabled={selectedYear >= endYear}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
