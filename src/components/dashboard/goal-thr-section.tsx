import { CheckCircle2, Flag, Target } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { calculateGoalProgress, formatGoalStatus } from "@/lib/goal-progress";
import type { Goal } from "@/types/goal";
import { formatCurrencyIDR } from "@/utils/currency";

interface GoalThrSectionProps {
  goal: Goal | null;
  saldo: number;
  isLoading: boolean;
  isMutating: boolean;
  error: string | null;
  onCreate: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onRetry: () => void;
}

function GoalLoadingState() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base sm:text-lg">Goal THR</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 pt-2">
        <div className="h-3 w-36 animate-pulse rounded bg-emerald-100" />
        <div className="h-2.5 w-full animate-pulse rounded-full bg-emerald-100" />
      </CardContent>
    </Card>
  );
}

export function GoalThrSection({
  goal,
  saldo,
  isLoading,
  isMutating,
  error,
  onCreate,
  onEdit,
  onDelete,
  onRetry,
}: GoalThrSectionProps) {
  const isSchemaMissing = Boolean(
    error?.toLowerCase().includes("tabel goal thr belum tersedia"),
  );

  if (isLoading) {
    return <GoalLoadingState />;
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg">Goal THR</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 pt-2">
          <p className="text-sm text-rose-700">{error}</p>
          {isSchemaMissing ? (
            <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
              Jalankan SQL migration goals di Supabase, lalu klik <span className="font-semibold">Coba Lagi</span>.
            </div>
          ) : null}
          <Button variant="outline" onClick={onRetry}>
            Coba Lagi
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!goal) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Target className="h-4 w-4 text-emerald-600" />
            Goal THR
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="rounded-2xl border border-dashed border-emerald-200 bg-emerald-50/60 px-4 py-5 text-center">
            <p className="text-sm font-medium text-emerald-900">Belum ada goal aktif</p>
            <p className="mt-1 text-sm text-emerald-700">
              Tentukan target supaya progres saldo THR lebih terarah.
            </p>
            <div className="mt-4">
              <Button onClick={onCreate} className="w-full sm:w-auto">
                Buat Goal THR
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const progress = calculateGoalProgress(goal, saldo);

  return (
    <Card>
      <CardHeader className="pb-1">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Flag className="h-4 w-4 text-emerald-600" />
              Goal THR
            </CardTitle>
            <p className="mt-1 text-sm font-medium text-emerald-900">{goal.title}</p>
          </div>

          <Badge
            className={
              progress.status === "tercapai"
                ? "border-emerald-300 bg-emerald-100 text-emerald-800"
                : progress.status === "belum-mulai"
                  ? "border-slate-300 bg-slate-100 text-slate-700"
                  : "border-amber-300 bg-amber-100 text-amber-800"
            }
          >
            {progress.status === "tercapai" ? <CheckCircle2 className="mr-1 h-3.5 w-3.5" /> : null}
            {formatGoalStatus(progress.status)}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3.5 pt-2">
        <div className="grid gap-2.5 text-sm sm:grid-cols-3">
          <div className="rounded-xl bg-emerald-50 px-3 py-2">
            <p className="text-xs text-emerald-700">Target Goal</p>
            <p className="font-semibold text-emerald-900">{formatCurrencyIDR(goal.target_amount)}</p>
          </div>
          <div className="rounded-xl bg-emerald-50 px-3 py-2">
            <p className="text-xs text-emerald-700">Saldo Saat Ini</p>
            <p className="font-semibold text-emerald-900">{formatCurrencyIDR(saldo)}</p>
          </div>
          <div className="rounded-xl bg-emerald-50 px-3 py-2">
            <p className="text-xs text-emerald-700">Sisa ke Target</p>
            <p className="font-semibold text-emerald-900">
              {formatCurrencyIDR(progress.remainingAmount)}
            </p>
          </div>
        </div>

        <div className="space-y-1.5 rounded-xl bg-emerald-50/70 px-3 py-2.5">
          <div className="flex items-center justify-between text-xs text-emerald-700">
            <p>Progress Goal</p>
            <p className="font-semibold text-emerald-900">
              {Math.round(progress.progressPercentage)}%
            </p>
          </div>

          <div className="h-2.5 w-full rounded-full bg-emerald-100">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 transition-all duration-500"
              style={{ width: `${progress.progressPercentage}%` }}
            />
          </div>
        </div>

        {goal.notes ? (
          <p className="rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
            {goal.notes}
          </p>
        ) : null}

        <div className="grid grid-cols-2 gap-2.5 sm:flex sm:flex-wrap">
          <Button
            variant="outline"
            className="w-full sm:w-auto"
            onClick={onEdit}
            disabled={isMutating}
          >
            Edit Goal
          </Button>
          <Button
            variant="destructive"
            className="w-full sm:w-auto"
            onClick={onDelete}
            disabled={isMutating}
          >
            Reset Goal
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
