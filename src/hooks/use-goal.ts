"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { deleteGoal, getGoal, upsertGoal } from "@/lib/goals";
import type { Goal, GoalInput } from "@/types/goal";

export function useGoal() {
  const [goal, setGoal] = useState<Goal | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await getGoal();
      setGoal(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Gagal memuat goal THR.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const save = useCallback(async (payload: GoalInput) => {
    setIsMutating(true);
    try {
      const saved = await upsertGoal(payload);
      setGoal(saved);
      return saved;
    } finally {
      setIsMutating(false);
    }
  }, []);

  const remove = useCallback(async () => {
    if (!goal) {
      return;
    }

    setIsMutating(true);
    try {
      await deleteGoal(goal.id);
      setGoal(null);
    } finally {
      setIsMutating(false);
    }
  }, [goal]);

  return useMemo(
    () => ({
      goal,
      isLoading,
      isMutating,
      error,
      refresh,
      save,
      remove,
    }),
    [goal, isLoading, isMutating, error, refresh, save, remove],
  );
}
