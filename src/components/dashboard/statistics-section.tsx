"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { CategoryTotal } from "@/lib/statistics";
import type { Transaction } from "@/types/transaction";
import { formatCurrencyIDR } from "@/utils/currency";

interface StatisticsSectionProps {
  expenseByCategory: CategoryTotal[];
  topIncoming: Transaction[];
  topOutgoing: Transaction[];
}

export function StatisticsSection({
  expenseByCategory,
  topIncoming,
  topOutgoing,
}: StatisticsSectionProps) {
  return (
    <section className="grid gap-4 lg:grid-cols-5">
      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle>Pengeluaran per Kategori</CardTitle>
        </CardHeader>
        <CardContent>
          {expenseByCategory.length === 0 ? (
            <p className="text-sm text-emerald-700">
              Belum ada data pengeluaran untuk ditampilkan.
            </p>
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={expenseByCategory} margin={{ left: 0, right: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#d1fae5" />
                  <XAxis
                    dataKey="category"
                    tick={{ fill: "#065f46", fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: "#065f46", fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(value: number) =>
                      value >= 1_000_000 ? `${(value / 1_000_000).toFixed(1)}jt` : `${value / 1_000}k`
                    }
                  />
                  <Tooltip
                    cursor={{ fill: "#ecfdf5" }}
                    formatter={(value) => formatCurrencyIDR(Number(value ?? 0))}
                  />
                  <Bar dataKey="total" fill="#059669" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>THR Masuk Terbesar</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {topIncoming.length === 0 ? (
            <p className="text-sm text-emerald-700">Belum ada transaksi masuk.</p>
          ) : (
            topIncoming.map((item, index) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-xl bg-emerald-50 px-3 py-2"
              >
                <p className="text-sm font-medium text-emerald-900">
                  {index + 1}. {item.name}
                </p>
                <p className="text-sm font-semibold text-emerald-700">
                  {formatCurrencyIDR(item.amount)}
                </p>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Pengeluaran Terbesar</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {topOutgoing.length === 0 ? (
            <p className="text-sm text-emerald-700">Belum ada transaksi keluar.</p>
          ) : (
            topOutgoing.map((item, index) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-xl bg-amber-50 px-3 py-2"
              >
                <p className="text-sm font-medium text-emerald-900">
                  {index + 1}. {item.name}
                </p>
                <p className="text-sm font-semibold text-amber-700">
                  {formatCurrencyIDR(item.amount)}
                </p>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </section>
  );
}
