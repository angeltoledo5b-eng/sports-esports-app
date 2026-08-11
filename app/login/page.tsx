'use client';

import { useState } from 'react';
import { supabase } from '../supabaseClient';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert(error.message);
    else window.location.href = '/';
    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center h-[80vh]">
      <form onSubmit={handleLogin} className="bg-gray-900 p-8 rounded-2xl w-full max-w-sm space-y-4">
        <h2 className="text-xl font-bold text-white">Iniciar Sesión</h2>
        <input type="email" placeholder="Correo" className="w-full p-2 bg-gray-950 border border-gray-800 rounded" onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Contraseña" className="w-full p-2 bg-gray-950 border border-gray-800 rounded" onChange={(e) => setPassword(e.target.value)} />
        <button className="w-full bg-blue-600 p-2 rounded text-white font-bold" disabled={loading}>
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </div>
  );
}