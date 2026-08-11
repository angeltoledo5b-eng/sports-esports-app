'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Match {
  id: string;
  round: string;
  player1: string;
  player2: string;
  score1?: number;
  score2?: number;
  winner?: string;
}

export default function TorneoDetallePage({ params }: { params: { id: string } }) {
  // Datos de demostración de la llave (Brackets)
  const [matches] = useState<Match[]>([
    // Cuartos de Final
    { id: '1', round: 'Cuartos de Final', player1: 'Ángel Toledo', player2: 'ShadowKing', score1: 2, score2: 0, winner: 'Ángel Toledo' },
    { id: '2', round: 'Cuartos de Final', player1: 'Vortex_99', player2: 'DragonRider', score1: 1, score2: 2, winner: 'DragonRider' },
    { id: '3', round: 'Cuartos de Final', player1: 'NexusPro', player2: 'AlphaOne', score1: 2, score2: 1, winner: 'NexusPro' },
    { id: '4', round: 'Cuartos de Final', player1: 'GamerX', player2: 'StormByte', score1: 0, score2: 2, winner: 'StormByte' },

    // Semifinales
    { id: '5', round: 'Semifinal', player1: 'Ángel Toledo', player2: 'DragonRider', score1: 2, score2: 1, winner: 'Ángel Toledo' },
    { id: '6', round: 'Semifinal', player1: 'NexusPro', player2: 'StormByte', score1: 0, score2: 2, winner: 'StormByte' },

    // Gran Final
    { id: '7', round: 'Gran Final', player1: 'Ángel Toledo', player2: 'StormByte', score1: 0, score2: 0 },
  ]);

  const cuartos = matches.filter((m) => m.round === 'Cuartos de Final');
  const semis = matches.filter((m) => m.round === 'Semifinal');
  const final = matches.filter((m) => m.round === 'Gran Final');

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-6">
      {/* Botón Volver */}
      <Link href="/torneos" className="inline-flex items-center text-xs font-semibold text-gray-400 hover:text-white transition">
        ← Volver a Torneos
      </Link>

      {/* Header del Torneo */}
      <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-xs font-bold px-2.5 py-1 bg-purple-950 text-purple-400 border border-purple-800 rounded-lg">
            Wild Rift • 1v1 ARAM
          </span>
          <h1 className="text-2xl font-black text-white mt-2">Copa ARAM 1v1 - Fase de Eliminatoria</h1>
          <p className="text-xs text-gray-400 mt-1">Cuadro de enfrentamientos directo a mejor de 3 partidas (Bo3).</p>
        </div>

        <div className="flex gap-2">
          <span className="px-3 py-1.5 bg-yellow-950 text-yellow-400 border border-yellow-800 text-xs font-bold rounded-xl">
            ⚡ En Curso
          </span>
        </div>
      </div>

      {/* Árbol de Eliminación (Brackets Graphic) */}
      <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl overflow-x-auto">
        <h2 className="text-base font-bold text-white mb-6">🏆 Cuadro del Torneo (Brackets)</h2>

        <div className="flex min-w-[700px] justify-between items-center gap-8">
          {/* Columna 1: Cuartos de Final */}
          <div className="flex flex-col gap-6 flex-1">
            <h3 className="text-xs font-bold text-gray-400 text-center uppercase tracking-wider">Cuartos de Final</h3>
            {cuartos.map((m) => (
              <MatchCard key={m.id} match={m} />
            ))}
          </div>

          {/* Separador */}
          <div className="text-gray-700 font-bold">→</div>

          {/* Columna 2: Semifinales */}
          <div className="flex flex-col gap-12 flex-1 justify-center">
            <h3 className="text-xs font-bold text-gray-400 text-center uppercase tracking-wider">Semifinales</h3>
            {semis.map((m) => (
              <MatchCard key={m.id} match={m} />
            ))}
          </div>

          {/* Separador */}
          <div className="text-gray-700 font-bold">→</div>

          {/* Columna 3: Gran Final */}
          <div className="flex flex-col gap-6 flex-1 justify-center">
            <h3 className="text-xs font-bold text-yellow-400 text-center uppercase tracking-wider">👑 Gran Final</h3>
            {final.map((m) => (
              <MatchCard key={m.id} match={m} isFinal />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Subcomponente para renderizar cada enfrentamiento
function MatchCard({ match, isFinal = false }: { match: Match; isFinal?: boolean }) {
  return (
    <div
      className={`bg-gray-950 border ${
        isFinal ? 'border-yellow-600/50 shadow-yellow-500/10 shadow-lg' : 'border-gray-800'
      } rounded-xl p-3 space-y-2 relative`}
    >
      {/* Jugador 1 */}
      <div
        className={`flex justify-between items-center p-2 rounded-lg text-xs font-semibold ${
          match.winner === match.player1 ? 'bg-blue-950/80 text-blue-300 font-bold' : 'bg-gray-900 text-gray-300'
        }`}
      >
        <span>{match.player1}</span>
        <span className="font-mono bg-gray-950 px-2 py-0.5 rounded text-gray-400">{match.score1 ?? '-'}</span>
      </div>

      {/* Jugador 2 */}
      <div
        className={`flex justify-between items-center p-2 rounded-lg text-xs font-semibold ${
          match.winner === match.player2 ? 'bg-blue-950/80 text-blue-300 font-bold' : 'bg-gray-900 text-gray-300'
        }`}
      >
        <span>{match.player2}</span>
        <span className="font-mono bg-gray-950 px-2 py-0.5 rounded text-gray-400">{match.score2 ?? '-'}</span>
      </div>
    </div>
  );
}