'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function Dashboard() {
  const [s, setS] = useState({ napi: 0, aktif: 0, remisi: 0, bebas: 0 });
  useEffect(() => {
    (async () => {
      const [a, b, c, d] = await Promise.all([
        supabase.from('napi').select('*', { count: 'exact', head: true }),
        supabase.from('napi').select('*', { count: 'exact', head: true }).eq('status', 'aktif'),
        supabase.from('remisi').select('*', { count: 'exact', head: true }),
        supabase.from('status_bebas').select('*', { count: 'exact', head: true }),
      ]);
      setS({ napi: a.count || 0, aktif: b.count || 0, remisi: c.count || 0, bebas: d.count || 0 });
    })();
  }, []);
  return (
    <>
      <h1>Dashboard Lapas</h1>
      <div className="grid">
        <div className="stat"><div className="v">{s.napi}</div><div className="l">Total Napi</div></div>
        <div className="stat"><div className="v">{s.aktif}</div><div className="l">Napi Aktif</div></div>
        <div className="stat"><div className="v">{s.remisi}</div><div className="l">Remisi Diberikan</div></div>
        <div className="stat"><div className="v">{s.bebas}</div><div className="l">Sudah Bebas</div></div>
      </div>
      <div className="card" style={{ marginTop: 20 }}>
        <h2>Alur Kerja</h2>
        <p className="muted">1. Vonis masuk otomatis dari Pengadilan → terbentuk data <b>Napi</b> → 2. Atur <b>Hunian</b> → 3. Berikan <b>Remisi</b> → 4. Catat <b>Status Bebas</b></p>
      </div>
    </>
  );
}
