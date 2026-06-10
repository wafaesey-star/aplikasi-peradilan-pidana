'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function Page() {
  const [list, setList] = useState<any[]>([]);
  const [napi, setNapi] = useState<any[]>([]);
  const [form, setForm] = useState({ napi_id: '', jenis_bebas: 'bebas murni', keterangan: '' });
  const [msg, setMsg] = useState('');
  const load = async () => {
    const { data } = await supabase.from('status_bebas').select('*, napi(nama, nomor_putusan)').order('created_at', { ascending: false });
    setList(data || []);
    const { data: n } = await supabase.from('napi').select('id, nama').eq('status', 'aktif');
    setNapi(n || []);
  };
  useEffect(() => { load(); }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('status_bebas').insert(form);
    if (error) setMsg('Error: ' + error.message);
    else {
      await supabase.from('napi').update({ status: 'bebas' }).eq('id', form.napi_id);
      setMsg('Status bebas dicatat ✓'); setForm({ napi_id: '', jenis_bebas: 'bebas murni', keterangan: '' }); load();
    }
  };

  return (
    <>
      <h1>Status Bebas</h1>
      {msg && <div className={`alert ${msg.startsWith('Error') ? 'err' : 'ok'}`}>{msg}</div>}
      <div className="card">
        <h2>Catat Pembebasan</h2>
        <form onSubmit={submit}>
          <div><label>Napi</label>
            <select required value={form.napi_id} onChange={e => setForm({ ...form, napi_id: e.target.value })}>
              <option value="">-- pilih --</option>
              {napi.map(n => <option key={n.id} value={n.id}>{n.nama}</option>)}
            </select>
          </div>
          <div><label>Jenis Bebas</label>
            <select value={form.jenis_bebas} onChange={e => setForm({ ...form, jenis_bebas: e.target.value })}>
              <option value="bebas murni">Bebas Murni</option>
              <option value="bebas bersyarat">Bebas Bersyarat</option>
              <option value="cuti menjelang bebas">Cuti Menjelang Bebas</option>
            </select>
          </div>
          <div><label>Keterangan</label><textarea value={form.keterangan} onChange={e => setForm({ ...form, keterangan: e.target.value })} /></div>
          <button className="danger" type="submit">Simpan</button>
        </form>
      </div>

      <div className="card">
        <table>
          <thead><tr><th>Napi</th><th>No Putusan</th><th>Jenis</th><th>Tanggal Bebas</th><th>Keterangan</th></tr></thead>
          <tbody>
            {list.map(b => <tr key={b.id}><td>{b.napi?.nama}</td><td>{b.napi?.nomor_putusan}</td><td>{b.jenis_bebas}</td><td>{b.tanggal_bebas}</td><td>{b.keterangan}</td></tr>)}
            {list.length === 0 && <tr><td colSpan={5} className="muted">Belum ada data</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}
