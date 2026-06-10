'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function Page() {
  const [list, setList] = useState<any[]>([]);
  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('dakwaan_masuk').select('*').order('created_at', { ascending: false });
      setList(data || []);
    })();
  }, []);
  return (
    <>
      <h1>Dakwaan Masuk dari Kejaksaan</h1>
      <div className="card">
        <table>
          <thead><tr><th>No P21</th><th>No BAP</th><th>Tersangka</th><th>Pasal</th><th>Tanggal Terima</th><th>Status</th></tr></thead>
          <tbody>
            {list.map(d => (
              <tr key={d.id}>
                <td>{d.nomor_p21}</td><td>{d.nomor_bap}</td><td>{d.tersangka_nama}</td><td>{d.pasal_didakwakan}</td><td>{d.tanggal_terima}</td>
                <td><span className={`badge ${d.status === 'masuk' ? 'draft' : 'dikirim'}`}>{d.status}</span></td>
              </tr>
            ))}
            {list.length === 0 && <tr><td colSpan={6} className="muted">Belum ada dakwaan masuk.</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}
