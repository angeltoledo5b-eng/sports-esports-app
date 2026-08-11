'use client';

import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { useAuth } from './AuthContext';
import Link from 'next/link';

interface Post {
  id: string;
  user_name: string;
  game: string;
  content: string;
  likes: number;
  created_at: string;
}

export default function Home() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [content, setContent] = useState('');
  const [game, setGame] = useState('General');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) console.error('Error al cargar posts:', error);
    if (data) setPosts(data);
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    const userName = user?.email ? user.email.split('@')[0] : 'Usuario';

    const { error } = await supabase.from('posts').insert([
      {
        user_name: userName,
        game,
        content,
        likes: 0,
      },
    ]);

    if (error) {
      alert('Error al publicar: ' + error.message);
    } else {
      setContent('');
      fetchPosts();
    }
    setLoading(false);
  };

  const handleLike = async (id: string, currentLikes: number) => {
    const { error } = await supabase
      .from('posts')
      .update({ likes: currentLikes + 1 })
      .eq('id', id);

    if (error) {
      console.error(error);
    } else {
      setPosts(posts.map((p) => (p.id === id ? { ...p, likes: p.likes + 1 } : p)));
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-6 space-y-6">
      {/* Banner de Bienvenida o Publicación */}
      {user ? (
        <form onSubmit={handleCreatePost} className="bg-gray-900 border border-gray-800 p-5 rounded-2xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400 font-medium">
              Publicando como <strong className="text-blue-400">@{user.email?.split('@')[0]}</strong>
            </span>
            <select
              value={game}
              onChange={(e) => setGame(e.target.value)}
              className="bg-gray-950 border border-gray-800 text-xs text-gray-300 rounded-lg p-1.5 font-semibold"
            >
              <option value="General">💬 General</option>
              <option value="Wild Rift">🎮 Wild Rift</option>
              <option value="Fútbol 5">⚽ Fútbol 5</option>
              <option value="League of Legends">⚔️ LoL</option>
            </select>
          </div>

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="¿Qué torneo o jugada quieres compartir hoy?"
            className="w-full bg-gray-950 border border-gray-800 rounded-xl p-3 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-blue-500 transition resize-none h-24"
          />

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading || !content.trim()}
              className="px-5 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl text-xs font-bold hover:opacity-90 disabled:opacity-50 transition"
            >
              {loading ? 'Publicando...' : 'Publicar'}
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl text-center space-y-3">
          <h2 className="text-lg font-bold text-white">¡Únete a la comunidad de SportsHub!</h2>
          <p className="text-xs text-gray-400">
            Inicia sesión para interactuar con jugadores, inscribirte en torneos y compartir tus mejores momentos.
          </p>
          <Link
            href="/login"
            className="inline-block px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition"
          >
            Iniciar Sesión / Registrarse
          </Link>
        </div>
      )}

      {/* Lista de Publicaciones */}
      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post.id} className="bg-gray-900 border border-gray-800 p-5 rounded-2xl space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white">
                  {post.user_name?.substring(0, 2).toUpperCase() || 'US'}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">{post.user_name}</h4>
                  <span className="text-[10px] text-gray-500">
                    {new Date(post.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <span className="text-[10px] font-bold px-2.5 py-1 bg-gray-950 border border-gray-800 text-purple-400 rounded-lg">
                {post.game}
              </span>
            </div>

            <p className="text-sm text-gray-300 leading-relaxed">{post.content}</p>

            <div className="flex items-center gap-4 pt-2 border-t border-gray-800/60">
              <button
                onClick={() => handleLike(post.id, post.likes || 0)}
                className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-red-400 transition font-medium"
              >
                ❤️ <span>{post.likes || 0}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}