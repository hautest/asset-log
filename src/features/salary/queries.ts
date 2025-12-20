import { db } from "@/shared/db/db";
import { salary } from "@/shared/db/schema";
import { eq, and, gte, lte, desc, asc } from "drizzle-orm";
import { getSession } from "@/shared/auth/getSession";

export interface SalaryData {
  id: string;
  year: number;
  amount: number;
  memo: string | null;
  growthRate: number | null;
}

export async function getSalariesByRange(
  startYear: number,
  endYear: number
): Promise<SalaryData[]> {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }

  const userId = session.user.id;

  const previousYearSalary = await db
    .select()
    .from(salary)
    .where(
      and(eq(salary.userId, userId), eq(salary.year, startYear - 1))
    )
    .limit(1);

  const salaries = await db
    .select()
    .from(salary)
    .where(
      and(
        eq(salary.userId, userId),
        gte(salary.year, startYear),
        lte(salary.year, endYear)
      )
    )
    .orderBy(asc(salary.year));

  const salaryMap = new Map(salaries.map((s) => [s.year, s]));

  const result: SalaryData[] = [];

  for (let year = startYear; year <= endYear; year++) {
    const currentSalary = salaryMap.get(year);
    const prevYear = year - 1;
    const prevSalary =
      prevYear === startYear - 1
        ? previousYearSalary[0]
        : salaryMap.get(prevYear);

    let growthRate: number | null = null;

    if (currentSalary && prevSalary && prevSalary.amount > 0) {
      growthRate =
        ((currentSalary.amount - prevSalary.amount) / prevSalary.amount) * 100;
    }

    if (currentSalary) {
      result.push({
        id: currentSalary.id,
        year: currentSalary.year,
        amount: currentSalary.amount,
        memo: currentSalary.memo,
        growthRate,
      });
    } else {
      result.push({
        id: "",
        year,
        amount: 0,
        memo: null,
        growthRate: null,
      });
    }
  }

  return result;
}

export async function getLatestSalary(): Promise<{
  amount: number;
  year: number;
  growthRate: number | null;
} | null> {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }

  const userId = session.user.id;

  const salaries = await db
    .select()
    .from(salary)
    .where(eq(salary.userId, userId))
    .orderBy(desc(salary.year))
    .limit(2);

  if (salaries.length === 0 || !salaries[0]) {
    return null;
  }

  const latest = salaries[0];
  const previous = salaries[1];

  let growthRate: number | null = null;
  if (previous && previous.amount > 0) {
    growthRate = ((latest.amount - previous.amount) / previous.amount) * 100;
  }

  return {
    amount: latest.amount,
    year: latest.year,
    growthRate,
  };
}

const queryKey = ["salaries"];
getSalariesByRange.queryKey = queryKey;
getLatestSalary.queryKey = queryKey;
