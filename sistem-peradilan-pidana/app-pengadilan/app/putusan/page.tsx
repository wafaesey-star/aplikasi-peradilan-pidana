'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function Page() {
  const [list, setList] = useState<any[]>([]);
  const [dakwaan, setDakwaan] = useState<any[]>([]);
  const [form, setForm] = useState({ nomor_putusan: '', dakwaan_id: '', jenis: 'pidana', lama_hukuman: '', isi_putusan: '' });
  const [msg, setMsg] = useState('');

  const load = async () => {
    const { data } = await supabase.from('putusan').select('*, dakwaan_masuk(nomor_p21, tersangka_nama)').order('created_at', { ascending: false });
    setList(data || []);
    const { data: d } = await supabase.from('dakwaan_masuk').select('id, nomor_p21, tersangka_nama');
    setDakwaan(d || []);
  };
  useEffect(() => { load(); }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('putusan').insert(form);
    if (error) setMsg('Error: ' + error.message);
    else {
      if (form.dakwaan_id) await supabase.from('dakwaan_masuk').update({ status: 'putus' }).eq('id', form.dakwaan_id);
      setMsg('Putusan disimpan ✓'); setForm({ nomor_putusan: '', dakwaan_id: '', jenis: 'pidana', lama_hukuman: '', isi_putusan: '' }); load();
    }
  };

  const kirim = async (p: any) => {
    if (p.jenis === 'bebas') {
      if (!confirm(`Kirim notif bebas untuk ${p.nomor_putusan} ke Polisi?`)) return;
      const res = await fetch('/api/notif-bebas', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ putusan_id: p.id }) });
      const j = await res.json();
      if (res.ok) { setMsg('Notif bebas terkirim ke Polisi ✓'); load(); } else setMsg('Error: ' + j.error);
    } else {
      if (!confirm(`Kirim vonis ${p.nomor_putusan} ke Lapas?`)) return;
      const res = await fetch('/api/kirim-vonis', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ putusan_id: p.id }) });
      const j = await res.json();
      if (res.ok) { setMsg('Vonis terkirim ke Lapas ✓'); load(); } else setMsg('Error: ' + j.error);
    }
  };

  return (
    <>
      <h1>Putusan / Vonis</h1>
      {msg && <div className={`alert ${msg.startsWith('Error') ? 'err' : 'ok'}`}>{msg}</div>}
      <div className="card">
        <h2>Buat Putusan</h2>
        <form onSubmit={submit}>
          <div><label>Nomor Putusan</label><input required value={form.nomor_putusan} onChange={e => setForm({ ...form, nomor_putusan: e.target.value })} /></div>
          <div><label>Dakwaan</label>
            <select required value={form.dakwaan_id} onChange={e => setForm({ ...form, dakwaan_id: e.target.value })}>
              <option value="">-- pilih --</option>
              {dakwaan.map(d => <option key={d.id} value={d.id}>{d.nomor_p21} — {d.tersangka_nama}</option>)}
            </select>
          </div>
          <div><label>Jenis Putusan</label>
            <select value={form.jenis} onChange={e => setForm({ ...form, jenis: e.target.value })}>
              <option value="pidana">Pidana (penjara)</option>
              <option value="bebas">Bebas</option>
            </select>
          </div>
          {form.jenis === 'pidana' && (
            <div><label>Lama Hukuman</label><input value={form.lama_hukuman} onChange={e => setForm({ ...form, lama_hukuman: e.target.value })} placeholder="contoh: 4 tahun" /></div>
          )}
          <div><label>Isi Putusan</label><textarea value={form.isi_putusan} onChange={e => setForm({ ...form, isi_putusan: e.target.value })} /></div>
          <button className="success" type="submit">Simpan</button>
        </form>
      </div>

      <div className="card">
        <table>
          <thead><tr><th>No Putusan</th><th>Terdakwa</th><th>Jenis</th><th>Hukuman</th><th>Status</th><th>Aksi</th></tr></thead>
          <tbody>
            {list.map(p => (
              <tr key={p.id}>
                <td>{p.nomor_putusan}</td><td>{p.dakwaan_masuk?.tersangka_nama}</td>
                <td>{p.jenis}</td><td>{p.lama_hukuman || '-'}</td>
                <td><span className={`badge ${p.status === 'draft' ? 'draft' : 'dikirim'}`}>{p.status}</span></td>
                <td>{p.status === 'draft' ? <button className={p.jenis === 'bebas' ? 'danger' : 'success'} onClick={() => kirim(p)}>{p.jenis === 'bebas' ? 'Notif Polisi' : 'Kirim ke Lapas'}</button> : <span className="muted">terkirim</span>}</td>
              </tr>
            ))}
            {list.length === 0 && <tr><td colSpan={6} className="muted">Belum ada putusan</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}
