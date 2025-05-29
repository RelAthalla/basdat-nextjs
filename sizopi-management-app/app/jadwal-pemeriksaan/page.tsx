'use client';

import { useState, useEffect } from 'react';

interface Jadwal {
  idHewan: string;
  tglSelanjutnya: string;  // "YYYY-MM-DD"
  freqRutin: number;
  namaHewan: string;
}

interface FormData {
  idHewan: string;
  tglSelanjutnya: string;
  freqRutin: number;
}

export default function JadwalPemeriksaanPage() {
  const [data, setData] = useState<Jadwal[]>([]);
  const [animals, setAnimals] = useState<string[]>([]);
  const [selectedAnimal, setSelectedAnimal] = useState<string | null>(null);

  const [form, setForm] = useState<FormData>({
    idHewan: '',
    tglSelanjutnya: '',
    freqRutin: 3,
  });
  const [editing, setEditing] = useState<Jadwal | null>(null);
  const [modal, setModal] = useState<'add'|'edit'|'delete'|null>(null);

  const [error, setError] = useState<string>('');

  // 1) Load joined schedules
  useEffect(() => {
    fetch('/api/jadwal-pemeriksaan')
      .then(r => r.json())
      .then((rows: Jadwal[]) => {
        setData(rows);
        // build list of unique animal names
        const names = Array.from(new Set(rows.map(r => r.namaHewan)));
        setAnimals(names);
        if (!selectedAnimal && names.length) setSelectedAnimal(names[0]);
      })
      .catch(() => setError('Gagal memuat data'));
  }, []);

  // Helpers
  const openAdd = () => {
    setForm({ idHewan:'', tglSelanjutnya:'', freqRutin:3 });
    setEditing(null);
    setModal('add');
  };
  const openEdit = (row: Jadwal) => {
    setEditing(row);
    setForm({
      idHewan: row.idHewan,
      tglSelanjutnya: row.tglSelanjutnya,
      freqRutin: row.freqRutin,
    });
    setModal('edit');
  };
  const openDelete = (row: Jadwal) => {
    setEditing(row);
    setModal('delete');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(f=>({
      ...f,
      [name]: name==='freqRutin' ? parseInt(value) : value
    }));
  };

  // CRUD calls
  const reload = () =>
    fetch('/api/jadwal-pemeriksaan')
      .then(r=>r.json())
      .then((rows:Jadwal[])=> {
        setData(rows);
        const names = Array.from(new Set(rows.map(r => r.namaHewan)));
        setAnimals(names);
      });

  const create = async () => {
    try {
      const res = await fetch('/api/jadwal-pemeriksaan', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify(form),
      });
      if (!res.ok) throw '';
      await reload();
      setModal(null);
    } catch {
      setError('Gagal menambah jadwal');
    }
  };

 const update = async () => {
  if (!editing) return;
  // normalize to date-only
  const dateOnly = editing.tglSelanjutnya.split('T')[0];

  try {
    const res = await fetch('/api/jadwal-pemeriksaan', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        idHewan:       editing.idHewan,
        origTanggal:   dateOnly,
        tglSelanjutnya: form.tglSelanjutnya,
        freqRutin:     form.freqRutin
      })
    });
    if (!res.ok) throw new Error();
    await reload();
    setModal(null);
  } catch {
    setError('Gagal mengubah jadwal');
  }
};

