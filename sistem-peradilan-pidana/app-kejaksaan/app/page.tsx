'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function Dashboard() {
  const [s, setS] = useState({ berkas: 0, dakwaan: 0, tuntutan: 0, dilimpahkan: 0 });
  useEffect(() => {
    (async () => {
      const [a, b, c, d] = await Promise.all([
        supabase.from('berkas_polisi').select('*', { count: 'exact', head: true }),
        supabase.from('dakwaan').select('*', { count: 'exact', head: true }),
        supabase.from('tuntutan').select('*', { count: 'exact', head: true }),
        supabase.from('dakwaan').select('*', { count: 'exact', head: true }).eq('status', 'dilimpahkan'),
      ]);
      setS({ berkas: a.count || 0, dakwaan: b.count || 0, tuntutan: c.count || 0, dilimpahkan: d.count || 0 });
    })();
  }, []);
  return (
    <>
      <h1>Dashboard Kejaksaan</h1>
      <div className="grid">
        <div className="stat"><div className="v">{s.berkas}</div><div className="l">Berkas dari Polisi</div></div>
        <div className="stat"><div className="v">{s.dakwaan}</div><div className="l">P21 / Dakwaan</div></div>
        <div className="stat"><div className="v">{s.tuntutan}</div><div className="l">Tuntutan</div></div>
        <div className="stat"><div className="v">{s.dilimpahkan}</div><div className="l">Dilimpahkan ke Pengadilan</div></div>
      </div>
      <div className="card" style={{ marginTop: 20 }}>
        <h2>Alur Kerja</h2>
        <p className="muted">1. <b>Berkas masuk</b> otomatis dari Polisi → 2. Buat <b>P21/Dakwaan</b> → 3. Limpahkan ke Pengadilan → 4. Buat <b>Tuntutan</b></p>
      </div>
    </>
  );
}
