'use client';

import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

interface Post {
  id: string;
  user_name: string;
  user_avatar?: string;
  content: string;
  media_url?: string;
  category: 'esports' | 'sports' | 'general';
  likes_count: number;
  comments_count: number;
  created_at: string;
}

interface Tournament {
  id: string;
  title: string;
  category: string;
  max_players: number;
  current_players: number;
  status: string;
  created_at: string;
}

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'esports' | 'sports'>('all');

  // Estado del nuevo post
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostCategory, setNewPostCategory] = useState<'esports' | 'sports' | 'general'>('esports');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, [selectedCategory]);

  const fetchData = async () => {
    setLoading(true);
    try {
      let postsQuery = supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (selectedCategory !== 'all') {
        postsQuery = postsQuery.eq('category', selectedCategory);
      }

      const { data: postsData } = await postsQuery;
      const { data: tournamentsData } = await supabase
        .from('tournaments')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (postsData) setPosts(postsData);
      if (tournamentsData) setTournaments(tournamentsData);
    } catch (err) {
      console.error('Error cargando datos:', err);
    } finally {
      setLoading(false);
    }
  };

  // Función para enviar nuevo post a Supabase
  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;

    setIsSubmitting(true);
    try {
      const newPost = {
        user_name: 'Jugador Pro', // Nombre temporal mientras conectamos Auth completo
        content: newPostContent,
        category: newPostCategory,
        likes_count: 0,
        comments_count: 0,
      };

      const { data, error } = await supabase.from('posts').insert([newPost]).select();

      if (error) {
        console.error('Error al publicar:', error);
        alert('Error al publicar. Revisa los permisos de la tabla en Supabase.');
      } else if (data) {
        setPosts([data[0], ...posts]);
        setNewPostContent('');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Encabezado Principal */}
      <header className="flex justify-between items-center py-4 border-b border-gray-800">
        <h1 className="text-2xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
          SPORTS & ESPORTS
        </h1>
        <div className="flex gap-2">
          <button className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-500 transition">
            Crear Torneo
          </button>
        </div>
      </header>

      {/* Filtros de Categoría */}
      <div className="flex gap-2">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
            selectedCategory === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          🔥 Todos
        </button>
        <button
          onClick={() => setSelectedCategory('esports')}
          className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
            selectedCategory === 'esports' ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          🎮 eSports
        </button>
        <button
          onClick={() => setSelectedCategory('sports')}
          className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
            selectedCategory === 'sports' ? 'bg-green-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          ⚽ Deportes
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Columna Principal: Crear Post + Feed */}
        <div className="md:col-span-2 space-y-4">
          {/* Caja para Publicar */}
          <form onSubmit={handleCreatePost} className="bg-gray-900 border border-gray-800 p-4 rounded-xl space-y-3">
            <textarea
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              placeholder="¿Qué estás entrenando o jugando hoy? Comparte tus jugadas..."
              className="w-full bg-gray-950 border border-gray-800 rounded-lg p-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none h-20"
            />
            <div className="flex justify-between items-center">
              <select
                value={newPostCategory}
                onChange={(e) => setNewPostCategory(e.target.value as any)}
                className="bg-gray-800 text-gray-300 text-xs rounded-lg px-3 py-1.5 border border-gray-700 focus:outline-none"
              >
                <option value="esports">🎮 eSports</option>
                <option value="sports">⚽ Deportes</option>
                <option value="general">🔥 General</option>
              </select>

              <button
                type="submit"
                disabled={isSubmitting || !newPostContent.trim()}
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold transition"
              >
                {isSubmitting ? 'Publicando...' : 'Publicar'}
              </button>
            </div>
          </form>

          {/* Feed de Noticias */}
          {loading ? (
            <p className="text-gray-400 text-sm">Cargando publicaciones...</p>
          ) : posts.length === 0 ? (
            <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl text-center">
              <p className="text-gray-400 text-sm">No hay publicaciones aún en esta categoría.</p>
              <p className="text-xs text-gray-500 mt-1">¡Escribe la primera publicación arriba!</p>
            </div>
          ) : (
            posts.map((post) => (
              <div key={post.id} className="bg-gray-900 border border-gray-800 p-4 rounded-xl space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center font-bold text-white text-sm">
                    {post.user_avatar ? (
                      <img src={post.user_avatar} alt={post.user_name} className="w-full h-full object-cover rounded-full" />
                    ) : (
                      post.user_name?.charAt(0).toUpperCase() || 'U'
                    )}
                  </div>
                  <div>
                    <h4 className="font-semibold text-white text-sm">{post.user_name || 'Usuario'}</h4>
                    <span className="text-xs text-gray-400">{new Date(post.created_at).toLocaleDateString()}</span>
                  </div>
                </div>

                <p className="text-gray-200 text-sm">{post.content}</p>

                {post.media_url && (
                  <img src={post.media_url} alt="Media" className="w-full rounded-lg max-h-96 object-cover border border-gray-800" />
                )}

                <div className="flex gap-4 pt-2 border-t border-gray-800 text-xs text-gray-400">
                  <button className="hover:text-blue-500 transition-colors">❤️ {post.likes_count || 0} Likes</button>
                  <button className="hover:text-blue-500 transition-colors">💬 {post.comments_count || 0} Comentarios</button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Columna Lateral: Torneos Activos */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white">🏆 Torneos Recientes</h2>
          <div className="bg-gray-900 border border-gray-800 p-4 rounded-xl space-y-4">
            {tournaments.length === 0 ? (
              <p className="text-gray-400 text-sm">No hay torneos activos en este momento.</p>
            ) : (
              tournaments.map((t) => (
                <div key={t.id} className="border-b border-gray-800 pb-3 last:border-0 last:pb-0 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-white text-sm">{t.title}</h4>
                      <p className="text-xs text-gray-400 capitalize">{t.category}</p>
                    </div>
                    <span className="px-2 py-0.5 bg-green-900/50 text-green-400 rounded text-[10px] font-semibold">
                      {t.status || 'Abierto'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-blue-400">{t.current_players || 0} / {t.max_players || 100} Jugadores</span>
                    <button className="px-2 py-1 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded text-[11px] font-medium transition">
                      Inscribirse
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}