import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: Request) {
  try {
    const { bap_id } = await req.json();
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

    // Ambil BAP + SPDP + tersangka
    const { data: bap, error } = await supabase
      .from('bap')
      .select('*, spdp(*, tersangka(*))')
      .eq('id', bap_id)
      .single();
    if (error || !bap) return NextResponse.json({ error: 'BAP tidak ditemukan' }, { status: 404 });

    const payload = {
      nomor_bap: bap.nomor_bap,
      isi_bap: bap.isi_bap,
      tanggal_bap: bap.tanggal,
      spdp: {
        nomor_spdp: bap.spdp?.nomor_spdp,
        perkara: bap.spdp?.perkara,
        pasal: bap.spdp?.pasal,
        tanggal: bap.spdp?.tanggal,
      },
      tersangka: {
        nama: bap.spdp?.tersangka?.nama,
        nik: bap.spdp?.tersangka?.nik,
        alamat: bap.spdp?.tersangka?.alamat,
      },
    };

    // Kirim ke kejaksaan
    const url = process.env.KEJAKSAAN_API_URL || 'http://localhost:3002';
    const res = await fetch(`${url}/api/inbox/bap`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const t = await res.text();
      return NextResponse.json({ error: 'Kejaksaan tolak: ' + t }, { status: 502 });
    }

    // Update status BAP + SPDP
    await supabase.from('bap').update({ status: 'dikirim', dikirim_ke_kejaksaan_at: new Date().toISOString() }).eq('id', bap_id);
    if (bap.spdp_id) await supabase.from('spdp').update({ status: 'dikirim' }).eq('id', bap.spdp_id);

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
