import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Dipanggil oleh aplikasi Polisi saat kirim BAP+SPDP
export async function POST(req: Request) {
  try {
    const p = await req.json();
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
    const { error } = await supabase.from('berkas_polisi').insert({
      nomor_bap: p.nomor_bap,
      nomor_spdp: p.spdp?.nomor_spdp,
      perkara: p.spdp?.perkara,
      pasal: p.spdp?.pasal,
      isi_bap: p.isi_bap,
      tersangka_nama: p.tersangka?.nama,
      tersangka_nik: p.tersangka?.nik,
      tersangka_alamat: p.tersangka?.alamat,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}
