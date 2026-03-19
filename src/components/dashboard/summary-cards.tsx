import { ArrowDownCircle, ArrowUpCircle, Landmark, ReceiptText } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { SummaryData } from "@/lib/statistics";
import { formatCurrencyIDR } from "@/utils/currency";

interface SummaryCardsProps {
  summary: SummaryData;
}

const summaryItems = [
  {
    key: "totalMasuk",
    label: "Total THR Masuk",
    icon: ArrowDownCircle,
    valueClassName: "text-emerald-700",
  },
  {
    key: "totalKeluar",
    label: "Total THR Keluar",
    icon: ArrowUpCircle,
    valueClassName: "text-amber-700",
  },
  {
    key: "saldo",
    label: "Sisa Saldo THR",
    icon: Landmark,
    valueClassName: "text-emerald-900",
  },
  {
    key: "totalTransaksi",
    label: "Jumlah Transaksi",
    icon: ReceiptText,
    valueClassName: "text-emerald-900",
  },
] as const;

export function SummaryCards({ summary }: SummaryCardsProps) {
  return (
    <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {summaryItems.map((item) => {
        const Icon = item.icon;
        const value = summary[item.key];
        const formattedValue =
          item.key === "totalTransaksi"
            ? `${value} transaksi`
            : formatCurrencyIDR(value as number);

        return (
          <Card key={item.key}>
            <CardHeader className="flex flex-row items-center justify-between pb-1">
              <CardTitle>{item.label}</CardTitle>
              <Icon className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <p className={`text-lg font-semibold sm:text-xl ${item.valueClassName}`}>
                {formattedValue}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </section>
  );
}
