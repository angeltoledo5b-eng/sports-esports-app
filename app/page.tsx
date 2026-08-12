'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { supabase } from './supabaseClient';

interface Post {
  id: string;
  user_email: string;
  content: string;
  media_url?: string;
  media_type?: 'image' | 'video';
  created_at: string;
  likes_count?: number;
}

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [content, setContent] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    fetchPosts();
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) setUserEmail(user.email || null);
  };

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setPosts(data);
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && !file) return;

    setLoading(true);
    let mediaUrl = '';
    let mediaType: 'image' | 'video' | undefined;

    try {
      if (file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `uploads/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('media')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from('media')
          .getPublicUrl(filePath);

        mediaUrl = publicUrlData.publicUrl;
        mediaType = file.type.startsWith('video') ? 'video' : 'image';
      }

      const { error: insertError } = await supabase.from('posts').insert([
        {
          user_email: userEmail || 'Usuario Anónimo',
          content,
          media_url: mediaUrl || null,
          media_type: mediaType || null,
        },
      ]);

      if (insertError) throw insertError;

      setContent('');
      setFile(null);
      fetchPosts();
    } catch (err: any) {
      alert('Error al publicar: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-6 px-4 space-y-6">
      {/* Formulario de publicación */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 shadow-lg">
        <form onSubmit={handleCreatePost} className="space-y-3">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="¿Qué está pasando en el mundo del deporte?"
            className="w-full bg-gray-950 border border-gray-800 rounded-xl p-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none h-20"
          />

          <div className="flex items-center justify-between">
            <input
              type="file"
              accept="image/*,video/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="text-xs text-gray-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-gray-800 file:text-gray-200 hover:file:bg-gray-700 cursor-pointer"
            />

            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-xs rounded-xl hover:opacity-90 transition disabled:opacity-50"
            >
              {loading ? 'Publicando...' : 'Publicar'}
            </button>
          </div>
        </form>
      </div>

      {/* Feed de publicaciones */}
      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post.id} className="bg-gray-900 border border-gray-800 rounded-2xl p-4 shadow-md space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-400">{post.user_email}</span>
              <span className="text-[10px] text-gray-500">
                {new Date(post.created_at).toLocaleDateString()}
              </span>
            </div>

            {post.content && (
              <p className="text-xs text-gray-200 leading-relaxed">{post.content}</p>
            )}

            {/* Media optimizado para Next.js sin warning */}
            {post.media_url && post.media_type === 'image' && (
              <div className="relative w-full h-auto overflow-hidden rounded-xl border border-gray-800">
                <Image
                  src={post.media_url}
                  alt="Contenido de publicación"
                  width={600}
                  height={400}
                  className="w-full max-h-[450px] object-cover"
                  unoptimized
                />
              </div>
            )}

            {post.media_url && post.media_type === 'video' && (
              <video
                src={post.media_url}
                controls
                className="w-full max-h-[450px] rounded-xl border border-gray-800 bg-black"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}