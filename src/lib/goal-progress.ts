import type { Goal, GoalStatus } from "@/types/goal";

export interface GoalProgress {
  progressPercentage: number;
  status: GoalStatus;
  remainingAmount: number;
}

export function calculateGoalProgress(goal: Goal, saldo: number): GoalProgress {
  const rawProgress = (saldo / goal.target_amount) * 100;
  const progressPercentage = Math.max(0, Math.min(rawProgress, 100));

  let status: GoalStatus = "sedang-dicapai";
  if (saldo <= 0) {
    status = "belum-mulai";
  }
  if (progressPercentage >= 100) {
    status = "tercapai";
  }

  return {
    progressPercentage,
    status,
    remainingAmount: Math.max(goal.target_amount - Math.max(saldo, 0), 0),
  };
}

export function formatGoalStatus(status: GoalStatus) {
  if (status === "belum-mulai") {
    return "Belum Mulai";
  }

  if (status === "tercapai") {
    return "Tercapai";
  }

  return "Sedang Dicapai";
}
