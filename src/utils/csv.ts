import type { Transaction } from "@/types/transaction";

function escapeCsv(value: string | number | null | undefined) {
  if (value === null || value === undefined) {
    return "";
  }

  const stringValue = String(value).replaceAll('"', '""');
  return `"${stringValue}"`;
}

export function exportTransactionsToCsv(transactions: Transaction[]) {
  const headers = [
    "Tanggal",
    "Jenis",
    "Nama",
    "Kategori",
    "Nominal",
    "Catatan",
  ];

  const lines = transactions.map((item) =>
    [item.date, item.type, item.name, item.category, item.amount, item.notes ?? ""]
      .map(escapeCsv)
      .join(","),
  );

  const csv = [headers.join(","), ...lines].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `thr-transactions-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
