'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function DakwaanPage() {
  const [list, setList] = useState<any[]>([]);
  const [berkas, setBerkas] = useState<any[]>([]);
  const [form, setForm] = useState({ nomor_p21: '', berkas_id: '', isi_dakwaan: '', pasal_didakwakan: '' });
  const [msg, setMsg] = useState('');

  const load = async () => {
    const { data } = await supabase.from('dakwaan').select('*, berkas_polisi(*)').order('created_at', { ascending: false });
    setList(data || []);
    const { data: b } = await supabase.from('berkas_polisi').select('id, nomor_bap, tersangka_nama').eq('status', 'masuk');
    setBerkas(b || []);
  };
  useEffect(() => { load(); }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('dakwaan').insert(form);
    if (error) setMsg('Error: ' + error.message);
    else {
      if (form.berkas_id) await supabase.from('berkas_polisi').update({ status: 'p21' }).eq('id', form.berkas_id);
      setMsg('Dakwaan dibuat ✓'); setForm({ nomor_p21: '', berkas_id: '', isi_dakwaan: '', pasal_didakwakan: '' }); load();
    }
  };

  const limpahkan = async (d: any) => {
    if (!confirm(`Limpahkan dakwaan ${d.nomor_p21} ke Pengadilan?`)) return;
    const res = await fetch('/api/limpahkan-dakwaan', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ dakwaan_id: d.id }) });
    const j = await res.json();
    if (res.ok) { setMsg('Dilimpahkan ke Pengadilan ✓'); load(); } else setMsg('Error: ' + j.error);
  };

  return (
    <>
      <h1>P21 / Dakwaan</h1>
      {msg && <div className={`alert ${msg.startsWith('Error') ? 'err' : 'ok'}`}>{msg}</div>}
      <div className="card">
        <h2>Buat Dakwaan</h2>
        <form onSubmit={submit}>
          <div><label>Nomor P21</label><input required value={form.nomor_p21} onChange={e => setForm({ ...form, nomor_p21: e.target.value })} placeholder="P21/001/2026" /></div>
          <div><label>Berkas dari Polisi</label>
            <select required value={form.berkas_id} onChange={e => setForm({ ...form, berkas_id: e.target.value })}>
              <option value="">-- pilih berkas --</option>
              {berkas.map(b => <option key={b.id} value={b.id}>{b.nomor_bap} — {b.tersangka_nama}</option>)}
            </select>
          </div>
          <div><label>Pasal didakwakan</label><input value={form.pasal_didakwakan} onChange={e => setForm({ ...form, pasal_didakwakan: e.target.value })} /></div>
          <div><label>Isi Dakwaan</label><textarea value={form.isi_dakwaan} onChange={e => setForm({ ...form, isi_dakwaan: e.target.value })} /></div>
          <button className="warn" type="submit">Simpan Dakwaan</button>
        </form>
      </div>

      <div className="card">
        <h2>Daftar Dakwaan ({list.length})</h2>
        <table>
          <thead><tr><th>No P21</th><th>Tersangka</th><th>Pasal</th><th>Status</th><th>Aksi</th></tr></thead>
          <tbody>
            {list.map(d => (
              <tr key={d.id}>
                <td>{d.nomor_p21}</td><td>{d.berkas_polisi?.tersangka_nama}</td><td>{d.pasal_didakwakan}</td>
                <td><span className={`badge ${d.status === 'draft' ? 'draft' : 'dikirim'}`}>{d.status}</span></td>
                <td>{d.status === 'draft' ? <button className="success" onClick={() => limpahkan(d)}>Limpahkan ke Pengadilan</button> : <span className="muted">terlimpah</span>}</td>
              </tr>
            ))}
            {list.length === 0 && <tr><td colSpan={5} className="muted">Belum ada dakwaan</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}
