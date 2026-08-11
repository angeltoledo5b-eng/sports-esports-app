'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

interface Tournament {
  id: string;
  title: string;
  category: string;
  max_players: number;
  current_players: number;
  status: string;
  created_at: string;
}

export default function TorneosPage() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<'all' | 'Abierto' | 'En Curso' | 'Finalizado'>('all');

  useEffect(() => {
    fetchTournaments();
  }, [filterStatus]);

  const fetchTournaments = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('tournaments')
        .select('*')
        .order('created_at', { ascending: false });

      if (filterStatus !== 'all') {
        query = query.eq('status', filterStatus);
      }

      const { data, error } = await query;
      if (error) console.error('Error al cargar torneos:', error);
      if (data) setTournaments(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async (id: string, current: number, max: number) => {
    if (current >= max) {
      alert('¡Este torneo alcanzó su cupo máximo!');
      return;
    }

    const { error } = await supabase
      .from('tournaments')
      .update({ current_players: current + 1 })
      .eq('id', id);

    if (error) {
      alert('Error al procesar la inscripción.');
    } else {
      setTournaments(
        tournaments.map((t) => (t.id === id ? { ...t, current_players: t.current_players + 1 } : t))
      );
      alert('¡Inscripción exitosa!');
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-6">
      {/* Encabezado de la Sección */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gray-900 border border-gray-800 p-6 rounded-2xl">
        <div>
          <h1 className="text-2xl font-black text-white">🏆 Torneos & Competencias</h1>
          <p className="text-sm text-gray-400 mt-1">
            Explora torneos activos, inscribe a tu equipo o compite en la comunidad.
          </p>
        </div>
      </div>

      {/* Filtros de Estado */}
      <div className="flex gap-2 border-b border-gray-800 pb-4">
        <button
          onClick={() => setFilterStatus('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            filterStatus === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-900 text-gray-400 hover:text-white'
          }`}
        >
          Todos
        </button>
        <button
          onClick={() => setFilterStatus('Abierto')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            filterStatus === 'Abierto' ? 'bg-green-600 text-white' : 'bg-gray-900 text-gray-400 hover:text-white'
          }`}
        >
          🟢 Abiertos
        </button>
        <button
          onClick={() => setFilterStatus('En Curso')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            filterStatus === 'En Curso' ? 'bg-yellow-600 text-white' : 'bg-gray-900 text-gray-400 hover:text-white'
          }`}
        >
          ⚡ En Curso
        </button>
      </div>

      {/* Rejilla de Torneos */}
      {loading ? (
        <p className="text-gray-400 text-sm">Cargando torneos...</p>
      ) : tournaments.length === 0 ? (
        <div className="bg-gray-900 border border-gray-800 p-8 rounded-2xl text-center">
          <p className="text-gray-400 text-sm">No se encontraron torneos en este estado.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tournaments.map((t) => {
            const isFull = (t.current_players || 0) >= (t.max_players || 16);
            return (
              <div
                key={t.id}
                className="bg-gray-900 border border-gray-800 hover:border-gray-700 p-5 rounded-2xl flex flex-col justify-between space-y-4 transition"
              >
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-bold px-2.5 py-1 bg-gray-800 text-blue-400 rounded-lg">
                      {t.category}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        t.status === 'Abierto'
                          ? 'bg-green-950 text-green-400 border border-green-800'
                          : 'bg-yellow-950 text-yellow-400 border border-yellow-800'
                      }`}
                    >
                      {t.status || 'Abierto'}
                    </span>
                  </div>

                  <h3 className="font-bold text-white text-base leading-snug">{t.title}</h3>
                </div>

                <div className="space-y-3 pt-3 border-t border-gray-800">
                  <div className="flex justify-between items-center text-xs text-gray-400">
                    <span>Jugadores inscritos:</span>
                    <span className="font-semibold text-white">
                      {t.current_players || 0} / {t.max_players || 16}
                    </span>
                  </div>

                  {/* Barra de Progreso */}
                  <div className="w-full bg-gray-950 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        isFull ? 'bg-red-500' : 'bg-gradient-to-r from-blue-500 to-purple-500'
                      }`}
                      style={{
                        width: `${Math.min(
                          ((t.current_players || 0) / (t.max_players || 16)) * 100,
                          100
                        )}%`,
                      }}
                    />
                  </div>

                  <button
                    onClick={() => handleJoin(t.id, t.current_players || 0, t.max_players || 16)}
                    disabled={isFull}
                    className={`w-full py-2 rounded-xl text-xs font-bold transition ${
                      isFull
                        ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-500 text-white'
                    }`}
                  >
                    {isFull ? 'Cupo Lleno' : 'Inscribirse Ahora'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}