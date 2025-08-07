import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export default function MappaPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <section className="py-16 bg-gradient-to-br from-blue-50 to-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">🗺️ Mappa Interattiva del Lazio</h1>
            <p className="text-xl text-gray-600">Esplora i porti e trova le imbarcazioni disponibili</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900">Porto di Civitavecchia</h3>
                  <span className="bg-blue-600 text-white px-2 py-1 rounded text-sm font-medium">4 barche</span>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <div>📍 42.0942, 11.7939</div>
                  <div>⚓ Porto principale del Lazio</div>
                  <div className="text-green-600 font-medium">€280 - €1200/giorno</div>
                </div>
                <div className="mt-4">
                  <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                    Esplora barche
                  </button>
                </div>
              </div>

              <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900">Porto di Gaeta</h3>
                  <span className="bg-green-600 text-white px-2 py-1 rounded text-sm font-medium">2 barche</span>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <div>📍 41.2058, 13.5696</div>
                  <div>⚓ Località turistica rinomata</div>
                  <div className="text-green-600 font-medium">€280 - €850/giorno</div>
                </div>
                <div className="mt-4">
                  <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
                    Esplora barche
                  </button>
                </div>
              </div>

              <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900">Porto di Ponza</h3>
                  <span className="bg-orange-600 text-white px-2 py-1 rounded text-sm font-medium">2 barche</span>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <div>📍 40.8992, 12.9619</div>
                  <div>⚓ Isola paradisiaca</div>
                  <div className="text-green-600 font-medium">€550 - €950/giorno</div>
                </div>
                <div className="mt-4">
                  <button className="w-full bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition-colors">
                    Esplora barche
                  </button>
                </div>
              </div>

              <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900">Porto di Terracina</h3>
                  <span className="bg-purple-600 text-white px-2 py-1 rounded text-sm font-medium">2 barche</span>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <div>📍 41.2857, 13.2443</div>
                  <div>⚓ Costa laziale storica</div>
                  <div className="text-green-600 font-medium">€320 - €580/giorno</div>
                </div>
                <div className="mt-4">
                  <button className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors">
                    Esplora barche
                  </button>
                </div>
              </div>

              <div className="bg-indigo-50 border-2 border-indigo-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900">Marina di Anzio</h3>
                  <span className="bg-indigo-600 text-white px-2 py-1 rounded text-sm font-medium">3 barche</span>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <div>📍 41.4471, 12.6221</div>
                  <div>⚓ Porto turistico moderno</div>
                  <div className="text-green-600 font-medium">€200 - €750/giorno</div>
                </div>
                <div className="mt-4">
                  <button className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors">
                    Esplora barche
                  </button>
                </div>
              </div>

              <div className="bg-pink-50 border-2 border-pink-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900">Porto di Formia</h3>
                  <span className="bg-pink-600 text-white px-2 py-1 rounded text-sm font-medium">2 barche</span>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <div>📍 41.2565, 13.6058</div>
                  <div>⚓ Golfo di Gaeta</div>
                  <div className="text-green-600 font-medium">€300 - €600/giorno</div>
                </div>
                <div className="mt-4">
                  <button className="w-full bg-pink-600 text-white py-2 px-4 rounded-lg hover:bg-pink-700 transition-colors">
                    Esplora barche
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-8 p-6 bg-blue-50 rounded-lg">
              <div className="flex items-center text-blue-800">
                <span className="text-2xl mr-3">🗺️</span>
                <div>
                  <h4 className="font-bold text-lg">Mappa Interattiva del Lazio</h4>
                  <p className="text-sm">Vista completa di tutti i porti principali con barche disponibili</p>
                  <p className="text-sm mt-2">Coordinate GPS precise per ogni destinazione</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}