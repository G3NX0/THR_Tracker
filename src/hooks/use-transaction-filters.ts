"use client";

import { useMemo, useState } from "react";

import type { Transaction } from "@/types/transaction";
import { getAllCategories } from "@/utils/categories";

export function useTransactionFilters(transactions: Transaction[]) {
  const [type, setType] = useState<"all" | "masuk" | "keluar">("all");
  const [category, setCategory] = useState<"all" | string>("all");
  const [search, setSearch] = useState("");

  const categoryOptions = useMemo(() => {
    const base = getAllCategories();
    const extras = transactions.map((item) => item.category);
    return Array.from(new Set([...base, ...extras])).sort((a, b) =>
      a.localeCompare(b, "id-ID"),
    );
  }, [transactions]);

  const filtered = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return transactions.filter((item) => {
      if (type !== "all" && item.type !== type) {
        return false;
      }

      if (category !== "all" && item.category !== category) {
        return false;
      }

      if (!searchValue) {
        return true;
      }

      return (
        item.name.toLowerCase().includes(searchValue) ||
        item.notes?.toLowerCase().includes(searchValue)
      );
    });
  }, [transactions, type, category, search]);

  return {
    type,
    setType,
    category,
    setCategory,
    search,
    setSearch,
    categoryOptions,
    filtered,
  };
}
