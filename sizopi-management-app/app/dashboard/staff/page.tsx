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
    staffType: string;
    idStaf: string;
  };
}

export default function DashboardStaff() {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [stats, setStats] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get user data from localStorage
    const userString = localStorage.getItem('user');
    if (!userString) {
      router.push('/login');
      return;
    }

    const user = JSON.parse(userString);
    if (user.role !== 'staff') {
      router.push('/login');
      return;
    }

    setUserData(user);
    fetchStaffStats(user.roleData.staffType);
    setLoading(false);
  }, [router]);

  const fetchStaffStats = async (staffType: string) => {
    // Mock data based on staff type
    switch (staffType) {
      case 'penjaga':
        setStats({
          hewanDiberiPakan: 25,
          jadwalHariIni: 8,
          status: 'Aktif'
        });
        break;
      case 'admin':
        setStats({
          penjualanTiketHariIni: 150,
          pengunjungHariIni: 142,
          pendapatanMingguan: 15750000,
          tiketTersedia: 350
        });
        break;
      case 'pelatih':
        setStats({
          pertunjukanHariIni: 3,
          hewanDilatih: 12,
          statusLatihan: 'Baik',
          jadwalBerikutnya: '14:00'
        });
        break;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/login');
  };

  const navigateTo = (path: string) => {
    router.push(path);
  };

  const getStaffTypeDisplay = (type: string) => {
    switch (type) {
      case 'penjaga': return 'Penjaga Hewan';
      case 'admin': return 'Staf Administrasi';
      case 'pelatih': return 'Pelatih Pertunjukan';
      default: return 'Staff';
    }
  };

  const renderStaffSpecificContent = () => {
    if (!userData?.roleData) return null;

    const { staffType } = userData.roleData;

    if (staffType === 'penjaga') {
      return (
        <>
          {/* Penjaga Hewan Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-green-600 text-2xl">🍖</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Hewan Diberi Pakan</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.hewanDiberiPakan}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 text-2xl">📅</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Jadwal Hari Ini</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.jadwalHariIni}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <span className="text-yellow-600 text-2xl">✅</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.status}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions for Penjaga */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Aksi Cepat</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => navigateTo('/pemberian-pakan')}
                className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors"
              >
                <div className="text-center">
                  <span className="text-2xl mb-2 block">🍖</span>
                  <p className="font-medium text-gray-900">Kelola Pemberian Pakan</p>
                </div>
              </button>
            </div>
          </div>
        </>
      );
    }

    if (staffType === 'admin') {
      return (
        <>
          {/* Admin Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-green-600 text-2xl">🎫</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Penjualan Tiket Hari Ini</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.penjualanTiketHariIni}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 text-2xl">👥</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Pengunjung Hari Ini</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.pengunjungHariIni}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <span className="text-purple-600 text-2xl">💰</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Pendapatan Mingguan</p>
                  <p className="text-2xl font-bold text-gray-900">Rp {stats.pendapatanMingguan?.toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <span className="text-orange-600 text-2xl">🎟️</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Tiket Tersedia</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.tiketTersedia}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sales Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Ringkasan Penjualan</h2>
            <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
              <p className="text-gray-500">Grafik penjualan akan ditampilkan di sini</p>
            </div>
          </div>
        </>
      );
    }

    if (staffType === 'pelatih') {
      return (
        <>
          {/* Pelatih Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <span className="text-purple-600 text-2xl">🎭</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Pertunjukan Hari Ini</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.pertunjukanHariIni}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-green-600 text-2xl">🐾</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Hewan Dilatih</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.hewanDilatih}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 text-2xl">⏰</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Jadwal Berikutnya</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.jadwalBerikutnya}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Training Schedule */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Jadwal Pertunjukan Hari Ini</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Pertunjukan Lumba-lumba</p>
                  <p className="text-sm text-gray-600">10:00 - 10:30</p>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">Selesai</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Atraksi Burung</p>
                  <p className="text-sm text-gray-600">14:00 - 14:30</p>
                </div>
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">Mendatang</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Show Singa Laut</p>
                  <p className="text-sm text-gray-600">16:00 - 16:30</p>
                </div>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">Terjadwal</span>
              </div>
            </div>
          </div>
        </>
      );
    }

    return null;
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
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">👤</span>
              </div>
              <div className="ml-4">
                <h1 className="text-2xl font-bold text-gray-900">Dashboard {getStaffTypeDisplay(userData.roleData?.staffType)}</h1>
                <p className="text-sm text-gray-600">Selamat datang, {userData.namaDepan}!</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Profil Staff</h2>
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
                  <p className="text-gray-900">{getStaffTypeDisplay(userData.roleData?.staffType)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">ID Staf</label>
                  <p className="text-gray-900">{userData.roleData?.idStaf || 'Tidak tersedia'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Staff-specific Content */}
          <div className="lg:col-span-3 space-y-8">
            {renderStaffSpecificContent()}
          </div>
        </div>
      </div>
    </div>
  );
}
