"use client";

import Link from "next/link";
import { ChevronDownIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface UserData {
  username: string;
  email: string;
  namaDepan: string;
  namaBelakang: string;
  role: string;
}

interface NavigationDropdownItem {
  label: string;
  href: string;
}

interface NavigationItem {
  label: string;
  href?: string;
  dropdown?: NavigationDropdownItem[];
}

export function Header() {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    const userString = localStorage.getItem("user");
    if (userString) {
      setUserData(JSON.parse(userString));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/login");
  };

  const getNavigationItems = (): NavigationItem[] => {
    if (!userData) return [];

    const role = userData.role.toLowerCase();

    switch (role) {
      case "pengunjung":
        return [
          { label: "Dashboard", href: "/dashboard/pengunjung" },
          { label: "Beli Tiket", href: "/tiket" },
          { label: "Jadwal Pertunjukan", href: "/pertunjukan" },
          { label: "Donasi", href: "/donasi" },
        ];

      case "dokter_hewan":
      case "dokter":
        return [
          { label: "Dashboard", href: "/dashboard/dokter" },
          { label: "Rekam Medis", href: "/rekam-medis" },
          { label: "Jadwal Pemeriksaan", href: "/jadwal-pemeriksaan" },
          { label: "Manajemen Data Satwa", href: "/manajemen/data-satwa" },
        ];

      case "penjaga_hewan":
        return [
          { label: "Dashboard", href: "/dashboard/staff" },
          { label: "Pemberian Pakan", href: "/pemberian-pakan" },
          { label: "Manajemen Data Satwa", href: "/manajemen/data-satwa" },
        ];

      case "staff_administrasi":
        return [
          { label: "Dashboard", href: "/dashboard/staff" },
          { label: "Manajemen Data Satwa", href: "/manajemen/data-satwa" },
          { label: "Manajemen Data Habitat", href: "/manajemen/data-habitat" },
        ];

      case "pelatih_pertunjukan":
        return [
          { label: "Dashboard", href: "/dashboard/staff" },
          { label: "Jadwal Pertunjukan", href: "/jadwal-pertunjukan" },
          { label: "Latihan Hewan", href: "/latihan-hewan" },
          { label: "Pertunjukan Khusus", href: "/pertunjukan-khusus" },
        ];

      default:
        return [{ label: "Dashboard", href: "/dashboard" }];
    }
  };

  if (!userData) {
    return null; // Don't render header if user is not logged in
  }

  const navigationItems = getNavigationItems();
  const fullName = `${userData.namaDepan} ${userData.namaBelakang}`;
  const roleDisplay = userData.role.replace("_", " ").toUpperCase();

  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-800 p-4 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo on the far left */}
        <Link href="/home" className="group">
          <h1 className="text-3xl font-bold text-white group-hover:text-yellow-300 transition-colors duration-300 flex items-center">
            <span className="mr-2">🐾</span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-yellow-100">
              Sizopi
            </span>
          </h1>
        </Link>

        {/* Center Navigation - Role-based */}
        <nav className="hidden lg:flex space-x-8">
          {navigationItems.map((item, index) => (
            <div key={index} className="relative group">
              {item.dropdown ? (
                <>
                  <button className="flex items-center text-white hover:text-yellow-300 transition-colors duration-300 text-lg font-medium py-2 px-4">
                    {item.label}
                    <ChevronDownIcon className="w-4 h-4 ml-1" />
                  </button>
                  <div className="absolute left-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 z-50 hidden group-hover:block">
                    {item.dropdown.map((dropdownItem, dropdownIndex) => (
                      <Link
                        key={dropdownIndex}
                        href={dropdownItem.href}
                        className="block px-4 py-2 text-gray-800 hover:bg-blue-50 hover:text-blue-600"
                      >
                        {dropdownItem.label}
                      </Link>
                    ))}
                  </div>
                </>
              ) : (
                item.href ? (
                  <Link
                    href={item.href}
                    className="relative text-white hover:text-yellow-300 transition-colors duration-300 text-lg font-medium py-2 px-4 group"
                  >
                    {item.label}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-300 transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                ) : null
              )}
            </div>
          ))}
        </nav>

        {/* Right side - Profile and Actions */}
        <div className="flex items-center space-x-6">
          {/* Logout */}
          <button
            onClick={handleLogout}
            className="hidden lg:block text-white hover:text-yellow-300 transition-colors duration-300 text-lg font-medium"
          >
            Logout
          </button>

          {/* Profile */}
          <div
            className="flex items-center space-x-3 group cursor-pointer"
            onClick={() => router.push("/profile")}
          >
            <div className="relative">
              <UserCircleIcon className="w-10 h-10 text-white group-hover:text-yellow-300 transition-colors duration-300" />
              {userData.role === "staff_administrasi" && (
                <span className="absolute -top-1 -right-1 bg-yellow-400 text-xs text-blue-800 font-bold px-1.5 py-0.5 rounded-full">
                  ADM
                </span>
              )}
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-white font-medium">{fullName}</p>
              <p className="text-blue-200 text-sm">{roleDisplay}</p>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              className="text-white hover:text-yellow-300 transition-colors duration-300 focus:outline-none"
              aria-label="Toggle menu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-8 h-8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
