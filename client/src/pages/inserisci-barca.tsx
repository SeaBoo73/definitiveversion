import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Anchor, Upload, Euro, Shield, Camera, FileText } from "lucide-react";
import { Link } from "wouter";

export default function InserisciBarcaPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Come Inserire la Tua Barca
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Guida completa per pubblicare la tua imbarcazione su SeaGO e iniziare a guadagnare
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Anchor className="h-6 w-6 mr-2 text-blue-600" />
                Requisiti Base
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start">
                  <Shield className="h-5 w-5 mr-2 text-green-500 mt-0.5" />
                  <div>
                    <h4 className="font-semibold">Documenti Obbligatori</h4>
                    <p className="text-sm text-gray-600">Licenza di navigazione, assicurazione valida, certificati di sicurezza</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Camera className="h-5 w-5 mr-2 text-blue-500 mt-0.5" />
                  <div>
                    <h4 className="font-semibold">Foto Professionali</h4>
                    <p className="text-sm text-gray-600">Minimo 5 foto ad alta risoluzione di interni ed esterni</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <FileText className="h-5 w-5 mr-2 text-orange-500 mt-0.5" />
                  <div>
                    <h4 className="font-semibold">Descrizione Dettagliata</h4>
                    <p className="text-sm text-gray-600">Specifiche tecniche, equipaggiamenti, regole d'uso</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Euro className="h-6 w-6 mr-2 text-green-600" />
                Potenziale di Guadagno
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-bold text-green-800 text-lg mb-2">€12.500/anno</h4>
                  <p className="text-sm text-green-700">Guadagno medio dei proprietari attivi</p>
                </div>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="font-bold text-2xl text-blue-600">78%</div>
                    <div className="text-xs text-gray-600">Tasso occupazione medio</div>
                  </div>
                  <div>
                    <div className="font-bold text-2xl text-orange-600">85%</div>
                    <div className="text-xs text-gray-600">Della tariffa è tua</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Processo di Inserimento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-600">1</span>
                </div>
                <h3 className="font-semibold mb-2">Registrazione</h3>
                <p className="text-sm text-gray-600">
                  Crea il tuo account proprietario
                </p>
              </div>
              <div className="text-center">
                <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-green-600">2</span>
                </div>
                <h3 className="font-semibold mb-2">Compilazione</h3>
                <p className="text-sm text-gray-600">
                  Inserisci dettagli e foto della barca
                </p>
              </div>
              <div className="text-center">
                <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-orange-600">3</span>
                </div>
                <h3 className="font-semibold mb-2">Verifica</h3>
                <p className="text-sm text-gray-600">
                  Il nostro team verifica i documenti
                </p>
              </div>
              <div className="text-center">
                <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-purple-600">4</span>
                </div>
                <h3 className="font-semibold mb-2">Pubblicazione</h3>
                <p className="text-sm text-gray-600">
                  La tua barca va online e ricevi prenotazioni
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-semibold text-blue-900 mb-3">Categorie Più Richieste</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Gommoni (senza patente)</span>
                <span className="font-semibold text-blue-600">€180/giorno</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Barche a motore</span>
                <span className="font-semibold text-blue-600">€250/giorno</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Yacht</span>
                <span className="font-semibold text-blue-600">€450/giorno</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Catamarani</span>
                <span className="font-semibold text-blue-600">€380/giorno</span>
              </div>
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h3 className="font-semibold text-green-900 mb-3">Servizi Inclusi</h3>
            <ul className="list-disc list-inside text-sm text-green-800 space-y-1">
              <li>Assicurazione completa inclusa</li>
              <li>Assistenza clienti 24/7</li>
              <li>Sistema di pagamenti automatico</li>
              <li>Marketing e promozione</li>
              <li>Gestione prenotazioni</li>
              <li>Supporto tecnico dedicato</li>
            </ul>
          </div>
        </div>

        <div className="text-center bg-gradient-to-r from-blue-600 to-orange-500 rounded-lg p-8 text-white">
          <h3 className="text-2xl font-bold mb-4">Pronto a Iniziare?</h3>
          <p className="mb-6 opacity-90">
            Unisciti a centinaia di proprietari che hanno già scelto SeaGO per massimizzare i loro guadagni.
          </p>
          <div className="space-x-4">
            <Link to="/auth?tab=register&role=owner">
              <Button className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-8 py-3">
                <Upload className="h-5 w-5 mr-2" />
                Inserisci la Tua Barca
              </Button>
            </Link>
            <Link to="/owner-dashboard">
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 font-semibold px-8 py-3">
                Accedi alla Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}