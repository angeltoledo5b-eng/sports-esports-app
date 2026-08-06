'use client'
import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'

interface Comment {
  id: number;
  autor: string;
  texto: string;
}

interface Post {
  id: number;
  autor: string;
  tag: string;
  categoria: string;
  rol: string;
  contenido: string;
  likes: number;
  tiempo: string;
  comentarios: Comment[];
}

export default function Home() {
  const [filtro, setFiltro] = useState<string>('TODOS')
  const [posts, setPosts] = useState<Post[]>([])
  const [cargando, setCargando] = useState<boolean>(true)
  
  // Estado para el Modal de nueva publicación
  const [modalAbierto, setModalAbierto] = useState<boolean>(false)
  const [autorInput, setAutorInput] = useState<string>('Ángel Toledo')
  const [rolInput, setRolInput] = useState<string>('Main ADC Diamante')
  const [categoriaInput, setCategoriaInput] = useState<string>('ESPORTS')
  const [tagInput, setTagInput] = useState<string>('Wild Rift')
  const [contenidoInput, setContenidoInput] = useState<string>('')
  const [guardando, setGuardando] = useState<boolean>(false)

  // Estado para gestionar desplegable de comentarios e input
  const [comentariosAbiertos, setComentariosAbiertos] = useState<{ [key: number]: boolean }>({})
  const [nuevoComentarioText, setNuevoComentarioText] = useState<{ [key: number]: string }>({})

  // Publicaciones iniciales
  const postsPrueba: Post[] = [
    {
      id: 1,
      autor: 'Ángel Toledo',
      tag: 'Wild Rift / Fútbol',
      categoria: 'ESPORTS',
      rol: 'ADC - Diamante',
      contenido: '¡Kiting perfecto con Ezreal en la última TF para asegurar el Nashor! 🏹⚡ Por cierto, ¿quién se anota para armar un partido de fútbol este fin de semana?',
      likes: 32,
      tiempo: 'Hace 10 min',
      comentarios: [
        { id: 101, autor: 'Yvannis', texto: '¡Excelente jugada! Cuenta conmigo para el partido.' }
      ]
    },
    {
      id: 2,
      autor: 'Academia Sady FC',
      tag: 'Fútbol',
      categoria: 'DEPORTE',
      rol: 'Academia',
      contenido: 'Convocatoria abierta para la categoría Sub-18 este sábado. ¡Buscamos mediocampistas y delanteros!',
      likes: 56,
      tiempo: 'Hace 1 hora',
      comentarios: []
    }
  ]

  const obtenerPublicaciones = async () => {
    try {
      if (!supabase) {
        setPosts(postsPrueba)
        return
      }

      const { data, error } = await supabase
        .from('publicaciones')
        .select('*')
        .order('id', { ascending: false })

      if (error || !data || data.length === 0) {
        setPosts(postsPrueba)
      } else {
        const postsFormateados: Post[] = data.map((p: any) => ({
          id: p.id,
          autor: p.autor || 'Usuario',
          tag: p.disciplina || 'General',
          categoria: p.categoria || 'DEPORTE',
          rol: p.rol || 'Miembro',
          contenido: p.contenido,
          likes: p.likes || 0,
          tiempo: 'Reciente',
          comentarios: p.comentarios || []
        }))
        setPosts(postsFormateados)
      }
    } catch (err) {
      setPosts(postsPrueba)
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    obtenerPublicaciones()
  }, [])

  // Crear Publicación
  const handleCrearPost = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!contenidoInput.trim()) return

    setGuardando(true)

    const nuevoPostLocal = {
      autor: autorInput,
      rol: rolInput,
      categoria: categoriaInput,
      disciplina: tagInput,
      contenido: contenidoInput,
      likes: 0
    }

    if (supabase) {
      const { error } = await supabase.from('publicaciones').insert([nuevoPostLocal])
      if (!error) {
        await obtenerPublicaciones()
      } else {
        setPosts(prev => [{
          id: Date.now(),
          autor: autorInput,
          tag: tagInput,
          categoria: categoriaInput,
          rol: rolInput,
          contenido: contenidoInput,
          likes: 0,
          tiempo: 'Ahora',
          comentarios: []
        }, ...prev])
      }
    }

    setContenidoInput('')
    setModalAbierto(false)
    setGuardando(false)
  }

  // Dar Me Gusta ❤️
  const handleLike = (id: number) => {
    setPosts(prev => prev.map(p => {
      if (p.id === id) {
        return { ...p, likes: p.likes + 1 }
      }
      return p
    }))
  }

  // Alternar caja de comentarios
  const toggleComentarios = (id: number) => {
    setComentariosAbiertos(prev => ({ ...prev, [id]: !prev[id] }))
  }

  // Agregar Comentario
  const handleAgregarComentario = (postId: number) => {
    const texto = nuevoComentarioText[postId]
    if (!texto || !texto.trim()) return

    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const nuevoComentario: Comment = {
          id: Date.now(),
          autor: autorInput || 'Ángel Toledo',
          texto: texto.trim()
        }
        return { ...p, comentarios: [...p.comentarios, nuevoComentario] }
      }
      return p
    }))

    setNuevoComentarioText(prev => ({ ...prev, [postId]: '' }))
  }

  const postsFiltrados = filtro === 'TODOS' 
    ? posts 
    : posts.filter(p => p.categoria === filtro)

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-4 py-3 flex items-center justify-between">
        <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
          Sports & Esports Social
        </h1>
        <button 
          onClick={() => setModalAbierto(true)}
          className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-4 py-1.5 rounded-full text-sm transition"
        >
          + Publicar
        </button>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-2xl w-full mx-auto p-4 space-y-4">
        {/* Filtros */}
        <div className="flex gap-2 border-b border-slate-800 pb-3">
          {['TODOS', 'DEPORTE', 'ESPORTS'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFiltro(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider transition ${
                filtro === cat
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Feed de Publicaciones */}
        {cargando ? (
          <div className="text-center py-8 text-slate-500 text-sm">Cargando publicaciones...</div>
        ) : (
          <div className="space-y-4">
            {postsFiltrados.map((post) => (
              <article key={post.id} className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-lg space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-slate-100">{post.autor}</h3>
                      <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-md bg-slate-800 text-emerald-400 border border-slate-700">
                        {post.tag}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">{post.rol}</p>
                  </div>
                  <span className="text-xs text-slate-500">{post.tiempo}</span>
                </div>

                <p className="text-sm text-slate-200 leading-relaxed">
                  {post.contenido}
                </p>

                {/* Botones de Acción */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-xs text-slate-400">
                  <button 
                    onClick={() => handleLike(post.id)}
                    className="hover:text-emerald-400 transition flex items-center gap-1 font-medium"
                  >
                    ❤️ {post.likes} Me gusta
                  </button>
                  <button 
                    onClick={() => toggleComentarios(post.id)}
                    className="hover:text-emerald-400 transition flex items-center gap-1 font-medium"
                  >
                    💬 {post.comentarios.length} Comentarios
                  </button>
                  <button className="hover:text-emerald-400 transition">
                    🔄 Compartir
                  </button>
                </div>

                {/* Sección Desplegable de Comentarios */}
                {comentariosAbiertos[post.id] && (
                  <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-3">
                    <div className="space-y-2">
                      {post.comentarios.length === 0 ? (
                        <p className="text-xs text-slate-500 italic">No hay comentarios aún. Sé el primero.</p>
                      ) : (
                        post.comentarios.map((c) => (
                          <div key={c.id} className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/50 text-xs space-y-1">
                            <span className="font-bold text-emerald-400">{c.autor}</span>
                            <p className="text-slate-300">{c.texto}</p>
                          </div>
                        ))
                      )}
                    </div>

                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder="Escribe un comentario..."
                        value={nuevoComentarioText[post.id] || ''}
                        onChange={(e) => setNuevoComentarioText({ ...nuevoComentarioText, [post.id]: e.target.value })}
                        className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                      />
                      <button 
                        onClick={() => handleAgregarComentario(post.id)}
                        className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-3 py-1.5 rounded-lg text-xs transition"
                      >
                        Enviar
                      </button>
                    </div>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </main>

      {/* Modal para Nueva Publicación */}
      {modalAbierto && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-lg space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h2 className="text-lg font-bold text-slate-100">Nueva Publicación</h2>
              <button 
                onClick={() => setModalAbierto(false)}
                className="text-slate-400 hover:text-slate-100 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCrearPost} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Nombre / Usuario</label>
                  <input 
                    type="text" 
                    value={autorInput} 
                    onChange={(e) => setAutorInput(e.target.value)} 
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Rol / Rango</label>
                  <input 
                    type="text" 
                    value={rolInput} 
                    onChange={(e) => setRolInput(e.target.value)} 
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Categoría</label>
                  <select 
                    value={categoriaInput} 
                    onChange={(e) => setCategoriaInput(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="ESPORTS">eSports</option>
                    <option value="DEPORTE">Deporte Tradicional</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Disciplina / Juego</label>
                  <input 
                    type="text" 
                    value={tagInput} 
                    onChange={(e) => setTagInput(e.target.value)} 
                    placeholder="Ej: Wild Rift, Fútbol..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Mensaje / Contenido</label>
                <textarea 
                  value={contenidoInput} 
                  onChange={(e) => setContenidoInput(e.target.value)} 
                  placeholder="¿Qué quieres compartir hoy?" 
                  rows={4}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-100 focus:outline-none focus:border-emerald-500 resize-none"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button 
                  type="button" 
                  onClick={() => setModalAbierto(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold bg-slate-800 text-slate-300 hover:bg-slate-700 transition"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  disabled={guardando}
                  className="px-4 py-2 rounded-lg text-xs font-bold bg-emerald-500 text-slate-950 hover:bg-emerald-400 transition disabled:opacity-50"
                >
                  {guardando ? 'Publicando...' : 'Publicar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}