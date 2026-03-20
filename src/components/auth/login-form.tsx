"use client";

import { KeyRound, LogIn, UserPlus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { AuthChangeEvent } from "@supabase/supabase-js";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

type AuthMode = "signin" | "signup";

function isEmailValid(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function parseAuthError(error: unknown) {
  const fallback = "Autentikasi gagal. Coba lagi.";
  const message = error instanceof Error ? error.message : fallback;
  const normalized = message.toLowerCase();

  if (normalized.includes("invalid login credentials")) {
    return "Email atau password tidak sesuai.";
  }

  if (normalized.includes("email not confirmed")) {
    return "Email belum terverifikasi. Cek inbox Anda terlebih dahulu.";
  }

  if (normalized.includes("user already registered")) {
    return "Email sudah terdaftar. Silakan masuk lewat tab Sign In.";
  }

  if (normalized.includes("password should be at least")) {
    return "Password minimal 6 karakter.";
  }

  return message || fallback;
}

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<AuthMode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  const errorMessage = searchParams.get("error");
  const nextPath = useMemo(() => {
    const next = searchParams.get("next") ?? "/";
    return next.startsWith("/") ? next : "/";
  }, [searchParams]);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();

    const syncIfSignedIn = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        router.replace(nextPath);
        router.refresh();
      }
    };

    void syncIfSignedIn();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event: AuthChangeEvent) => {
      if (event === "SIGNED_IN") {
        router.replace(nextPath);
        router.refresh();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [nextPath, router]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();
    if (!isEmailValid(normalizedEmail)) {
      toast.error("Masukkan email yang valid.");
      return;
    }

    if (!password || password.length < 6) {
      toast.error("Password minimal 6 karakter.");
      return;
    }

    if (mode === "signup" && password !== confirmPassword) {
      toast.error("Konfirmasi password tidak sama.");
      return;
    }

    setIsSubmitting(true);
    setInfoMessage(null);

    try {
      const supabase = getSupabaseBrowserClient();

      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({
          email: normalizedEmail,
          password,
        });

        if (error) {
          throw error;
        }

        toast.success("Login berhasil.");
        router.replace(nextPath);
        router.refresh();
        return;
      }

      const { data, error } = await supabase.auth.signUp({
        email: normalizedEmail,
        password,
      });

      if (error) {
        throw error;
      }

      if (data.session) {
        toast.success("Akun berhasil dibuat dan Anda sudah login.");
        router.replace(nextPath);
        router.refresh();
        return;
      }

      setInfoMessage(
        "Akun berhasil dibuat. Jika verifikasi email aktif, cek inbox Anda sebelum sign in.",
      );
      setMode("signin");
      setConfirmPassword("");
      toast.success("Akun berhasil dibuat.");
    } catch (error) {
      toast.error(parseAuthError(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-md flex-1 items-center px-4 py-8 sm:px-6">
      <Card className="w-full rounded-3xl border-emerald-200/80 bg-white/95 shadow-lg">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl font-semibold">Masuk ke THR Tracker</CardTitle>
          <CardDescription>
            Gunakan email dan password untuk akses cepat ke dashboard pribadi Anda.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-2 rounded-xl bg-emerald-50 p-1">
            <Button
              type="button"
              variant={mode === "signin" ? "default" : "ghost"}
              className="w-full"
              onClick={() => setMode("signin")}
              disabled={isSubmitting}
            >
              <LogIn className="h-4 w-4" />
              Sign In
            </Button>
            <Button
              type="button"
              variant={mode === "signup" ? "default" : "ghost"}
              className="w-full"
              onClick={() => setMode("signup")}
              disabled={isSubmitting}
            >
              <UserPlus className="h-4 w-4" />
              Sign Up
            </Button>
          </div>

          {errorMessage ? (
            <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
              {errorMessage}
            </div>
          ) : null}

          {infoMessage ? (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
              {infoMessage}
            </div>
          ) : null}

          <form className="space-y-3" onSubmit={handleSubmit}>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="nama@email.com"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Minimal 6 karakter"
                autoComplete={mode === "signin" ? "current-password" : "new-password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </div>

            {mode === "signup" ? (
              <div className="space-y-1.5">
                <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Ulangi password"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  required
                />
              </div>
            ) : null}

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              <KeyRound className="h-4 w-4" />
              {isSubmitting ? "Memproses..." : mode === "signin" ? "Masuk" : "Buat Akun"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
