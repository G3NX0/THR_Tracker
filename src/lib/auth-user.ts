import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export async function getAuthenticatedUserId() {
  const supabase = getSupabaseBrowserClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    throw new Error(error.message);
  }

  if (!user) {
    throw new Error("Sesi login tidak ditemukan. Silakan login kembali.");
  }

  return user.id;
}
