"use client";

import { useState, useEffect } from 'react';
import '../globals.css';

interface JadwalPemeriksaan {
  id: number;
  idHewan: number;
  tanggalPemeriksaan: string;
  waktuPemeriksaan: string;
  jenisPemeriksaan: string;
  namaDokter: string;
  statusJadwal: string;
}

interface FormData {
  idHewan: number;
  tanggalPemeriksaan: string;
  waktuPemeriksaan: string;
  jenisPemeriksaan: string;
  namaDokter: string;
  statusJadwal: string;
}

export default function JadwalPemeriksaanPage() {
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [selectedJadwal, setSelectedJadwal] = useState<JadwalPemeriksaan | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  
  const [jadwalPemeriksaan, setJadwalPemeriksaan] = useState<JadwalPemeriksaan[]>([]);
  
  // Form state
  const [formData, setFormData] = useState<FormData>({
    idHewan: 0,
    tanggalPemeriksaan: '',
    waktuPemeriksaan: '',
    jenisPemeriksaan: 'Rutin',
    namaDokter: '',
    statusJadwal: 'Terjadwal'
  });

  // Fetch jadwal pemeriksaan from API
  useEffect(() => {
    fetchJadwalPemeriksaan();
  }, []);

  const fetchJadwalPemeriksaan = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/jadwal-pemeriksaan');
      if (!response.ok) throw new Error('Failed to fetch jadwal pemeriksaan');
      
      const data = await response.json();
      setJadwalPemeriksaan(data);
    } catch (err) {
      setError('Gagal memuat jadwal pemeriksaan');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'idHewan' ? parseInt(value) : value
    });
  };

  const handleAddJadwal = async () => {
    try {
      const response = await fetch('/api/jadwal-pemeriksaan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to add jadwal');

      await fetchJadwalPemeriksaan(); // Refresh data
      setShowAddModal(false);
      
      // Reset form
      setFormData({
        idHewan: 0,
        tanggalPemeriksaan: '',
        waktuPemeriksaan: '',
        jenisPemeriksaan: 'Rutin',
        namaDokter: '',
        statusJadwal: 'Terjadwal'
      });
    } catch (err) {
      setError('Gagal menambah jadwal pemeriksaan');
      console.error(err);
    }
  };

  const handleEditJadwal = async () => {
    if (!selectedJadwal) return;
    
    try {
      const response = await fetch(`/api/jadwal-pemeriksaan?id=${selectedJadwal.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to update jadwal');

      await fetchJadwalPemeriksaan(); // Refresh data
      setShowEditModal(false);
      setSelectedJadwal(null);
    } catch (err) {
      setError('Gagal mengupdate jadwal pemeriksaan');
      console.error(err);
    }
  };

  const handleDeleteJadwal = async () => {
    if (!selectedJadwal) return;
    
    try {
      const response = await fetch(`/api/jadwal-pemeriksaan?id=${selectedJadwal.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete jadwal');

      await fetchJadwalPemeriksaan(); // Refresh data
      setShowDeleteModal(false);
      setSelectedJadwal(null);
    } catch (err) {
      setError('Gagal menghapus jadwal pemeriksaan');
      console.error(err);
    }
  };

  const openEditModal = (jadwal: JadwalPemeriksaan) => {
    setSelectedJadwal(jadwal);
    setFormData({
      idHewan: jadwal.idHewan,
      tanggalPemeriksaan: jadwal.tanggalPemeriksaan,
      waktuPemeriksaan: jadwal.waktuPemeriksaan,
      jenisPemeriksaan: jadwal.jenisPemeriksaan,
      namaDokter: jadwal.namaDokter,
      statusJadwal: jadwal.statusJadwal
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (jadwal: JadwalPemeriksaan) => {
    setSelectedJadwal(jadwal);
    setShowDeleteModal(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">JADWAL PEMERIKSAAN KESEHATAN</h1>
      
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
      <div className="mb-6">
        <div className="flex items-center bg-blue-50 p-4 rounded-lg">
          <div className="mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="text-blue-700 font-medium">Frekuensi Pemeriksaan Rutin: 3 bulan sekali</p>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-700">Jadwal Pemeriksaan</h2>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md"
        >
          + Tambah Jadwal Pemeriksaan
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID Hewan</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Waktu</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jenis Pemeriksaan</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Dokter</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {jadwalPemeriksaan.map((jadwal) => (
              <tr key={jadwal.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{jadwal.idHewan}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{jadwal.tanggalPemeriksaan}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{jadwal.waktuPemeriksaan}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{jadwal.jenisPemeriksaan}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{jadwal.namaDokter}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    jadwal.statusJadwal === 'Selesai' ? 'bg-green-100 text-green-800' : 
                    jadwal.statusJadwal === 'Terjadwal' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {jadwal.statusJadwal}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => openEditModal(jadwal)}
                    className="text-indigo-600 hover:text-indigo-900 mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => openDeleteModal(jadwal)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Jadwal Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg w-full max-w-md mx-4 p-6">
            <h2 className="text-xl font-bold mb-4">TAMBAH JADWAL PEMERIKSAAN</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">ID Hewan</label>
                <input
                  type="number"
                  name="idHewan"
                  value={formData.idHewan}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Tanggal Pemeriksaan</label>
                <input
                  type="date"
                  name="tanggalPemeriksaan"
                  value={formData.tanggalPemeriksaan}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Waktu Pemeriksaan</label>
                <input
                  type="time"
                  name="waktuPemeriksaan"
                  value={formData.waktuPemeriksaan}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Jenis Pemeriksaan</label>
                <select
                  name="jenisPemeriksaan"
                  value={formData.jenisPemeriksaan}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Rutin">Rutin</option>
                  <option value="Darurat">Darurat</option>
                  <option value="Khusus">Khusus</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Nama Dokter</label>
                <input
                  type="text"
                  name="namaDokter"
                  value={formData.namaDokter}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Status Jadwal</label>
                <select
                  name="statusJadwal"
                  value={formData.statusJadwal}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Terjadwal">Terjadwal</option>
                  <option value="Berlangsung">Berlangsung</option>
                  <option value="Selesai">Selesai</option>
                  <option value="Dibatalkan">Dibatalkan</option>
                </select>
              </div>
            </div>
            <div className="mt-5 flex justify-end space-x-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded-md text-sm font-medium"
              >
                BATAL
              </button>
              <button
                onClick={handleAddJadwal}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                SIMPAN
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedJadwal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg w-full max-w-md mx-4 p-6">
            <h2 className="text-xl font-bold mb-4">EDIT JADWAL PEMERIKSAAN</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Tanggal Pemeriksaan</label>
                <input
                  type="date"
                  name="tanggalPemeriksaan"
                  value={formData.tanggalPemeriksaan}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Waktu Pemeriksaan</label>
                <input
                  type="time"
                  name="waktuPemeriksaan"
                  value={formData.waktuPemeriksaan}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Status Jadwal</label>
                <select
                  name="statusJadwal"
                  value={formData.statusJadwal}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Terjadwal">Terjadwal</option>
                  <option value="Berlangsung">Berlangsung</option>
                  <option value="Selesai">Selesai</option>
                  <option value="Dibatalkan">Dibatalkan</option>
                </select>
              </div>
            </div>
            <div className="mt-5 flex justify-end space-x-3">
              <button
                onClick={() => setShowEditModal(false)}
                className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded-md text-sm font-medium"
              >
                BATAL
              </button>
              <button
                onClick={handleEditJadwal}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                SIMPAN
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && selectedJadwal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg w-full max-w-md mx-4 p-6">
            <h2 className="text-xl font-bold mb-4">HAPUS JADWAL PEMERIKSAAN</h2>
            <p className="mb-4">Apakah anda yakin ingin menghapus jadwal pemeriksaan ini?</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded-md text-sm font-medium"
              >
                TIDAK
              </button>
              <button
                onClick={handleDeleteJadwal}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                YA
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}