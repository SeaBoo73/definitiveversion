import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, CreditCard, IdCard, Shield, AlertTriangle, CheckCircle } from "lucide-react";

export default function DocumentiPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Documenti Necessari
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Scopri quali documenti servono per noleggiare un'imbarcazione su SeaGO
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <IdCard className="h-6 w-6 mr-2 text-blue-600" />
                Documenti Personali
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 mr-2 text-green-500 mt-0.5" />
                  <div>
                    <h4 className="font-semibold">Documento d'Identità</h4>
                    <p className="text-sm text-gray-600">Carta d'identità, passaporto o patente di guida validi</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 mr-2 text-green-500 mt-0.5" />
                  <div>
                    <h4 className="font-semibold">Codice Fiscale</h4>
                    <p className="text-sm text-gray-600">Necessario per la registrazione e fatturazione</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CreditCard className="h-5 w-5 mr-2 text-blue-500 mt-0.5" />
                  <div>
                    <h4 className="font-semibold">Carta di Credito</h4>
                    <p className="text-sm text-gray-600">Per il pagamento e eventuale deposito cauzionale</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-6 w-6 mr-2 text-green-600" />
                Patenti Nautiche
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-l-4 border-green-400 pl-4">
                  <h4 className="font-semibold text-green-700">Barche senza Patente</h4>
                  <p className="text-sm text-gray-600">Nessuna patente richiesta per motori fino a 40 CV</p>
                  <p className="text-xs text-green-600 font-semibold">Solo maggiorenni</p>
                </div>
                <div className="border-l-4 border-blue-400 pl-4">
                  <h4 className="font-semibold text-blue-700">Patente Nautica Entro le Miglia</h4>
                  <p className="text-sm text-gray-600">Per barche oltre 40 CV e navigazione costiera</p>
                  <p className="text-xs text-blue-600 font-semibold">Entro 12 miglia dalla costa</p>
                </div>
                <div className="border-l-4 border-orange-400 pl-4">
                  <h4 className="font-semibold text-orange-700">Patente Nautica Senza Limiti</h4>
                  <p className="text-sm text-gray-600">Per navigazione d'altura e yacht più grandi</p>
                  <p className="text-xs text-orange-600 font-semibold">Navigazione illimitata</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Documenti per Categoria di Imbarcazione</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <FileText className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="font-semibold mb-2">Gommoni</h3>
                <p className="text-sm text-gray-600 mb-2">
                  Solo documento d'identità
                </p>
                <div className="text-xs text-green-600 font-semibold">
                  Nessuna patente richiesta
                </div>
              </div>
              <div className="text-center">
                <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <IdCard className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">Barche a Motore</h3>
                <p className="text-sm text-gray-600 mb-2">
                  Patente nautica richiesta
                </p>
                <div className="text-xs text-blue-600 font-semibold">
                  Entro le miglia o senza limiti
                </div>
              </div>
              <div className="text-center">
                <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-2">Yacht</h3>
                <p className="text-sm text-gray-600 mb-2">
                  Patente + esperienza comprovata
                </p>
                <div className="text-xs text-purple-600 font-semibold">
                  Può richiedere skipper obbligatorio
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-6 w-6 mr-2 text-green-600" />
                Documenti per l'Assicurazione
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-gray-600 text-sm">
                  L'assicurazione è inclusa in ogni prenotazione. Potrebbero essere richiesti:
                </p>
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                    <span>Certificato medico per età &gt; 65 anni</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                    <span>Dichiarazione esperienza nautica</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                    <span>Lista equipaggio (per barche grandi)</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="h-6 w-6 mr-2 text-orange-600" />
                Documenti Stranieri
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-gray-600 text-sm">
                  Per cittadini non UE sono necessari documenti aggiuntivi:
                </p>
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <FileText className="h-4 w-4 mr-2 text-blue-500" />
                    <span>Passaporto con visto valido</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <FileText className="h-4 w-4 mr-2 text-blue-500" />
                    <span>Patente nautica del paese d'origine</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <FileText className="h-4 w-4 mr-2 text-blue-500" />
                    <span>Traduzione ufficiale dei documenti</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Check-in e Verifica Documenti</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-blue-50 p-6 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-3">Cosa Aspettarsi al Check-in</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-semibold text-sm mb-2">Verifica Documenti:</h5>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Controllo identità e patente</li>
                    <li>• Verifica validità assicurazione</li>
                    <li>• Conferma dati prenotazione</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-semibold text-sm mb-2">Briefing Sicurezza:</h5>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Spiegazione equipaggiamenti</li>
                    <li>• Procedure di emergenza</li>
                    <li>• Limiti e zone di navigazione</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-lg p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">Documenti Pronti?</h3>
          <p className="mb-6 opacity-90">
            Assicurati di avere tutti i documenti necessari prima della prenotazione per un check-in veloce e senza problemi.
          </p>
          <div className="grid md:grid-cols-2 gap-4 mt-6">
            <div className="bg-white bg-opacity-20 rounded-lg p-4">
              <h4 className="font-semibold mb-2">🎯 Consiglio Pro</h4>
              <p className="text-sm opacity-90">
                Carica i documenti sul tuo profilo per velocizzare le future prenotazioni
              </p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-4">
              <h4 className="font-semibold mb-2">📱 Documenti Digitali</h4>
              <p className="text-sm opacity-90">
                Foto dei documenti salvate sul telefono sono accettate per il check-in
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}