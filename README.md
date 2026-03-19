# THR Tracker

Web app personal untuk mencatat THR masuk dan THR keluar saat Lebaran.

## Tech Stack
- Next.js (App Router) + TypeScript
- Tailwind CSS
- UI components custom (gaya shadcn clean)
- Supabase (database + persistence)
- lucide-react (icon)
- Vercel-ready deployment

## Fitur MVP
- Dashboard ringkasan: total masuk, total keluar, saldo, jumlah transaksi
- Tambah/edit/hapus transaksi via modal (mobile-friendly)
- Filter tipe transaksi + filter kategori + pencarian
- Riwayat transaksi: card list di mobile, tabel di desktop
- Statistik sederhana:
  - chart pengeluaran per kategori
  - top THR masuk terbesar
  - top pengeluaran terbesar
- Loading state, empty state, error state, toast sukses/gagal
- Bonus: export CSV berdasarkan hasil filter aktif

## Struktur Folder
```bash
src/
  app/
    globals.css
    layout.tsx
    page.tsx
  components/
    dashboard/
      app-header.tsx
      statistics-section.tsx
      summary-cards.tsx
      thr-tracker-app.tsx
    transactions/
      transaction-filters.tsx
      transaction-form-dialog.tsx
      transaction-list.tsx
    ui/
      badge.tsx
      button.tsx
      card.tsx
      dialog.tsx
      input.tsx
      label.tsx
      select.tsx
      skeleton.tsx
      textarea.tsx
  hooks/
    use-transaction-filters.ts
    use-transactions.ts
  lib/
    statistics.ts
    transactions.ts
    validation.ts
    supabase/
      client.ts
  types/
    database.ts
    transaction.ts
  utils/
    categories.ts
    cn.ts
    currency.ts
    csv.ts
    date.ts
supabase/
  schema.sql
  migrations/
    20260320053000_init_transactions.sql
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
Isi dengan kredensial project Supabase Anda.

3. Buat tabel di Supabase:
- Buka Supabase SQL Editor
- Jalankan isi file `supabase/schema.sql`

4. Jalankan app:
```bash
npm run dev
```
Buka `http://localhost:3000`.

## Environment Variables
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Deploy ke Vercel
1. Push repository ke Git provider.
2. Import project ke Vercel.
3. Tambahkan env vars yang sama di dashboard Vercel.
4. Deploy.

## Catatan Arsitektur
- Menggunakan single-user MVP tanpa backend terpisah.
- Semua operasi CRUD dilakukan langsung dari client via Supabase JS.
- Struktur `user_id` sudah disiapkan agar mudah di-upgrade ke mode multi-user + auth.
- Business logic summary/statistik dipisah ke `lib/statistics.ts` agar komponen UI tetap bersih.
- Formatting Rupiah terpusat di `utils/currency.ts` untuk konsistensi global.

## Perintah Penting
- `npm run dev`
- `npm run lint`
- `npm run build`
