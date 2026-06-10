'use client';

import React from 'react';

const ALIAS = 'mspcomp.mp';
const WHATSAPP = '543446203480'; // Formato: 5491112345678

const steps = [
  { num: 1, text: 'Elegí tu número favorito en la grilla de abajo.' },
  { num: 2, text: 'Completá tu nombre y teléfono en el formulario.' },
  {
    num: 3,
    text: (
      <>
        Transferí el valor al alias:{' '}
        <span className="font-bold text-yellow-300 bg-yellow-500/10 px-2 py-0.5 rounded-lg border border-yellow-400/20">
          {ALIAS}
        </span>
      </>
    ),
  },
  {
    num: 4,
    text: (
      <>
        Enviá el comprobante al WhatsApp:{' '}
        <a
          href={`https://wa.me/${WHATSAPP}`}
          target="_blank"
          rel="noopener noreferrer"
          className="font-bold text-green-300 underline decoration-dotted underline-offset-2 hover:text-green-200 transition-colors"
        >
          {WHATSAPP}
        </a>
      </>
    ),
  },
];

export default function Instructions() {
  return (
    <section className="px-4 py-6 max-w-2xl mx-auto">
      <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-sm">
        <h2 className="text-center text-white/80 text-xs font-bold tracking-widest uppercase mb-5">
          ¿Cómo participar?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {steps.map((step) => (
            <div
              key={step.num}
              className="flex items-start gap-3 bg-white/5 rounded-2xl p-4 border border-white/5 hover:border-purple-400/20 transition-colors"
            >
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center text-white font-black text-sm shadow-lg shadow-purple-900/50">
                {step.num}
              </span>
              <p className="text-purple-100 text-sm leading-relaxed mt-0.5">{step.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export { ALIAS, WHATSAPP };
