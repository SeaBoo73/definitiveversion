import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { DollarSign, TrendingUp, Calendar, PieChart } from "lucide-react";

export default function CommissioniGuadagniPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Commissioni e Guadagni
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Scopri quanto puoi guadagnare noleggiando la tua imbarcazione con SeaGO
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
            <DollarSign className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="font-semibold mb-2">15%</h3>
            <p className="text-sm text-gray-600">Commissione SeaGO</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
            <TrendingUp className="h-12 w-12 text-ocean-blue mx-auto mb-4" />
            <h3 className="font-semibold mb-2">85%</h3>
            <p className="text-sm text-gray-600">Il tuo guadagno</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
            <Calendar className="h-12 w-12 text-purple-600 mx-auto mb-4" />
            <h3 className="font-semibold mb-2">7 giorni</h3>
            <p className="text-sm text-gray-600">Tempo di pagamento</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
            <PieChart className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="font-semibold mb-2">€2.800</h3>
            <p className="text-sm text-gray-600">Guadagno medio mensile</p>
          </div>
        </div>

        <div className="space-y-12">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-semibold mb-6">Come Funzionano le Commissioni</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-medium mb-4">Struttura Semplice</h3>
                <p className="text-gray-600 mb-4">
                  SeaGO applica una commissione del 15% sul prezzo di noleggio. 
                  Questo include tutti i nostri servizi: marketing, assistenza clienti, 
                  pagamenti sicuri e assicurazione.
                </p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Esempio:</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Prezzo noleggio:</span>
                      <span>€1.000</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Commissione SeaGO (15%):</span>
                      <span>€150</span>
                    </div>
                    <div className="flex justify-between font-semibold border-t pt-1">
                      <span>Il tuo guadagno:</span>
                      <span>€850</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-4">Cosa Include la Commissione</h3>
                <ul className="space-y-3 text-gray-600">
                  <li>• Marketing e promozione della tua barca</li>
                  <li>• Gestione prenotazioni e calendario</li>
                  <li>• Assistenza clienti 24/7</li>
                  <li>• Processamento pagamenti sicuri</li>
                  <li>• Copertura assicurativa</li>
                  <li>• Sistema di recensioni</li>
                  <li>• Supporto tecnico e legale</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-semibold mb-6">Calcola i Tuoi Guadagni</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <h3 className="text-lg font-medium mb-4">Barca Piccola (6-8m)</h3>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="text-2xl font-bold text-ocean-blue mb-2">€150-250</div>
                  <div className="text-sm text-gray-600 mb-4">al giorno</div>
                  <div className="text-lg font-semibold">€1.200-2.000</div>
                  <div className="text-sm text-gray-600">guadagno mensile</div>
                </div>
              </div>

              <div className="text-center">
                <h3 className="text-lg font-medium mb-4">Barca Media (8-12m)</h3>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="text-2xl font-bold text-ocean-blue mb-2">€300-500</div>
                  <div className="text-sm text-gray-600 mb-4">al giorno</div>
                  <div className="text-lg font-semibold">€2.400-4.000</div>
                  <div className="text-sm text-gray-600">guadagno mensile</div>
                </div>
              </div>

              <div className="text-center">
                <h3 className="text-lg font-medium mb-4">Yacht di Lusso (12m+)</h3>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="text-2xl font-bold text-ocean-blue mb-2">€600-1.200</div>
                  <div className="text-sm text-gray-600 mb-4">al giorno</div>
                  <div className="text-lg font-semibold">€4.800-9.600</div>
                  <div className="text-sm text-gray-600">guadagno mensile</div>
                </div>
              </div>
            </div>
            <p className="text-center text-gray-600 mt-6">
              * I guadagni sono indicativi e dipendono dalla stagione, location e caratteristiche dell'imbarcazione
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-semibold mb-6">Pagamenti e Fatturazione</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-medium mb-4">Tempistiche di Pagamento</h3>
                <ul className="space-y-3 text-gray-600">
                  <li>• Pagamento entro 7 giorni dalla fine del noleggio</li>
                  <li>• Bonifico bancario diretto sul tuo conto</li>
                  <li>• Rendiconto dettagliato per ogni noleggio</li>
                  <li>• Report mensili e annuali disponibili</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-4">Aspetti Fiscali</h3>
                <ul className="space-y-3 text-gray-600">
                  <li>• Fatturazione automatica per ogni pagamento</li>
                  <li>• Ritenuta d'acconto del 20% se applicabile</li>
                  <li>• Documenti pronti per dichiarazione redditi</li>
                  <li>• Consulenza fiscale gratuita</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl p-8">
            <h2 className="text-2xl font-semibold mb-4">Inizia a Guadagnare Oggi</h2>
            <p className="text-lg mb-6">
              Registra la tua imbarcazione e inizia a generare reddito passivo con SeaGO.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-2">Setup Gratuito</h3>
                <p>Nessun costo di attivazione, paghi solo quando guadagni</p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Supporto Dedicato</h3>
                <p>Account manager personale per ottimizzare i tuoi guadagni</p>
              </div>
            </div>
            <button className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors mt-6">
              Registra la Tua Barca
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}