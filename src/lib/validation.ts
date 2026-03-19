import { z } from "zod";

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
      .number()
      .finite("Nominal wajib diisi.")
      .positive("Nominal harus lebih besar dari 0."),
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

export type TransactionFormValues = z.infer<typeof transactionFormSchema>;
