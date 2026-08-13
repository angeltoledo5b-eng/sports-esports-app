'use client';

import { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [isForgot, setIsForgot] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    try {
      if (isForgot) {
        // Enviar correo de recuperación con Supabase
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/login`,
        });

        if (error) throw error;
        setMessage({
          type: 'success',
          text: 'Te hemos enviado un correo con instrucciones para restablecer tu contraseña.',
        });
      } else if (isRegister) {
        // Registro de usuario
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setMessage({
          type: 'success',
          text: 'Cuenta creada exitosamente. Ya puedes iniciar sesión.',
        });
        setIsRegister(false);
      } else {
        // Inicio de sesión
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.push('/');
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Ocurrió un error inesperado.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-12 p-6 bg-gray-900 border border-gray-800 rounded-2xl shadow-xl">
      <h2 className="text-xl font-black text-white text-center mb-2">
        {isForgot
          ? 'Recuperar Contraseña'
          : isRegister
          ? 'Crear Cuenta'
          : 'Iniciar Sesión'}
      </h2>
      <p className="text-xs text-gray-400 text-center mb-6">
        {isForgot
          ? 'Ingresa tu correo para recibir un enlace de recuperación'
          : 'Accede a tu perfil en SportsHub'}
      </p>

      {message && (
        <div
          className={`p-3 mb-4 rounded-xl text-xs font-medium ${
            message.type === 'error'
              ? 'bg-red-950/60 text-red-400 border border-red-800'
              : 'bg-green-950/60 text-green-400 border border-green-800'
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleAuth} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-1">Correo Electrónico</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@email.com"
            className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
          />
        </div>

        {!isForgot && (
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-semibold text-gray-300">Contraseña</label>
              {!isRegister && (
                <button
                  type="button"
                  onClick={() => {
                    setIsForgot(true);
                    setMessage(null);
                  }}
                  className="text-[11px] text-blue-400 hover:underline"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              )}
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
            />
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-xs rounded-xl hover:opacity-90 transition disabled:opacity-50"
        >
          {loading
            ? 'Cargando...'
            : isForgot
            ? 'Enviar Correo de Recuperación'
            : isRegister
            ? 'Registrarse'
            : 'Ingresar'}
        </button>
      </form>

      <div className="mt-6 pt-4 border-t border-gray-800 text-center">
        {isForgot ? (
          <button
            onClick={() => {
              setIsForgot(false);
              setMessage(null);
            }}
            className="text-xs text-gray-400 hover:text-white"
          >
            ← Volver a Iniciar Sesión
          </button>
        ) : (
          <button
            onClick={() => {
              setIsRegister(!isRegister);
              setMessage(null);
            }}
            className="text-xs text-gray-400 hover:text-white"
          >
            {isRegister
              ? '¿Ya tienes cuenta? Inicia sesión aquí'
              : '¿No tienes cuenta? Regístrate gratis'}
          </button>
        )}
      </div>
    </div>
  );
}