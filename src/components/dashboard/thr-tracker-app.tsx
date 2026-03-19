"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";

import { AppHeader } from "@/components/dashboard/app-header";
import { StatisticsSection } from "@/components/dashboard/statistics-section";
import { SummaryCards } from "@/components/dashboard/summary-cards";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useTransactionFilters } from "@/hooks/use-transaction-filters";
import { useTransactions } from "@/hooks/use-transactions";
import {
  calculateSummary,
  getExpenseByCategory,
  getTopTransactions,
} from "@/lib/statistics";
import { type Transaction } from "@/types/transaction";
import { TransactionFilters } from "@/components/transactions/transaction-filters";
import { TransactionFormDialog } from "@/components/transactions/transaction-form-dialog";
import type { TransactionFormValues } from "@/lib/validation";
import { TransactionList } from "@/components/transactions/transaction-list";
import { formatCurrencyIDR } from "@/utils/currency";
import { exportTransactionsToCsv } from "@/utils/csv";

function LoadingState() {
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-28 rounded-2xl" />
        ))}
      </div>
      <Skeleton className="h-24 rounded-2xl" />
      <Skeleton className="h-80 rounded-2xl" />
    </div>
  );
}

export function ThrTrackerApp() {
  const { transactions, isLoading, isMutating, error, refresh, add, edit, remove } =
    useTransactions();

  const [formOpen, setFormOpen] = useState(false);
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
    const shouldDelete = window.confirm(
      `Hapus transaksi \"${transaction.name}\" sebesar ${formatCurrencyIDR(transaction.amount)}?`,
    );

    if (!shouldDelete) {
      return;
    }

    try {
      await remove(transaction.id);
      toast.success("Transaksi berhasil dihapus.");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Terjadi kesalahan saat menghapus.";
      toast.error(message);
    }
  };

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-4 px-4 py-4 sm:gap-5 sm:px-6 sm:py-6 lg:py-8">
      <AppHeader onAddTransaction={handleOpenCreate} />

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
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-lg font-semibold text-emerald-950">Riwayat Transaksi</h2>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => exportTransactionsToCsv(filtered)}
                  disabled={filtered.length === 0}
                >
                  Export CSV
                </Button>
                <Button onClick={handleOpenCreate}>Tambah Transaksi</Button>
              </div>
            </div>
            {filtered.length === 0 && transactions.length > 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-sm text-emerald-700">
                  Tidak ada transaksi yang cocok dengan filter saat ini.
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
    </main>
  );
}
