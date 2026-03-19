import { MoonStar, WalletCards } from "lucide-react";

import { Button } from "@/components/ui/button";

interface AppHeaderProps {
  onAddTransaction: () => void;
}

export function AppHeader({ onAddTransaction }: AppHeaderProps) {
  return (
    <header className="rounded-3xl border border-emerald-200/70 bg-gradient-to-br from-emerald-600 via-emerald-700 to-emerald-900 p-5 text-white shadow-lg sm:p-7">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-emerald-50">
            <MoonStar className="h-3.5 w-3.5" />
            Lebaran Finance Tracker
          </p>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            THR Tracker
          </h1>
          <p className="max-w-xl text-sm text-emerald-100 sm:text-base">
            Catat THR masuk dan pengeluaran Lebaran dalam satu dashboard yang cepat.
          </p>
        </div>

        <Button
          onClick={onAddTransaction}
          className="shrink-0 bg-white text-emerald-700 hover:bg-emerald-50"
        >
          <WalletCards className="h-4 w-4" />
          Tambah
        </Button>
      </div>
    </header>
  );
}
