"use client";

import { useMemo, useState } from "react";
import { SearchX } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { AppHeader } from "@/components/dashboard/app-header";
import { GoalFormDialog } from "@/components/dashboard/goal-form-dialog";
import { GoalThrSection } from "@/components/dashboard/goal-thr-section";
import { StatisticsSection } from "@/components/dashboard/statistics-section";
import { SummaryCards } from "@/components/dashboard/summary-cards";
import { useGoal } from "@/hooks/use-goal";
import { TransactionFilters } from "@/components/transactions/transaction-filters";
import { TransactionFormDialog } from "@/components/transactions/transaction-form-dialog";
import { TransactionList } from "@/components/transactions/transaction-list";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useTransactionFilters } from "@/hooks/use-transaction-filters";
import { useTransactions } from "@/hooks/use-transactions";
import {
  calculateSummary,
  getExpenseByCategory,
  getTopTransactions,
} from "@/lib/statistics";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import type { GoalFormValues, TransactionFormValues } from "@/lib/validation";
import { type Transaction } from "@/types/transaction";
import { formatCurrencyIDR } from "@/utils/currency";
import { exportTransactionsToCsv } from "@/utils/csv";

interface ThrTrackerAppProps {
  userEmail: string;
}

function LoadingState() {
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-28 rounded-2xl" />
        ))}
      </div>
      <Skeleton className="h-56 rounded-2xl" />
      <Skeleton className="h-24 rounded-2xl" />
      <Skeleton className="h-80 rounded-2xl" />
    </div>
  );
}

