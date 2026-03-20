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
import { CircleOff, TrendingDown, TrendingUp } from "lucide-react";

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
  const topExpenseTotal = expenseByCategory[0]?.total ?? 0;

  return (
    <section className="grid gap-4 lg:grid-cols-5">
      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle>Pengeluaran per Kategori</CardTitle>
        </CardHeader>
        <CardContent className="pt-2">
          {expenseByCategory.length === 0 ? (
            <div className="flex flex-col items-center gap-2 rounded-xl bg-emerald-50 px-4 py-6 text-center">
              <CircleOff className="h-4 w-4 text-emerald-500" />
              <p className="text-sm font-medium text-emerald-900">
                Belum ada data pengeluaran
              </p>
              <p className="text-sm text-emerald-700">
                Tambahkan transaksi keluar untuk melihat ringkasan kategori.
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-2.5 md:hidden">
                {expenseByCategory.slice(0, 5).map((item) => {
                  const percentage =
                    topExpenseTotal > 0 ? (item.total / topExpenseTotal) * 100 : 0;

                  return (
                    <div key={item.category} className="space-y-1">
                      <div className="flex items-center justify-between gap-3 text-xs">
                        <p className="truncate font-medium text-emerald-900">{item.category}</p>
                        <p className="shrink-0 text-emerald-700">
                          {formatCurrencyIDR(item.total)}
                        </p>
                      </div>
                      <div className="h-2 rounded-full bg-emerald-100">
                        <div
                          className="h-full rounded-full bg-emerald-500"
                          style={{ width: `${Math.max(6, percentage)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="hidden h-64 md:block">
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
                        value >= 1_000_000
                          ? `${(value / 1_000_000).toFixed(1)}jt`
                          : `${value / 1_000}k`
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
            </>
          )}
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>THR Masuk Terbesar</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2.5 pt-2">
          {topIncoming.length === 0 ? (
            <div className="flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-3 text-sm text-emerald-700">
              <TrendingUp className="h-4 w-4 text-emerald-500" />
              Belum ada transaksi masuk untuk ditampilkan.
            </div>
          ) : (
            topIncoming.map((item, index) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-3 rounded-xl bg-emerald-50 px-3 py-2"
              >
                <p className="min-w-0 pr-3 text-sm font-medium text-emerald-900 break-words">
                  {index + 1}. {item.name}
                </p>
                <p className="shrink-0 text-sm font-semibold text-emerald-700">
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
        <CardContent className="space-y-2.5 pt-2">
          {topOutgoing.length === 0 ? (
            <div className="flex items-center gap-2 rounded-xl bg-amber-50 px-3 py-3 text-sm text-emerald-700">
              <TrendingDown className="h-4 w-4 text-amber-500" />
              Belum ada transaksi keluar untuk ditampilkan.
            </div>
          ) : (
            topOutgoing.map((item, index) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-3 rounded-xl bg-amber-50 px-3 py-2"
              >
                <p className="min-w-0 pr-3 text-sm font-medium text-emerald-900 break-words">
                  {index + 1}. {item.name}
                </p>
                <p className="shrink-0 text-sm font-semibold text-amber-700">
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
