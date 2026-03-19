import { Pencil, Trash2 } from "lucide-react";

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
      <CardContent className="py-10 text-center">
        <p className="text-sm font-medium text-emerald-900">
          Belum ada transaksi.
        </p>
        <p className="mt-1 text-sm text-emerald-700">
          Tambahkan transaksi pertama agar ringkasan THR langsung terbentuk.
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
      <div className="space-y-3 md:hidden">
        {transactions.map((item) => (
          <Card key={item.id}>
            <CardContent className="space-y-3 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-emerald-950">{item.name}</p>
                  <p className="text-xs text-emerald-700">{formatDateID(item.date)}</p>
                </div>
                <Badge variant={item.type}>{formatTypeLabel(item.type)}</Badge>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-xs text-emerald-700">Kategori</p>
                  <p className="font-medium capitalize text-emerald-900">{item.category}</p>
                </div>
                <div>
                  <p className="text-xs text-emerald-700">Nominal</p>
                  <p className="font-semibold text-emerald-900">
                    {formatCurrencyIDR(item.amount)}
                  </p>
                </div>
              </div>

              {item.notes ? (
                <p className="rounded-xl bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
                  {item.notes}
                </p>
              ) : null}

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
            </CardContent>
          </Card>
        ))}
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
                <td className="max-w-64 px-4 py-3 text-emerald-700">
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
