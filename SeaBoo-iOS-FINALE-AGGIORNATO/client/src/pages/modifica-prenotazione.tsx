import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, AlertTriangle, CheckCircle, XCircle, Edit } from "lucide-react";

export default function ModificaPrenotazionePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Modificare una Prenotazione
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Scopri come modificare le tue prenotazioni esistenti su SeaBoo
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Edit className="h-6 w-6 mr-2 text-blue-600" />
                Cosa Puoi Modificare
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 mr-2 text-green-500 mt-0.5" />
                  <div>
                    <h4 className="font-semibold">Date del Noleggio</h4>
                    <p className="text-sm text-gray-600">Cambia date di inizio e fine secondo disponibilità</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 mr-2 text-green-500 mt-0.5" />
                  <div>
                    <h4 className="font-semibold">Servizi Aggiuntivi</h4>
                    <p className="text-sm text-gray-600">Aggiungi o rimuovi skipper, carburante, equipaggiamenti</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 mr-2 text-green-500 mt-0.5" />
                  <div>
                    <h4 className="font-semibold">Numero di Persone</h4>
                    <p className="text-sm text-gray-600">Modifica il numero di ospiti entro il limite della barca</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <XCircle className="h-5 w-5 mr-2 text-red-500 mt-0.5" />
                  <div>
                    <h4 className="font-semibold">Cambio Imbarcazione</h4>
                    <p className="text-sm text-gray-600">Non è possibile cambiare barca - serve nuova prenotazione</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-6 w-6 mr-2 text-orange-600" />
                Tempistiche per le Modifiche
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-l-4 border-green-400 pl-4">
                  <h4 className="font-semibold text-green-700">Oltre 48 ore prima</h4>
                  <p className="text-sm text-gray-600">Modifiche gratuite per date e servizi</p>
                </div>
                <div className="border-l-4 border-yellow-400 pl-4">
                  <h4 className="font-semibold text-yellow-700">24-48 ore prima</h4>
                  <p className="text-sm text-gray-600">Possibili modifiche con piccolo sovrapprezzo</p>
                </div>
                <div className="border-l-4 border-red-400 pl-4">
                  <h4 className="font-semibold text-red-700">Meno di 24 ore</h4>
                  <p className="text-sm text-gray-600">Modifiche limitate, soggette ad approvazione</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Come Modificare la Tua Prenotazione</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-600">1</span>
                </div>
                <h3 className="font-semibold mb-2">Accedi al Dashboard</h3>
                <p className="text-sm text-gray-600">
                  Entra nel tuo account cliente
                </p>
              </div>
              <div className="text-center">
                <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-green-600">2</span>
                </div>
                <h3 className="font-semibold mb-2">Trova la Prenotazione</h3>
                <p className="text-sm text-gray-600">
                  Seleziona la prenotazione da modificare
                </p>
              </div>
              <div className="text-center">
                <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-orange-600">3</span>
                </div>
                <h3 className="font-semibold mb-2">Richiedi Modifica</h3>
                <p className="text-sm text-gray-600">
                  Indica le modifiche desiderate
                </p>
              </div>
              <div className="text-center">
                <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-purple-600">4</span>
                </div>
                <h3 className="font-semibold mb-2">Conferma</h3>
                <p className="text-sm text-gray-600">
                  Attendi conferma dal proprietario
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h3 className="font-semibold text-green-900 mb-3 flex items-center">
              <CheckCircle className="h-5 w-5 mr-2" />
              Modifiche Gratuite
            </h3>
            <ul className="list-disc list-inside text-sm text-green-800 space-y-1">
              <li>Cambio date con oltre 48h di anticipo</li>
              <li>Aggiunta servizi aggiuntivi</li>
              <li>Riduzione numero ospiti</li>
              <li>Modifica orari check-in/out (entro limiti)</li>
            </ul>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
            <h3 className="font-semibold text-amber-900 mb-3 flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Modifiche a Pagamento
            </h3>
            <ul className="list-disc list-inside text-sm text-amber-800 space-y-1">
              <li>Cambio date last-minute (24-48h)</li>
              <li>Upgrade servizi premium</li>
              <li>Aumento numero ospiti</li>
              <li>Modifiche urgenti (meno di 24h)</li>
            </ul>
          </div>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Situazioni Speciali</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">🌦️ Maltempo</h4>
                <p className="text-sm text-blue-700">
                  In caso di condizioni meteo avverse, puoi richiedere lo spostamento gratuito della prenotazione.
                  La decisione finale spetta al proprietario per motivi di sicurezza.
                </p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <h4 className="font-semibold text-orange-800 mb-2">🔧 Problemi Tecnici</h4>
                <p className="text-sm text-orange-700">
                  Se la barca ha problemi tecnici, il proprietario ti offrirà un rimborso completo o una barca 
                  sostitutiva equivalente senza costi aggiuntivi.
                </p>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <h4 className="font-semibold text-red-800 mb-2">🚨 Emergenze</h4>
                <p className="text-sm text-red-700">
                  Per emergenze mediche o familiari gravi, contatta immediatamente il nostro supporto.
                  Valuteremo ogni caso individualmente per trovare la soluzione migliore.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-white">
          <h3 className="text-2xl font-bold mb-4">Hai Bisogno di Aiuto?</h3>
          <p className="mb-6 opacity-90">
            Il nostro team è disponibile 24/7 per aiutarti con qualsiasi modifica alla tua prenotazione.
          </p>
          <div className="space-x-4">
            <Button className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-8 py-3">
              Chat Live
            </Button>
            <Button variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 font-semibold px-8 py-3">
              Chiama: +39 06 1234 5678
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}