"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface UserData {
  username: string;
  email: string;
  namaDepan: string;
  namaTengah: string;
  namaBelakang: string;
  nomorTelepon: string;
  role: string;
  roleData: {
    no_STR: string;
  };
}

interface CatatanMedis {
  id_hewan: string;
  nama_hewan: string;
  tanggal_pemeriksaan: string;
  diagnosis: string;
  pengobatan: string;
  status_kesehatan: string;
  catatan_tindak_lanjut: string;
}

export default function DashboardDokter() {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [catatanMedis, setCatatanMedis] = useState<CatatanMedis[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const userString = localStorage.getItem('user');
    if (!userString) {
      router.push('/login');
      return;
    }

    const user = JSON.parse(userString);
    console.log('Dashboard - User data:', user);
    
    if (user.role !== 'dokter' && user.role !== 'dokter_hewan') {
      console.log('User role is not dokter/dokter_hewan:', user.role);
      router.push('/login');
      return;
    }

    setUserData(user);
    fetchCatatanMedis(user.username);
    setLoading(false);
  }, [router]);

  const fetchCatatanMedis = async (username: string) => {
    try {
      console.log('Fetching catatan medis for username:', username);
      const response = await fetch(`/api/catatan-medis?username=${username}`);
      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        throw new Error(`Failed to fetch catatan medis: ${errorData.error || response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Received catatan medis data:', data);
      setCatatanMedis(data);
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Gagal memuat catatan medis');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getRecentRecords = () => {
    return catatanMedis
      .sort((a, b) => new Date(b.tanggal_pemeriksaan).getTime() - new Date(a.tanggal_pemeriksaan).getTime())
      .slice(0, 10);
  };

  const getCriticalCases = () => {
    return catatanMedis.filter(record => 
      record.status_kesehatan.toLowerCase().includes('kritis') || 
      record.status_kesehatan.toLowerCase().includes('sakit') ||
      record.status_kesehatan.toLowerCase().includes('perlu perhatian')
    );
  };

  const getHealthyAnimals = () => {
    return catatanMedis.filter(record => 
      record.status_kesehatan.toLowerCase().includes('sehat') ||
      record.status_kesehatan.toLowerCase().includes('baik')
    );
  };

  if (loading || !userData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  const fullName = `${userData.namaDepan} ${userData.namaTengah ? userData.namaTengah + ' ' : ''}${userData.namaBelakang}`;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Profil Dokter</h2>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500">Nama Lengkap</label>
                  <p className="text-gray-900">{fullName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Username</label>
                  <p className="text-gray-900">{userData.username}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <p className="text-gray-900">{userData.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Nomor Telepon</label>
                  <p className="text-gray-900">{userData.nomorTelepon}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Peran</label>
                  <p className="text-gray-900 capitalize">Dokter Hewan</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Nomor STR</label>
                  <p className="text-gray-900">{userData.roleData?.no_STR || 'Tidak tersedia'}</p>
                </div>
              </div>
            </div>

            {/* Statistics */}
            <div className="bg-white rounded-lg shadow p-6 mt-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Statistik Medis</h2>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500">Total Pemeriksaan</label>
                  <p className="text-2xl font-bold text-gray-900">{catatanMedis.length}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Kasus Kritis</label>
                  <p className="text-2xl font-bold text-red-600">{getCriticalCases().length}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Hewan Sehat</label>
                  <p className="text-2xl font-bold text-green-600">{getHealthyAnimals().length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Medical Records */}
          <div className="lg:col-span-3 space-y-8">
            {/* Recent Medical Records */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Catatan Medis Terbaru</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama Hewan</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tanggal Pemeriksaan</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Diagnosis</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status Kesehatan</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pengobatan</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {getRecentRecords().map((record, index) => (
                      <tr key={`${record.id_hewan}-${record.tanggal_pemeriksaan}-${index}`}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.nama_hewan || record.id_hewan}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatDate(record.tanggal_pemeriksaan)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.diagnosis}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            record.status_kesehatan.toLowerCase().includes('sehat') || record.status_kesehatan.toLowerCase().includes('baik')
                              ? 'bg-green-100 text-green-800'
                              : record.status_kesehatan.toLowerCase().includes('kritis') || record.status_kesehatan.toLowerCase().includes('sakit')
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {record.status_kesehatan}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.pengobatan}</td>
                      </tr>
                    ))}
                    {getRecentRecords().length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                          Belum ada catatan medis
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Critical Cases */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Kasus yang Perlu Perhatian</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama Hewan</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Diagnosis</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tindak Lanjut</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tanggal</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {getCriticalCases().map((record, index) => (
                      <tr key={`critical-${record.id_hewan}-${record.tanggal_pemeriksaan}-${index}`}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.nama_hewan || record.id_hewan}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.diagnosis}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
                            {record.status_kesehatan}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.catatan_tindak_lanjut || '-'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatDate(record.tanggal_pemeriksaan)}</td>
                      </tr>
                    ))}
                    {getCriticalCases().length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                          Tidak ada kasus kritis
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Aksi Cepat</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => router.push('/rekam-medis/tambah')}
                  className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors"
                >
                  <div className="text-center">
                    <span className="text-2xl mb-2 block">📋</span>
                    <p className="font-medium text-gray-900">Tambah Catatan Medis</p>
                    <p className="text-sm text-gray-500">Buat catatan pemeriksaan baru</p>
                  </div>
                </button>

                <button
                  onClick={() => router.push('/jadwal-pemeriksaan')}
                  className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
                >
                  <div className="text-center">
                    <span className="text-2xl mb-2 block">🩺</span>
                    <p className="font-medium text-gray-900">Jadwal Pemeriksaan</p>
                    <p className="text-sm text-gray-500">Lihat jadwal pemeriksaan</p>
                  </div>
                </button>

                <button
                  onClick={() => router.push('/rekam-medis')}
                  className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors"
                >
                  <div className="text-center">
                    <span className="text-2xl mb-2 block">📊</span>
                    <p className="font-medium text-gray-900">Lihat Semua Rekam Medis</p>
                    <p className="text-sm text-gray-500">Akses rekam medis lengkap</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