const remove = async () => {
  if (!editing) return;
  const dateOnly = editing.tglSelanjutnya.split('T')[0];
  try {
    const res = await fetch('/api/jadwal-pemeriksaan', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        idHewan:     editing.idHewan,
        origTanggal: dateOnly
      })
    });
    if (!res.ok) throw new Error();
    await reload();
    setModal(null);
  } catch {
    setError('Gagal menghapus jadwal');
  }
};


  // Filter for the selected animal
  const shown = selectedAnimal
    ? data.filter(d => d.namaHewan === selectedAnimal)
    : [];

  return (
    <div className="flex h-full">
      {/* LEFT: animal list */}
      <nav className="w-1/4 border-r p-4 space-y-2">
        <h2 className="font-semibold mb-2">Daftar Hewan</h2>
        {animals.map(name => (
          <button
            key={name}
            onClick={()=>setSelectedAnimal(name)}
            className={`block w-full text-left px-2 py-1 rounded ${
              name===selectedAnimal
                ? 'bg-blue-500 text-white'
                : 'hover:bg-gray-100'
            }`}
          >
            {name}
          </button>
        ))}
      </nav>

      {/* RIGHT: schedule table */}
      <div className="flex-1 p-4">
        <div className="flex justify-between mb-4">
          <h1 className="text-xl font-bold">Jadwal untuk <span className="text-blue-600">{selectedAnimal}</span></h1>
          <button
            onClick={openAdd}
            className="bg-green-500 text-white px-3 py-1 rounded"
          >
            + Tambah Jadwal
          </button>
        </div>

        {error && <div className="mb-2 text-red-600">{error}</div>}

        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-2 py-1">Tanggal</th>
              <th className="border px-2 py-1">Frekuensi (bln)</th>
              <th className="border px-2 py-1">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {shown.map(r => (
              <tr key={r.idHewan + r.tglSelanjutnya}>
                <td className="border px-2 py-1">{r.tglSelanjutnya}</td>
                <td className="border px-2 py-1">{r.freqRutin}</td>
                <td className="border px-2 py-1 space-x-2">
                  <button
                    onClick={()=>openEdit(r)}
                    className="text-blue-600 hover:underline"
                  >Edit</button>
                  <button
                    onClick={()=>openDelete(r)}
                    className="text-red-600 hover:underline"
                  >Hapus</button>
                </td>
              </tr>
            ))}
            {shown.length===0 && (
              <tr>
                <td colSpan={3} className="text-center py-4 text-gray-500">
                  Belum ada jadwal.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODALS */}
      {modal === 'add' && (
        <Modal title="Tambah Jadwal" onClose={()=>setModal(null)}>
          <div className="space-y-3">
            {/* Animal select */}
            <div>
              <label className="block mb-1">Hewan</label>
              <select
                name="idHewan"
                value={form.idHewan}
                onChange={e=>setForm(f=>({...f,idHewan:e.target.value}))}
                className="w-full border px-2 py-1 rounded"
              >
                <option value="">— Pilih Hewan —</option>
                {data
                  .map(d=>({ id:d.idHewan, nama:d.namaHewan }))
                  .filter((v,i,a)=>a.findIndex(x=>x.id===v.id)===i)
                  .map(h=>(
                    <option key={h.id} value={h.id}>{h.nama}</option>
                  ))}
              </select>
            </div>
            <div>
              <label className="block mb-1">Tanggal</label>
              <input
                type="date"
                name="tglSelanjutnya"
                value={form.tglSelanjutnya}
                onChange={handleChange}
                className="w-full border px-2 py-1 rounded"
              />
            </div>
            <div>
              <label className="block mb-1">Frekuensi (bln)</label>
              <input
                type="number"
                name="freqRutin"
                value={form.freqRutin}
                onChange={handleChange}
                className="w-full border px-2 py-1 rounded"
                min={1}
              />
            </div>
            <div className="text-right">
              <button
                onClick={()=>setModal(null)}
                className="mr-2 px-3 py-1 bg-gray-300 rounded"
              >Batal</button>
              <button
                onClick={create}
                className="px-3 py-1 bg-green-500 text-white rounded"
              >Simpan</button>
            </div>
          </div>
        </Modal>
      )}

      {modal === 'edit' && editing && (
        <Modal title="Edit Jadwal" onClose={()=>setModal(null)}>
          {/* same fields but no hewan select */}
          <div className="space-y-3">
            <div>
              <label className="block mb-1">Tanggal</label>
              <input
                type="date"
                name="tglSelanjutnya"
                value={form.tglSelanjutnya}
                onChange={handleChange}
                className="w-full border px-2 py-1 rounded"
              />
            </div>
            <div>
              <label className="block mb-1">Frekuensi (bln)</label>
              <input
                type="number"
                name="freqRutin"
                value={form.freqRutin}
                onChange={handleChange}
                className="w-full border px-2 py-1 rounded"
                min={1}
              />
            </div>
            <div className="text-right">
              <button onClick={()=>setModal(null)} className="mr-2 px-3 py-1 bg-gray-300 rounded">Batal</button>
              <button onClick={update} className="px-3 py-1 bg-blue-600 text-white rounded">Simpan</button>
            </div>
          </div>
        </Modal>
      )}

      {modal === 'delete' && editing && (
        <Modal title="Konfirmasi Hapus" onClose={()=>setModal(null)}>
          <p>Hapus jadwal tanggal <strong>{editing.tglSelanjutnya}</strong> untuk <strong>{editing.namaHewan}</strong>?</p>
          <div className="mt-4 text-right">
            <button onClick={()=>setModal(null)} className="mr-2 px-3 py-1 bg-gray-300 rounded">Tidak</button>
            <button onClick={remove} className="px-3 py-1 bg-red-600 text-white rounded">Ya, Hapus</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function Modal(props: { title: string; onClose():void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">{props.title}</h2>
          <button onClick={props.onClose} className="text-gray-500">✕</button>
        </div>
        {props.children}
      </div>
    </div>
  );
}
