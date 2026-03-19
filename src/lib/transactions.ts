import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import type { Database } from "@/types/database";
import type { Transaction, TransactionInput } from "@/types/transaction";

type TransactionRow = Database["public"]["Tables"]["transactions"]["Row"];

function mapRowToTransaction(row: TransactionRow): Transaction {
  return {
    ...row,
    amount: Number(row.amount),
  };
}

export async function getTransactions() {
  const supabase = getSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .order("date", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  const rows = (data ?? []) as TransactionRow[];
  return rows.map(mapRowToTransaction);
}

export async function createTransaction(input: TransactionInput) {
  const supabase = getSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("transactions")
    .insert({
      type: input.type,
      date: input.date,
      name: input.name,
      category: input.category,
      amount: input.amount,
      notes: input.notes?.trim() || null,
    })
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return mapRowToTransaction(data as TransactionRow);
}

export async function updateTransaction(id: string, input: TransactionInput) {
  const supabase = getSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("transactions")
    .update({
      type: input.type,
      date: input.date,
      name: input.name,
      category: input.category,
      amount: input.amount,
      notes: input.notes?.trim() || null,
    })
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return mapRowToTransaction(data as TransactionRow);
}

export async function deleteTransaction(id: string) {
  const supabase = getSupabaseBrowserClient();
  const { error } = await supabase.from("transactions").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
}
