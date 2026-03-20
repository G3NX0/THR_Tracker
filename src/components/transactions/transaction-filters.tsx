import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

interface TransactionFiltersProps {
  type: "all" | "masuk" | "keluar";
  onTypeChange: (value: "all" | "masuk" | "keluar") => void;
  category: "all" | string;
  onCategoryChange: (value: "all" | string) => void;
  search: string;
  onSearchChange: (value: string) => void;
  categories: string[];
}

export function TransactionFilters({
  type,
  onTypeChange,
  category,
  onCategoryChange,
  search,
  onSearchChange,
  categories,
}: TransactionFiltersProps) {
  return (
    <section className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap gap-2">
        <Button
          variant={type === "all" ? "default" : "outline"}
          size="sm"
          className="min-w-[84px] flex-1 sm:min-w-[92px] sm:flex-none"
          onClick={() => onTypeChange("all")}
        >
          Semua
        </Button>
        <Button
          variant={type === "masuk" ? "default" : "outline"}
          size="sm"
          className="min-w-[84px] flex-1 sm:min-w-[92px] sm:flex-none"
          onClick={() => onTypeChange("masuk")}
        >
          Masuk
        </Button>
        <Button
          variant={type === "keluar" ? "default" : "outline"}
          size="sm"
          className="min-w-[84px] flex-1 sm:min-w-[92px] sm:flex-none"
          onClick={() => onTypeChange("keluar")}
        >
          Keluar
        </Button>
      </div>

      <div className="mt-3 grid gap-3 md:grid-cols-[minmax(0,1fr)_240px]">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-400" />
          <Input
            placeholder="Cari nama pihak atau catatan..."
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            className="pl-9"
          />
        </div>

        <Select
          value={category}
          onChange={(event) => onCategoryChange(event.target.value)}
        >
          <option value="all">Semua kategori</option>
          {categories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </Select>
      </div>
    </section>
  );
}
