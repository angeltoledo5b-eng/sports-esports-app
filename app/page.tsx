'use client'

import React, { useState } from 'react'

export default function Home() {
  const [activeTab, setActiveTab] = useState<'feed' | 'torneos' | 'academias' | 'perfil'>('feed')

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* Encabezado Principal */}
      <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 py-3 flex items-center justify-between">
        <h1 className="text-xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
          Sports & Esports Network
        </h1>
        <button className="bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold px-4 py-2 rounded-lg shadow-lg">
          + Crear
        </button>
      </header>

      {/* Navegación Estilo App (Barra Superior / Menú Principal) */}
      <nav className="flex justify-around border-b border-slate-800 bg-slate-900/50 text-sm font-medium">
        <button
          onClick={() => setActiveTab('feed')}
          className={`py-3 px-4 border-b-2 transition-all ${
            activeTab === 'feed'
              ? 'border-emerald-500 text-emerald-400 font-bold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          📱 Feed Social
        </button>
        <button
          onClick={() => setActiveTab('torneos')}
          className={`py-3 px-4 border-b-2 transition-all ${
            activeTab === 'torneos'
              ? 'border-emerald-500 text-emerald-400 font-bold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          🏆 Torneos (Copa Fácil)
        </button>
        <button
          onClick={() => setActiveTab('academias')}
          className={`py-3 px-4 border-b-2 transition-all ${
            activeTab === 'academias'
              ? 'border-emerald-500 text-emerald-400 font-bold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          🏫 Academias
        </button>
        <button
          onClick={() => setActiveTab('perfil')}
          className={`py-3 px-4 border-b-2 transition-all ${
            activeTab === 'perfil'
              ? 'border-emerald-500 text-emerald-400 font-bold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          👤 Mi Perfil
        </button>
      </nav>

      {/* Contenido Dinámico según la pestaña activa */}
      <main className="max-w-4xl mx-auto p-4 space-y-6">
        {activeTab === 'feed' && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-200">Muro Comunitario</h2>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow">
              <p className="text-slate-400">Publicaciones de usuarios, noticias de torneos y academias...</p>
            </div>
          </div>
        )}

        {activeTab === 'torneos' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-slate-200">Gestor de Torneos</h2>
              <button className="bg-emerald-600 hover:bg-emerald-500 text-xs px-3 py-1.5 rounded text-white">
                + Crear Torneo
              </button>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <span className="font-bold text-emerald-400">Liga Sub-18 Fútbol</span>
                <span className="text-xs bg-slate-800 text-slate-300 px-2 py-1 rounded">En curso</span>
              </div>
              <p className="text-xs text-slate-400">Tabla de posiciones, fixtures y goleadores habilitados.</p>
            </div>
          </div>
        )}

        {activeTab === 'academias' && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-200">Directorio de Academias & Clubes</h2>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <p className="text-slate-400">Perfiles institucionales, inscripciones abiertas y convocatorias.</p>
            </div>
          </div>
        )}

        {activeTab === 'perfil' && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-200">Perfil de Usuario (Estilo Facebook)</h2>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <p className="text-slate-400">Información personal, estadísticas, equipos y link de referidos para generar ganancias.</p>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}