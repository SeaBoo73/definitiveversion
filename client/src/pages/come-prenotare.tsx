import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Calendar, CreditCard, CheckCircle, Anchor, Users } from "lucide-react";

export default function ComePrenotarePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Come Prenotare una Barca
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Guida passo-passo per prenotare la tua imbarcazione ideale su SeaGO
          </p>
        </div>

        <Card className="mb-12">
          <CardHeader>
            <CardTitle>Processo di Prenotazione in 4 Semplici Passi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Search className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">1. Cerca</h3>
                <p className="text-sm text-gray-600">
                  Trova la barca perfetta usando i nostri filtri avanzati
                </p>
              </div>
              <div className="text-center">
                <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Calendar className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="font-semibold mb-2">2. Seleziona Date</h3>
                <p className="text-sm text-gray-600">
                  Scegli le date del tuo noleggio e verifica la disponibilità
                </p>
              </div>
              <div className="text-center">
                <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <CreditCard className="h-8 w-8 text-orange-600" />
                </div>
                <h3 className="font-semibold mb-2">3. Paga</h3>
                <p className="text-sm text-gray-600">
                  Completa il pagamento in modo sicuro con Stripe
                </p>
              </div>
              <div className="text-center">
                <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-2">4. Goditi</h3>
                <p className="text-sm text-gray-600">
                  Ricevi conferma e preparati per la tua avventura
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Anchor className="h-6 w-6 mr-2 text-blue-600" />
                Cosa Include la Prenotazione
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                  <span className="text-sm">Assicurazione completa inclusa</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                  <span className="text-sm">Assistenza 24/7 durante il noleggio</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                  <span className="text-sm">Check-in e check-out assistiti</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                  <span className="text-sm">Equipaggiamenti di sicurezza obbligatori</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                  <span className="text-sm">Chat diretta con il proprietario</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                  <span className="text-sm">Cancellazione flessibile*</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-6 w-6 mr-2 text-green-600" />
                Servizi Aggiuntivi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-l-4 border-blue-400 pl-4">
                  <h4 className="font-semibold text-blue-700">Skipper Professionale</h4>
                  <p className="text-sm text-gray-600">Capitano esperto per una navigazione sicura e rilassante</p>
                  <p className="text-xs text-blue-600 font-semibold">Da €150/giorno</p>
                </div>
                <div className="border-l-4 border-green-400 pl-4">
                  <h4 className="font-semibold text-green-700">Carburante Incluso</h4>
                  <p className="text-sm text-gray-600">Naviga senza pensieri con il carburante già incluso</p>
                  <p className="text-xs text-green-600 font-semibold">Secondo consumo</p>
                </div>
                <div className="border-l-4 border-orange-400 pl-4">
                  <h4 className="font-semibold text-orange-700">Equipaggiamenti Extra</h4>
                  <p className="text-sm text-gray-600">Attrezzature per sport acquatici, pesca, snorkeling</p>
                  <p className="text-xs text-orange-600 font-semibold">Su richiesta</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Tempistiche di Prenotazione</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <h4 className="font-bold text-blue-800 text-lg mb-2">Immediata</h4>
                <p className="text-sm text-blue-700">
                  La maggior parte delle barche può essere prenotata istantaneamente
                </p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg text-center">
                <h4 className="font-bold text-yellow-800 text-lg mb-2">Entro 24h</h4>
                <p className="text-sm text-yellow-700">
                  Alcune richieste necessitano conferma del proprietario
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <h4 className="font-bold text-green-800 text-lg mb-2">Garantita</h4>
                <p className="text-sm text-green-700">
                  Ricevi sempre una risposta definitiva entro 24 ore
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="bg-gradient-to-r from-blue-600 to-ocean-blue rounded-lg p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">Pronto a Partire?</h3>
          <p className="mb-6 opacity-90">
            Oltre 200 imbarcazioni ti aspettano per la tua prossima avventura in mare.
          </p>
          <div className="space-y-2">
            <p className="text-sm opacity-80">*Condizioni di cancellazione variano per barca</p>
            <p className="text-sm opacity-80">Assistenza disponibile 24/7 al numero 1530 (Guardia Costiera)</p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}