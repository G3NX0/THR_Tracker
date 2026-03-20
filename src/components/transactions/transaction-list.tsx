import { Pencil, ReceiptText, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Transaction } from "@/types/transaction";
import { formatTypeLabel } from "@/utils/categories";
import { formatCurrencyIDR } from "@/utils/currency";
import { formatDateID } from "@/utils/date";

interface TransactionListProps {
  transactions: Transaction[];
  isMutating: boolean;
  onEdit: (transaction: Transaction) => void;
  onDelete: (transaction: Transaction) => void;
}

function EmptyState() {
  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center gap-2 py-10 text-center">
        <div className="rounded-full bg-emerald-100 p-2 text-emerald-700">
          <ReceiptText className="h-4 w-4" />
        </div>
        <p className="text-sm font-medium text-emerald-900">Belum ada transaksi.</p>
        <p className="max-w-sm text-sm text-emerald-700">
          Tambahkan transaksi pertama agar ringkasan THR Anda langsung terbentuk.
        </p>
      </CardContent>
    </Card>
  );
}

export function TransactionList({
  transactions,
  isMutating,
  onEdit,
  onDelete,
}: TransactionListProps) {
  if (transactions.length === 0) {
    return <EmptyState />;
  }

  return (
    <section className="space-y-4">
      <div className="md:hidden">
        <div className="mb-2 rounded-xl border border-emerald-100 bg-emerald-50/70 px-3 py-2.5">
          <p className="text-sm font-semibold text-emerald-900">Transaksi Terbaru</p>
          <p className="mt-0.5 text-xs text-emerald-700">
            Kelola pemasukan dan pengeluaran kamu dengan cepat.
          </p>
          <div className="mt-2 flex items-center justify-between text-[11px] uppercase tracking-wide text-emerald-700/80">
            <span>Nama & tanggal</span>
            <span>Nominal</span>
            <span>Aksi</span>
          </div>
        </div>

        <div className="space-y-3">
          {transactions.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <CardContent className="space-y-3 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="break-words text-sm font-semibold text-emerald-950">
                      {item.name}
                    </p>
                    <p className="mt-0.5 text-xs text-emerald-700">{formatDateID(item.date)}</p>
                  </div>
                  <Badge variant={item.type}>{formatTypeLabel(item.type)}</Badge>
                </div>

                <div className="rounded-xl bg-emerald-50 px-3 py-2">
                  <p className="text-xs text-emerald-700">Nominal</p>
                  <p className="text-base font-semibold text-emerald-900">
                    {formatCurrencyIDR(item.amount)}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <Button
                    variant="outline"
                    className="h-10"
                    onClick={() => onEdit(item)}
                    disabled={isMutating}
                  >
                    <Pencil className="h-4 w-4" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    className="h-10"
                    onClick={() => onDelete(item)}
                    disabled={isMutating}
                  >
                    <Trash2 className="h-4 w-4" />
                    Hapus
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="hidden overflow-x-auto rounded-2xl border border-emerald-100 bg-white shadow-sm md:block">
        <table className="min-w-full text-sm">
          <thead className="bg-emerald-50/70 text-left text-xs uppercase tracking-wide text-emerald-700">
            <tr>
              <th className="px-4 py-3 font-semibold">Tanggal</th>
              <th className="px-4 py-3 font-semibold">Jenis</th>
              <th className="px-4 py-3 font-semibold">Nama</th>
              <th className="px-4 py-3 font-semibold">Kategori</th>
              <th className="px-4 py-3 font-semibold">Nominal</th>
              <th className="px-4 py-3 font-semibold">Catatan</th>
              <th className="px-4 py-3 font-semibold text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((item) => (
              <tr key={item.id} className="border-t border-emerald-100/80">
                <td className="px-4 py-3 text-emerald-800">{formatDateID(item.date)}</td>
                <td className="px-4 py-3">
                  <Badge variant={item.type}>{formatTypeLabel(item.type)}</Badge>
                </td>
                <td className="px-4 py-3 font-medium text-emerald-950">{item.name}</td>
                <td className="px-4 py-3 capitalize text-emerald-800">{item.category}</td>
                <td className="px-4 py-3 font-semibold text-emerald-900">
                  {formatCurrencyIDR(item.amount)}
                </td>
                <td className="max-w-64 break-words px-4 py-3 text-emerald-700">
                  {item.notes ? item.notes : "-"}
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(item)}
                      disabled={isMutating}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onDelete(item)}
                      disabled={isMutating}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Hapus
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
