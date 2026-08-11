'use client';

import { useState } from 'react';

interface Team {
  id: string;
  name: string;
  tag: string;
  game: string;
  membersCount: number;
  maxMembers: number;
  logo: string;
}

export default function EquiposPage() {
  const [teams, setTeams] = useState<Team[]>([
    {
      id: '1',
      name: 'Daysa Grace FC',
      tag: 'DGF',
      game: 'Fútbol 5',
      membersCount: 8,
      maxMembers: 12,
      logo: '⚽',
    },
    {
      id: '2',
      name: 'Shadow Strikers',
      tag: 'SST',
      game: 'Wild Rift',
      membersCount: 5,
      maxMembers: 5,
      logo: '🦅',
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [teamName, setTeamName] = useState('');
  const [teamTag, setTeamTag] = useState('');
  const [teamGame, setTeamGame] = useState('Wild Rift');

  const handleCreateTeam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamName.trim() || !teamTag.trim()) return;

    const newTeam: Team = {
      id: Date.now().toString(),
      name: teamName,
      tag: teamTag.toUpperCase(),
      game: teamGame,
      membersCount: 1,
      maxMembers: teamGame === 'Fútbol 5' ? 12 : 5,
      logo: '🛡️',
    };

    setTeams([newTeam, ...teams]);
    setTeamName('');
    setTeamTag('');
    setIsModalOpen(false);
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-6">
      {/* Header de la sección */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gray-900 border border-gray-800 p-6 rounded-2xl">
        <div>
          <h1 className="text-2xl font-black text-white">🛡️ Equipos y Guilds</h1>
          <p className="text-xs text-gray-400 mt-1">
            Crea tu escuadra, recluta jugadores y compite en torneos grupales.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-xl text-xs font-bold transition shadow-lg"
        >
          ➕ Crear Equipo
        </button>
      </div>

      {/* Lista de Equipos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {teams.map((t) => (
          <div key={t.id} className="bg-gray-900 border border-gray-800 p-5 rounded-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gray-950 border border-gray-800 flex items-center justify-center text-2xl">
                {t.logo}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-white text-base">{t.name}</h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 bg-gray-800 text-blue-400 rounded">
                    [{t.tag}]
                  </span>
                </div>
                <p className="text-xs text-gray-400">{t.game}</p>
              </div>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-gray-800 text-xs">
              <span className="text-gray-400">
                Miembros: <strong className="text-white">{t.membersCount} / {t.maxMembers}</strong>
              </span>
              <button className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-lg font-semibold transition text-xs">
                Solicitar Unirse
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal para Crear Equipo */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-md space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-white">🛡️ Crear Nuevo Equipo</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateTeam} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-400">Nombre del Equipo</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Daysa Grace FC"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  className="w-full mt-1 bg-gray-950 border border-gray-800 rounded-xl p-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-400">Abreviatura / TAG (3-4 letras)</label>
                <input
                  type="text"
                  required
                  maxLength={4}
                  placeholder="Ej: DGF"
                  value={teamTag}
                  onChange={(e) => setTeamTag(e.target.value)}
                  className="w-full mt-1 bg-gray-950 border border-gray-800 rounded-xl p-2.5 text-sm text-white focus:outline-none focus:border-blue-500 uppercase"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-400">Disciplina / Juego Principal</label>
                <select
                  value={teamGame}
                  onChange={(e) => setTeamGame(e.target.value)}
                  className="w-full mt-1 bg-gray-950 border border-gray-800 rounded-xl p-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="Wild Rift">🎮 Wild Rift</option>
                  <option value="Fútbol 5">⚽ Fútbol 5</option>
                  <option value="Valorant">🎮 Valorant</option>
                  <option value="FC 24 / FIFA">🎮 FC 24 / FIFA</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl text-xs font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-xl text-xs font-bold transition"
                >
                  Crear Equipo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}