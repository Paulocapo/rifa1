'use client';

import React from 'react';

interface HeaderProps {
  libres: number;
  reservados: number;
  vendidos: number;
}

export default function Header({ libres, reservados, vendidos }: HeaderProps) {
  return (
    <header className="relative overflow-hidden">
      {/* Fondo con gradiente y patrón */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-950 via-purple-900 to-yellow-900 opacity-95" />
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, #fbbf24 0%, transparent 50%),
                            radial-gradient(circle at 80% 20%, #7c3aed 0%, transparent 50%)`,
        }}
      />

      <div className="relative z-10 px-4 py-8 md:py-12 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-yellow-500/20 border border-yellow-400/30 rounded-full px-4 py-1.5 mb-4">
          <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
          <span className="text-yellow-300 text-xs font-semibold tracking-widest uppercase">
            Instituto Bertora 5to A
          </span>
        </div>

        {/* Título principal */}
        <h1 className="text-4xl md:text-6xl font-black text-white mb-2 leading-tight tracking-tight">
          Gran{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-400">
            Sorteo
          </span>
        </h1>

        <div className="text-purple-200 text-sm md:text-base mb-8 max-w-lg mx-auto flex flex-col gap-2">
          <p className="font-bold text-yellow-300 text-xl tracking-wide uppercase">
            ¡Lechón a la estaca + 1 Whisky y 2 Vinos!
          </p>
          <p className="text-lg">El número a tan solo: <span className="font-bold text-green-400 text-xl">$1000</span></p>
          <div className="bg-black/30 p-3 rounded-xl border border-white/10 mt-2">
            <p className="font-medium text-white">📅 25 de Mayo &nbsp;|&nbsp; ⏰ Entre 13hs y 14hs</p>
            <p className="text-sm mt-1">📍 Stand Número 16 (¡Puede pasar a verlo por el stand!)</p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex justify-center gap-3 md:gap-6 flex-wrap">
          <StatBadge value={libres} label="Disponibles" color="green" />
          <StatBadge value={reservados} label="Reservados" color="yellow" />
          <StatBadge value={vendidos} label="Vendidos" color="red" />
        </div>
      </div>
    </header>
  );
}

function StatBadge({
  value,
  label,
  color,
}: {
  value: number;
  label: string;
  color: 'green' | 'yellow' | 'red';
}) {
  const styles = {
    green: 'bg-green-500/20 border-green-400/30 text-green-300',
    yellow: 'bg-yellow-500/20 border-yellow-400/30 text-yellow-300',
    red: 'bg-red-500/20 border-red-400/30 text-red-300',
  };

  return (
    <div
      className={`flex flex-col items-center px-5 py-3 rounded-2xl border backdrop-blur-sm ${styles[color]}`}
    >
      <span className="text-2xl font-black">{value}</span>
      <span className="text-xs font-medium opacity-80 mt-0.5">{label}</span>
    </div>
  );
}
