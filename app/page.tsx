'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import Navbar from './Navbar';

interface Post {
  id: string;
  content: string;
  media_url?: string;
  media_type?: string;
  created_at: string;
  user_id: string;
  profiles?: {
    username?: string;
    avatar_url?: string;
  };
}

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [content, setContent] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    fetchUserAndPosts();
  }, []);

  const fetchUserAndPosts = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);

    const { data, error } = await supabase
      .from('posts')
      .select('*, profiles(username, avatar_url)')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setPosts(data);
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && !file) return;

    setLoading(true);
    let mediaUrl = null;
    let mediaType = null;

    try {
      // Si hay un archivo (imagen/video), lo subimos al bucket 'posts'
      if (file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('posts')
          .upload(filePath, file);

        if (uploadError) {
          throw uploadError;
        }

        const { data: urlData } = supabase.storage
          .from('posts')
          .getPublicUrl(filePath);

        mediaUrl = urlData.publicUrl;
        mediaType = file.type.startsWith('video/') ? 'video' : 'image';
      }

      // Guardamos la publicación en la tabla de la base de datos
      const { error: insertError } = await supabase
        .from('posts')
        .insert([
          {
            content,
            media_url: mediaUrl,
            media_type: mediaType,
            user_id: user?.id,
          },
        ]);

      if (insertError) throw insertError;

      // Limpiamos los campos y recargamos
      setContent('');
      setFile(null);
      fetchUserAndPosts();
    } catch (error: any) {
      alert('Error al publicar: ' + (error.message || 'Ocurrió un problema'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-20">
      <Navbar />

      <main className="max-w-2xl mx-auto p-4 pt-6">
        {/* Crear Publicación */}
        {user ? (
          <form onSubmit={handleCreatePost} className="bg-slate-900 p-4 rounded-xl border border-slate-800 mb-6">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="¿Qué está pasando en la comunidad?"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 resize-none h-24"
            />

            <div className="flex items-center justify-between mt-3">
              <input
                type="file"
                accept="image/*,video/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-cyan-500/10 file:text-cyan-400 hover:file:bg-cyan-500/20"
              />

              <button
                type="submit"
                disabled={loading}
                className="bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-bold px-5 py-2 rounded-lg text-sm transition"
              >
                {loading ? 'Publicando...' : 'Publicar'}
              </button>
            </div>
          </form>
        ) : (
          <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl text-center mb-6 text-slate-400">
            Inicia sesión para crear publicaciones.
          </div>
        )}

        {/* Feed de Publicaciones */}
        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post.id} className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-9 h-9 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-bold text-sm">
                  {post.profiles?.username?.[0]?.toUpperCase() || 'U'}
                </div>
                <div>
                  <p className="font-semibold text-sm text-slate-200">
                    {post.profiles?.username || 'Usuario'}
                  </p>
                  <p className="text-xs text-slate-500">
                    {new Date(post.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {post.content && <p className="text-slate-300 text-sm mb-3">{post.content}</p>}

              {post.media_url && (
                <div className="rounded-lg overflow-hidden border border-slate-800 bg-black">
                  {post.media_type === 'video' ? (
                    <video src={post.media_url} controls className="w-full max-h-96 object-contain" />
                  ) : (
                    <img src={post.media_url} alt="Publicación" className="w-full max-h-96 object-cover" />
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}