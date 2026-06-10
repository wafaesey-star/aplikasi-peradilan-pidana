'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function BerkasPage() {
  const [list, setList] = useState<any[]>([]);
  const load = async () => {
    const { data } = await supabase.from('berkas_polisi').select('*').order('created_at', { ascending: false });
    setList(data || []);
  };
  useEffect(() => { load(); }, []);

  const notifBebas = async (b: any) => {
    const pesan = prompt('Pesan notif bebas ke Polisi:', `Perkara ${b.nomor_spdp} dihentikan / tersangka dibebaskan`);
    if (!pesan) return;
    const res = await fetch('/api/notif-bebas', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ nomor_perkara: b.nomor_spdp, pesan }) });
    if (res.ok) alert('Notif bebas terkirim ke Polisi'); else alert('Gagal');
  };

  return (
    <>
      <h1>Berkas Masuk dari Polisi</h1>
      <div className="card">
        <table>
          <thead><tr><th>No BAP</th><th>No SPDP</th><th>Tersangka</th><th>Perkara</th><th>Pasal</th><th>Status</th><th>Aksi</th></tr></thead>
          <tbody>
            {list.map(b => (
              <tr key={b.id}>
                <td>{b.nomor_bap}</td><td>{b.nomor_spdp}</td><td>{b.tersangka_nama}</td><td>{b.perkara}</td><td>{b.pasal}</td>
                <td><span className={`badge ${b.status === 'masuk' ? 'draft' : 'dikirim'}`}>{b.status}</span></td>
                <td><button className="danger" onClick={() => notifBebas(b)}>Notif Bebas</button></td>
              </tr>
            ))}
            {list.length === 0 && <tr><td colSpan={7} className="muted">Belum ada berkas. Kirim dari aplikasi Polisi.</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}
