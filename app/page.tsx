'use client';

import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { useAuth } from './AuthContext';
import Link from 'next/link';

interface Comment {
  id: string;
  post_id: string;
  user_name: string;
  content: string;
  created_at: string;
}

interface Post {
  id: string;
  user_name: string;
  game: string;
  content: string;
  media_url?: string | null;
  likes: number;
  created_at: string;
  comments?: Comment[];
}

export default function Home() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [content, setContent] = useState('');
  const [game, setGame] = useState('General');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from('posts')
      .select('*, comments(*)')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error al cargar posts:', error);
    } else if (data) {
      setPosts(data);
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && !file) return;

    setLoading(true);
    let mediaUrl: string | null = null;

    // Subir imagen o video a Supabase Storage si seleccionó un archivo
    if (file) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const { data, error: uploadError } = await supabase.storage
        .from('media')
        .upload(fileName, file);

      if (uploadError) {
        console.error('Error al subir multimedia:', uploadError);
      } else if (data) {
        const { data: publicData } = supabase.storage.from('media').getPublicUrl(fileName);
        mediaUrl = publicData.publicUrl;
      }
    }

    const userName = user?.email ? user.email.split('@')[0] : 'Usuario';

    const { error } = await supabase.from('posts').insert([
      {
        user_name: userName,
        game,
        content,
        media_url: mediaUrl,
        likes: 0,
      },
    ]);

    if (error) {
      alert('Error al publicar: ' + error.message);
    } else {
      setContent('');
      setFile(null);
      fetchPosts();
    }
    setLoading(false);
  };

  const handleLike = async (id: string, currentLikes: number) => {
    const { error } = await supabase
      .from('posts')
      .update({ likes: currentLikes + 1 })
      .eq('id', id);

    if (!error) {
      setPosts(posts.map((p) => (p.id === id ? { ...p, likes: (p.likes || 0) + 1 } : p)));
    }
  };

  const handleAddComment = async (postId: string) => {
    if (!commentText.trim() || !user) return;

    const userName = user.email ? user.email.split('@')[0] : 'Usuario';

    const { error } = await supabase.from('comments').insert([
      {
        post_id: postId,
        user_name: userName,
        content: commentText,
      },
    ]);

    if (error) {
      alert('Error al comentar: ' + error.message);
    } else {
      setCommentText('');
      fetchPosts();
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-6 space-y-6">
      {/* Formulario de publicación */}
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
            placeholder="¿Qué quieres compartir hoy? (Puedes adjuntar foto o Reel video)"
            className="w-full bg-gray-950 border border-gray-800 rounded-xl p-3 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-blue-500 transition resize-none h-24"
          />

          <div className="flex items-center justify-between pt-2">
            {/* Input de archivo multimedia (Fotos/Videos Reels) */}
            <label className="flex items-center gap-2 cursor-pointer bg-gray-950 border border-gray-800 px-3 py-1.5 rounded-xl text-xs text-gray-300 hover:border-gray-700 transition">
              📷 <span>{file ? file.name.substring(0, 15) + '...' : 'Adjuntar Imagen / Video'}</span>
              <input
                type="file"
                accept="image/*,video/*"
                onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
                className="hidden"
              />
            </label>

            <button
              type="submit"
              disabled={loading || (!content.trim() && !file)}
              className="px-5 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl text-xs font-bold hover:opacity-90 disabled:opacity-50 transition"
            >
              {loading ? 'Subiendo...' : 'Publicar'}
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

            {post.content && <p className="text-sm text-gray-300 leading-relaxed">{post.content}</p>}

            {/* Renderizado multimedia (Fotos o Videos/Reels) */}
            {post.media_url && (
              <div className="rounded-xl overflow-hidden mt-3 border border-gray-800 bg-black">
                {post.media_url.match(/\.(mp4|webm|ogg|mov)$/i) ? (
                  <video src={post.media_url} controls className="w-full max-h-[450px] object-contain" />
                ) : (
                  <img src={post.media_url} alt="Contenido multimedia" className="w-full max-h-[450px] object-cover" />
                )}
              </div>
            )}

            {/* Acciones del Post */}
            <div className="flex items-center gap-4 pt-2 border-t border-gray-800/60">
              <button
                onClick={() => handleLike(post.id, post.likes || 0)}
                className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-red-400 transition font-medium"
              >
                ❤️ <span>{post.likes || 0}</span>
              </button>

              <button
                onClick={() => setActiveCommentPostId(activeCommentPostId === post.id ? null : post.id)}
                className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-blue-400 transition font-medium"
              >
                💬 <span>{post.comments?.length || 0} Comentarios</span>
              </button>
            </div>

            {/* Sección de Comentarios Expansible */}
            {activeCommentPostId === post.id && (
              <div className="pt-3 space-y-3 border-t border-gray-800/40">
                <div className="space-y-2">
                  {post.comments && post.comments.length > 0 ? (
                    post.comments.map((c) => (
                      <div key={c.id} className="bg-gray-950 p-2.5 rounded-xl border border-gray-800/80 text-xs space-y-1">
                        <span className="font-bold text-blue-400">@{c.user_name}</span>
                        <p className="text-gray-300">{c.content}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-[11px] text-gray-500 italic">No hay comentarios aún. ¡Sé el primero!</p>
                  )}
                </div>

                {user && (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Escribe un comentario..."
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      className="flex-1 bg-gray-950 border border-gray-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                    />
                    <button
                      onClick={() => handleAddComment(post.id)}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition"
                    >
                      Enviar
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}