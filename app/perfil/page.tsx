'use client';

import { useState } from 'react';

export default function PerfilPage() {
  const [activeTab, setActiveTab] = useState<'stats' | 'tournaments'>('stats');

  // Datos de ejemplo del perfil
  const userProfile = {
    name: 'Ángel Toledo',
    tag: '@angeltoledo',
    role: 'ADC / Competidor Pro',
    rank: 'Diamante',
    favGame: 'Wild Rift / Fútbol 5',
    tournamentsPlayed: 12,
    tournamentsWon: 3,
    bio: 'Apasionado de los eSports y torneos locales. Siempre listo para el siguiente 1v1 o partido de fin de semana.',
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">
      {/* Tarjeta Principal de Perfil */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 relative overflow-hidden">
        {/* Banner de Fondo */}
        <div className="h-28 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-xl -m-6 mb-4 opacity-80" />

        <div className="flex flex-col md:flex-row items-center md:items-end gap-5 relative z-10 -mt-14">
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-blue-500 to-purple-600 p-1 shadow-2xl">
            <div className="w-full h-full bg-gray-950 rounded-xl flex items-center justify-center text-2xl font-black text-white">
              AP
            </div>
          </div>

          <div className="text-center md:text-left flex-1">
            <div className="flex flex-col md:flex-row md:items-center gap-2">
              <h1 className="text-2xl font-black text-white">{userProfile.name}</h1>
              <span className="text-xs font-bold px-2.5 py-0.5 bg-blue-950 text-blue-400 border border-blue-800 rounded-full w-fit mx-auto md:mx-0">
                {userProfile.rank}
              </span>
            </div>
            <p className="text-xs text-gray-400">{userProfile.tag} • {userProfile.role}</p>
          </div>

          <button className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-xl text-xs font-bold transition">
            Editar Perfil
          </button>
        </div>

        <p className="text-sm text-gray-300 mt-4 pt-4 border-t border-gray-800/80">
          {userProfile.bio}
        </p>
      </div>

      {/* Pestañas de Navegación del Perfil */}
      <div className="flex gap-2 border-b border-gray-800 pb-3">
        <button
          onClick={() => setActiveTab('stats')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'stats' ? 'bg-blue-600 text-white' : 'bg-gray-900 text-gray-400 hover:text-white'
          }`}
        >
          📊 Estadísticas
        </button>
        <button
          onClick={() => setActiveTab('tournaments')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'tournaments' ? 'bg-purple-600 text-white' : 'bg-gray-900 text-gray-400 hover:text-white'
          }`}
        >
          🏆 Mis Torneos
        </button>
      </div>

      {/* Contenido según la Pestaña */}
      {activeTab === 'stats' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-900 border border-gray-800 p-5 rounded-2xl text-center space-y-1">
            <span className="text-2xl font-black text-blue-400">{userProfile.tournamentsPlayed}</span>
            <p className="text-xs text-gray-400 font-medium">Torneos Jugados</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 p-5 rounded-2xl text-center space-y-1">
            <span className="text-2xl font-black text-green-400">{userProfile.tournamentsWon}</span>
            <p className="text-xs text-gray-400 font-medium">Torneos Ganados</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 p-5 rounded-2xl text-center space-y-1">
            <span className="text-2xl font-black text-purple-400">{userProfile.favGame}</span>
            <p className="text-xs text-gray-400 font-medium">Disciplina Principal</p>
          </div>
        </div>
      ) : (
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl text-center space-y-2">
          <p className="text-gray-300 text-sm font-semibold">Copa ARAM 1v1 Wild Rift</p>
          <span className="px-2.5 py-1 bg-green-950 text-green-400 border border-green-800 text-[10px] font-bold rounded">
            Inscrito / Activo
          </span>
        </div>
      )}
    </div>
  );
}