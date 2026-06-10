import { NextResponse } from 'next/server';

// Kirim notif bebas ke Polisi
export async function POST(req: Request) {
  try {
    const { nomor_perkara, pesan } = await req.json();
    const url = process.env.POLISI_API_URL || 'http://localhost:3001';
    const res = await fetch(`${url}/api/inbox/bebas`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nomor_perkara, sumber: 'kejaksaan', pesan }),
    });
    if (!res.ok) return NextResponse.json({ error: 'Polisi tolak' }, { status: 502 });
    return NextResponse.json({ ok: true });
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}
