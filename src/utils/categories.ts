import {
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
  type TransactionType,
} from "@/types/transaction";

export function getCategoriesByType(type: TransactionType) {
  return type === "masuk" ? [...INCOME_CATEGORIES] : [...EXPENSE_CATEGORIES];
}

export function getAllCategories() {
  return Array.from(new Set([...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES]));
}

export function formatTypeLabel(type: TransactionType) {
  return type === "masuk" ? "Masuk" : "Keluar";
}
