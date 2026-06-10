# Sistem Peradilan Pidana Terintegrasi

Sistem ini terdiri dari **4 aplikasi terpisah** dengan **database Supabase masing-masing**, terintegrasi via **REST API / Webhook**.

```
┌──────────────────┐  BAP+SPDP  ┌────────────────────┐
│  Aplikasi Polisi │ ─────────► │ Aplikasi Kejaksaan │
│  (port 3001)     │            │  (port 3002)       │
└──────────────────┘            └─────────┬──────────┘
        ▲                                 │ Dakwaan
        │ notif bebas (opsional)          ▼
        │                       ┌────────────────────┐
        │                       │ Aplikasi Pengadilan│
        │                       │  (port 3003)       │
        │                       └─────────┬──────────┘
        │                                 │ Vonis
        │                                 ▼
        │                       ┌────────────────────┐
        └─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ │  Aplikasi Lapas    │
                                │  (port 3004)       │
                                └────────────────────┘
```

## Struktur Folder

| Folder              | Aplikasi           | Port | Database Supabase   |
| ------------------- | ------------------ | ---- | ------------------- |
| `app-polisi/`       | Polisi (SPDP/BAP)  | 3001 | `polisi-db`         |
| `app-kejaksaan/`    | Kejaksaan (P21)    | 3002 | `kejaksaan-db`      |
| `app-pengadilan/`   | Pengadilan (Vonis) | 3003 | `pengadilan-db`     |
| `app-lapas/`        | Lapas (Remisi)     | 3004 | `lapas-db`          |

## Cara Setup (untuk setiap aplikasi)

1. **Buat 4 project Supabase** terpisah di https://supabase.com (gratis):
   - `polisi-db`, `kejaksaan-db`, `pengadilan-db`, `lapas-db`

2. **Jalankan SQL schema** di tiap project:
   - Buka **SQL Editor** di Supabase dashboard
   - Copy isi `schema.sql` dari folder masing-masing aplikasi, lalu Run

3. **Setup environment** di setiap folder:
   ```bash
   
   # Isi NEXT_PUBLIC_SUPABASE_URL & NEXT_PUBLIC_SUPABASE_ANON_KEY
   # Isi juga URL aplikasi tujuan (untuk webhook)
   ```

4. **Install & jalankan** (di setiap folder):
   ```bash
   npm install
   npm run dev
   ```

## Alur Integrasi (Webhook)

- **Polisi → Kejaksaan**: `POST {KEJAKSAAN_URL}/api/inbox/bap` (kirim BAP + SPDP)
- **Kejaksaan → Pengadilan**: `POST {PENGADILAN_URL}/api/inbox/dakwaan`
- **Pengadilan → Lapas**: `POST {LAPAS_URL}/api/inbox/vonis`
- **Kejaksaan → Polisi** (opsional): `POST {POLISI_URL}/api/inbox/bebas` (notif putusan bebas)

Tiap aplikasi punya database sendiri — tidak ada shared table.
