"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Get user data from localStorage
    const userString = localStorage.getItem('user');
    if (!userString) {
      router.push('/login');
      return;
    }

    const user = JSON.parse(userString);
    
    // Redirect to appropriate dashboard based on role
    switch (user.role) {
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
  }, [router]);

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Mengalihkan ke dashboard...</p>
      </div>
    </div>
  );
}
