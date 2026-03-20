"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

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
import { Textarea } from "@/components/ui/textarea";
import {
  DEFAULT_GOAL_TARGET_AMOUNT,
  MIN_GOAL_TARGET_AMOUNT,
  MIN_GOAL_TARGET_AMOUNT_LABEL,
  QUICK_GOAL_TARGET_AMOUNTS,
} from "@/lib/goal-amount";
import { goalFormSchema, type GoalFormValues } from "@/lib/validation";
import type { Goal } from "@/types/goal";

interface GoalFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Goal | null;
  isSubmitting: boolean;
  onSubmit: (values: GoalFormValues) => Promise<void>;
}

function getDefaultValues(): GoalFormValues {
  return {
    title: "",
    target_amount: DEFAULT_GOAL_TARGET_AMOUNT,
    notes: "",
  };
}

export function GoalFormDialog({
  open,
  onOpenChange,
  initialData,
  isSubmitting,
  onSubmit,
}: GoalFormDialogProps) {
  const isEditMode = Boolean(initialData);

  const form = useForm<GoalFormValues>({
    resolver: zodResolver(goalFormSchema),
    defaultValues: getDefaultValues(),
  });

  useEffect(() => {
    if (!open) {
      return;
    }

    if (initialData) {
      form.reset({
        title: initialData.title,
        target_amount: initialData.target_amount,
        notes: initialData.notes ?? "",
      });
      return;
    }

    form.reset(getDefaultValues());
  }, [open, initialData, form]);

  const handleSubmit = form.handleSubmit(async (values) => {
    await onSubmit(values);
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form className="flex min-h-0 flex-1 flex-col overflow-hidden" onSubmit={handleSubmit}>
          <DialogHeader className="shrink-0 border-b border-emerald-100 pb-3 pr-10">
            <DialogTitle>{isEditMode ? "Edit Goal THR" : "Buat Goal THR"}</DialogTitle>
            <DialogDescription>
              Tentukan target tabungan atau penggunaan THR Anda untuk Lebaran.
            </DialogDescription>
          </DialogHeader>

          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto py-3 pr-1">
            <div className="space-y-1.5">
              <Label htmlFor="goal-title">Nama Goal</Label>
              <Input
                id="goal-title"
                placeholder="Contoh: Tabung untuk laptop"
                {...form.register("title")}
              />
              {form.formState.errors.title ? (
                <p className="text-xs text-rose-600">
                  {form.formState.errors.title.message}
                </p>
              ) : null}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="target_amount">Target Nominal (IDR)</Label>
              <Input
                id="target_amount"
                type="number"
                min={MIN_GOAL_TARGET_AMOUNT}
                step={1}
                inputMode="numeric"
                placeholder={`Minimal ${MIN_GOAL_TARGET_AMOUNT_LABEL}`}
                {...form.register("target_amount", { valueAsNumber: true })}
              />
              {form.formState.errors.target_amount ? (
                <p className="text-xs text-rose-600">
                  {form.formState.errors.target_amount.message}
                </p>
              ) : (
                <p className="text-xs text-emerald-600/80">
                  Masukkan angka bulat tanpa titik atau koma.
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
              {QUICK_GOAL_TARGET_AMOUNTS.map((amount) => (
                <Button
                  key={amount}
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full sm:w-auto"
                  onClick={() =>
                    form.setValue("target_amount", amount, { shouldValidate: true })
                  }
                >
                  {`Rp${amount.toLocaleString("id-ID")}`}
                </Button>
              ))}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="goal-notes">Catatan (Opsional)</Label>
              <Textarea
                id="goal-notes"
                rows={2}
                placeholder="Contoh: Prioritas sebelum akhir Ramadan"
                {...form.register("notes")}
                className="sm:min-h-24"
              />
              {form.formState.errors.notes ? (
                <p className="text-xs text-rose-600">
                  {form.formState.errors.notes.message}
                </p>
              ) : null}
            </div>
          </div>

          <DialogFooter className="mt-3 shrink-0 border-t border-emerald-100 pt-3 sm:mt-4 sm:pt-4">
            <Button
              type="button"
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Batal
            </Button>
            <Button type="submit" className="w-full sm:w-auto" disabled={isSubmitting}>
              {isSubmitting
                ? "Menyimpan..."
                : isEditMode
                  ? "Simpan Goal"
                  : "Buat Goal"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
