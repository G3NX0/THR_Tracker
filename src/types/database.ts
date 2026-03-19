export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      transactions: {
        Row: {
          id: string;
          user_id: string | null;
          type: "masuk" | "keluar";
          date: string;
          name: string;
          category: string;
          amount: string;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          type: "masuk" | "keluar";
          date: string;
          name: string;
          category: string;
          amount: number;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          type?: "masuk" | "keluar";
          date?: string;
          name?: string;
          category?: string;
          amount?: number;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      transaction_type: "masuk" | "keluar";
    };
    CompositeTypes: Record<string, never>;
  };
}
