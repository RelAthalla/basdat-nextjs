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
    alamat: string;
    tgl_lahir: string;
  };
}

interface ReservasiInfo {
  username: string;
  namaFasilitas: string;
  tanggalKunjungan: string;
  jumlahTiket: number;
  status: string;
  hargaTiket?: number; // Make optional since it's not in database
}

export default function DashboardPengunjung() {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [reservasi, setReservasi] = useState<ReservasiInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    // Get user data from localStorage
    const userString = localStorage.getItem('user');
    if (!userString) {
      router.push('/login');
      return;
    }

    const user = JSON.parse(userString);
    if (user.role !== 'pengunjung') {
      router.push('/login');
      return;
    }

    setUserData(user);
    fetchReservasiInfo(user.username);
    setLoading(false);
  }, [router]);

  const fetchReservasiInfo = async (username: string) => {
    try {
      console.log('Fetching reservasi for username:', username);
      const response = await fetch(`/api/reservasi?username=${username}`);
      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        throw new Error(`Failed to fetch reservasi: ${errorData.error || response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Received reservasi data:', data);
      setReservasi(data);
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Gagal memuat informasi reservasi');
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

  const getTotalSpent = () => {
    return reservasi.reduce((total, item) => {
      // Since hargaTiket might not exist, return 0 for now
      return total + 0;
    }, 0);
  };

  const getActiveReservations = () => {
    return reservasi.filter(item => 
      item.status === 'Aktif' || 
      item.status === 'confirmed' || 
      item.status === 'active'
    );
  };

  const getCompletedReservations = () => {
    return reservasi.filter(item => 
      item.status === 'Selesai' || 
      item.status === 'Digunakan' || 
      item.status === 'completed' || 
      item.status === 'used' ||
      item.status === 'finished'
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
              <h2 className="text-xl font-bold text-gray-900 mb-4">Profil Pengguna</h2>
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
                  <p className="text-gray-900 capitalize">{userData.role}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Alamat Lengkap</label>
                  <p className="text-gray-900">{userData.roleData?.alamat || 'Tidak tersedia'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Tanggal Lahir</label>
                  <p className="text-gray-900">{userData.roleData?.tgl_lahir || 'Tidak tersedia'}</p>
                </div>
              </div>
            </div>

            {/* Statistics */}
            <div className="bg-white rounded-lg shadow p-6 mt-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Statistik</h2>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500">Total Kunjungan</label>
                  <p className="text-2xl font-bold text-gray-900">{reservasi.length}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Reservasi Aktif</label>
                  <p className="text-2xl font-bold text-green-600">{getActiveReservations().length}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Total Pengeluaran</label>
                  <p className="text-lg font-bold text-gray-900">Rp {getTotalSpent().toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Reservations and Visit History */}
          <div className="lg:col-span-3 space-y-8">
            {/* Active Reservations */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Reservasi Aktif</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fasilitas</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tanggal Kunjungan</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Jumlah Tiket</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Harga</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {getActiveReservations().map((reservation, index) => (
                      <tr key={`${reservation.namaFasilitas}-${reservation.tanggalKunjungan}-${index}`}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{reservation.namaFasilitas}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatDate(reservation.tanggalKunjungan)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{reservation.jumlahTiket}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {reservation.hargaTiket ? 
                            `Rp ${(reservation.hargaTiket * reservation.jumlahTiket).toLocaleString()}` : 
                            'Harga tidak tersedia'
                          }
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                            {reservation.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {getActiveReservations().length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                          Tidak ada reservasi aktif
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Visit History */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Riwayat Kunjungan</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fasilitas</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tanggal Kunjungan</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Jumlah Tiket</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Harga</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {getCompletedReservations().map((reservation, index) => (
                      <tr key={`${reservation.namaFasilitas}-${reservation.tanggalKunjungan}-history-${index}`}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{reservation.namaFasilitas}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatDate(reservation.tanggalKunjungan)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{reservation.jumlahTiket}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {reservation.hargaTiket ? 
                            `Rp ${(reservation.hargaTiket * reservation.jumlahTiket).toLocaleString()}` : 
                            'Harga tidak tersedia'
                          }
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
                            {reservation.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {getCompletedReservations().length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                          Belum ada riwayat kunjungan
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => router.push('/reservasi')}
                  className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
                >
                  <div className="text-center">
                    <span className="text-2xl mb-2 block">🎫</span>
                    <p className="font-medium text-gray-900">Buat Reservasi Baru</p>
                    <p className="text-sm text-gray-500">Reservasi fasilitas zoo</p>
                  </div>
                </button>

                <button
                  onClick={() => router.push('/fasilitas')}
                  className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors"
                >
                  <div className="text-center">
                    <span className="text-2xl mb-2 block">🏢</span>
                    <p className="font-medium text-gray-900">Lihat Fasilitas</p>
                    <p className="text-sm text-gray-500">Jelajahi fasilitas yang tersedia</p>
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
