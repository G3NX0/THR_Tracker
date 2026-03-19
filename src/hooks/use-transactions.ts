"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import {
  createTransaction,
  deleteTransaction,
  getTransactions,
  updateTransaction,
} from "@/lib/transactions";
import type { Transaction, TransactionInput } from "@/types/transaction";

function sortByNewest(items: Transaction[]) {
  return [...items].sort((a, b) => {
    if (a.date !== b.date) {
      return a.date < b.date ? 1 : -1;
    }

    return a.created_at < b.created_at ? 1 : -1;
  });
}

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await getTransactions();
      setTransactions(sortByNewest(data));
    } catch (err) {
      const message = err instanceof Error ? err.message : "Gagal memuat transaksi.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const add = useCallback(async (payload: TransactionInput) => {
    setIsMutating(true);
    try {
      const created = await createTransaction(payload);
      setTransactions((prev) => sortByNewest([created, ...prev]));
      return created;
    } finally {
      setIsMutating(false);
    }
  }, []);

  const edit = useCallback(async (id: string, payload: TransactionInput) => {
    setIsMutating(true);
    try {
      const updated = await updateTransaction(id, payload);
      setTransactions((prev) =>
        sortByNewest(prev.map((item) => (item.id === id ? updated : item))),
      );
      return updated;
    } finally {
      setIsMutating(false);
    }
  }, []);

  const remove = useCallback(async (id: string) => {
    setIsMutating(true);
    try {
      await deleteTransaction(id);
      setTransactions((prev) => prev.filter((item) => item.id !== id));
    } finally {
      setIsMutating(false);
    }
  }, []);

  return useMemo(
    () => ({
      transactions,
      isLoading,
      isMutating,
      error,
      refresh,
      add,
      edit,
      remove,
    }),
    [transactions, isLoading, isMutating, error, refresh, add, edit, remove],
  );
}
