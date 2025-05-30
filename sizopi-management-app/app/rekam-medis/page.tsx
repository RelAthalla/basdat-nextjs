"use client";

import { useState, useEffect } from 'react';
import '../globals.css';

interface MedicalRecord {
  idHewan: string;
  namaHewan?: string;
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

interface Animal {
  id: string;
  namaIndividu: string;
  spesies: string;
}

export default function RekamMedis() {
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [animals, setAnimals] = useState<Animal[]>([]);

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

  // helper: normalize any date input to PostgreSQL date format
  const toPgDate = (input: string) => {
    const d = new Date(input);
    if (isNaN(d.getTime())) throw new Error("Invalid date");
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
  };

  // Fetch medical records from API
  useEffect(() => {
    // Get current user data
    const userString = localStorage.getItem('user');
    if (userString) {
      const user = JSON.parse(userString);
      setCurrentUser(user);
      setFormData(prev => ({
        ...prev,
        usernameDh: user.username
      }));
    }

    fetchMedicalRecords();
    fetchAnimals();
  }, []);

  const fetchMedicalRecords = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/rekam-medis');
      if (!response.ok) throw new Error('Failed to fetch rekam medis');
      
      const data = await response.json();
      setMedicalRecords(data);
    } catch (err) {
      setError('Gagal memuat rekam medis');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnimals = async () => {
    try {
      const response = await fetch('/api/hewan');
      if (!response.ok) throw new Error('Failed to fetch animals');
      
      const data = await response.json();
      setAnimals(data);
    } catch (err) {
      console.error('Error fetching animals:', err);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // If status kesehatan changes to "Sehat", clear diagnosis, pengobatan, and catatan tindak lanjut
    if (name === 'statusKesehatan' && value === 'Sehat') {
      setFormData({
        ...formData,
        [name]: value,
        diagnosis: '',
        pengobatan: '',
        catatanTindakLanjut: ''
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleAddRecord = async () => {
    try {
      // normalize the date before sending
      const payload = {
        ...formData,
        tanggalPemeriksaan: toPgDate(formData.tanggalPemeriksaan)
      };

      const response = await fetch('/api/rekam-medis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add rekam medis');
      }

      // Clear any previous errors
      setError('');
      
      await fetchMedicalRecords();
      setShowAddModal(false);
      
      // Reset form but keep the doctor username
      setFormData({
        idHewan: '',
        usernameDh: currentUser?.username || '', // Keep the doctor username
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
      // normalize the date parameter for URL
      const normalizedDate = toPgDate(selectedRecord.tanggalPemeriksaan);

      const response = await fetch(`/api/rekam-medis?idHewan=${selectedRecord.idHewan}&tanggalPemeriksaan=${encodeURIComponent(normalizedDate)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          diagnosis: formData.diagnosis,
          pengobatan: formData.pengobatan,
          catatanTindakLanjut: formData.catatanTindakLanjut
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update rekam medis');
      }
      
      await fetchMedicalRecords();
      setShowEditModal(false);
      setSelectedRecord(null);
      setError('');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(`Gagal mengupdate rekam medis: ${errorMessage}`);
      console.error(err);
    }
  };

  const handleDeleteRecord = async () => {
    if (!selectedRecord) return;
    
    try {
      // normalize the date parameter for URL
      const normalizedDate = toPgDate(selectedRecord.tanggalPemeriksaan);

      const response = await fetch(`/api/rekam-medis?idHewan=${selectedRecord.idHewan}&tanggalPemeriksaan=${encodeURIComponent(normalizedDate)}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete rekam medis');
      }
      
      await fetchMedicalRecords();
      setShowDeleteModal(false);
      setSelectedRecord(null);
      setError('');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(`Gagal menghapus rekam medis: ${errorMessage}`);
      console.error(err);
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Hewan</th>
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
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.namaHewan || 'Nama tidak tersedia'}</td>
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
        <div className="fixed inset-0 bg-black bg-opacity-60 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg w-full max-w-lg mx-4 shadow-2xl">
            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center border-b pb-4">FORM PENCATATAN REKAM MEDIS</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">Pilih Hewan</label>
                  <select
                    name="idHewan"
                    value={formData.idHewan}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                    required
                  >
                    <option value="">Pilih Hewan</option>
                    {animals.map((animal) => (
                      <option key={animal.id} value={animal.id}>
                        {animal.namaIndividu} - {animal.spesies} (ID: {animal.id})
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">Dokter Pemeriksa</label>
                  <input
                    type="text"
                    value={currentUser?.username || ''}
                    disabled
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg shadow-sm bg-gray-100 text-gray-600 cursor-not-allowed"
                    placeholder="Username dokter"
                  />
                  <p className="text-xs text-gray-500 mt-1">Username dokter yang sedang login</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">Tanggal Pemeriksaan</label>
                  <input
                    type="date"
                    name="tanggalPemeriksaan"
                    value={formData.tanggalPemeriksaan}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">Status Kesehatan</label>
                  <select
                    name="statusKesehatan"
                    value={formData.statusKesehatan}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                  >
                    <option value="Sehat">Sehat</option>
                    <option value="Sakit">Sakit</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">Diagnosis</label>
                  <input
                    type="text"
                    name="diagnosis"
                    value={formData.diagnosis}
                    onChange={handleInputChange}
                    disabled={formData.statusKesehatan === 'Sehat'}
                    className={`w-full px-4 py-3 border-2 rounded-lg shadow-sm focus:outline-none ${
                      formData.statusKesehatan === 'Sehat'
                        ? 'border-gray-200 bg-gray-100 cursor-not-allowed text-gray-500'
                        : 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900'
                    }`}
                    placeholder={formData.statusKesehatan === 'Sehat' ? 'Tidak diperlukan untuk status sehat' : 'Masukkan diagnosis'}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">Pengobatan</label>
                  <input
                    type="text"
                    name="pengobatan"
                    value={formData.pengobatan}
                    onChange={handleInputChange}
                    disabled={formData.statusKesehatan === 'Sehat'}
                    className={`w-full px-4 py-3 border-2 rounded-lg shadow-sm focus:outline-none ${
                      formData.statusKesehatan === 'Sehat'
                        ? 'border-gray-200 bg-gray-100 cursor-not-allowed text-gray-500'
                        : 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900'
                    }`}
                    placeholder={formData.statusKesehatan === 'Sehat' ? 'Tidak diperlukan untuk status sehat' : 'Masukkan pengobatan'}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">Catatan Tindak Lanjut</label>
                  <input
                    type="text"
                    name="catatanTindakLanjut"
                    value={formData.catatanTindakLanjut}
                    onChange={handleInputChange}
                    disabled={formData.statusKesehatan === 'Sehat'}
                    className={`w-full px-4 py-3 border-2 rounded-lg shadow-sm focus:outline-none ${
                      formData.statusKesehatan === 'Sehat'
                        ? 'border-gray-200 bg-gray-100 cursor-not-allowed text-gray-500'
                        : 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900'
                    }`}
                    placeholder={formData.statusKesehatan === 'Sehat' ? 'Tidak diperlukan untuk status sehat' : 'Masukkan catatan tindak lanjut'}
                  />
                </div>
              </div>
              <div className="mt-8 flex justify-end space-x-4 pt-4 border-t">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-semibold transition-colors"
                >
                  BATAL
                </button>
                <button
                  onClick={handleAddRecord}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
                >
                  SIMPAN
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Record Modal */}
      {showEditModal && selectedRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-60 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg w-full max-w-lg mx-4 shadow-2xl">
            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center border-b pb-4">EDIT REKAM MEDIS</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">Diagnosis Baru</label>
                  <input
                    type="text"
                    name="diagnosis"
                    value={formData.diagnosis}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-500"
                    placeholder="Masukkan diagnosis baru"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">Pengobatan Baru</label>
                  <input
                    type="text"
                    name="pengobatan"
                    value={formData.pengobatan}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-500"
                    placeholder="Masukkan pengobatan baru"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">Catatan Tindak Lanjut</label>
                  <input
                    type="text"
                    name="catatanTindakLanjut"
                    value={formData.catatanTindakLanjut}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-500"
                    placeholder="Catatan tindak lanjut (opsional)"
                  />
                </div>
              </div>
              <div className="mt-8 flex justify-end space-x-4 pt-4 border-t">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-semibold transition-colors"
                >
                  BATAL
                </button>
                <button
                  onClick={handleEditRecord}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
                >
                  SIMPAN
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-60 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg w-full max-w-md mx-4 shadow-2xl">
            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center border-b pb-4">HAPUS REKAM MEDIS</h2>
              <p className="mb-6 text-gray-700 text-center">Apakah anda yakin ingin menghapus rekam medis ini?</p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-semibold transition-colors"
                >
                  TIDAK
                </button>
                <button
                  onClick={handleDeleteRecord}
                  className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors"
                >
                  YA
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}