import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: Request) {
  try {
    const { putusan_id } = await req.json();
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
    const { data: p, error } = await supabase.from('putusan').select('*, dakwaan_masuk(*)').eq('id', putusan_id).single();
    if (error || !p) return NextResponse.json({ error: 'Putusan tidak ditemukan' }, { status: 404 });

    const payload = {
      nomor_putusan: p.nomor_putusan,
      jenis: p.jenis,
      lama_hukuman: p.lama_hukuman,
      isi_putusan: p.isi_putusan,
      tanggal: p.tanggal,
      terpidana: {
        nama: p.dakwaan_masuk?.tersangka_nama,
        nik: p.dakwaan_masuk?.tersangka_nik,
        alamat: p.dakwaan_masuk?.tersangka_alamat,
      },
      nomor_p21: p.dakwaan_masuk?.nomor_p21,
    };

    const url = process.env.LAPAS_API_URL || 'http://localhost:3004';
    const res = await fetch(`${url}/api/inbox/vonis`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
    });
    if (!res.ok) return NextResponse.json({ error: 'Lapas tolak: ' + (await res.text()) }, { status: 502 });

    await supabase.from('putusan').update({ status: 'dikirim', dikirim_ke_lapas_at: new Date().toISOString() }).eq('id', putusan_id);
    return NextResponse.json({ ok: true });
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}
