import { LogOut, MoonStar, WalletCards } from "lucide-react";

import { Button } from "@/components/ui/button";

interface AppHeaderProps {
  userEmail: string;
  onAddTransaction: () => void;
  onLogout: () => void;
  isSigningOut: boolean;
}

export function AppHeader({
  userEmail,
  onAddTransaction,
  onLogout,
  isSigningOut,
}: AppHeaderProps) {
  return (
    <header className="rounded-3xl border border-emerald-200/70 bg-gradient-to-br from-emerald-600 via-emerald-700 to-emerald-900 p-5 text-white shadow-lg sm:p-7">
      <div className="flex flex-col gap-5">
        <div className="space-y-2">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-emerald-50">
            <MoonStar className="h-3.5 w-3.5" />
            Lebaran Finance Tracker
          </p>
          <h1 className="text-xl font-semibold tracking-tight sm:text-3xl">
            THR Tracker
          </h1>
          <p className="max-w-xl text-sm text-emerald-100 sm:text-base">
            Catat THR masuk dan pengeluaran Lebaran dalam satu dashboard yang cepat.
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p
            className="max-w-full truncate rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs text-emerald-50 sm:max-w-[20rem]"
            title={userEmail}
          >
            Login sebagai <span className="font-semibold">{userEmail}</span>
          </p>

          <div className="grid w-full grid-cols-2 gap-2 self-start sm:flex sm:w-auto sm:flex-wrap sm:self-auto">
            <Button
              onClick={onAddTransaction}
              className="w-full bg-white text-emerald-700 hover:bg-emerald-50 sm:w-auto"
            >
              <WalletCards className="h-4 w-4" />
              Tambah
            </Button>
            <Button
              variant="outline"
              onClick={onLogout}
              disabled={isSigningOut}
              className="w-full border-white/30 bg-white/10 text-white hover:bg-white/20 sm:w-auto"
            >
              <LogOut className="h-4 w-4" />
              {isSigningOut ? "Keluar..." : "Logout"}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
