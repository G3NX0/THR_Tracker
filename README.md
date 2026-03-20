# THR Tracker

Web app personal untuk mencatat THR masuk dan THR keluar saat Lebaran.

## Stack
- Next.js App Router + TypeScript
- Tailwind CSS
- Supabase (Auth + Postgres + RLS)
- react-hook-form + zod
- sonner (toast), lucide-react, recharts

## Fitur Utama
- Auth email + password (Sign In / Sign Up)
- Dashboard ringkasan THR masuk, THR keluar, saldo
- Goal THR per user (target, progress, status, edit/reset)
- CRUD transaksi (masuk/keluar)
- Filter tipe, kategori, dan pencarian
- Riwayat transaksi responsive (card mobile, table desktop)
- Statistik sederhana + export CSV
- Loading, error, empty state

## Struktur Folder
```txt
src/
  app/
    login/page.tsx
    globals.css
    layout.tsx
    page.tsx
  components/
    auth/login-form.tsx
    dashboard/*
    transactions/*
    ui/*
  hooks/*
  lib/
    statistics.ts
    transactions.ts
    validation.ts
    supabase/
      client.ts
      config.ts
      middleware.ts
      server.ts
  types/*
  utils/*
supabase/
  schema.sql
  migrations/
    20260320053000_init_transactions.sql
    20260320090000_auth_rls_and_constraints.sql
    20260320162000_add_goals.sql
middleware.ts
.env.example
```

## Setup Lokal
1. Install dependency:
```bash
npm install
```

2. Copy env:
```bash
cp .env.example .env.local
```

3. Isi env:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

4. Jalankan SQL di Supabase SQL Editor:
- Untuk project baru: jalankan `supabase/schema.sql`
- Untuk project existing: jalankan migration berikut berurutan:
  - `supabase/migrations/20260320090000_auth_rls_and_constraints.sql`
  - `supabase/migrations/20260320162000_add_goals.sql`

5. Setup Auth di Supabase Dashboard:
- Authentication > Providers > Email
- Pastikan provider Email aktif
- Untuk testing cepat, nonaktifkan sementara `Confirm email` agar Sign Up langsung dapat session
- Jika `Confirm email` tetap aktif, user harus verifikasi email dulu sebelum Sign In

6. Jalankan app:
```bash
npm run dev
```

## Auth Flow
- User belum login -> diarahkan ke `/login`
- Halaman `/login` memiliki mode `Sign In` dan `Sign Up`
- Sign In memakai `signInWithPassword`
- Sign Up memakai `signUp` + validasi konfirmasi password
- Session tersimpan dan tetap aktif saat refresh
- Logout tersedia di header dashboard

## RLS Model
Tabel `transactions` dan `goals` memakai policy berbasis user:
- `select`: hanya baris `auth.uid() = user_id`
- `insert`: hanya boleh insert dengan `user_id = auth.uid()`
- `update/delete`: hanya row milik user login

## Validasi Nominal
- Integer (tanpa desimal)
- Minimal `1000`
- Error message jelas di form

## Command
- `npm run dev`
- `npm run lint`
- `npm run build`

## Deploy Vercel
1. Push repository
2. Import ke Vercel
3. Isi env vars yang sama
4. Pastikan Supabase project production memakai URL frontend production

## Catatan Ekstensi Google Login
Struktur auth sekarang tetap mudah di-upgrade ke OAuth Google:
- Tambahkan tombol OAuth di `src/components/auth/login-form.tsx`
- Tambahkan route callback khusus OAuth saat diperlukan
- Tambahkan redirect URL callback OAuth di Supabase
