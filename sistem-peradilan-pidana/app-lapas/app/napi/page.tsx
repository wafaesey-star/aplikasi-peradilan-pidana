'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function Page() {
  const [list, setList] = useState<any[]>([]);
  const [msg, setMsg] = useState('');
  const load = async () => {
    const { data } = await supabase.from('napi').select('*').order('created_at', { ascending: false });
    setList(data || []);
  };
  useEffect(() => { load(); }, []);

  const setBlok = async (n: any) => {
    const b = prompt('Blok hunian:', n.blok_hunian || 'A-01');
    if (!b) return;
    await supabase.from('napi').update({ blok_hunian: b }).eq('id', n.id);
    setMsg('Blok hunian diperbarui ✓'); load();
  };

  return (
    <>
      <h1>Hunian Napi / Warga Binaan</h1>
      {msg && <div className="alert ok">{msg}</div>}
      <div className="card">
        <table>
          <thead><tr><th>Nama</th><th>NIK</th><th>No Putusan</th><th>Hukuman</th><th>Blok</th><th>Status</th><th>Aksi</th></tr></thead>
          <tbody>
            {list.map(n => (
              <tr key={n.id}>
                <td>{n.nama}</td><td>{n.nik || '-'}</td><td>{n.nomor_putusan}</td><td>{n.lama_hukuman}</td>
                <td>{n.blok_hunian || <span className="muted">belum diatur</span>}</td>
                <td><span className={`badge ${n.status === 'aktif' ? 'draft' : 'dikirim'}`}>{n.status}</span></td>
                <td><button className="danger" onClick={() => setBlok(n)}>Atur Blok</button></td>
              </tr>
            ))}
            {list.length === 0 && <tr><td colSpan={7} className="muted">Belum ada napi. Vonis dari Pengadilan akan otomatis muncul di sini.</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}
