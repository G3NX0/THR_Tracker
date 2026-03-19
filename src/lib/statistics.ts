import type { Transaction, TransactionType } from "@/types/transaction";

export interface SummaryData {
  totalMasuk: number;
  totalKeluar: number;
  saldo: number;
  totalTransaksi: number;
  transaksiMasukTerbesar: number;
  transaksiKeluarTerbesar: number;
}

export interface CategoryTotal {
  category: string;
  total: number;
}

export function calculateSummary(transactions: Transaction[]): SummaryData {
  const totalMasuk = transactions
    .filter((item) => item.type === "masuk")
    .reduce((sum, item) => sum + item.amount, 0);

  const totalKeluar = transactions
    .filter((item) => item.type === "keluar")
    .reduce((sum, item) => sum + item.amount, 0);

  const transaksiMasukTerbesar = Math.max(
    0,
    ...transactions
      .filter((item) => item.type === "masuk")
      .map((item) => item.amount),
  );

  const transaksiKeluarTerbesar = Math.max(
    0,
    ...transactions
      .filter((item) => item.type === "keluar")
      .map((item) => item.amount),
  );

  return {
    totalMasuk,
    totalKeluar,
    saldo: totalMasuk - totalKeluar,
    totalTransaksi: transactions.length,
    transaksiMasukTerbesar,
    transaksiKeluarTerbesar,
  };
}

export function getExpenseByCategory(transactions: Transaction[]): CategoryTotal[] {
  const totals = new Map<string, number>();

  transactions
    .filter((item) => item.type === "keluar")
    .forEach((item) => {
      totals.set(item.category, (totals.get(item.category) ?? 0) + item.amount);
    });

  return Array.from(totals.entries())
    .map(([category, total]) => ({ category, total }))
    .sort((a, b) => b.total - a.total);
}

export function getTopTransactions(
  transactions: Transaction[],
  type: TransactionType,
  limit = 5,
): Transaction[] {
  return [...transactions]
    .filter((item) => item.type === type)
    .sort((a, b) => b.amount - a.amount)
    .slice(0, limit);
}
