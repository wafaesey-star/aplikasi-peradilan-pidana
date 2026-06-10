'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function BapPage() {
  const [list, setList] = useState<any[]>([]);
  const [spdp, setSpdp] = useState<any[]>([]);
  const [form, setForm] = useState({ nomor_bap: '', spdp_id: '', isi_bap: '' });
  const [msg, setMsg] = useState('');

  const load = async () => {
    const { data } = await supabase.from('bap').select('*, spdp(nomor_spdp, perkara, pasal, tersangka(nama, nik))').order('created_at', { ascending: false });
    setList(data || []);
    const { data: s } = await supabase.from('spdp').select('id, nomor_spdp');
    setSpdp(s || []);
  };
  useEffect(() => { load(); }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('bap').insert(form);
    if (error) setMsg('Error: ' + error.message);
    else { setMsg('BAP dibuat ✓'); setForm({ nomor_bap: '', spdp_id: '', isi_bap: '' }); load(); }
  };

  const kirimKeKejaksaan = async (bap: any) => {
    if (!confirm(`Kirim BAP ${bap.nomor_bap} + SPDP ke Kejaksaan?`)) return;
    try {
      const res = await fetch('/api/kirim-bap', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ bap_id: bap.id }) });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || 'Gagal');
      setMsg('BAP berhasil dikirim ke Kejaksaan ✓');
      load();
    } catch (e: any) { setMsg('Error: ' + e.message); }
  };

  return (
    <>
      <h1>BAP Digital</h1>
      {msg && <div className={`alert ${msg.startsWith('Error') ? 'err' : 'ok'}`}>{msg}</div>}
      <div className="card">
        <h2>Buat BAP Baru</h2>
        <form onSubmit={submit}>
          <div><label>Nomor BAP</label><input required value={form.nomor_bap} onChange={e => setForm({ ...form, nomor_bap: e.target.value })} placeholder="BAP/001/2026" /></div>
          <div><label>SPDP terkait</label>
            <select required value={form.spdp_id} onChange={e => setForm({ ...form, spdp_id: e.target.value })}>
              <option value="">-- pilih SPDP --</option>
              {spdp.map(s => <option key={s.id} value={s.id}>{s.nomor_spdp}</option>)}
            </select>
          </div>
          <div><label>Isi BAP</label><textarea value={form.isi_bap} onChange={e => setForm({ ...form, isi_bap: e.target.value })} placeholder="Ringkasan keterangan tersangka, saksi, barang bukti..." /></div>
          <button className="primary" type="submit">Simpan BAP</button>
        </form>
      </div>

      <div className="card">
        <h2>Daftar BAP ({list.length})</h2>
        <table>
          <thead><tr><th>Nomor BAP</th><th>SPDP</th><th>Tersangka</th><th>Status</th><th>Aksi</th></tr></thead>
          <tbody>
            {list.map(b => (
              <tr key={b.id}>
                <td>{b.nomor_bap}</td><td>{b.spdp?.nomor_spdp || '-'}</td><td>{b.spdp?.tersangka?.nama || '-'}</td>
                <td><span className={`badge ${b.status}`}>{b.status}</span></td>
                <td>{b.status === 'draft' ? <button className="success" onClick={() => kirimKeKejaksaan(b)}>Kirim ke Kejaksaan</button> : <span className="muted">terkirim</span>}</td>
              </tr>
            ))}
            {list.length === 0 && <tr><td colSpan={5} className="muted">Belum ada data</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}
