'use client';

import React, { useState, useEffect, useRef } from 'react';
import { RaffleNumber } from '@/types';

interface ReservationModalProps {
  number: RaffleNumber | null;
  onClose: () => void;
  onConfirm: (nombre: string, telefono: string) => Promise<void>;
  loading: boolean;
}

export default function ReservationModal({
  number,
  onClose,
  onConfirm,
  loading,
}: ReservationModalProps) {
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [errors, setErrors] = useState<{ nombre?: string; telefono?: string }>({});
  const nombreRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (number) {
      setNombre('');
      setTelefono('');
      setErrors({});
      setTimeout(() => nombreRef.current?.focus(), 100);
    }
  }, [number]);

  // Cerrar con Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !loading) onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [loading, onClose]);

  if (!number) return null;

  const validate = () => {
    const newErrors: { nombre?: string; telefono?: string } = {};
    if (!nombre.trim() || nombre.trim().length < 3)
      newErrors.nombre = 'Ingresá tu nombre completo (mín. 3 caracteres)';
    if (!telefono.trim() || !/^\d{7,15}$/.test(telefono.replace(/[\s\-()]/g, '')))
      newErrors.telefono = 'Ingresá un teléfono válido (solo números)';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await onConfirm(nombre.trim(), telefono.trim());
  };

  const numStr = String(number.numero).padStart(2, '0');

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={!loading ? onClose : undefined}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-gradient-to-b from-gray-900 to-gray-950 border border-purple-500/20 rounded-3xl shadow-2xl shadow-purple-900/50 overflow-hidden animate-modal-in">
        {/* Header */}
        <div className="bg-gradient-to-r from-violet-800/50 to-purple-800/50 px-6 pt-6 pb-4 border-b border-white/5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-300 text-xs font-semibold uppercase tracking-widest mb-1">
                Reservando número
              </p>
              <h2
                id="modal-title"
                className="text-5xl font-black text-white leading-none"
              >
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-400">
                  #{numStr}
                </span>
              </h2>
            </div>
            <button
              onClick={onClose}
              disabled={loading}
              aria-label="Cerrar modal"
              className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-all disabled:opacity-50"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4" noValidate>
          {/* Nombre */}
          <div>
            <label htmlFor="input-nombre" className="block text-purple-200 text-sm font-medium mb-1.5">
              Nombre y Apellido <span className="text-red-400">*</span>
            </label>
            <input
              ref={nombreRef}
              id="input-nombre"
              type="text"
              value={nombre}
              onChange={(e) => { setNombre(e.target.value); setErrors((p) => ({ ...p, nombre: undefined })); }}
              placeholder="Ej: Juan Pérez"
              disabled={loading}
              className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 transition-all ${
                errors.nombre
                  ? 'border-red-500/60 focus:ring-red-500/30'
                  : 'border-white/10 focus:border-purple-400/50 focus:ring-purple-500/20'
              }`}
            />
            {errors.nombre && (
              <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                <span>⚠</span> {errors.nombre}
              </p>
            )}
          </div>

          {/* Teléfono */}
          <div>
            <label htmlFor="input-telefono" className="block text-purple-200 text-sm font-medium mb-1.5">
              Teléfono de contacto <span className="text-red-400">*</span>
            </label>
            <input
              id="input-telefono"
              type="tel"
              value={telefono}
              onChange={(e) => { setTelefono(e.target.value); setErrors((p) => ({ ...p, telefono: undefined })); }}
              placeholder="Ej: 3816123456"
              disabled={loading}
              className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 transition-all ${
                errors.telefono
                  ? 'border-red-500/60 focus:ring-red-500/30'
                  : 'border-white/10 focus:border-purple-400/50 focus:ring-purple-500/20'
              }`}
            />
            {errors.telefono && (
              <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                <span>⚠</span> {errors.telefono}
              </p>
            )}
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 py-3 rounded-xl border border-white/10 text-white/60 hover:text-white hover:border-white/20 hover:bg-white/5 transition-all font-medium disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              id="btn-confirmar-reserva"
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-bold shadow-lg shadow-purple-900/50 hover:shadow-purple-700/50 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Spinner />
                  Reservando...
                </>
              ) : (
                '✓ Confirmar Reserva'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Spinner() {
  return (
    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
    </svg>
  );
}
