'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function Dashboard() {
  const [s, setS] = useState({ dakwaan: 0, sidang: 0, putusan: 0, dikirim: 0 });
  useEffect(() => {
    (async () => {
      const [a, b, c, d] = await Promise.all([
        supabase.from('dakwaan_masuk').select('*', { count: 'exact', head: true }),
        supabase.from('sidang').select('*', { count: 'exact', head: true }),
        supabase.from('putusan').select('*', { count: 'exact', head: true }),
        supabase.from('putusan').select('*', { count: 'exact', head: true }).eq('status', 'dikirim'),
      ]);
      setS({ dakwaan: a.count || 0, sidang: b.count || 0, putusan: c.count || 0, dikirim: d.count || 0 });
    })();
  }, []);
  return (
    <>
      <h1>Dashboard Pengadilan</h1>
      <div className="grid">
        <div className="stat"><div className="v">{s.dakwaan}</div><div className="l">Dakwaan Masuk</div></div>
        <div className="stat"><div className="v">{s.sidang}</div><div className="l">Sidang (e-Court)</div></div>
        <div className="stat"><div className="v">{s.putusan}</div><div className="l">Putusan</div></div>
        <div className="stat"><div className="v">{s.dikirim}</div><div className="l">Dikirim ke Lapas</div></div>
      </div>
      <div className="card" style={{ marginTop: 20 }}>
        <h2>Alur Kerja</h2>
        <p className="muted">1. Dakwaan masuk otomatis dari Kejaksaan → 2. Jadwalkan <b>Sidang (e-Court)</b> → 3. Buat <b>Putusan</b> → 4. Jika pidana: kirim ke Lapas. Jika bebas: notif balik ke Polisi.</p>
      </div>
    </>
  );
}
