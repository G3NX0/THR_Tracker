import { getAuthenticatedUserId } from "@/lib/auth-user";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import type { Database } from "@/types/database";
import type { Goal, GoalInput } from "@/types/goal";

type GoalRow = Database["public"]["Tables"]["goals"]["Row"];

function mapRowToGoal(row: GoalRow): Goal {
  return {
    ...row,
    target_amount: Number(row.target_amount),
  };
}

function toIntegerAmount(value: number) {
  return Math.trunc(value);
}

function normalizeGoalError(error: { message: string }) {
  const message = error.message ?? "Terjadi kesalahan pada Goal THR.";
  const normalized = message.toLowerCase();

  if (
    normalized.includes("could not find the table") ||
    normalized.includes("schema cache")
  ) {
    return new Error(
      "Tabel Goal THR belum tersedia di database. Jalankan migration goals terlebih dahulu.",
    );
  }

  return new Error(message);
}

export async function getGoal() {
  const supabase = getSupabaseBrowserClient();
  const userId = await getAuthenticatedUserId();

  const { data, error } = await supabase
    .from("goals")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    throw normalizeGoalError(error);
  }

  if (!data) {
    return null;
  }

  return mapRowToGoal(data as GoalRow);
}

export async function upsertGoal(input: GoalInput) {
  const supabase = getSupabaseBrowserClient();
  const userId = await getAuthenticatedUserId();

  const { data, error } = await supabase
    .from("goals")
    .upsert(
      {
        user_id: userId,
        title: input.title.trim(),
        target_amount: toIntegerAmount(input.target_amount),
        notes: input.notes?.trim() || null,
      },
      {
        onConflict: "user_id",
      },
    )
    .select("*")
    .single();

  if (error) {
    throw normalizeGoalError(error);
  }

  return mapRowToGoal(data as GoalRow);
}

export async function deleteGoal(id: string) {
  const supabase = getSupabaseBrowserClient();
  const userId = await getAuthenticatedUserId();

  const { error } = await supabase
    .from("goals")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);

  if (error) {
    throw normalizeGoalError(error);
  }
}
