'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function TuntutanPage() {
  const [list, setList] = useState<any[]>([]);
  const [dakwaan, setDakwaan] = useState<any[]>([]);
  const [form, setForm] = useState({ nomor_tuntutan: '', dakwaan_id: '', isi_tuntutan: '', lama_hukuman: '' });
  const [msg, setMsg] = useState('');

  const load = async () => {
    const { data } = await supabase.from('tuntutan').select('*, dakwaan(nomor_p21)').order('created_at', { ascending: false });
    setList(data || []);
    const { data: d } = await supabase.from('dakwaan').select('id, nomor_p21');
    setDakwaan(d || []);
  };
  useEffect(() => { load(); }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('tuntutan').insert(form);
    if (error) setMsg('Error: ' + error.message);
    else { setMsg('Tuntutan disimpan ✓'); setForm({ nomor_tuntutan: '', dakwaan_id: '', isi_tuntutan: '', lama_hukuman: '' }); load(); }
  };

  return (
    <>
      <h1>Tuntutan</h1>
      {msg && <div className={`alert ${msg.startsWith('Error') ? 'err' : 'ok'}`}>{msg}</div>}
      <div className="card">
        <h2>Buat Tuntutan</h2>
        <form onSubmit={submit}>
          <div><label>Nomor Tuntutan</label><input required value={form.nomor_tuntutan} onChange={e => setForm({ ...form, nomor_tuntutan: e.target.value })} /></div>
          <div><label>Dakwaan</label>
            <select required value={form.dakwaan_id} onChange={e => setForm({ ...form, dakwaan_id: e.target.value })}>
              <option value="">-- pilih --</option>
              {dakwaan.map(d => <option key={d.id} value={d.id}>{d.nomor_p21}</option>)}
            </select>
          </div>
          <div><label>Lama hukuman dituntut</label><input value={form.lama_hukuman} onChange={e => setForm({ ...form, lama_hukuman: e.target.value })} placeholder="contoh: 5 tahun" /></div>
          <div><label>Isi Tuntutan</label><textarea value={form.isi_tuntutan} onChange={e => setForm({ ...form, isi_tuntutan: e.target.value })} /></div>
          <button className="warn" type="submit">Simpan</button>
        </form>
      </div>

      <div className="card">
        <table>
          <thead><tr><th>No Tuntutan</th><th>Dakwaan</th><th>Lama Hukuman</th><th>Tanggal</th></tr></thead>
          <tbody>
            {list.map(t => <tr key={t.id}><td>{t.nomor_tuntutan}</td><td>{t.dakwaan?.nomor_p21}</td><td>{t.lama_hukuman}</td><td>{t.tanggal}</td></tr>)}
            {list.length === 0 && <tr><td colSpan={4} className="muted">Belum ada tuntutan</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}
