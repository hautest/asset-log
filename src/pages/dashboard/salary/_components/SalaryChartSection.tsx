import { getSalariesByRange } from "@/features/salary/queries";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Skeleton } from "@/shared/ui/skeleton";
import { SalaryPageContent } from "./SalaryPageContent";

interface SalaryChartSectionProps {
  startYear: number;
}

async function SalaryChartSection({ startYear }: SalaryChartSectionProps) {
  const endYear = startYear + 4;

  const salaries = await getSalariesByRange(startYear, endYear);

  return (
    <SalaryPageContent
      startYear={startYear}
      endYear={endYear}
      salaries={salaries}
    />
  );
}

function SalaryChartSectionSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Skeleton className="h-6 w-32" />
          <Skeleton className="mt-2 h-4 w-48" />
        </div>
        <Skeleton className="h-10 w-32" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-[300px] w-full" />
        <div className="flex justify-center pt-6">
          <Skeleton className="h-11 w-48" />
        </div>
      </CardContent>
    </Card>
  );
}

SalaryChartSection.Skeleton = SalaryChartSectionSkeleton;

export { SalaryChartSection };
