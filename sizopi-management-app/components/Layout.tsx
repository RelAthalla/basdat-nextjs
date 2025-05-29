"use client";

import { useState, ReactNode } from 'react';
import Link from 'next/link';

interface LayoutProps {
  children: ReactNode;
  role: 'dokter_hewan' | 'penjaga_hewan' | 'staf_admin' | 'pelatih_hewan' | 'pengunjung';
}

export default function Layout({ children, role }: LayoutProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-blue-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link href="/dashboard">
                  <span className="text-white font-bold text-xl cursor-pointer">SIZOPI</span>
                </Link>
              </div>
              <div className="hidden md:ml-6 md:flex md:space-x-8">
                <Link href="/dashboard">
                  <span className="text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium cursor-pointer">
                    Dashboard
                  </span>
                </Link>
                
                {role === 'dokter_hewan' && (
                  <>
                    <Link href="/rekam-medis">
                      <span className="text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium cursor-pointer">
                        Rekam Medis Hewan
                      </span>
                    </Link>
                    <Link href="/jadwal-pemeriksaan">
                      <span className="text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium cursor-pointer">
                        Jadwal Pemeriksaan
                      </span>
                    </Link>
                  </>
                )}
                
                {role === 'penjaga_hewan' && (
                  <Link href="/pemberian-pakan">
                    <span className="text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium cursor-pointer">
                      Catatan Perawatan Hewan
                    </span>
                  </Link>
                )}
                
                <Link href="/profile">
                  <span className="text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium cursor-pointer">
                    Pengaturan Profil
                  </span>
                </Link>
                
                <Link href="/">
                  <span className="text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium cursor-pointer">
                    Logout
                  </span>
                </Link>
              </div>
            </div>
            
            <div className="-mr-2 flex items-center md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-blue-700 focus:outline-none"
              >
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {isOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link href="/dashboard">
                <span className="text-white hover:bg-blue-700 block px-3 py-2 rounded-md text-base font-medium cursor-pointer">
                  Dashboard
                </span>
              </Link>
              
              {role === 'dokter_hewan' && (
                <>
                  <Link href="/rekam-medis">
                    <span className="text-white hover:bg-blue-700 block px-3 py-2 rounded-md text-base font-medium cursor-pointer">
                      Rekam Medis Hewan
                    </span>
                  </Link>
                  <Link href="/jadwal-pemeriksaan">
                    <span className="text-white hover:bg-blue-700 block px-3 py-2 rounded-md text-base font-medium cursor-pointer">
                      Jadwal Pemeriksaan
                    </span>
                  </Link>
                </>
              )}
              
              {role === 'penjaga_hewan' && (
                <Link href="/pemberian-pakan">
                  <span className="text-white hover:bg-blue-700 block px-3 py-2 rounded-md text-base font-medium cursor-pointer">
                    Catatan Perawatan Hewan
                  </span>
                </Link>
              )}
              
              <Link href="/profile">
                <span className="text-white hover:bg-blue-700 block px-3 py-2 rounded-md text-base font-medium cursor-pointer">
                  Pengaturan Profil
                </span>
              </Link>
              
              <Link href="/">
                <span className="text-white hover:bg-blue-700 block px-3 py-2 rounded-md text-base font-medium cursor-pointer">
                  Logout
                </span>
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Main content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}