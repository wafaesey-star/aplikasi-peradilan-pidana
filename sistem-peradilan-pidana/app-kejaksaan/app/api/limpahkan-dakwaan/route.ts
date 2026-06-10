import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: Request) {
  try {
    const { dakwaan_id } = await req.json();
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
    const { data: d, error } = await supabase.from('dakwaan').select('*, berkas_polisi(*)').eq('id', dakwaan_id).single();
    if (error || !d) return NextResponse.json({ error: 'Dakwaan tidak ditemukan' }, { status: 404 });

    const payload = {
      nomor_p21: d.nomor_p21,
      isi_dakwaan: d.isi_dakwaan,
      pasal_didakwakan: d.pasal_didakwakan,
      tanggal: d.tanggal,
      berkas: {
        nomor_bap: d.berkas_polisi?.nomor_bap,
        nomor_spdp: d.berkas_polisi?.nomor_spdp,
        perkara: d.berkas_polisi?.perkara,
        tersangka_nama: d.berkas_polisi?.tersangka_nama,
        tersangka_nik: d.berkas_polisi?.tersangka_nik,
        tersangka_alamat: d.berkas_polisi?.tersangka_alamat,
      },
    };

    const url = process.env.PENGADILAN_API_URL || 'http://localhost:3003';
    const res = await fetch(`${url}/api/inbox/dakwaan`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
    });
    if (!res.ok) return NextResponse.json({ error: 'Pengadilan tolak: ' + (await res.text()) }, { status: 502 });

    await supabase.from('dakwaan').update({ status: 'dilimpahkan', dilimpahkan_at: new Date().toISOString() }).eq('id', dakwaan_id);
    if (d.berkas_id) await supabase.from('berkas_polisi').update({ status: 'dilimpahkan' }).eq('id', d.berkas_id);
    return NextResponse.json({ ok: true });
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}
