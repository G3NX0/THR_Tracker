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
      <div className="overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-emerald-50/70 text-left text-xs uppercase tracking-wide text-emerald-700">
            <tr>
              <th className="px-3 py-3 font-semibold md:hidden">Info</th>
              <th className="hidden px-4 py-3 font-semibold md:table-cell">Tanggal</th>
              <th className="hidden px-4 py-3 font-semibold md:table-cell">Jenis</th>
              <th className="hidden px-4 py-3 font-semibold md:table-cell">Nama</th>
              <th className="hidden px-4 py-3 font-semibold md:table-cell">Kategori</th>
              <th className="px-3 py-3 font-semibold text-right md:px-4 md:text-left">
                Nominal
              </th>
              <th className="hidden px-4 py-3 font-semibold md:table-cell">Catatan</th>
              <th className="px-3 py-3 font-semibold text-right md:px-4">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((item) => (
              <tr key={item.id} className="border-t border-emerald-100/80">
                <td className="px-3 py-3 md:hidden">
                  <div className="min-w-0">
                    <p className="break-words font-medium text-emerald-950">{item.name}</p>
                    <div className="mt-1 flex items-center gap-2">
                      <p className="text-xs text-emerald-700">{formatDateID(item.date)}</p>
                      <Badge variant={item.type}>{formatTypeLabel(item.type)}</Badge>
                    </div>
                  </div>
                </td>
                <td className="hidden px-4 py-3 text-emerald-800 md:table-cell">
                  {formatDateID(item.date)}
                </td>
                <td className="hidden px-4 py-3 md:table-cell">
                  <Badge variant={item.type}>{formatTypeLabel(item.type)}</Badge>
                </td>
                <td className="hidden px-4 py-3 font-medium text-emerald-950 md:table-cell">
                  {item.name}
                </td>
                <td className="hidden px-4 py-3 capitalize text-emerald-800 md:table-cell">
                  {item.category}
                </td>
                <td className="px-3 py-3 text-right md:px-4 md:text-left">
                  <p className="text-[15px] font-semibold text-emerald-900 md:text-sm">
                    {formatCurrencyIDR(item.amount)}
                  </p>
                </td>
                <td className="hidden max-w-64 break-words px-4 py-3 text-emerald-700 md:table-cell">
                  {item.notes ? item.notes : "-"}
                </td>
                <td className="px-3 py-3 md:px-4">
                  <div className="grid grid-cols-2 gap-1.5 md:flex md:justify-end md:gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(item)}
                      disabled={isMutating}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      <span className="hidden min-[420px]:inline md:inline">Edit</span>
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onDelete(item)}
                      disabled={isMutating}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span className="hidden min-[420px]:inline md:inline">Hapus</span>
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
