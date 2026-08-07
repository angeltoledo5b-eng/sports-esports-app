'use client'

import React, { useState } from 'react'

interface Team {
  id: number
  name: string
  pj: number
  pg: number
  pe: number
  pp: number
  gf: number
  gc: number
  pts: number
}

interface Match {
  id: number
  round: string
  teamA: string
  teamB: string
  scoreA: number | null
  scoreB: number | null
  date: string
  status: 'Programado' | 'En Vivo' | 'Finalizado'
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<'feed' | 'torneos' | 'academias' | 'perfil'>('torneos')
  const [tournamentSubTab, setTournamentSubTab] = useState<'posiciones' | 'fixture' | 'reglas'>('posiciones')
  const [selectedCategory, setSelectedCategory] = useState<'deportes' | 'esports'>('esports')

  const [teams] = useState<Team[]>([
    { id: 1, name: 'Sady FC', pj: 3, pg: 2, pe: 1, pp: 0, gf: 7, gc: 2, pts: 7 },
    { id: 2, name: 'Daysa Grace Academy', pj: 3, pg: 2, pe: 0, pp: 1, gf: 5, gc: 3, pts: 6 },
    { id: 3, name: 'Titan eSports', pj: 3, pg: 1, pe: 0, pp: 2, gf: 3, gc: 5, pts: 3 },
    { id: 4, name: 'Phoenix Wild Rift', pj: 3, pg: 0, pe: 1, pp: 2, gf: 2, gc: 7, pts: 1 },
  ])

  const [matches] = useState<Match[]>([
    { id: 1, round: 'Fecha 1', teamA: 'Sady FC', teamB: 'Daysa Grace Academy', scoreA: 2, scoreB: 1, date: 'Ayer', status: 'Finalizado' },
    { id: 2, round: 'Fecha 1', teamA: 'Titan eSports', teamB: 'Phoenix Wild Rift', scoreA: 3, scoreB: 0, date: 'Ayer', status: 'Finalizado' },
    { id: 3, round: 'Fecha 2', teamA: 'Sady FC', teamB: 'Titan eSports', scoreA: null, scoreB: null, date: 'Sábado 18:00', status: 'Programado' },
    { id: 4, round: 'Fecha 2', teamA: 'Daysa Grace Academy', teamB: 'Phoenix Wild Rift', scoreA: null, scoreB: null, date: 'Sábado 19:30', status: 'Programado' },
  ])

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 py-3 flex items-center justify-between">
        <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
          Sports & Esports Network
        </h1>
        <button className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-semibold px-3 py-2 rounded-lg shadow-lg">
          + Crear Torneo
        </button>
      </header>

