"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is already logged in
    const user = localStorage.getItem('user');
    if (user) {
      const userData = JSON.parse(user);
      // Redirect to appropriate dashboard
      switch (userData.role) {
        case 'pengunjung':
          router.push('/dashboard/pengunjung');
          break;
        case 'dokter':
          router.push('/dashboard/dokter');
          break;
        case 'staff':
          router.push('/dashboard/staff');
          break;
        default:
          router.push('/login');
      }
    } else {
      // Redirect to login page
      router.push('/login');
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Mengalihkan...</p>
      </div>
    </div>
  );
}
