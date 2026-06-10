'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function NotifPage() {
  const [list, setList] = useState<any[]>([]);
  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('notif_bebas').select('*').order('diterima_at', { ascending: false });
      setList(data || []);
    })();
  }, []);
  return (
    <>
      <h1>Notifikasi Bebas (dari Kejaksaan/Pengadilan)</h1>
      <div className="card">
        <table>
          <thead><tr><th>Nomor Perkara</th><th>Sumber</th><th>Pesan</th><th>Diterima</th></tr></thead>
          <tbody>
            {list.map(n => (
              <tr key={n.id}><td>{n.nomor_perkara}</td><td>{n.sumber}</td><td>{n.pesan}</td><td>{new Date(n.diterima_at).toLocaleString('id-ID')}</td></tr>
            ))}
            {list.length === 0 && <tr><td colSpan={4} className="muted">Belum ada notifikasi</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}
