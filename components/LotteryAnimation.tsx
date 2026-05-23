'use client';

import React, { useState, useEffect, useRef } from 'react';
import { RaffleNumber } from '@/types';

interface LotteryAnimationProps {
  vendidos: RaffleNumber[];
  onClose: () => void;
}

type Phase = 'idle' | 'spinning' | 'slowing' | 'done';

export default function LotteryAnimation({ vendidos, onClose }: LotteryAnimationProps) {
  const [phase, setPhase] = useState<Phase>('idle');
  const [displayNum, setDisplayNum] = useState<number>(1);
  const [winner, setWinner] = useState<RaffleNumber | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const startLottery = () => {
    if (vendidos.length === 0) return;

    setPhase('spinning');
    setWinner(null);

    const chosen = vendidos[Math.floor(Math.random() * vendidos.length)];
    let speed = 60;
    let elapsed = 0;
    const totalDuration = 4000;
    const slowStart = 2500;

    const tick = () => {
      // Número aleatorio para la animación
      const randomNum = vendidos[Math.floor(Math.random() * vendidos.length)];
      setDisplayNum(randomNum.numero);
      elapsed += speed;

      if (elapsed >= slowStart && phase !== 'slowing') {
        setPhase('slowing');
      }

      // Ir frenando
      if (elapsed > slowStart) {
        speed = Math.min(speed + 15, 400);
      }

      if (elapsed >= totalDuration) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setDisplayNum(chosen.numero);
        setWinner(chosen);
        setPhase('done');
        return;
      }

      intervalRef.current = setTimeout(tick, speed);
    };

    tick();
  };

  const handleClose = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setPhase('idle');
    setWinner(null);
    onClose();
  };

  const numStr = String(displayNum).padStart(2, '0');

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Sorteo"
    >
      {/* Backdrop estrellado */}
      <div className="absolute inset-0 bg-black/90 backdrop-blur-md">
        {/* Partículas decorativas */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-yellow-400/40 animate-twinkle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <div className="relative w-full max-w-lg text-center">
        {/* Título */}
        <h2 className="text-purple-300 text-sm font-bold tracking-widest uppercase mb-6">
          🎰 Bolillero Digital
        </h2>

        {/* Display del número */}
        <div className="relative mx-auto mb-8">
          {/* Anillo externo */}
          <div
            className={`w-64 h-64 mx-auto rounded-full border-4 flex items-center justify-center shadow-2xl transition-all duration-300 ${
              phase === 'done'
                ? 'border-yellow-400 shadow-yellow-500/40 bg-yellow-500/10'
                : phase === 'spinning' || phase === 'slowing'
                ? 'border-purple-400 shadow-purple-500/40 bg-purple-500/10 animate-pulse-ring'
                : 'border-purple-600/40 bg-purple-900/20'
            }`}
          >
            {/* Anillo interno */}
            <div
              className={`w-52 h-52 rounded-full border-2 flex items-center justify-center ${
                phase === 'done'
                  ? 'border-yellow-300/60 bg-yellow-500/5'
                  : 'border-purple-500/30 bg-purple-900/30'
              }`}
            >
              <span
                className={`font-black leading-none transition-all duration-100 ${
                  phase === 'done'
                    ? 'text-8xl text-yellow-300 animate-winner-appear'
                    : 'text-7xl text-white'
                }`}
              >
                {numStr}
              </span>
            </div>
          </div>

          {/* Destellos cuando gana */}
          {phase === 'done' && (
            <>
              {['top', 'bottom', 'left', 'right'].map((dir) => (
                <div
                  key={dir}
                  className="absolute inset-0 flex items-center justify-center pointer-events-none"
                >
                  <div className="w-2 h-16 bg-gradient-to-t from-yellow-400/0 via-yellow-400/60 to-yellow-400/0 rounded-full animate-ray"
                    style={{ transform: `rotate(${dir === 'top' ? 0 : dir === 'right' ? 90 : dir === 'bottom' ? 180 : 270}deg) translateY(-130px)` }}
                  />
                </div>
              ))}
            </>
          )}
        </div>

        {/* Estado / ganador */}
        {phase === 'idle' && (
          <div className="mb-6">
            <p className="text-purple-200 text-sm mb-2">
              {vendidos.length} número{vendidos.length !== 1 ? 's' : ''} vendido{vendidos.length !== 1 ? 's' : ''} en juego
            </p>
            {vendidos.length === 0 && (
              <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2 inline-block">
                No hay números vendidos aún para sortear
              </p>
            )}
          </div>
        )}

        {(phase === 'spinning' || phase === 'slowing') && (
          <p className="text-purple-300 text-sm animate-pulse mb-6">
            {phase === 'slowing' ? '⏳ Frenando...' : '🎲 Girando...'}
          </p>
        )}

        {phase === 'done' && winner && (
          <div className="mb-6 animate-fade-in-up">
            <div className="text-3xl mb-3">🏆</div>
            <h3 className="text-4xl font-black text-yellow-300 mb-2">¡Ganador!</h3>
            <div className="bg-yellow-500/10 border border-yellow-400/20 rounded-2xl px-6 py-4 inline-block">
              <p className="text-white text-2xl font-bold mb-1">{winner.nombre}</p>
              <p className="text-yellow-300/70 text-sm">📞 {winner.telefono}</p>
              <p className="text-yellow-300/50 text-xs mt-1">Número #{String(winner.numero).padStart(2, '0')}</p>
            </div>
          </div>
        )}

        {/* Botones */}
        <div className="flex gap-3 justify-center">
          {phase === 'idle' && (
            <>
              <button
                onClick={handleClose}
                className="px-6 py-3 rounded-xl border border-white/10 text-white/60 hover:text-white hover:border-white/20 hover:bg-white/5 transition-all font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={startLottery}
                disabled={vendidos.length === 0}
                id="btn-iniciar-sorteo"
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-black font-black shadow-lg shadow-yellow-900/40 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                🎰 ¡SORTEAR AHORA!
              </button>
            </>
          )}

          {phase === 'done' && (
            <>
              <button
                onClick={() => { setPhase('idle'); setWinner(null); }}
                className="px-6 py-3 rounded-xl border border-white/10 text-white/60 hover:text-white hover:border-white/20 hover:bg-white/5 transition-all font-medium"
              >
                Volver a sortear
              </button>
              <button
                onClick={handleClose}
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-bold shadow-lg shadow-purple-900/40 transition-all"
              >
                ✓ Finalizar
              </button>
            </>
          )}

          {(phase === 'spinning' || phase === 'slowing') && (
            <div className="flex items-center gap-2 text-purple-300">
              <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              Sorteando...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
