'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function Dashboard() {
  const [stats, setStats] = useState({ tersangka: 0, spdp: 0, bap: 0, dikirim: 0 });

  useEffect(() => {
    (async () => {
      const [a, b, c, d] = await Promise.all([
        supabase.from('tersangka').select('*', { count: 'exact', head: true }),
        supabase.from('spdp').select('*', { count: 'exact', head: true }),
        supabase.from('bap').select('*', { count: 'exact', head: true }),
        supabase.from('bap').select('*', { count: 'exact', head: true }).eq('status', 'dikirim'),
      ]);
      setStats({
        tersangka: a.count || 0,
        spdp: b.count || 0,
        bap: c.count || 0,
        dikirim: d.count || 0,
      });
    })();
  }, []);

  return (
    <>
      <h1>Dashboard Polisi</h1>
      <div className="grid">
        <div className="stat"><div className="v">{stats.tersangka}</div><div className="l">Tersangka</div></div>
        <div className="stat"><div className="v">{stats.spdp}</div><div className="l">SPDP</div></div>
        <div className="stat"><div className="v">{stats.bap}</div><div className="l">BAP</div></div>
        <div className="stat"><div className="v">{stats.dikirim}</div><div className="l">BAP Dikirim ke Kejaksaan</div></div>
      </div>
      <div className="card" style={{ marginTop: 20 }}>
        <h2>Alur Kerja</h2>
        <p className="muted">1. Daftarkan <b>Tersangka</b> → 2. Buat <b>SPDP</b> → 3. Buat <b>BAP Digital</b> → 4. Kirim ke Kejaksaan</p>
      </div>
    </>
  );
}
