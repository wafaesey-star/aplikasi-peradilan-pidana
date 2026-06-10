-- ===========================================================
-- Schema Database Aplikasi KEJAKSAAN (Supabase project: kejaksaan-db)
-- ===========================================================

-- Berkas perkara dari Polisi (BAP + SPDP)
create table if not exists berkas_polisi (
  id uuid primary key default gen_random_uuid(),
  nomor_bap text not null,
  nomor_spdp text,
  perkara text,
  pasal text,
  isi_bap text,
  tersangka_nama text,
  tersangka_nik text,
  tersangka_alamat text,
  tanggal_terima date default current_date,
  status text default 'masuk', -- masuk, p21, dilimpahkan
  created_at timestamptz default now()
);

-- P21 / Dakwaan
create table if not exists dakwaan (
  id uuid primary key default gen_random_uuid(),
  nomor_p21 text unique not null,
  berkas_id uuid references berkas_polisi(id) on delete cascade,
  isi_dakwaan text,
  pasal_didakwakan text,
  tanggal date default current_date,
  status text default 'draft', -- draft, dilimpahkan
  dilimpahkan_at timestamptz,
  created_at timestamptz default now()
);

-- Tuntutan
create table if not exists tuntutan (
  id uuid primary key default gen_random_uuid(),
  nomor_tuntutan text unique not null,
  dakwaan_id uuid references dakwaan(id) on delete cascade,
  isi_tuntutan text,
  lama_hukuman text,
  tanggal date default current_date,
  created_at timestamptz default now()
);

alter table berkas_polisi disable row level security;
alter table dakwaan       disable row level security;
alter table tuntutan      disable row level security;
