import { z } from "zod";

import {
  MIN_GOAL_TARGET_AMOUNT,
  MIN_GOAL_TARGET_AMOUNT_LABEL,
} from "@/lib/goal-amount";
import {
  MIN_TRANSACTION_AMOUNT,
  MIN_TRANSACTION_AMOUNT_LABEL,
} from "@/lib/transaction-amount";
import { getCategoriesByType } from "@/utils/categories";

export const transactionFormSchema = z
  .object({
    type: z.enum(["masuk", "keluar"], {
      message: "Jenis transaksi wajib dipilih.",
    }),
    date: z
      .string({ message: "Tanggal wajib diisi." })
      .min(1, "Tanggal wajib diisi.")
      .refine((value) => !Number.isNaN(new Date(value).getTime()), {
        message: "Tanggal tidak valid.",
      }),
    name: z
      .string({ message: "Nama pihak wajib diisi." })
      .trim()
      .min(2, "Nama pihak minimal 2 karakter."),
    category: z
      .string({ message: "Kategori wajib dipilih." })
      .min(1, "Kategori wajib dipilih."),
    amount: z
      .number({ error: "Nominal wajib diisi." })
      .refine(Number.isFinite, {
        message: "Nominal wajib diisi.",
      })
      .int("Nominal harus bilangan bulat tanpa desimal.")
      .positive("Nominal harus lebih besar dari 0.")
      .min(
        MIN_TRANSACTION_AMOUNT,
        `Nominal minimal ${MIN_TRANSACTION_AMOUNT_LABEL}.`,
      ),
    notes: z
      .string()
      .trim()
      .max(250, "Catatan maksimal 250 karakter.")
      .optional(),
  })
  .refine(
    (value) => getCategoriesByType(value.type).includes(value.category as never),
    {
      message: "Kategori tidak sesuai dengan jenis transaksi.",
      path: ["category"],
    },
  );

export const goalFormSchema = z.object({
  title: z
    .string({ message: "Nama goal wajib diisi." })
    .trim()
    .min(2, "Nama goal minimal 2 karakter.")
    .max(80, "Nama goal maksimal 80 karakter."),
  target_amount: z
    .number({ error: "Target nominal wajib diisi." })
    .refine(Number.isFinite, {
      message: "Target nominal wajib diisi.",
    })
    .int("Target harus bilangan bulat tanpa desimal.")
    .positive("Target harus lebih besar dari 0.")
    .min(
      MIN_GOAL_TARGET_AMOUNT,
      `Target minimal ${MIN_GOAL_TARGET_AMOUNT_LABEL}.`,
    ),
  notes: z
    .string()
    .trim()
    .max(250, "Catatan maksimal 250 karakter.")
    .optional(),
});

export type TransactionFormValues = z.infer<typeof transactionFormSchema>;
export type GoalFormValues = z.infer<typeof goalFormSchema>;
