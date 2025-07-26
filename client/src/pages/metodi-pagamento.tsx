import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, Shield, Smartphone, DollarSign, CheckCircle, AlertTriangle } from "lucide-react";

export default function MetodiPagamentoPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Metodi di Pagamento
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Tutti i modi sicuri per pagare il tuo noleggio su SeaGO
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <Card className="text-center">
            <CardHeader>
              <CardTitle className="flex flex-col items-center">
                <CreditCard className="h-8 w-8 mb-2 text-blue-600" />
                Carte di Credito
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Visa, Mastercard, American Express
              </p>
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                  <span>Pagamento immediato</span>
                </div>
                <div className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                  <span>Sicurezza 3D Secure</span>
                </div>
                <div className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                  <span>Rimborsi automatici</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <CardTitle className="flex flex-col items-center">
                <Smartphone className="h-8 w-8 mb-2 text-green-600" />
                Pagamenti Digitali
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Apple Pay, Google Pay, Samsung Pay
              </p>
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                  <span>Touch ID / Face ID</span>
                </div>
                <div className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                  <span>Nessuna carta richiesta</span>
                </div>
                <div className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                  <span>Crittografia avanzata</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <CardTitle className="flex flex-col items-center">
                <DollarSign className="h-8 w-8 mb-2 text-orange-600" />
                Bonifico Bancario
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Per prenotazioni di alto valore
              </p>
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                  <span>Commissioni ridotte</span>
                </div>
                <div className="flex items-center text-sm">
                  <AlertTriangle className="h-4 w-4 mr-2 text-orange-500" />
                  <span>Tempi di elaborazione: 1-3 giorni</span>
                </div>
                <div className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                  <span>Ideale per yacht premium</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="h-6 w-6 mr-2 text-green-600" />
              Sicurezza dei Pagamenti
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold mb-3">Tecnologie di Sicurezza</h4>
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <Shield className="h-4 w-4 mr-2 text-blue-500" />
                    <span>Crittografia SSL 256-bit</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Shield className="h-4 w-4 mr-2 text-blue-500" />
                    <span>Conformità PCI DSS Level 1</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Shield className="h-4 w-4 mr-2 text-blue-500" />
                    <span>Autenticazione 3D Secure 2.0</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Shield className="h-4 w-4 mr-2 text-blue-500" />
                    <span>Monitoraggio frodi 24/7</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Protezione Acquirente</h4>
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                    <span>Rimborso garantito in caso di problemi</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                    <span>Disputa automatica per transazioni</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                    <span>Supporto dedicato per pagamenti</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                    <span>Assicurazione transazioni inclusa</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Commissioni e Costi</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-l-4 border-green-400 pl-4">
                  <h4 className="font-semibold text-green-700">Carte di Credito</h4>
                  <p className="text-sm text-gray-600">Nessuna commissione per l'utente</p>
                  <p className="text-xs text-green-600 font-semibold">Costi inclusi nel prezzo</p>
                </div>
                <div className="border-l-4 border-blue-400 pl-4">
                  <h4 className="font-semibold text-blue-700">Pagamenti Digitali</h4>
                  <p className="text-sm text-gray-600">Gratuiti per tutte le transazioni</p>
                  <p className="text-xs text-blue-600 font-semibold">0% commissioni</p>
                </div>
                <div className="border-l-4 border-orange-400 pl-4">
                  <h4 className="font-semibold text-orange-700">Bonifico Bancario</h4>
                  <p className="text-sm text-gray-600">Commissioni bancarie a carico del cliente</p>
                  <p className="text-xs text-orange-600 font-semibold">Variabili per banca</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tempistiche di Elaborazione</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-green-50 p-3 rounded-lg">
                  <h4 className="font-semibold text-green-800">Immediato</h4>
                  <p className="text-sm text-green-700">Carte di credito e pagamenti digitali</p>
                </div>
                <div className="bg-yellow-50 p-3 rounded-lg">
                  <h4 className="font-semibold text-yellow-800">1-3 Giorni Lavorativi</h4>
                  <p className="text-sm text-yellow-700">Bonifici bancari nazionali</p>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <h4 className="font-semibold text-blue-800">3-5 Giorni Lavorativi</h4>
                  <p className="text-sm text-blue-700">Bonifici bancari internazionali</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Valute Accettate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 mb-1">EUR</div>
                <div className="text-sm text-blue-700">Euro (Principale)</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600 mb-1">USD</div>
                <div className="text-sm text-green-700">Dollaro USA</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600 mb-1">GBP</div>
                <div className="text-sm text-orange-700">Sterlina Britannica</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600 mb-1">CHF</div>
                <div className="text-sm text-purple-700">Franco Svizzero</div>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-4 text-center">
              I tassi di cambio sono aggiornati in tempo reale. Conversioni automatiche applicate al checkout.
            </p>
          </CardContent>
        </Card>

        <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-lg p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">Pagamenti Sicuri Garantiti</h3>
          <p className="mb-6 opacity-90">
            Tutti i pagamenti sono protetti da crittografia bancaria e copertura assicurativa completa.
          </p>
          <div className="grid md:grid-cols-3 gap-4 mt-6">
            <div className="bg-white bg-opacity-20 rounded-lg p-4">
              <Shield className="h-8 w-8 mx-auto mb-2" />
              <h4 className="font-semibold mb-1">SSL 256-bit</h4>
              <p className="text-sm opacity-90">Crittografia massima</p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-4">
              <CheckCircle className="h-8 w-8 mx-auto mb-2" />
              <h4 className="font-semibold mb-1">PCI Compliant</h4>
              <p className="text-sm opacity-90">Standard internazionali</p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-4">
              <CreditCard className="h-8 w-8 mx-auto mb-2" />
              <h4 className="font-semibold mb-1">3D Secure</h4>
              <p className="text-sm opacity-90">Autenticazione forte</p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}