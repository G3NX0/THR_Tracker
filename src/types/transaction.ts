export const TRANSACTION_TYPES = ["masuk", "keluar"] as const;

export type TransactionType = (typeof TRANSACTION_TYPES)[number];

export const INCOME_CATEGORIES = [
  "keluarga",
  "saudara",
  "tetangga",
  "teman",
  "lainnya",
] as const;

export const EXPENSE_CATEGORIES = [
  "belanja",
  "makanan",
  "hadiah",
  "thr keluarga",
  "transport",
  "sedekah",
  "lainnya",
] as const;

export type IncomeCategory = (typeof INCOME_CATEGORIES)[number];
export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number];
export type TransactionCategory = IncomeCategory | ExpenseCategory;

export interface Transaction {
  id: string;
  user_id: string | null;
  type: TransactionType;
  date: string;
  name: string;
  category: string;
  amount: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface TransactionInput {
  type: TransactionType;
  date: string;
  name: string;
  category: string;
  amount: number;
  notes?: string;
}

export interface TransactionFilters {
  type: "all" | TransactionType;
  category: "all" | string;
  search: string;
}
