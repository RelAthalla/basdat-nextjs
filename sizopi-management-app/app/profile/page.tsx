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
  roleData?: any;
}

export default function ProfilePage() {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    const userString = localStorage.getItem('user');
    if (!userString) {
      router.push('/login');
      return;
    }

    const user = JSON.parse(userString);
    setUserData(user);
    setFormData({
      email: user.email,
      namaDepan: user.namaDepan,
      namaTengah: user.namaTengah || '',
      namaBelakang: user.namaBelakang,
      no_telepon: user.nomorTelepon, // Map from nomorTelepon to no_telepon
      ...user.roleData
    });
    setLoading(false);
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      setFormData((prev: any) => ({
        ...prev,
        [name]: checkbox.checked
      }));
    } else {
      setFormData((prev: any) => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: userData?.username,
          ...formData
        }),
      });

      if (response.ok) {
        const updatedUser = { ...userData, ...formData };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUserData(updatedUser);
        setMessage('Profil berhasil diperbarui!');
      } else {
        setMessage('Gagal memperbarui profil.');
      }
    } catch (error) {
      setMessage('Terjadi kesalahan saat memperbarui profil.');
    }
    setSaving(false);
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage('Konfirmasi password tidak sesuai.');
      return;
    }

    try {
      const response = await fetch('/api/profile/password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: userData?.username,
          oldPassword: passwordData.oldPassword,
          newPassword: passwordData.newPassword
        }),
      });

      if (response.ok) {
        setMessage('Password berhasil diubah!');
        setShowPasswordModal(false);
        setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        setMessage('Gagal mengubah password. Periksa password lama Anda.');
      }
    } catch (error) {
      setMessage('Terjadi kesalahan saat mengubah password.');
    }
  };

  const renderRoleSpecificFields = () => {
    if (!userData) return null;

    switch (userData.role.toLowerCase()) {
      case 'pengunjung':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Alamat Lengkap
              </label>
              <textarea
                name="alamat"
                value={formData.alamat || ''}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tanggal Lahir
              </label>
              <input
                type="date"
                name="tgl_lahir"
                value={formData.tgl_lahir || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </>
        );

      case 'dokter_hewan':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nomor Sertifikasi Profesional
              </label>
              <input
                type="text"
                name="nomorSertifikasi"
                value={formData.nomorSertifikasi || ''}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Spesialisasi
              </label>
              <div className="space-y-2">
                {['Mamalia Besar', 'Reptil', 'Burung Eksotis', 'Primata'].map(spec => (
                  <label key={spec} className="flex items-center">
                    <input
                      type="checkbox"
                      name={`spesialisasi_${spec.replace(' ', '_').toLowerCase()}`}
                      checked={formData[`spesialisasi_${spec.replace(' ', '_').toLowerCase()}`] || false}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    {spec}
                  </label>
                ))}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="spesialisasi_lainnya"
                    checked={formData.spesialisasi_lainnya || false}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  <span className="mr-2">Lainnya:</span>
                  <input
                    type="text"
                    name="spesialisasi_lainnya_text"
                    value={formData.spesialisasi_lainnya_text || ''}
                    onChange={handleInputChange}
                    disabled={!formData.spesialisasi_lainnya}
                    className="px-2 py-1 border border-gray-300 rounded"
                  />
                </div>
              </div>
            </div>
          </>
        );

      case 'penjaga_hewan':
      case 'staff_administrasi':
      case 'pelatih_pertunjukan':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ID Staf
            </label>
            <input
              type="text"
              name="idStaf"
              value={formData.idStaf || ''}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
            />
          </div>
        );

      default:
        return null;
    }
  };

  if (loading || !userData) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Pengaturan Profil</h1>
          
          {message && (
            <div className="mb-4 p-4 bg-blue-100 border border-blue-400 text-blue-700 rounded">
              {message}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <input
                type="text"
                value={userData.username}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nama Depan
              </label>
              <input
                type="text"
                name="namaDepan"
                value={formData.namaDepan || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nama Tengah (Opsional)
              </label>
              <input
                type="text"
                name="namaTengah"
                value={formData.namaTengah || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nama Belakang
              </label>
              <input
                type="text"
                name="namaBelakang"
                value={formData.namaBelakang || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nomor Telepon
              </label>
              <input
                type="tel"
                name="no_telepon"
                value={formData.no_telepon || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Role-specific fields */}
            {renderRoleSpecificFields()}
          </div>

          <div className="flex space-x-4 mt-8">
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
            >
              {saving ? 'Menyimpan...' : 'SIMPAN'}
            </button>
            
            <button
              onClick={() => setShowPasswordModal(true)}
              className="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700"
            >
              UBAH PASSWORD
            </button>
          </div>
        </div>
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Ubah Password</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password Lama
                </label>
                <input
                  type="password"
                  value={passwordData.oldPassword}
                  onChange={(e) => setPasswordData(prev => ({...prev, oldPassword: e.target.value}))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password Baru
                </label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData(prev => ({...prev, newPassword: e.target.value}))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Konfirmasi Password Baru
                </label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData(prev => ({...prev, confirmPassword: e.target.value}))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex space-x-4 mt-6">
              <button
                onClick={handlePasswordChange}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                SIMPAN
              </button>
              <button
                onClick={() => setShowPasswordModal(false)}
                className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
              >
                BATAL
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
