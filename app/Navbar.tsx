'use client';

import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-40 bg-gray-950/90 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-lg md:text-xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-indigo-500">
            SPORTSHUB
          </span>
        </Link>

        {/* Menú Principal */}
        <div className="flex items-center gap-3 sm:gap-6 text-xs sm:text-sm font-semibold text-gray-300">
          <Link href="/" className="hover:text-blue-400 transition-colors">
            🏠 <span className="hidden xs:inline">Feed</span>
          </Link>
          <Link href="/torneos" className="hover:text-purple-400 transition-colors">
            🏆 <span className="hidden xs:inline">Torneos</span>
          </Link>
          <Link href="/equipos" className="hover:text-green-400 transition-colors">
            🛡️ <span className="hidden xs:inline">Equipos</span>
          </Link>
          <Link href="/perfil" className="hover:text-indigo-400 transition-colors">
            👤 <span className="hidden xs:inline">Perfil</span>
          </Link>
        </div>

        {/* Avatar rápido */}
        <Link 
          href="/perfil" 
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center font-bold text-white text-xs border border-gray-700 hover:opacity-90 transition"
        >
          AP
        </Link>
      </div>
    </nav>
  );
}