export function ThrTrackerApp({ userEmail }: ThrTrackerAppProps) {
  const router = useRouter();
  const { transactions, isLoading, isMutating, error, refresh, add, edit, remove } =
    useTransactions();
  const {
    goal,
    isLoading: isGoalLoading,
    isMutating: isGoalMutating,
    error: goalError,
    refresh: refreshGoal,
    save: saveGoal,
    remove: removeGoal,
  } = useGoal();

  const [formOpen, setFormOpen] = useState(false);
  const [goalFormOpen, setGoalFormOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [pendingDeleteTransaction, setPendingDeleteTransaction] =
    useState<Transaction | null>(null);
  const [isGoalDeleteConfirmOpen, setIsGoalDeleteConfirmOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);

  const {
    type,
    setType,
    category,
    setCategory,
    search,
    setSearch,
    categoryOptions,
    filtered,
  } = useTransactionFilters(transactions);

  const summary = useMemo(() => calculateSummary(transactions), [transactions]);
  const expenseByCategory = useMemo(
    () => getExpenseByCategory(transactions),
    [transactions],
  );
  const topIncoming = useMemo(
    () => getTopTransactions(transactions, "masuk", 5),
    [transactions],
  );
  const topOutgoing = useMemo(
    () => getTopTransactions(transactions, "keluar", 5),
    [transactions],
  );

  const handleOpenCreate = () => {
    setEditingTransaction(null);
    setFormOpen(true);
  };

  const handleOpenEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setFormOpen(true);
  };

  const handleOpenGoalDialog = () => {
    setGoalFormOpen(true);
  };

  const handleFormSubmit = async (values: TransactionFormValues) => {
    try {
      if (editingTransaction) {
        await edit(editingTransaction.id, values);
        toast.success("Transaksi berhasil diperbarui.");
      } else {
        await add(values);
        toast.success("Transaksi berhasil ditambahkan.");
      }

      setFormOpen(false);
      setEditingTransaction(null);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Terjadi kesalahan saat menyimpan.";
      toast.error(message);
      throw err;
    }
  };

  const handleDelete = async (transaction: Transaction) => {
    setPendingDeleteTransaction(transaction);
  };

  const confirmDeleteTransaction = async () => {
    if (!pendingDeleteTransaction) {
      return;
    }
    try {
      await remove(pendingDeleteTransaction.id);
      toast.success("Transaksi berhasil dihapus.");
      setPendingDeleteTransaction(null);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Terjadi kesalahan saat menghapus.";
      toast.error(message);
    }
  };

  const handleGoalSubmit = async (values: GoalFormValues) => {
    try {
      await saveGoal(values);
      toast.success("Goal THR berhasil disimpan.");
      setGoalFormOpen(false);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Terjadi kesalahan saat menyimpan goal.";
      toast.error(message);
      throw error;
    }
  };

  const handleGoalDelete = async () => {
    if (!goal) {
      return;
    }

    try {
      await removeGoal();
      toast.success("Goal THR berhasil direset.");
      setIsGoalDeleteConfirmOpen(false);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Terjadi kesalahan saat menghapus goal.";
      toast.error(message);
    }
  };

  const handleLogout = async () => {
    setIsSigningOut(true);
    try {
      const supabase = getSupabaseBrowserClient();
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }

      toast.success("Anda sudah logout.");
      router.replace("/login");
      router.refresh();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Gagal logout.";
      toast.error(message);
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-4 overflow-x-clip px-3 py-4 sm:gap-5 sm:px-6 sm:py-6 lg:py-8">
      <AppHeader
        userEmail={userEmail}
        onAddTransaction={handleOpenCreate}
        onLogout={handleLogout}
        isSigningOut={isSigningOut}
      />

      {isLoading ? (
        <LoadingState />
      ) : error ? (
        <Card>
          <CardContent className="space-y-3 py-10 text-center">
            <p className="text-sm font-semibold text-rose-700">Gagal memuat data</p>
            <p className="text-sm text-emerald-800">{error}</p>
            <div className="flex justify-center">
              <Button onClick={() => void refresh()}>Coba Lagi</Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <SummaryCards summary={summary} />

          <GoalThrSection
            goal={goal}
            saldo={summary.saldo}
            isLoading={isGoalLoading}
            isMutating={isGoalMutating}
            error={goalError}
            onCreate={handleOpenGoalDialog}
            onEdit={handleOpenGoalDialog}
            onDelete={() => setIsGoalDeleteConfirmOpen(true)}
            onRetry={() => void refreshGoal()}
          />

          <TransactionFilters
            type={type}
            onTypeChange={setType}
            category={category}
            onCategoryChange={setCategory}
            search={search}
            onSearchChange={setSearch}
            categories={categoryOptions}
          />

          <section className="space-y-3">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-lg font-semibold text-emerald-950">Riwayat Transaksi</h2>
              <div className="grid w-full grid-cols-1 gap-2 min-[430px]:grid-cols-2 sm:flex sm:w-auto sm:flex-wrap">
                <Button
                  variant="outline"
                  onClick={() => exportTransactionsToCsv(filtered)}
                  disabled={filtered.length === 0}
                  className="w-full sm:w-auto"
                >
                  Export CSV
                </Button>
                <Button onClick={handleOpenCreate} className="w-full sm:w-auto">
                  Tambah Transaksi
                </Button>
              </div>
            </div>
            {filtered.length === 0 && transactions.length > 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center gap-2 py-8 text-center">
                  <div className="rounded-full bg-emerald-100 p-2 text-emerald-600">
                    <SearchX className="h-4 w-4" />
                  </div>
                  <p className="text-sm font-medium text-emerald-900">
                    Tidak ada transaksi yang cocok
                  </p>
                  <p className="text-sm text-emerald-700">
                    Coba ubah filter atau kata pencarian untuk melihat data lain.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <TransactionList
                transactions={filtered}
                onEdit={handleOpenEdit}
                onDelete={(item) => void handleDelete(item)}
                isMutating={isMutating}
              />
            )}
          </section>

          <StatisticsSection
            expenseByCategory={expenseByCategory}
            topIncoming={topIncoming}
            topOutgoing={topOutgoing}
          />
        </>
      )}

      <TransactionFormDialog
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) {
            setEditingTransaction(null);
          }
        }}
        initialData={editingTransaction}
        isSubmitting={isMutating}
        onSubmit={handleFormSubmit}
      />

      <GoalFormDialog
        open={goalFormOpen}
        onOpenChange={setGoalFormOpen}
        initialData={goal}
        isSubmitting={isGoalMutating}
        onSubmit={handleGoalSubmit}
      />

      <Dialog
        open={Boolean(pendingDeleteTransaction)}
        onOpenChange={(open) => {
          if (!open) {
            setPendingDeleteTransaction(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Hapus transaksi?</DialogTitle>
            <DialogDescription>
              {pendingDeleteTransaction ? (
                <>
                  Transaksi <span className="font-semibold">{pendingDeleteTransaction.name}</span>{" "}
                  sebesar{" "}
                  <span className="font-semibold">
                    {formatCurrencyIDR(pendingDeleteTransaction.amount)}
                  </span>{" "}
                  akan dihapus permanen.
                </>
              ) : (
                "Transaksi ini akan dihapus permanen."
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="pt-2">
            <Button
              variant="outline"
              onClick={() => setPendingDeleteTransaction(null)}
              disabled={isMutating}
            >
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={() => void confirmDeleteTransaction()}
              disabled={isMutating}
            >
              Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isGoalDeleteConfirmOpen}
        onOpenChange={setIsGoalDeleteConfirmOpen}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reset Goal THR?</DialogTitle>
            <DialogDescription>
              {goal ? (
                <>
                  Goal <span className="font-semibold">{goal.title}</span> akan dihapus dari
                  dashboard.
                </>
              ) : (
                "Goal akan dihapus dari dashboard."
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="pt-2">
            <Button
              variant="outline"
              onClick={() => setIsGoalDeleteConfirmOpen(false)}
              disabled={isGoalMutating}
            >
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={() => void handleGoalDelete()}
              disabled={isGoalMutating}
            >
              Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
