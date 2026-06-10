import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: Request) {
  try {
    const p = await req.json();
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
    const { error } = await supabase.from('dakwaan_masuk').insert({
      nomor_p21: p.nomor_p21,
      nomor_bap: p.berkas?.nomor_bap,
      nomor_spdp: p.berkas?.nomor_spdp,
      perkara: p.berkas?.perkara,
      pasal_didakwakan: p.pasal_didakwakan,
      isi_dakwaan: p.isi_dakwaan,
      tersangka_nama: p.berkas?.tersangka_nama,
      tersangka_nik: p.berkas?.tersangka_nik,
      tersangka_alamat: p.berkas?.tersangka_alamat,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}
