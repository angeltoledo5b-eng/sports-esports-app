'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

interface Tournament {
  id: string;
  name: string;
  game: string;
  status: string;
  start_date?: string;
  description?: string;
}

export default function TorneosPage() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const { data, error } = await supabase
          .from('tournaments')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data) {
          setTournaments(data);
        }
      } catch (err) {
        console.error('Error al cargar torneos:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTournaments();
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 space-y-6">
      <div className="flex items-center justify-between border-b border-gray-800 pb-4">
        <div>
          <h1 className="text-2xl font-black text-white">Torneos Activos</h1>
          <p className="text-xs text-gray-400">Compite y sigue la clasificación en tiempo real</p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-xs text-gray-500">Cargando torneos...</div>
      ) : tournaments.length === 0 ? (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center text-xs text-gray-400">
          No hay torneos registrados actualmente.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tournaments.map((t) => (
            <div key={t.id} className="bg-gray-900 border border-gray-800 rounded-2xl p-5 shadow-md space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 bg-purple-950/80 text-purple-400 border border-purple-800/60 rounded-lg">
                  {t.game || 'E-Sports'}
                </span>
                <span className="text-[10px] font-semibold text-green-400 bg-green-950/60 border border-green-800 px-2 py-0.5 rounded-md">
                  {t.status || 'En inscripción'}
                </span>
              </div>

              <h3 className="text-lg font-bold text-white">{t.name}</h3>
              {t.description && <p className="text-xs text-gray-400">{t.description}</p>}

              <div className="pt-2 flex items-center justify-between border-t border-gray-800 text-[11px] text-gray-400">
                <span>Inicio: {t.start_date || 'Por definir'}</span>
                <button className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition">
                  Ver Brackets
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}