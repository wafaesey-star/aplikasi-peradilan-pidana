-- ===========================================================
-- Schema Database Aplikasi PENGADILAN (Supabase project: pengadilan-db)
-- ===========================================================

-- Dakwaan masuk dari Kejaksaan
create table if not exists dakwaan_masuk (
  id uuid primary key default gen_random_uuid(),
  nomor_p21 text not null,
  nomor_bap text,
  nomor_spdp text,
  perkara text,
  pasal_didakwakan text,
  isi_dakwaan text,
  tersangka_nama text,
  tersangka_nik text,
  tersangka_alamat text,
  tanggal_terima date default current_date,
  status text default 'masuk', -- masuk, sidang, putus
  created_at timestamptz default now()
);

-- e-Court: jadwal sidang
create table if not exists sidang (
  id uuid primary key default gen_random_uuid(),
  dakwaan_id uuid references dakwaan_masuk(id) on delete cascade,
  nomor_perkara text not null,
  tanggal_sidang date not null,
  hakim text,
  agenda text,
  status text default 'terjadwal', -- terjadwal, selesai
  created_at timestamptz default now()
);

-- Putusan / Vonis
create table if not exists putusan (
  id uuid primary key default gen_random_uuid(),
  nomor_putusan text unique not null,
  dakwaan_id uuid references dakwaan_masuk(id) on delete cascade,
  jenis text not null, -- pidana, bebas
  lama_hukuman text,
  isi_putusan text,
  tanggal date default current_date,
  status text default 'draft', -- draft, dikirim
  dikirim_ke_lapas_at timestamptz,
  created_at timestamptz default now()
);

alter table dakwaan_masuk disable row level security;
alter table sidang        disable row level security;
alter table putusan       disable row level security;
