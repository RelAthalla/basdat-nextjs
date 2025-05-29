"use client";

import { useState, useEffect } from 'react';
import '../globals.css';

interface PakanData {
  idHewan: string;
  jadwal: string;
  jenisPakan: string;
  jumlahPakan: number;
  status: string;
  namaHewan?: string;
  spesies?: string;
}

interface FormData {
  idHewan: string;
  jadwal: string;
  jenisPakan: string;
  jumlahPakan: number;
}

export default function PemberianPakan() {
  const [activeTab, setActiveTab] = useState<'penjadwalan' | 'riwayat'>('penjadwalan');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [selectedRecord, setSelectedRecord] = useState<PakanData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const [pakanData, setPakanData] = useState<PakanData[]>([]);
  const [hewanList, setHewanList] = useState<any[]>([]);

  // Form state
  const [formData, setFormData] = useState<FormData>({
    idHewan: '',
    jadwal: '',
    jenisPakan: '',
    jumlahPakan: 0
  });

  // Fetch data from API
  useEffect(() => {
    fetchPakanData();
    fetchHewanList();
  }, []);

  const fetchPakanData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/pemberian-pakan');
      if (!response.ok) throw new Error('Failed to fetch pakan data');
      
      const data = await response.json();
      setPakanData(data);
    } catch (err) {
      setError('Gagal memuat data pakan');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchHewanList = async () => {
    try {
      const response = await fetch('/api/hewan');
      if (!response.ok) throw new Error('Failed to fetch hewan list');
      
      const data = await response.json();
      setHewanList(data);
    } catch (err) {
      console.error('Failed to fetch hewan list:', err);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'jumlahPakan' ? parseInt(value) || 0 : value
    });
  };

  const handleAddRecord = async () => {
    try {
      const response = await fetch('/api/pemberian-pakan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to add pakan data');

      await fetchPakanData(); // Refresh data
      setShowAddModal(false);
      
      // Reset form
      setFormData({
        idHewan: '',
        jadwal: '',
        jenisPakan: '',
        jumlahPakan: 0
      });
    } catch (err) {
      setError('Gagal menambah data pakan');
      console.error(err);
    }
  };

  const openEditModal = (record: PakanData) => {
    setSelectedRecord(record);
    
    // Format the datetime for the input field
    const formattedJadwal = new Date(record.jadwal).toISOString().slice(0, 16);
    
    setFormData({
      idHewan: record.idHewan,
      jadwal: formattedJadwal,
      jenisPakan: record.jenisPakan,
      jumlahPakan: record.jumlahPakan
    });
    setShowEditModal(true);
  };

  const handleEditRecord = async () => {
    if (!selectedRecord) return;
    
    try {
      // Use the original jadwal from selectedRecord for the URL parameter
      const originalJadwal = selectedRecord.jadwal;
      
      const response = await fetch(`/api/pemberian-pakan?idHewan=${selectedRecord.idHewan}&jadwal=${encodeURIComponent(originalJadwal)}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jenisPakan: formData.jenisPakan,
          jumlahPakan: formData.jumlahPakan,
          jadwal: formData.jadwal // This is the new jadwal value
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update pakan data');
      }

      await fetchPakanData(); // Refresh data
      setShowEditModal(false);
      setSelectedRecord(null);
    } catch (err) {
      const errorMessage = (err instanceof Error) ? err.message : String(err);
      setError(`Gagal mengupdate data pakan: ${errorMessage}`);
      console.error(err);
    }
  };

  const handleDeleteRecord = async () => {
    if (!selectedRecord) return;
    
    try {
      const response = await fetch(`/api/pemberian-pakan?idHewan=${selectedRecord.idHewan}&jadwal=${encodeURIComponent(selectedRecord.jadwal)}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete pakan data');
      }

      await fetchPakanData(); // Refresh data
      setShowDeleteModal(false);
      setSelectedRecord(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(`Gagal menghapus data pakan: ${errorMessage}`);
      console.error(err);
    }
  };

  const handleBeriPakan = async (record: PakanData) => {
    try {
      const response = await fetch(`/api/pemberian-pakan?idHewan=${record.idHewan}&jadwal=${encodeURIComponent(record.jadwal)}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jenisPakan: record.jenisPakan,
          jumlahPakan: record.jumlahPakan,
          status: 'Selesai Diberikan'
        }),
      });

      if (!response.ok) throw new Error('Failed to update status');

      await fetchPakanData(); // Refresh data
    } catch (err) {
      setError('Gagal mengupdate status pakan');
      console.error(err);
    }
  };

  const openDeleteModal = (record: PakanData) => {
    setSelectedRecord(record);
    setShowDeleteModal(true);
  };

  const formatDateTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    return {
      date: date.toISOString().split('T')[0],
      time: date.toTimeString().split(' ')[0].substring(0, 5)
    };
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
      <h1 className="text-2xl font-bold text-gray-800 mb-6">CATATAN PERAWATAN HEWAN</h1>
      
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('penjadwalan')}
            className={`${
              activeTab === 'penjadwalan'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Pemberian Pakan
          </button>
          <button
            onClick={() => setActiveTab('riwayat')}
            className={`${
              activeTab === 'riwayat'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Riwayat Pemberian Pakan
          </button>
        </nav>
      </div>
      
      {activeTab === 'penjadwalan' && (
        <>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-700">PEMBERIAN PAKAN</h2>
            <button 
              onClick={() => setShowAddModal(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md"
            >
              + Tambah Jadwal Pemberian Pakan
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jenis Pakan</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jumlah Pakan (gram)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jadwal</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {pakanData.map((record, index) => {
                  const { date, time } = formatDateTime(record.jadwal);
                  return (
                    <tr key={`${record.idHewan}-${record.jadwal}`}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.jenisPakan}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.jumlahPakan}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{date} {time}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          record.status === 'Selesai Diberikan' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {record.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {record.status === 'Menunggu Pemberian' && (
                          <button
                            onClick={() => handleBeriPakan(record)}
                            className="text-green-600 hover:text-green-900 mr-2"
                          >
                            Beri Pakan
                          </button>
                        )}
                        <button
                          onClick={() => openEditModal(record)}
                          className="text-indigo-600 hover:text-indigo-900 mr-2"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => openDeleteModal(record)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
      
      {activeTab === 'riwayat' && (
        <>
          <h2 className="text-xl font-semibold text-gray-700 mb-6">RIWAYAT PEMBERIAN PAKAN</h2>
          
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Hewan</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Spesies</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jenis Pakan</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jumlah (gram)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jadwal</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {pakanData.filter(record => record.status === 'Selesai Diberikan').map((record, index) => {
                  const { date, time } = formatDateTime(record.jadwal);
                  return (
                    <tr key={`${record.idHewan}-${record.jadwal}-history`}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.namaHewan || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.spesies || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.jenisPakan}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.jumlahPakan}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{date} {time}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                          {record.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg w-full max-w-md mx-4 p-6">
            <h2 className="text-xl font-bold mb-4">FORM TAMBAH PEMBERIAN PAKAN</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Hewan</label>
                <select
                  name="idHewan"
                  value={formData.idHewan}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Pilih Hewan</option>
                  {hewanList.map((hewan) => (
                    <option key={hewan.id} value={hewan.id}>
                      {hewan.nama || 'Unnamed'} - {hewan.spesies}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Jadwal</label>
                <input
                  type="datetime-local"
                  name="jadwal"
                  value={formData.jadwal}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Jenis Pakan</label>
                <input
                  type="text"
                  name="jenisPakan"
                  value={formData.jenisPakan}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Jumlah Pakan (gram)</label>
                <input
                  type="number"
                  name="jumlahPakan"
                  value={formData.jumlahPakan}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
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

      {/* Edit Modal */}
      {showEditModal && selectedRecord && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg w-full max-w-md mx-4 p-6">
            <h2 className="text-xl font-bold mb-4">EDIT PEMBERIAN PAKAN</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Jenis Pakan Baru</label>
                <input
                  type="text"
                  name="jenisPakan"
                  value={formData.jenisPakan}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Jumlah Pakan Baru (gram)</label>
                <input
                  type="number"
                  name="jumlahPakan"
                  value={formData.jumlahPakan}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Jadwal Baru</label>
                <input
                  type="datetime-local"
                  name="jadwal"
                  value={formData.jadwal}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
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
            <h2 className="text-xl font-bold mb-4">HAPUS PEMBERIAN PAKAN</h2>
            <p className="mb-4">Apakah anda yakin ingin menghapus data pemberian pakan ini?</p>
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