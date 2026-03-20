import { getAuthenticatedUserId } from "@/lib/auth-user";
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

function toIntegerAmount(value: number) {
  return Math.trunc(value);
}

export async function getTransactions() {
  const supabase = getSupabaseBrowserClient();
  const userId = await getAuthenticatedUserId();

  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .eq("user_id", userId)
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
  const userId = await getAuthenticatedUserId();

  const { data, error } = await supabase
    .from("transactions")
    .insert({
      user_id: userId,
      type: input.type,
      date: input.date,
      name: input.name,
      category: input.category,
      amount: toIntegerAmount(input.amount),
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
  const userId = await getAuthenticatedUserId();

  const { data, error } = await supabase
    .from("transactions")
    .update({
      type: input.type,
      date: input.date,
      name: input.name,
      category: input.category,
      amount: toIntegerAmount(input.amount),
      notes: input.notes?.trim() || null,
    })
    .eq("id", id)
    .eq("user_id", userId)
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return mapRowToTransaction(data as TransactionRow);
}

export async function deleteTransaction(id: string) {
  const supabase = getSupabaseBrowserClient();
  const userId = await getAuthenticatedUserId();

  const { error } = await supabase
    .from("transactions")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);

  if (error) {
    throw new Error(error.message);
  }
}
