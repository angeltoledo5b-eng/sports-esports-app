'use client'

import React, { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'

interface Post {
  id: string | number
  author_name: string
  author_role: string
  avatar: string
  content: string
  likes: number
  comments: number
  created_at?: string
  tag?: string
}

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
  const [activeTab, setActiveTab] = useState<'feed' | 'torneos' | 'academias' | 'perfil'>('feed')
  const [tournamentSubTab, setTournamentSubTab] = useState<'posiciones' | 'fixture' | 'reglas'>('posiciones')
  const [selectedCategory, setSelectedCategory] = useState<'deportes' | 'esports'>('esports')
  const [newPostText, setNewPostText] = useState('')
  const [posts, setPosts] = useState<Post[]>([])
  const [loadingPosts, setLoadingPosts] = useState(true)

  // Cargar publicaciones desde Supabase al iniciar
  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      setLoadingPosts(true)
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error cargando posts:', error)
      } else if (data && data.length > 0) {
        setPosts(data)
      } else {
        // Datos por defecto si aún no hay publicaciones en la BD
        setPosts([
          {
            id: '1',
            author_name: 'Ángel Toledo',
            author_role: 'Organizador eSports',
            avatar: 'Á',
            content: '¡Inscripciones abiertas para el Torneo Wild Rift 1v1 ARAM! 🏆 Recuerden que no hay bans, campeones Ornn y Ziggs prohibidos. ¡Premio de 1425 Wild Cores al 1° Lugar!',
            likes: 24,
            comments: 8,
            tag: 'Torneos Wild Rift'
          }
        ])
      }
    } catch (err) {
      console.error('Error de conexión:', err)
    } finally {
      setLoadingPosts(false)
    }
  }

  // Guardar nueva publicación en Supabase
  const handleCreatePost = async () => {
    if (!newPostText.trim()) return

    const newPostData = {
      author_name: 'Usuario Activo',
      author_role: 'Jugador Pro',
      avatar: 'U',
      content: newPostText,
      likes: 0,
      comments: 0,
      tag: 'Comunidad'
    }

    // Insertar en la BD
    const { data, error } = await supabase
      .from('posts')
      .insert([newPostData])
      .select()

    if (error) {
      alert('Error al publicar: ' + error.message)
    } else if (data) {
      setPosts([data[0], ...posts])
      setNewPostText('')
    }
  }

  // Datos locales de ejemplo para la sección de Torneos
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
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 py-3 flex items-center justify-between">
        <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
          Sports & Esports Network
        </h1>
        <div className="flex gap-2">
          <button 
            onClick={() => setActiveTab('torneos')}
            className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-semibold px-3 py-2 rounded-lg shadow"
          >
            + Crear Torneo
          </button>
        </div>
      </header>

      {/* Navegación Principal */}
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

      {/* Contenido Principal */}
      <main className="max-w-3xl mx-auto p-4 space-y-6">

        {/* FEED SOCIAL */}
        {activeTab === 'feed' && (
          <div className="space-y-5">
            {/* Creador de Publicaciones */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-700 flex items-center justify-center font-bold text-white">
                  U
                </div>
                <input
                  type="text"
                  placeholder="¿Qué estás pensando o qué torneo quieres anunciar?..."
                  value={newPostText}
                  onChange={(e) => setNewPostText(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div className="flex justify-between items-center border-t border-slate-800/80 pt-2 text-xs">
                <span className="text-slate-400">⚡ Guardado instantáneo en la Base de Datos</span>
                <button
                  onClick={handleCreatePost}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-1.5 rounded-lg transition-all"
                >
                  Publicar
                </button>
              </div>
            </div>

            {/* Banner Monetización */}
            <div className="bg-gradient-to-r from-emerald-950 to-slate-900 border border-emerald-500/30 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 shadow">
              <div>
                <span className="bg-emerald-500 text-slate-950 font-extrabold text-[10px] px-2 py-0.5 rounded uppercase">
                  💰 Gana Dinero
                </span>
                <h4 className="text-sm font-bold text-white mt-1">Programa de Referidos Abierto</h4>
                <p className="text-xs text-slate-300">Invita jugadores o academias con tu enlace personal y gana comisiones por registro.</p>
              </div>
              <button 
                onClick={() => setActiveTab('perfil')}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold px-3 py-1.5 rounded-lg"
              >
                Copiar Mi Enlace
              </button>
            </div>

            {/* Muro de Publicaciones */}
            <div className="space-y-4">
              {loadingPosts ? (
                <p className="text-center text-xs text-slate-500 py-4">Cargando publicaciones desde la base de datos...</p>
              ) : (
                posts.map((post) => (
                  <div key={post.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 shadow">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-emerald-400">
                          {post.avatar || 'U'}
                        </div>
                        <div>
                          <h3 className="font-bold text-sm text-slate-100">{post.author_name}</h3>
                          <p className="text-[11px] text-slate-400">{post.author_role}</p>
                        </div>
                      </div>
                      {post.tag && (
                        <span className="text-[10px] bg-slate-800 text-emerald-400 px-2.5 py-1 rounded-full font-semibold border border-slate-700">
                          {post.tag}
                        </span>
                      )}
                    </div>

                    <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">{post.content}</p>

                    <div className="flex justify-between items-center border-t border-slate-800/80 pt-3 text-xs text-slate-400 font-medium">
                      <button className="hover:text-emerald-400 flex items-center gap-1">
                        👍 {post.likes} Me gusta
                      </button>
                      <button className="hover:text-emerald-400 flex items-center gap-1">
                        💬 {post.comments} Comentarios
                      </button>
                      <button className="hover:text-emerald-400 flex items-center gap-1">
                        ↪️ Compartir
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* MÓDULO TORNEOS */}
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
                <h3 className="text-base font-bold text-emerald-400">
                  🎁 Premio Principal: 1425 Wild Cores (1° Lugar)
                </h3>
                <div className="space-y-2 bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-emerald-400">Reglas Oficiales del Torneo 1v1 ARAM:</h4>
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

        {/* ACADEMIAS */}
        {activeTab === 'academias' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h2 className="text-lg font-bold text-white">Directorio de Academias & Clubes</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <span className="text-[10px] bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20 font-bold">Fútbol Base</span>
                <h3 className="font-bold text-base text-white">Daysa Grace Academy</h3>
                <p className="text-xs text-slate-400">Formación deportiva integral para categorías infantiles y juveniles.</p>
                <button className="w-full bg-slate-800 hover:bg-slate-700 text-xs font-bold py-2 rounded text-slate-200 mt-2">
                  Ver Perfil de la Academia
                </button>
              </div>
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <span className="text-[10px] bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20 font-bold">Fútbol Senior / Esports</span>
                <h3 className="font-bold text-base text-white">Sady FC</h3>
                <p className="text-xs text-slate-400">Club deportivo de alto rendimiento y rama eSports competitiva.</p>
                <button className="w-full bg-slate-800 hover:bg-slate-700 text-xs font-bold py-2 rounded text-slate-200 mt-2">
                  Ver Perfil de la Academia
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MI PERFIL Y MONETIZACIÓN */}
        {activeTab === 'perfil' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
            <div className="flex items-center gap-4 border-b border-slate-800 pb-5">
              <div className="w-16 h-16 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-2xl text-white">
                Á
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Ángel Toledo</h2>
                <p className="text-xs text-slate-400">Organizador Pro • Miembro Freemium</p>
              </div>
            </div>

            {/* Enlace de Referidos */}
            <div className="bg-slate-950 border border-emerald-500/30 p-4 rounded-xl space-y-3">
              <h3 className="font-bold text-sm text-emerald-400">💰 Tu Enlace de Referido Personal</h3>
              <p className="text-xs text-slate-300">Comparte este enlace para invitar nuevos usuarios, jugadores o academias. Obtendrás comisiones automáticas por sus registros e inscripciones.</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value="https://sports-esports-app.vercel.app/?ref=angeltoledo"
                  className="w-full bg-slate-900 border border-slate-800 text-slate-300 text-xs px-3 py-2 rounded-lg font-mono"
                />
                <button
                  onClick={() => alert('¡Enlace copiado al portapapeles!')}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2 rounded-lg"
                >
                  Copiar
                </button>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  )
}