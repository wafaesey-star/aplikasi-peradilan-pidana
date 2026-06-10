-- ===========================================================
-- Schema Database Aplikasi LAPAS (Supabase project: lapas-db)
-- ===========================================================

-- Warga binaan / napi
create table if not exists napi (
  id uuid primary key default gen_random_uuid(),
  nomor_putusan text not null,
  nomor_p21 text,
  nama text not null,
  nik text,
  alamat text,
  lama_hukuman text,
  tanggal_masuk date default current_date,
  status text default 'aktif', -- aktif, bebas
  blok_hunian text,
  created_at timestamptz default now()
);

-- Remisi
create table if not exists remisi (
  id uuid primary key default gen_random_uuid(),
  napi_id uuid references napi(id) on delete cascade,
  jenis text, -- umum, khusus, kemerdekaan
  lama text, -- contoh: 1 bulan
  tanggal date default current_date,
  keterangan text,
  created_at timestamptz default now()
);

-- Status bebas
create table if not exists status_bebas (
  id uuid primary key default gen_random_uuid(),
  napi_id uuid references napi(id) on delete cascade,
  tanggal_bebas date default current_date,
  jenis_bebas text, -- bebas murni, bebas bersyarat
  keterangan text,
  created_at timestamptz default now()
);

alter table napi          disable row level security;
alter table remisi        disable row level security;
alter table status_bebas  disable row level security;
