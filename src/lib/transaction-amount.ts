import { formatCurrencyIDR } from "@/utils/currency";

export const MIN_TRANSACTION_AMOUNT = 1_000;

export const DEFAULT_TRANSACTION_AMOUNT = MIN_TRANSACTION_AMOUNT;

export const QUICK_TRANSACTION_AMOUNTS = [
  MIN_TRANSACTION_AMOUNT,
  10_000,
  50_000,
  100_000,
  200_000,
  500_000,
] as const;

export const MIN_TRANSACTION_AMOUNT_LABEL = formatCurrencyIDR(
  MIN_TRANSACTION_AMOUNT,
);
