import { useEffect, useRef } from 'react';

interface Port {
  id: string;
  name: string;
  lat: number;
  lng: number;
  boats: number;
  priceRange: string;
  description: string;
}

const lazioCoastPorts: Port[] = [
  // Porti del Lazio
  {
    id: 'civitavecchia',
    name: 'Porto di Civitavecchia',
    lat: 42.0942,
    lng: 11.7939,
    boats: 4,
    priceRange: '€280 - €1200',
    description: 'Porto principale del Lazio'
  },
  {
    id: 'gaeta',
    name: 'Porto di Gaeta',
    lat: 41.2058,
    lng: 13.5696,
    boats: 2,
    priceRange: '€280 - €850',
    description: 'Località turistica rinomata'
  },
  {
    id: 'ponza',
    name: 'Porto di Ponza',
    lat: 40.8992,
    lng: 12.9619,
    boats: 2,
    priceRange: '€550 - €950',
    description: 'Isola paradisiaca'
  },
  {
    id: 'terracina',
    name: 'Porto di Terracina',
    lat: 41.2857,
    lng: 13.2443,
    boats: 2,
    priceRange: '€320 - €580',
    description: 'Costa laziale storica'
  },
  {
    id: 'anzio',
    name: 'Marina di Anzio',
    lat: 41.4471,
    lng: 12.6221,
    boats: 3,
    priceRange: '€200 - €750',
    description: 'Porto turistico moderno'
  },
  {
    id: 'formia',
    name: 'Porto di Formia',
    lat: 41.2565,
    lng: 13.6058,
    boats: 2,
    priceRange: '€300 - €600',
    description: 'Golfo di Gaeta'
  },
  // Porti della Campania
  {
    id: 'napoli',
    name: 'Porto di Napoli',
    lat: 40.8388,
    lng: 14.2468,
    boats: 8,
    priceRange: '€320 - €1500',
    description: 'Porto principale della Campania'
  },
  {
    id: 'sorrento',
    name: 'Marina di Sorrento',
    lat: 40.6263,
    lng: 14.3774,
    boats: 5,
    priceRange: '€450 - €1200',
    description: 'Costiera sorrentina'
  },
  {
    id: 'amalfi',
    name: 'Porto di Amalfi',
    lat: 40.6340,
    lng: 14.6026,
    boats: 3,
    priceRange: '€600 - €1800',
    description: 'Costiera amalfitana'
  },
  {
    id: 'salerno',
    name: 'Porto di Salerno',
    lat: 40.6774,
    lng: 14.7581,
    boats: 4,
    priceRange: '€280 - €950',
    description: 'Golfo di Salerno'
  },
  {
    id: 'ischia',
    name: 'Porto di Ischia',
    lat: 40.7362,
    lng: 13.9333,
    boats: 6,
    priceRange: '€380 - €1100',
    description: 'Isola di Ischia'
  },
  {
    id: 'capri',
    name: 'Marina Grande Capri',
    lat: 40.5507,
    lng: 14.2439,
    boats: 4,
    priceRange: '€800 - €2500',
    description: 'Isola di Capri'
  },
  {
    id: 'procida',
    name: 'Porto di Procida',
    lat: 40.7598,
    lng: 14.0155,
    boats: 3,
    priceRange: '€350 - €800',
    description: 'Isola di Procida'
  },
  {
    id: 'castellammare',
    name: 'Porto di Castellammare',
    lat: 40.7017,
    lng: 14.4853,
    boats: 2,
    priceRange: '€250 - €700',
    description: 'Castellammare di Stabia'
  }
];

declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

