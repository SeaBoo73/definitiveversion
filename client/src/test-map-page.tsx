import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export function TestMapPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <section className="py-16 bg-red-500 text-white text-center">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">🚨 TEST PAGE - MAPPA DEBUGGING 🚨</h1>
          <p className="text-xl">Se vedi questa pagina, il routing funziona!</p>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-br from-blue-50 to-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">🗺️ Mappa Interattiva del Lazio</h2>
            <p className="text-lg text-gray-600">Esplora i porti e trova le imbarcazioni disponibili</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 min-h-[600px]">
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
            </div>

            <div className="mt-8 p-6 bg-blue-50 rounded-lg">
              <div className="flex items-center text-blue-800">
                <span className="text-2xl mr-3">🗺️</span>
                <div>
                  <h4 className="font-bold text-lg">Mappa Interattiva del Lazio</h4>
                  <p className="text-sm">Vista completa di tutti i porti principali con barche disponibili</p>
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