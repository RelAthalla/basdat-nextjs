import Link from "next/link";
import { ChevronDownIcon, UserCircleIcon } from "@heroicons/react/24/outline";

export function Header() {
  const userName = "Admin Sizopi";
  const userRole = "Super Admin";

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

        {/* Center Navigation */}
        <nav className="hidden lg:flex space-x-8">
          {/* Dashboard */}
          <Link
            href="/dashboard"
            className="relative text-white hover:text-yellow-300 transition-colors duration-300 text-lg font-medium py-2 px-4 group"
          >
            Dashboard
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-300 transition-all duration-300 group-hover:w-full"></span>
          </Link>

          {/* Manajemen Kebun Binatang - Dropdown */}
          <div className="relative group">
            <button className="flex items-center text-white hover:text-yellow-300 transition-colors duration-300 text-lg font-medium py-2 px-4">
              Manajemen Kebun Binatang
              <ChevronDownIcon className="w-4 h-4 ml-1" />
            </button>
            <div className="absolute left-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 z-50 hidden group-hover:block">
              <Link
                href="/manajemen/data-satwa"
                className="block px-4 py-2 text-gray-800 hover:bg-blue-50 hover:text-blue-600"
              >
                Manajemen Data Satwa
              </Link>
              <Link
                href="/manajemen/data-habitat"
                className="block px-4 py-2 text-gray-800 hover:bg-blue-50 hover:text-blue-600"
              >
                Manajemen Data Habitat
              </Link>
            </div>
          </div>
        </nav>

        {/* Right side - Profile and Actions */}
        <div className="flex items-center space-x-6">
          {/* Logout */}
          <Link
            href="/logout"
            className="hidden lg:block text-white hover:text-yellow-300 transition-colors duration-300 text-lg font-medium"
          >
            Logout
          </Link>

          {/* Profile */}
          <div className="flex items-center space-x-3 group cursor-pointer">
            <div className="relative">
              <UserCircleIcon className="w-10 h-10 text-white group-hover:text-yellow-300 transition-colors duration-300" />
              {userRole === "Super Admin" && (
                <span className="absolute -top-1 -right-1 bg-yellow-400 text-xs text-blue-800 font-bold px-1.5 py-0.5 rounded-full">
                  SA
                </span>
              )}
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-white font-medium">{userName}</p>
              <p className="text-blue-200 text-sm">{userRole}</p>
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
