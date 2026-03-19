"use client";

import { useEffect, useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  transactionFormSchema,
  type TransactionFormValues,
} from "@/lib/validation";
import type { Transaction } from "@/types/transaction";
import { getCategoriesByType } from "@/utils/categories";
import { toDateInputValue } from "@/utils/date";

interface TransactionFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Transaction | null;
  isSubmitting: boolean;
  onSubmit: (values: TransactionFormValues) => Promise<void>;
}

const quickAmountOptions = [50_000, 100_000, 200_000, 500_000];

function getDefaultValues(): TransactionFormValues {
  return {
    type: "masuk",
    date: toDateInputValue(),
    name: "",
    category: "keluarga",
    amount: 0,
    notes: "",
  };
}

export function TransactionFormDialog({
  open,
  onOpenChange,
  initialData,
  isSubmitting,
  onSubmit,
}: TransactionFormDialogProps) {
  const isEditMode = Boolean(initialData);

  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: getDefaultValues(),
  });

  useEffect(() => {
    if (!open) {
      return;
    }

    if (initialData) {
      form.reset({
        type: initialData.type,
        date: initialData.date,
        name: initialData.name,
        category: initialData.category,
        amount: initialData.amount,
        notes: initialData.notes ?? "",
      });
      return;
    }

    form.reset(getDefaultValues());
  }, [open, initialData, form]);

  const selectedType = useWatch({
    control: form.control,
    name: "type",
  });

  const categoryOptions = useMemo(
    () => getCategoriesByType(selectedType ?? "masuk"),
    [selectedType],
  );

  useEffect(() => {
    const currentCategory = form.getValues("category");
    if (!categoryOptions.includes(currentCategory as never)) {
      form.setValue("category", categoryOptions[0], { shouldValidate: true });
    }
  }, [categoryOptions, form]);

  const handleSubmit = form.handleSubmit(async (values) => {
    await onSubmit(values);
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Edit Transaksi" : "Tambah Transaksi"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Perbarui data transaksi THR Anda."
              : "Input transaksi THR masuk atau keluar dengan cepat."}
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="type">Jenis Transaksi</Label>
              <Select id="type" {...form.register("type")}> 
                <option value="masuk">Masuk</option>
                <option value="keluar">Keluar</option>
              </Select>
              {form.formState.errors.type ? (
                <p className="text-xs text-rose-600">
                  {form.formState.errors.type.message}
                </p>
              ) : null}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="date">Tanggal</Label>
              <Input id="date" type="date" {...form.register("date")} />
              {form.formState.errors.date ? (
                <p className="text-xs text-rose-600">
                  {form.formState.errors.date.message}
                </p>
              ) : null}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="name">Nama Pihak / Tujuan</Label>
            <Input
              id="name"
              placeholder="Contoh: Om Joko atau Beli kue lebaran"
              {...form.register("name")}
            />
            {form.formState.errors.name ? (
              <p className="text-xs text-rose-600">
                {form.formState.errors.name.message}
              </p>
            ) : null}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="category">Kategori</Label>
              <Select id="category" {...form.register("category")}>
                {categoryOptions.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </Select>
              {form.formState.errors.category ? (
                <p className="text-xs text-rose-600">
                  {form.formState.errors.category.message}
                </p>
              ) : null}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="amount">Nominal (IDR)</Label>
              <Input
                id="amount"
                type="number"
                min={1}
                step={1000}
                placeholder="Contoh: 150000"
                {...form.register("amount", { valueAsNumber: true })}
              />
              {form.formState.errors.amount ? (
                <p className="text-xs text-rose-600">
                  {form.formState.errors.amount.message}
                </p>
              ) : null}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {quickAmountOptions.map((amount) => (
              <Button
                key={amount}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => form.setValue("amount", amount, { shouldValidate: true })}
              >
                {`Rp${amount.toLocaleString("id-ID")}`}
              </Button>
            ))}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="notes">Catatan (Opsional)</Label>
            <Textarea
              id="notes"
              rows={3}
              placeholder="Contoh: Belanja untuk ketupat dan kue kering"
              {...form.register("notes")}
            />
            {form.formState.errors.notes ? (
              <p className="text-xs text-rose-600">
                {form.formState.errors.notes.message}
              </p>
            ) : null}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Batal
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? "Menyimpan..."
                : isEditMode
                  ? "Simpan Perubahan"
                  : "Tambah Transaksi"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
