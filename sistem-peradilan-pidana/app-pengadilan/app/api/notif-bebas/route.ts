import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: Request) {
  try {
    const { putusan_id } = await req.json();
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
    const { data: p } = await supabase.from('putusan').select('*, dakwaan_masuk(*)').eq('id', putusan_id).single();
    if (!p) return NextResponse.json({ error: 'tidak ditemukan' }, { status: 404 });

    const url = process.env.POLISI_API_URL || 'http://localhost:3001';
    const res = await fetch(`${url}/api/inbox/bebas`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nomor_perkara: p.dakwaan_masuk?.nomor_spdp || p.dakwaan_masuk?.nomor_p21,
        sumber: 'pengadilan',
        pesan: `Putusan ${p.nomor_putusan}: Terdakwa ${p.dakwaan_masuk?.tersangka_nama} diputus BEBAS`,
      }),
    });
    if (!res.ok) return NextResponse.json({ error: 'Polisi tolak' }, { status: 502 });
    await supabase.from('putusan').update({ status: 'dikirim' }).eq('id', putusan_id);
    return NextResponse.json({ ok: true });
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}
