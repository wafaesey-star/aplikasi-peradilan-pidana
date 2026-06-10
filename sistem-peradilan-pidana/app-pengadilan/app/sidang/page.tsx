'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function Page() {
  const [list, setList] = useState<any[]>([]);
  const [dakwaan, setDakwaan] = useState<any[]>([]);
  const [form, setForm] = useState({ dakwaan_id: '', nomor_perkara: '', tanggal_sidang: '', hakim: '', agenda: '' });
  const [msg, setMsg] = useState('');

  const load = async () => {
    const { data } = await supabase.from('sidang').select('*, dakwaan_masuk(nomor_p21, tersangka_nama)').order('tanggal_sidang', { ascending: false });
    setList(data || []);
    const { data: d } = await supabase.from('dakwaan_masuk').select('id, nomor_p21, tersangka_nama');
    setDakwaan(d || []);
  };
  useEffect(() => { load(); }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('sidang').insert(form);
    if (error) setMsg('Error: ' + error.message);
    else {
      if (form.dakwaan_id) await supabase.from('dakwaan_masuk').update({ status: 'sidang' }).eq('id', form.dakwaan_id);
      setMsg('Sidang terjadwal ✓'); setForm({ dakwaan_id: '', nomor_perkara: '', tanggal_sidang: '', hakim: '', agenda: '' }); load();
    }
  };

  return (
    <>
      <h1>e-Court — Jadwal Sidang</h1>
      {msg && <div className={`alert ${msg.startsWith('Error') ? 'err' : 'ok'}`}>{msg}</div>}
      <div className="card">
        <h2>Jadwalkan Sidang</h2>
        <form onSubmit={submit}>
          <div><label>Dakwaan</label>
            <select required value={form.dakwaan_id} onChange={e => setForm({ ...form, dakwaan_id: e.target.value })}>
              <option value="">-- pilih --</option>
              {dakwaan.map(d => <option key={d.id} value={d.id}>{d.nomor_p21} — {d.tersangka_nama}</option>)}
            </select>
          </div>
          <div><label>Nomor Perkara</label><input required value={form.nomor_perkara} onChange={e => setForm({ ...form, nomor_perkara: e.target.value })} placeholder="123/Pid.B/2026/PN.JKT" /></div>
          <div><label>Tanggal Sidang</label><input required type="date" value={form.tanggal_sidang} onChange={e => setForm({ ...form, tanggal_sidang: e.target.value })} /></div>
          <div><label>Hakim Ketua</label><input value={form.hakim} onChange={e => setForm({ ...form, hakim: e.target.value })} /></div>
          <div><label>Agenda</label><input value={form.agenda} onChange={e => setForm({ ...form, agenda: e.target.value })} placeholder="Pembacaan dakwaan, pemeriksaan saksi..." /></div>
          <button className="success" type="submit">Jadwalkan</button>
        </form>
      </div>

      <div className="card">
        <table>
          <thead><tr><th>No Perkara</th><th>Tanggal</th><th>Dakwaan</th><th>Hakim</th><th>Agenda</th><th>Status</th></tr></thead>
          <tbody>
            {list.map(s => (
              <tr key={s.id}>
                <td>{s.nomor_perkara}</td><td>{s.tanggal_sidang}</td><td>{s.dakwaan_masuk?.nomor_p21}</td>
                <td>{s.hakim}</td><td>{s.agenda}</td>
                <td><span className={`badge ${s.status === 'terjadwal' ? 'draft' : 'dikirim'}`}>{s.status}</span></td>
              </tr>
            ))}
            {list.length === 0 && <tr><td colSpan={6} className="muted">Belum ada sidang</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}
