import React from 'react';
import './index.css';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-blue-600">SeaBoo</h1>
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">
              Accedi
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            Naviga verso l'avventura
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Scopri le migliori barche per il tuo prossimo viaggio sul mare
          </p>
          
          {/* Search Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Destinazione
                </label>
                <input 
                  type="text" 
                  placeholder="Dove vuoi andare?"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Check-in
                </label>
                <input 
                  type="date" 
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Check-out
                </label>
                <input 
                  type="date" 
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ospiti
                </label>
                <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                  <option>1 ospite</option>
                  <option>2 ospiti</option>
                  <option>3-5 ospiti</option>
                  <option>6+ ospiti</option>
                </select>
              </div>
            </div>
            <button className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg mt-6 text-lg font-semibold hover:bg-blue-700 transition">
              Cerca Barche
            </button>
          </div>
        </div>

        {/* Featured Boats */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Barche in Evidenza
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((boat) => (
              <div key={boat} className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="h-48 bg-gradient-to-r from-blue-400 to-blue-600"></div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">Yacht di Lusso {boat}</h3>
                  <p className="text-gray-600 mb-4">
                    Esperienza indimenticabile con tutti i comfort
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-blue-600">€199/giorno</span>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                      Prenota
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Bottom Navigation for Mobile */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
        <div className="flex justify-around">
          <button className="flex flex-col items-center py-2 text-blue-600">
            <div className="w-6 h-6 mb-1">🏠</div>
            <span className="text-xs">Home</span>
          </button>
          <button className="flex flex-col items-center py-2 text-gray-500">
            <div className="w-6 h-6 mb-1">🔍</div>
            <span className="text-xs">Cerca</span>
          </button>
          <button className="flex flex-col items-center py-2 text-gray-500">
            <div className="w-6 h-6 mb-1">⚓</div>
            <span className="text-xs">Ormeggi</span>
          </button>
          <button className="flex flex-col items-center py-2 text-gray-500">
            <div className="w-6 h-6 mb-1">🛥️</div>
            <span className="text-xs">Esperienze</span>
          </button>
          <button className="flex flex-col items-center py-2 text-gray-500">
            <div className="w-6 h-6 mb-1">👤</div>
            <span className="text-xs">Profilo</span>
          </button>
        </div>
      </nav>
    </div>
  );
}

export default App;