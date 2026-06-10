-- ===========================================================
-- Schema Database Aplikasi POLISI (Supabase project: polisi-db)
-- Jalankan di SQL Editor Supabase
-- ===========================================================

-- Tabel tersangka
create table if not exists tersangka (
  id uuid primary key default gen_random_uuid(),
  nama text not null,
  nik text,
  alamat text,
  created_at timestamptz default now()
);

-- Tabel SPDP (Surat Pemberitahuan Dimulainya Penyidikan)
create table if not exists spdp (
  id uuid primary key default gen_random_uuid(),
  nomor_spdp text unique not null,
  tersangka_id uuid references tersangka(id) on delete cascade,
  perkara text not null,
  pasal text,
  tanggal date not null default current_date,
  status text default 'draft', -- draft, dikirim
  created_at timestamptz default now()
);

-- Tabel BAP (Berita Acara Pemeriksaan)
create table if not exists bap (
  id uuid primary key default gen_random_uuid(),
  nomor_bap text unique not null,
  spdp_id uuid references spdp(id) on delete cascade,
  isi_bap text,
  tanggal date not null default current_date,
  status text default 'draft', -- draft, dikirim
  dikirim_ke_kejaksaan_at timestamptz,
  created_at timestamptz default now()
);

-- Log notifikasi bebas dari kejaksaan/pengadilan (opsional)
create table if not exists notif_bebas (
  id uuid primary key default gen_random_uuid(),
  nomor_perkara text,
  sumber text, -- kejaksaan / pengadilan
  pesan text,
  diterima_at timestamptz default now()
);

-- RLS: untuk demo dimatikan agar mudah dicoba. Aktifkan untuk produksi.
alter table tersangka disable row level security;
alter table spdp      disable row level security;
alter table bap       disable row level security;
alter table notif_bebas disable row level security;