      <nav className="flex justify-around border-b border-slate-800 bg-slate-900/60 text-xs sm:text-sm font-medium">
        <button
          onClick={() => setActiveTab('feed')}
          className={`py-3 px-3 border-b-2 transition-all ${
            activeTab === 'feed'
              ? 'border-emerald-500 text-emerald-400 font-bold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          📱 Feed Social
        </button>
        <button
          onClick={() => setActiveTab('torneos')}
          className={`py-3 px-3 border-b-2 transition-all ${
            activeTab === 'torneos'
              ? 'border-emerald-500 text-emerald-400 font-bold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          🏆 Torneos (Copa Fácil)
        </button>
        <button
          onClick={() => setActiveTab('academias')}
          className={`py-3 px-3 border-b-2 transition-all ${
            activeTab === 'academias'
              ? 'border-emerald-500 text-emerald-400 font-bold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          🏫 Academias
        </button>
        <button
          onClick={() => setActiveTab('perfil')}
          className={`py-3 px-3 border-b-2 transition-all ${
            activeTab === 'perfil'
              ? 'border-emerald-500 text-emerald-400 font-bold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          👤 Mi Perfil
        </button>
      </nav>

      <main className="max-w-4xl mx-auto p-4 space-y-6">
        {activeTab === 'torneos' && (
          <div className="space-y-5">
            <div className="flex gap-2 border-b border-slate-800 pb-3">
              <button
                onClick={() => setSelectedCategory('esports')}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold ${
                  selectedCategory === 'esports'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                }`}
              >
                🎮 Esports (Wild Rift / FIFA)
              </button>
              <button
                onClick={() => setSelectedCategory('deportes')}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold ${
                  selectedCategory === 'deportes'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                }`}
              >
                ⚽ Deportes Tradicionales
              </button>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
              <div className="flex flex-wrap justify-between items-start gap-2">
                <div>
                  <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                    {selectedCategory === 'esports' ? 'Torneo Wild Rift 1v1 ARAM' : 'Liga de Fútbol Campo Sub-18'}
                  </span>
                  <h2 className="text-xl font-bold text-white mt-1">
                    {selectedCategory === 'esports' ? 'Torneo ARAM Flash Custom' : 'Copa Torneo Local Sady FC'}
                  </h2>
                </div>
                <span className="bg-emerald-950 border border-emerald-500/30 text-emerald-400 text-xs px-3 py-1 rounded-full font-medium">
                  🟢 Inscripciones Abiertas
                </span>
              </div>

              <div className="flex gap-2 border-t border-slate-800 pt-3 text-xs sm:text-sm font-medium text-slate-400">
                <button
                  onClick={() => setTournamentSubTab('posiciones')}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    tournamentSubTab === 'posiciones' ? 'bg-slate-800 text-emerald-400 font-bold' : 'hover:text-slate-200'
                  }`}
                >
                  📊 Tabla de Posiciones
                </button>
                <button
                  onClick={() => setTournamentSubTab('fixture')}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    tournamentSubTab === 'fixture' ? 'bg-slate-800 text-emerald-400 font-bold' : 'hover:text-slate-200'
                  }`}
                >
                  📅 Fixture & Partidos
                </button>
                <button
                  onClick={() => setTournamentSubTab('reglas')}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    tournamentSubTab === 'reglas' ? 'bg-slate-800 text-emerald-400 font-bold' : 'hover:text-slate-200'
                  }`}
                >
                  📜 Reglas & Premio
                </button>
              </div>
            </div>

            {tournamentSubTab === 'posiciones' && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow">
                <div className="p-4 border-b border-slate-800 flex justify-between items-center">
                  <h3 className="font-bold text-slate-200 text-sm">Tabla General de Puntos</h3>
                  <span className="text-xs text-slate-400">Actualizado en tiempo real</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs sm:text-sm text-slate-300">
                    <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800 uppercase text-[10px] tracking-wider">
                      <tr>
                        <th className="p-3">#</th>
                        <th className="p-3">Equipo / Jugador</th>
                        <th className="p-3 text-center">PJ</th>
                        <th className="p-3 text-center">PG</th>
                        <th className="p-3 text-center">PE</th>
                        <th className="p-3 text-center">PP</th>
                        <th className="p-3 text-center">DIF</th>
                        <th className="p-3 text-center font-bold text-emerald-400">PTS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {teams.map((t, index) => (
                        <tr key={t.id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="p-3 font-semibold text-slate-400">{index + 1}</td>
                          <td className="p-3 font-bold text-slate-100 flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-emerald-900/50 border border-emerald-500/30 flex items-center justify-center text-[10px] text-emerald-300">
                              {t.name.charAt(0)}
                            </div>
                            {t.name}
                          </td>
                          <td className="p-3 text-center">{t.pj}</td>
                          <td className="p-3 text-center text-emerald-400">{t.pg}</td>
                          <td className="p-3 text-center text-slate-400">{t.pe}</td>
                          <td className="p-3 text-center text-rose-400">{t.pp}</td>
                          <td className="p-3 text-center font-medium">{t.gf - t.gc > 0 ? `+${t.gf - t.gc}` : t.gf - t.gc}</td>
                          <td className="p-3 text-center font-extrabold text-emerald-400 bg-emerald-950/20">{t.pts}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {tournamentSubTab === 'fixture' && (
              <div className="space-y-3">
                {matches.map((m) => (
                  <div key={m.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between text-xs sm:text-sm">
                    <div className="w-1/3 text-right font-bold text-slate-200">{m.teamA}</div>
                    <div className="flex flex-col items-center px-4">
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">{m.round} • {m.date}</span>
                      <div className="bg-slate-950 border border-slate-800 px-3 py-1 rounded-lg font-mono font-bold text-emerald-400 text-sm">
                        {m.status === 'Finalizado' ? `${m.scoreA} - ${m.scoreB}` : 'VS'}
                      </div>
                      <span className={`text-[10px] mt-1 font-semibold ${m.status === 'Finalizado' ? 'text-slate-500' : 'text-amber-400'}`}>
                        {m.status}
                      </span>
                    </div>
                    <div className="w-1/3 text-left font-bold text-slate-200">{m.teamB}</div>
                  </div>
                ))}
              </div>
            )}

            {tournamentSubTab === 'reglas' && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 text-xs sm:text-sm text-slate-300">
                <h3 className="text-base font-bold text-emerald-400 flex items-center gap-2">
                  🎁 Premio Principal: 1425 Wild Cores (1° Lugar)
                </h3>
                <div className="space-y-2 bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <h4 className="font-bold text-slate-200 text-xs uppercase tracking-wider text-emerald-400">Reglas Oficiales del Torneo 1v1 ARAM:</h4>
                  <ul className="list-disc pl-5 space-y-1 text-slate-300">
                    <li>Modo de juego: ARAM Normal Personalizado (Eliminación directa).</li>
                    <li>Sin baneos de campeones.</li>
                    <li><strong>Campeones restringidos:</strong> No se permite usar Ornn ni Ziggs.</li>
                    <li><strong>Runas prohibidas:</strong> No se permiten runas de tumba/destrucción rápida de torres.</li>
                    <li>No hay recall (retorno a base) a menos que el personaje muera.</li>
                    <li><strong>Condición de victoria:</strong> Gana el jugador que consiga 2 Kills primero o destruya la primera torre rival.</li>
                  </ul>
                </div>
                <button className="w-full bg-emerald-600 hover:bg-emerald-500 font-bold py-3 rounded-xl text-white shadow-lg transition-all">
                  Inscribir Mi Equipo / Usuario Gratis
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'feed' && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-center text-slate-400">
            En el próximo paso conectaremos las publicaciones de muro estilo Facebook aquí.
          </div>
        )}
        {activeTab === 'academias' && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-center text-slate-400">
            Módulo de páginas institucionales para Academias y Clubes.
          </div>
        )}
        {activeTab === 'perfil' && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-center text-slate-400">
            Perfil de Usuario con enlace de referidos para generar comisiones.
          </div>
        )}
      </main>
    </div>
  )
}