'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function SpdpPage() {
  const [list, setList] = useState<any[]>([]);
  const [tersangka, setTersangka] = useState<any[]>([]);
  const [form, setForm] = useState({ nomor_spdp: '', tersangka_id: '', perkara: '', pasal: '' });
  const [msg, setMsg] = useState('');

  const load = async () => {
    const { data } = await supabase.from('spdp').select('*, tersangka(nama)').order('created_at', { ascending: false });
    setList(data || []);
    const { data: t } = await supabase.from('tersangka').select('id,nama');
    setTersangka(t || []);
  };
  useEffect(() => { load(); }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('spdp').insert(form);
    if (error) setMsg('Error: ' + error.message);
    else { setMsg('SPDP dibuat ✓'); setForm({ nomor_spdp: '', tersangka_id: '', perkara: '', pasal: '' }); load(); }
  };

  return (
    <>
      <h1>SPDP — Surat Pemberitahuan Dimulainya Penyidikan</h1>
      {msg && <div className={`alert ${msg.startsWith('Error') ? 'err' : 'ok'}`}>{msg}</div>}
      <div className="card">
        <h2>Buat SPDP Baru</h2>
        <form onSubmit={submit}>
          <div><label>Nomor SPDP</label><input required value={form.nomor_spdp} onChange={e => setForm({ ...form, nomor_spdp: e.target.value })} placeholder="SPDP/001/2026" /></div>
          <div><label>Tersangka</label>
            <select required value={form.tersangka_id} onChange={e => setForm({ ...form, tersangka_id: e.target.value })}>
              <option value="">-- pilih tersangka --</option>
              {tersangka.map(t => <option key={t.id} value={t.id}>{t.nama}</option>)}
            </select>
          </div>
          <div><label>Perkara</label><input required value={form.perkara} onChange={e => setForm({ ...form, perkara: e.target.value })} /></div>
          <div><label>Pasal</label><input value={form.pasal} onChange={e => setForm({ ...form, pasal: e.target.value })} placeholder="Pasal 363 KUHP" /></div>
          <button className="primary" type="submit">Simpan SPDP</button>
        </form>
      </div>

      <div className="card">
        <h2>Daftar SPDP ({list.length})</h2>
        <table>
          <thead><tr><th>Nomor</th><th>Tersangka</th><th>Perkara</th><th>Pasal</th><th>Status</th></tr></thead>
          <tbody>
            {list.map(s => (
              <tr key={s.id}>
                <td>{s.nomor_spdp}</td><td>{s.tersangka?.nama || '-'}</td><td>{s.perkara}</td><td>{s.pasal || '-'}</td>
                <td><span className={`badge ${s.status}`}>{s.status}</span></td>
              </tr>
            ))}
            {list.length === 0 && <tr><td colSpan={5} className="muted">Belum ada data</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}
