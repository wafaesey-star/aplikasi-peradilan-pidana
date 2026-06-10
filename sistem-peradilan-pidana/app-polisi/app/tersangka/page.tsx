'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function TersangkaPage() {
  const [list, setList] = useState<any[]>([]);
  const [form, setForm] = useState({ nama: '', nik: '', alamat: '' });
  const [msg, setMsg] = useState('');

  const load = async () => {
    const { data } = await supabase.from('tersangka').select('*').order('created_at', { ascending: false });
    setList(data || []);
  };

  useEffect(() => { load(); }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('tersangka').insert(form);
    if (error) setMsg('Error: ' + error.message);
    else { setMsg('Tersangka ditambahkan ✓'); setForm({ nama: '', nik: '', alamat: '' }); load(); }
  };

  const hapus = async (id: string) => {
    if (!confirm('Hapus tersangka ini?')) return;
    await supabase.from('tersangka').delete().eq('id', id);
    load();
  };

  return (
    <>
      <h1>Data Tersangka</h1>
      {msg && <div className={`alert ${msg.startsWith('Error') ? 'err' : 'ok'}`}>{msg}</div>}
      <div className="card">
        <h2>Tambah Tersangka</h2>
        <form onSubmit={submit}>
          <div><label>Nama</label><input required value={form.nama} onChange={e => setForm({ ...form, nama: e.target.value })} /></div>
          <div><label>NIK</label><input value={form.nik} onChange={e => setForm({ ...form, nik: e.target.value })} /></div>
          <div><label>Alamat</label><textarea value={form.alamat} onChange={e => setForm({ ...form, alamat: e.target.value })} /></div>
          <button className="primary" type="submit">Simpan</button>
        </form>
      </div>

      <div className="card">
        <h2>Daftar Tersangka ({list.length})</h2>
        <table>
          <thead><tr><th>Nama</th><th>NIK</th><th>Alamat</th><th></th></tr></thead>
          <tbody>
            {list.map(t => (
              <tr key={t.id}>
                <td>{t.nama}</td><td>{t.nik || '-'}</td><td>{t.alamat || '-'}</td>
                <td><button className="danger" onClick={() => hapus(t.id)}>Hapus</button></td>
              </tr>
            ))}
            {list.length === 0 && <tr><td colSpan={4} className="muted">Belum ada data</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}
