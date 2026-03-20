import { formatCurrencyIDR } from "@/utils/currency";

export const MIN_GOAL_TARGET_AMOUNT = 1_000;

export const DEFAULT_GOAL_TARGET_AMOUNT = 100_000;

export const QUICK_GOAL_TARGET_AMOUNTS = [
  100_000,
  250_000,
  500_000,
  1_000_000,
  2_000_000,
] as const;

export const MIN_GOAL_TARGET_AMOUNT_LABEL = formatCurrencyIDR(
  MIN_GOAL_TARGET_AMOUNT,
);
