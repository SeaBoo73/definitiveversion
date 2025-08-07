import React from 'react';

export function SimpleTest() {
  return (
    <div className="min-h-screen bg-white p-8">
      <h1 className="text-3xl font-bold text-center mb-8">SeaBoo - Test Semplificato</h1>
      <div className="max-w-4xl mx-auto">
        <div className="bg-ocean-blue text-white p-6 rounded-lg text-center">
          <h2 className="text-xl font-semibold mb-4">Test di Funzionamento</h2>
          <p>Se vedi questo messaggio, l'app React funziona correttamente!</p>
          <p className="mt-2">L'errore "match" è solo un overlay e non impedisce il funzionamento.</p>
        </div>
      </div>
    </div>
  );
}