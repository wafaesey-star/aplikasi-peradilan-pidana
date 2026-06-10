import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Endpoint dipanggil Kejaksaan/Pengadilan saat notif bebas
export async function POST(req: Request) {
  try {
    const body = await req.json(); // { nomor_perkara, sumber, pesan }
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
    const { error } = await supabase.from('notif_bebas').insert({
      nomor_perkara: body.nomor_perkara,
      sumber: body.sumber || 'kejaksaan',
      pesan: body.pesan,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}
