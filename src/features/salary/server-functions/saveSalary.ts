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

  return result[0];
}
