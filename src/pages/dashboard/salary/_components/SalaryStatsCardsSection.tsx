import { getLatestSalary } from "@/features/salary/queries";
import { SalaryStatsCards } from "./SalaryStatsCards";
import { Card, CardContent, CardHeader } from "@/shared/ui/card";
import { Skeleton } from "@/shared/ui/skeleton";

async function SalaryStatsCardsSection() {
  const latestSalary = await getLatestSalary();

  return (
    <SalaryStatsCards
      currentSalary={latestSalary?.amount ?? null}
      currentYear={latestSalary?.year ?? null}
      growthRate={latestSalary?.growthRate ?? null}
    />
  );
}

function SalaryStatsCardsSkeleton() {
  return (
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
  );
}

SalaryStatsCardsSection.Skeleton = SalaryStatsCardsSkeleton;

export { SalaryStatsCardsSection };
