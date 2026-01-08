import { getSalariesByRange, getLatestSalary } from "@/features/salary/queries";
import { Card, CardContent, CardHeader } from "@/shared/ui/card";
import { Skeleton } from "@/shared/ui/skeleton";
import { SalaryPageContent } from "./SalaryPageContent";

interface SalaryChartSectionProps {
  startYear: number;
}

async function SalaryChartSection({ startYear }: SalaryChartSectionProps) {
  const endYear = startYear + 4;

  const [salaries, latestSalary] = await Promise.all([
    getSalariesByRange(startYear, endYear),
    getLatestSalary(),
  ]);

  return (
    <SalaryPageContent
      startYear={startYear}
      endYear={endYear}
      salaries={salaries}
      latestSalary={
        latestSalary
          ? {
              amount: latestSalary.amount,
              year: latestSalary.year,
              growthRate: latestSalary.growthRate,
            }
          : null
      }
    />
  );
}

function SalaryChartSectionSkeleton() {
  return (
    <>
      <div className="mb-8 grid gap-6 md:grid-cols-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-32" />
              <Skeleton className="mt-2 h-3 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
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
    </>
  );
}

SalaryChartSection.Skeleton = SalaryChartSectionSkeleton;

export { SalaryChartSection };