export function GoogleMapsLazio() {
  return (
    <div className="w-full h-96 rounded-lg overflow-hidden border border-gray-200 bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100">
      <div className="w-full h-full relative">
        {/* Mappa Statica con Layout Mare */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 opacity-20"></div>
        
        {/* Contenuto Principale */}
        <div className="relative z-10 h-full flex flex-col justify-center items-center px-8">
          <div className="text-center mb-6">
            <div className="text-5xl mb-3">🗺️</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Porti del Lazio e Campania</h3>
            <p className="text-sm text-gray-600 mb-4">14 Porti Principali con Coordinate GPS Precise</p>
            <div className="inline-block bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full">
              ✅ Lazio + Campania
            </div>
          </div>

          {/* Griglia Porti - 2 righe: Lazio e Campania */}
          <div className="max-w-6xl space-y-4">
            {/* Porti del Lazio */}
            <div>
              <h4 className="text-sm font-bold text-blue-800 mb-2 text-center">🏛️ LAZIO</h4>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="bg-white/80 backdrop-blur-sm p-2 rounded-lg shadow-sm text-center hover:bg-white/90 transition-all">
                  <div className="text-blue-600 font-bold mb-1">⚓ Civitavecchia</div>
                  <div className="text-gray-600 text-xs">4 barche</div>
                </div>
                <div className="bg-white/80 backdrop-blur-sm p-2 rounded-lg shadow-sm text-center hover:bg-white/90 transition-all">
                  <div className="text-green-600 font-bold mb-1">⚓ Gaeta</div>
                  <div className="text-gray-600 text-xs">2 barche</div>
                </div>
                <div className="bg-white/80 backdrop-blur-sm p-2 rounded-lg shadow-sm text-center hover:bg-white/90 transition-all">
                  <div className="text-orange-600 font-bold mb-1">🏝️ Ponza</div>
                  <div className="text-gray-600 text-xs">2 barche</div>
                </div>
                <div className="bg-white/80 backdrop-blur-sm p-2 rounded-lg shadow-sm text-center hover:bg-white/90 transition-all">
                  <div className="text-purple-600 font-bold mb-1">⚓ Terracina</div>
                  <div className="text-gray-600 text-xs">2 barche</div>
                </div>
                <div className="bg-white/80 backdrop-blur-sm p-2 rounded-lg shadow-sm text-center hover:bg-white/90 transition-all">
                  <div className="text-indigo-600 font-bold mb-1">🏖️ Anzio</div>
                  <div className="text-gray-600 text-xs">3 barche</div>
                </div>
                <div className="bg-white/80 backdrop-blur-sm p-2 rounded-lg shadow-sm text-center hover:bg-white/90 transition-all">
                  <div className="text-pink-600 font-bold mb-1">🌊 Formia</div>
                  <div className="text-gray-600 text-xs">2 barche</div>
                </div>
              </div>
            </div>

            {/* Porti della Campania */}
            <div>
              <h4 className="text-sm font-bold text-red-800 mb-2 text-center">🌋 CAMPANIA</h4>
              <div className="grid grid-cols-4 gap-2 text-xs">
                <div className="bg-white/80 backdrop-blur-sm p-2 rounded-lg shadow-sm text-center hover:bg-white/90 transition-all">
                  <div className="text-red-600 font-bold mb-1">⚓ Napoli</div>
                  <div className="text-gray-600 text-xs">8 barche</div>
                </div>
                <div className="bg-white/80 backdrop-blur-sm p-2 rounded-lg shadow-sm text-center hover:bg-white/90 transition-all">
                  <div className="text-yellow-600 font-bold mb-1">🍋 Sorrento</div>
                  <div className="text-gray-600 text-xs">5 barche</div>
                </div>
                <div className="bg-white/80 backdrop-blur-sm p-2 rounded-lg shadow-sm text-center hover:bg-white/90 transition-all">
                  <div className="text-blue-600 font-bold mb-1">🏔️ Amalfi</div>
                  <div className="text-gray-600 text-xs">3 barche</div>
                </div>
                <div className="bg-white/80 backdrop-blur-sm p-2 rounded-lg shadow-sm text-center hover:bg-white/90 transition-all">
                  <div className="text-green-600 font-bold mb-1">⚓ Salerno</div>
                  <div className="text-gray-600 text-xs">4 barche</div>
                </div>
                <div className="bg-white/80 backdrop-blur-sm p-2 rounded-lg shadow-sm text-center hover:bg-white/90 transition-all">
                  <div className="text-purple-600 font-bold mb-1">🌋 Ischia</div>
                  <div className="text-gray-600 text-xs">6 barche</div>
                </div>
                <div className="bg-white/80 backdrop-blur-sm p-2 rounded-lg shadow-sm text-center hover:bg-white/90 transition-all">
                  <div className="text-cyan-600 font-bold mb-1">💎 Capri</div>
                  <div className="text-gray-600 text-xs">4 barche</div>
                </div>
                <div className="bg-white/80 backdrop-blur-sm p-2 rounded-lg shadow-sm text-center hover:bg-white/90 transition-all">
                  <div className="text-teal-600 font-bold mb-1">🏝️ Procida</div>
                  <div className="text-gray-600 text-xs">3 barche</div>
                </div>
                <div className="bg-white/80 backdrop-blur-sm p-2 rounded-lg shadow-sm text-center hover:bg-white/90 transition-all">
                  <div className="text-orange-600 font-bold mb-1">⚓ Castellammare</div>
                  <div className="text-gray-600 text-xs">2 barche</div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 text-center">
            <p className="text-xs text-blue-700 bg-blue-100/70 px-3 py-1 rounded-full">
              La mappa Google Maps si attiverà automaticamente appena l'API sarà configurata
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}