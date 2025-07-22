import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Calendar, Users, Euro, BarChart3, Settings, Bell } from "lucide-react";

export default function GestionePrenotazioniPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Gestione delle Prenotazioni
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Gestisci facilmente tutte le prenotazioni della tua imbarcazione con gli strumenti avanzati di SeaGO
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 text-center">
            <Calendar className="h-12 w-12 text-ocean-blue mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-4">Calendario Integrato</h3>
            <p className="text-gray-600">
              Visualizza tutte le prenotazioni in un calendario intuitivo. 
              Gestisci disponibilità e blocca date con un click.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 text-center">
            <Users className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-4">Profili Clienti</h3>
            <p className="text-gray-600">
              Accedi ai profili completi dei clienti, cronologia noleggi 
              e comunicazioni dirette tramite chat integrata.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 text-center">
            <Euro className="h-12 w-12 text-purple-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-4">Gestione Pagamenti</h3>
            <p className="text-gray-600">
              Monitora pagamenti, depositi e commissioni. 
              Ricevi notifiche per transazioni completate.
            </p>
          </div>
        </div>

        <div className="space-y-12">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-semibold mb-6">Dashboard Proprietario</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-medium mb-4 flex items-center">
                  <BarChart3 className="w-5 h-5 text-ocean-blue mr-2" />
                  Analytics e Statistiche
                </h3>
                <ul className="space-y-3 text-gray-600">
                  <li>• Tasso di occupazione in tempo reale</li>
                  <li>• Ricavi mensili e annuali</li>
                  <li>• Valutazioni e recensioni clienti</li>
                  <li>• Confronto con imbarcazioni simili</li>
                  <li>• Suggerimenti per ottimizzare i prezzi</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-4 flex items-center">
                  <Settings className="w-5 h-5 text-green-600 mr-2" />
                  Strumenti di Gestione
                </h3>
                <ul className="space-y-3 text-gray-600">
                  <li>• Impostazione prezzi dinamici</li>
                  <li>• Gestione delle disponibilità</li>
                  <li>• Check-in e check-out digitali</li>
                  <li>• Lista equipaggiamenti e inventario</li>
                  <li>• Report di manutenzione</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-semibold mb-6">Comunicazione con i Clienti</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Bell className="h-8 w-8 text-ocean-blue mb-3" />
                <h3 className="text-lg font-medium mb-3">Notifiche Automatiche</h3>
                <p className="text-gray-600">
                  Messaggi automatici per conferme, promemoria e istruzioni pre-imbarco.
                </p>
              </div>
              <div>
                <Users className="h-8 w-8 text-green-600 mb-3" />
                <h3 className="text-lg font-medium mb-3">Chat Integrata</h3>
                <p className="text-gray-600">
                  Comunicazione diretta con i clienti attraverso la piattaforma SeaGO.
                </p>
              </div>
              <div>
                <Settings className="h-8 w-8 text-purple-600 mb-3" />
                <h3 className="text-lg font-medium mb-3">Template Personalizzati</h3>
                <p className="text-gray-600">
                  Crea modelli di messaggi personalizzati per diverse situazioni.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-ocean-blue to-deep-navy text-white rounded-xl p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-2xl font-semibold mb-4">Accedi alla Dashboard</h2>
                <p className="text-lg mb-6">
                  Gestisci la tua imbarcazione con gli strumenti professionali di SeaGO. 
                  Accedi alla dashboard proprietario per iniziare.
                </p>
                <button className="bg-white text-ocean-blue px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                  Accedi alla Dashboard
                </button>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Supporto Dedicato</h3>
                <p className="mb-4">
                  Il nostro team è disponibile per aiutarti a ottimizzare la gestione 
                  della tua imbarcazione e massimizzare i guadagni.
                </p>
                <p className="font-medium">Hotline Proprietari: +39 800 123 456</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}