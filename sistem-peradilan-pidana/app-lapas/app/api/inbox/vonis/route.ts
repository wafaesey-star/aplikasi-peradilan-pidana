import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: Request) {
  try {
    const p = await req.json();
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
    const { error } = await supabase.from('napi').insert({
      nomor_putusan: p.nomor_putusan,
      nomor_p21: p.nomor_p21,
      nama: p.terpidana?.nama,
      nik: p.terpidana?.nik,
      alamat: p.terpidana?.alamat,
      lama_hukuman: p.lama_hukuman,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}
