import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Users, Settings, CheckCircle, Clock, AlertCircle } from "lucide-react";

export default function GestionePrenotazioniPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Gestione delle Prenotazioni
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Guida completa per proprietari su come gestire le prenotazioni delle proprie imbarcazioni
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-6 w-6 mr-2 text-blue-600" />
                Dashboard Prenotazioni
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-600">
                  Accedi alla tua dashboard proprietario per gestire tutte le prenotazioni.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                    <span>Visualizza prenotazioni attive</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Clock className="h-4 w-4 mr-2 text-blue-500" />
                    <span>Conferma automatica entro 24h</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Users className="h-4 w-4 mr-2 text-orange-500" />
                    <span>Chat diretta con i clienti</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="h-6 w-6 mr-2 text-green-600" />
                Stati delle Prenotazioni
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-l-4 border-yellow-400 pl-4">
                  <h4 className="font-semibold text-yellow-700">In Attesa</h4>
                  <p className="text-sm text-gray-600">Richiesta appena ricevuta, necessita conferma</p>
                </div>
                <div className="border-l-4 border-green-400 pl-4">
                  <h4 className="font-semibold text-green-700">Confermata</h4>
                  <p className="text-sm text-gray-600">Prenotazione confermata e pagamento ricevuto</p>
                </div>
                <div className="border-l-4 border-blue-400 pl-4">
                  <h4 className="font-semibold text-blue-700">In Corso</h4>
                  <p className="text-sm text-gray-600">Cliente attualmente in uso dell'imbarcazione</p>
                </div>
                <div className="border-l-4 border-gray-400 pl-4">
                  <h4 className="font-semibold text-gray-700">Completata</h4>
                  <p className="text-sm text-gray-600">Noleggio terminato, pagamento elaborato</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Processo di Gestione Prenotazioni</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="bg-yellow-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-yellow-600">1</span>
                </div>
                <h3 className="font-semibold mb-2">Richiesta Ricevuta</h3>
                <p className="text-sm text-gray-600">
                  Notifica immediata della nuova richiesta
                </p>
              </div>
              <div className="text-center">
                <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-600">2</span>
                </div>
                <h3 className="font-semibold mb-2">Verifica Disponibilità</h3>
                <p className="text-sm text-gray-600">
                  Controlla calendario e condizioni barca
                </p>
              </div>
              <div className="text-center">
                <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-green-600">3</span>
                </div>
                <h3 className="font-semibold mb-2">Conferma/Rifiuta</h3>
                <p className="text-sm text-gray-600">
                  Accetta o rifiuta entro 24 ore
                </p>
              </div>
              <div className="text-center">
                <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-purple-600">4</span>
                </div>
                <h3 className="font-semibold mb-2">Gestione Attiva</h3>
                <p className="text-sm text-gray-600">
                  Comunica con il cliente e monitora il noleggio
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h3 className="font-semibold text-green-900 mb-3 flex items-center">
              <CheckCircle className="h-5 w-5 mr-2" />
              Best Practices
            </h3>
            <ul className="list-disc list-inside text-sm text-green-800 space-y-1">
              <li>Rispondi alle richieste entro 4 ore</li>
              <li>Mantieni il calendario sempre aggiornato</li>
              <li>Comunica chiaramente le regole della barca</li>
              <li>Fornisci istruzioni dettagliate per il check-in</li>
              <li>Sii disponibile durante il noleggio</li>
            </ul>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
            <h3 className="font-semibold text-amber-900 mb-3 flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              Situazioni Speciali
            </h3>
            <ul className="list-disc list-inside text-sm text-amber-800 space-y-1">
              <li>Maltempo: contatta il cliente in anticipo</li>
              <li>Problemi tecnici: informa immediatamente</li>
              <li>Modifiche last-minute: usa la chat integrata</li>
              <li>Emergenze: segui i protocolli di sicurezza</li>
              <li>Dispute: contatta il supporto SeaGO</li>
            </ul>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Pagamenti e Commissioni</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <span className="text-lg font-bold text-blue-600">85%</span>
                </div>
                <h4 className="font-semibold mb-2">Il Tuo Guadagno</h4>
                <p className="text-sm text-gray-600">
                  Ricevi l'85% del prezzo di noleggio
                </p>
              </div>
              <div className="text-center">
                <div className="bg-orange-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <span className="text-lg font-bold text-orange-600">15%</span>
                </div>
                <h4 className="font-semibold mb-2">Commissione SeaGO</h4>
                <p className="text-sm text-gray-600">
                  Include assicurazione e supporto
                </p>
              </div>
              <div className="text-center">
                <div className="bg-green-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <span className="text-lg font-bold text-green-600">7</span>
                </div>
                <h4 className="font-semibold mb-2">Giorni Pagamento</h4>
                <p className="text-sm text-gray-600">
                  Bonifico automatico ogni settimana
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
}