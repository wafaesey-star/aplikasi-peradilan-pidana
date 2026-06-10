'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function Page() {
  const [list, setList] = useState<any[]>([]);
  const [napi, setNapi] = useState<any[]>([]);
  const [form, setForm] = useState({ napi_id: '', jenis: 'umum', lama: '', keterangan: '' });
  const [msg, setMsg] = useState('');
  const load = async () => {
    const { data } = await supabase.from('remisi').select('*, napi(nama)').order('created_at', { ascending: false });
    setList(data || []);
    const { data: n } = await supabase.from('napi').select('id, nama').eq('status', 'aktif');
    setNapi(n || []);
  };
  useEffect(() => { load(); }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('remisi').insert(form);
    if (error) setMsg('Error: ' + error.message);
    else { setMsg('Remisi diberikan ✓'); setForm({ napi_id: '', jenis: 'umum', lama: '', keterangan: '' }); load(); }
  };

  return (
    <>
      <h1>Remisi</h1>
      {msg && <div className={`alert ${msg.startsWith('Error') ? 'err' : 'ok'}`}>{msg}</div>}
      <div className="card">
        <h2>Berikan Remisi</h2>
        <form onSubmit={submit}>
          <div><label>Napi</label>
            <select required value={form.napi_id} onChange={e => setForm({ ...form, napi_id: e.target.value })}>
              <option value="">-- pilih --</option>
              {napi.map(n => <option key={n.id} value={n.id}>{n.nama}</option>)}
            </select>
          </div>
          <div><label>Jenis Remisi</label>
            <select value={form.jenis} onChange={e => setForm({ ...form, jenis: e.target.value })}>
              <option value="umum">Umum (17 Agustus)</option>
              <option value="khusus">Khusus (Hari Raya)</option>
              <option value="kemerdekaan">Dasawarsa</option>
            </select>
          </div>
          <div><label>Lama Remisi</label><input value={form.lama} onChange={e => setForm({ ...form, lama: e.target.value })} placeholder="1 bulan" /></div>
          <div><label>Keterangan</label><textarea value={form.keterangan} onChange={e => setForm({ ...form, keterangan: e.target.value })} /></div>
          <button className="danger" type="submit">Simpan</button>
        </form>
      </div>

      <div className="card">
        <table>
          <thead><tr><th>Napi</th><th>Jenis</th><th>Lama</th><th>Tanggal</th><th>Keterangan</th></tr></thead>
          <tbody>
            {list.map(r => <tr key={r.id}><td>{r.napi?.nama}</td><td>{r.jenis}</td><td>{r.lama}</td><td>{r.tanggal}</td><td>{r.keterangan}</td></tr>)}
            {list.length === 0 && <tr><td colSpan={5} className="muted">Belum ada remisi</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}
