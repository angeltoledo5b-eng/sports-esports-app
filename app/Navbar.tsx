'use client';

import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-40 bg-gray-950/80 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-indigo-500">
            SPORTSHUB
          </span>
        </Link>

        {/* Menú Principal */}
        <div className="hidden md:flex items-center gap-6 text-sm font-semibold text-gray-300">
          <Link href="/" className="hover:text-blue-400 transition-colors">
            🏠 Feed
          </Link>
          <Link href="/torneos" className="hover:text-purple-400 transition-colors">
            🏆 Torneos
          </Link>
          <Link href="#" className="hover:text-green-400 transition-colors">
            🛡️ Equipos
          </Link>
        </div>

        {/* Perfil / Acceso */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center font-bold text-white text-xs border border-gray-700">
            AP
          </div>
        </div>
      </div>
    </nav>
  );
}