"use server";

import { db } from "@/shared/db/db";
import { salary } from "@/shared/db/schema";
import { getSession } from "@/shared/auth/getSession";
import { eq, and } from "drizzle-orm";

interface SaveSalaryInput {
  year: number;
  amount: number;
  memo?: string;
}

export async function saveSalary(input: SaveSalaryInput) {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }

  const userId = session.user.id;
  const { year, amount, memo } = input;

  const result = await db
    .insert(salary)
    .values({
      userId,
      year,
      amount,
      memo: memo ?? null,
    })
    .onConflictDoUpdate({
      target: [salary.userId, salary.year],
      set: {
        amount,
        memo: memo ?? null,
      },
    })
    .returning();

  const saved = result[0];
  if (!saved) {
    throw new Error("Failed to save salary");
  }

  // 직전년도 연봉 조회하여 성장률 계산
  const prevYearSalary = await db
    .select()
    .from(salary)
    .where(and(eq(salary.userId, userId), eq(salary.year, year - 1)))
    .limit(1);

  let growthRate: number | null = null;
  if (prevYearSalary[0] && prevYearSalary[0].amount > 0 && amount > 0) {
    growthRate =
      ((amount - prevYearSalary[0].amount) / prevYearSalary[0].amount) * 100;
  }

  return {
    id: saved.id,
    year: saved.year,
    amount: saved.amount,
    memo: saved.memo,
    growthRate,
  };
}
