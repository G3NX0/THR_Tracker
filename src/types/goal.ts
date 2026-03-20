export interface Goal {
  id: string;
  user_id: string;
  title: string;
  target_amount: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface GoalInput {
  title: string;
  target_amount: number;
  notes?: string;
}

export type GoalStatus = "belum-mulai" | "sedang-dicapai" | "tercapai";
