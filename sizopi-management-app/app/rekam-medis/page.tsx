"use client";

import { useState, useEffect } from 'react';
import { getAllRekamMedis, addRekamMedis, updateRekamMedis, deleteRekamMedis } from '@/services/rekamMedisService';
import '../globals.css';

interface MedicalRecord {
  idHewan: string;
  usernameDh: string;
  tanggalPemeriksaan: string;
  diagnosis: string;
  pengobatan: string;
  statusKesehatan: string;
  catatanTindakLanjut: string;
}

interface FormData {
  idHewan: string;
  usernameDh: string;
  tanggalPemeriksaan: string;
  diagnosis: string;
  pengobatan: string;
  statusKesehatan: string;
  catatanTindakLanjut: string;
}

export default function RekamMedis() {
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);

  // Form state
  const [formData, setFormData] = useState<FormData>({
    idHewan: '',
    usernameDh: '',
    tanggalPemeriksaan: '',
    diagnosis: '',
    pengobatan: '',
    statusKesehatan: 'Sehat',
    catatanTindakLanjut: ''
  });

  // Fetch medical records from API
  useEffect(() => {
    fetchMedicalRecords();
  }, []);

  const fetchMedicalRecords = async () => {
    try {
      setLoading(true);
      const data = await getAllRekamMedis();
      setMedicalRecords(data);
    } catch (err) {
      setError('Gagal memuat rekam medis');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleAddRecord = async () => {
    try {
      await addRekamMedis(formData as any);
      await fetchMedicalRecords();
      setShowAddModal(false);
      setFormData({
        idHewan: '',
        usernameDh: '',
        tanggalPemeriksaan: '',
        diagnosis: '',
        pengobatan: '',
        statusKesehatan: 'Sehat',
        catatanTindakLanjut: ''
      });
    } catch (err) {
      setError('Gagal menambah rekam medis');
      console.error(err);
    }
  };

  const handleEditRecord = async () => {
    if (!selectedRecord) return;
    
    try {
      await updateRekamMedis(
        selectedRecord.idHewan,
        selectedRecord.tanggalPemeriksaan,
        {
          diagnosis: formData.diagnosis,
          pengobatan: formData.pengobatan,
          catatanTindakLanjut: formData.catatanTindakLanjut
        }
      );
      
      await fetchMedicalRecords();
      setShowEditModal(false);
      setSelectedRecord(null);
      setError('');
      alert('Rekam medis berhasil diupdate!');
    } catch (err) {
      console.error("Edit error:", err);
      if (err instanceof Error) {
        setError(`Gagal mengupdate rekam medis: ${err.message}`);
      }
    }
  };

  const handleDeleteRecord = async () => {
    if (!selectedRecord) return;
    
    try {
      await deleteRekamMedis(selectedRecord.idHewan, selectedRecord.tanggalPemeriksaan);
      await fetchMedicalRecords();
      setShowDeleteModal(false);
      setSelectedRecord(null);
      setError('');
      alert('Rekam medis berhasil dihapus!');
    } catch (err) {
      console.error("Delete error:", err);
      if (err instanceof Error) {
        setError(`Gagal menghapus rekam medis: ${err.message}`);
      }
    }
  };

  const openEditModal = (record: MedicalRecord) => {
    setSelectedRecord(record);
    setFormData({
      idHewan: record.idHewan,
      usernameDh: record.usernameDh,
      tanggalPemeriksaan: record.tanggalPemeriksaan,
      diagnosis: record.diagnosis,
      pengobatan: record.pengobatan,
      statusKesehatan: record.statusKesehatan,
      catatanTindakLanjut: record.catatanTindakLanjut
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (record: MedicalRecord) => {
    setSelectedRecord(record);
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">REKAM MEDIS</h1>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md"
        >
          + Tambah Rekam Medis
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID Hewan</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username Dokter</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal Pemeriksaan</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status Kesehatan</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Diagnosis</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pengobatan</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Catatan Tindak Lanjut</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {medicalRecords.map((record, index) => (
              <tr key={`${record.idHewan}-${record.tanggalPemeriksaan}-${index}`}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.idHewan}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.usernameDh}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.tanggalPemeriksaan}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    record.statusKesehatan === 'Sehat' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {record.statusKesehatan}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.diagnosis}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.pengobatan}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.catatanTindakLanjut}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {record.statusKesehatan === 'Sakit' && (
                    <button
                      onClick={() => openEditModal(record)}
                      className="text-indigo-600 hover:text-indigo-900 mr-2"
                    >
                      Edit
                    </button>
                  )}
                  <button
                    onClick={() => openDeleteModal(record)}
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

      {/* Add Record Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg w-full max-w-md mx-4 p-6">
            <h2 className="text-xl font-bold mb-4">FORM PENCATATAN REKAM MEDIS</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">ID Hewan</label>
                <input
                  type="text"
                  name="idHewan"
                  value={formData.idHewan}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Username Dokter</label>
                <input
                  type="text"
                  name="usernameDh"
                  value={formData.usernameDh}
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
                <label className="block text-sm font-medium text-gray-700">Status Kesehatan</label>
                <select
                  name="statusKesehatan"
                  value={formData.statusKesehatan}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Sehat">Sehat</option>
                  <option value="Sakit">Sakit</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Diagnosis</label>
                <input
                  type="text"
                  name="diagnosis"
                  value={formData.diagnosis}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Pengobatan</label>
                <input
                  type="text"
                  name="pengobatan"
                  value={formData.pengobatan}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Catatan Tindak Lanjut</label>
                <input
                  type="text"
                  name="catatanTindakLanjut"
                  value={formData.catatanTindakLanjut}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
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
                onClick={handleAddRecord}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                SIMPAN
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Record Modal */}
      {showEditModal && selectedRecord && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg w-full max-w-md mx-4 p-6">
            <h2 className="text-xl font-bold mb-4">EDIT REKAM MEDIS</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Diagnosis Baru</label>
                <input
                  type="text"
                  name="diagnosis"
                  value={formData.diagnosis}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Pengobatan Baru</label>
                <input
                  type="text"
                  name="pengobatan"
                  value={formData.pengobatan}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Catatan Tindak Lanjut</label>
                <input
                  type="text"
                  name="catatanTindakLanjut"
                  value={formData.catatanTindakLanjut}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Catatan tindak lanjut (opsional)"
                />
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
                onClick={handleEditRecord}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                SIMPAN
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedRecord && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg w-full max-w-md mx-4 p-6">
            <h2 className="text-xl font-bold mb-4">HAPUS REKAM MEDIS</h2>
            <p className="mb-4">Apakah anda yakin ingin menghapus rekam medis ini?</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded-md text-sm font-medium"
              >
                TIDAK
              </button>
              <button
                onClick={handleDeleteRecord}
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