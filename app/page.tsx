'use client';

import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient'; // Importación nombrada usando llaves

interface Post {
  id: string;
  user_id: string;
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

      const { data: postsData, error: postsError } = await postsQuery;

      const { data: tournamentsData, error: tournamentsError } = await supabase
        .from('tournaments')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (postsError) console.error('Error cargando posts:', postsError);
      if (tournamentsError) console.error('Error cargando torneos:', tournamentsError);

      if (postsData) setPosts(postsData);
      if (tournamentsData) setTournaments(tournamentsData);
    } catch (err) {
      console.error('Error de conexión:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Filtros de Categoría */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
            selectedCategory === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300'
          }`}
        >
          🔥 Todos
        </button>
        <button
          onClick={() => setSelectedCategory('esports')}
          className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
            selectedCategory === 'esports' ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-300'
          }`}
        >
          🎮 eSports
        </button>
        <button
          onClick={() => setSelectedCategory('sports')}
          className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
            selectedCategory === 'sports' ? 'bg-green-600 text-white' : 'bg-gray-800 text-gray-300'
          }`}
        >
          ⚽ Deportes
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Columna Principal: Feed de Noticias */}
        <div className="md:col-span-2 space-y-4">
          <h2 className="text-xl font-bold text-white mb-4">Feed Principal</h2>

          {loading ? (
            <p className="text-gray-400 text-sm">Cargando publicaciones...</p>
          ) : posts.length === 0 ? (
            <p className="text-gray-400 text-sm">No hay publicaciones aún. ¡Sé el primero en compartir algo!</p>
          ) : (
            posts.map((post) => (
              <div key={post.id} className="bg-gray-900 border border-gray-800 p-4 rounded-xl space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white text-sm overflow-hidden">
                    {post.user_avatar ? (
                      <img src={post.user_avatar} alt={post.user_name} className="w-full h-full object-cover" />
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
          <h2 className="text-xl font-bold text-white mb-4">🏆 Torneos Recientes</h2>
          <div className="bg-gray-900 border border-gray-800 p-4 rounded-xl space-y-4">
            {tournaments.length === 0 ? (
              <p className="text-gray-400 text-sm">No hay torneos activos en este momento.</p>
            ) : (
              tournaments.map((t) => (
                <div key={t.id} className="border-b border-gray-800 pb-3 last:border-0 last:pb-0">
                  <h4 className="font-bold text-white text-sm">{t.title}</h4>
                  <p className="text-xs text-gray-400 capitalize">{t.category}</p>
                  <div className="flex justify-between items-center mt-2 text-xs">
                    <span className="text-blue-400">{t.current_players || 0} / {t.max_players || 100} Jugadores</span>
                    <span className="px-2 py-0.5 bg-green-900/50 text-green-400 rounded text-[10px]">{t.status || 'Abierto'}</span>
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