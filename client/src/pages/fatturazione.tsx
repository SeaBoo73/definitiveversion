import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, Calendar, CreditCard, Building, CheckCircle } from "lucide-react";

export default function FatturazionePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Fatturazione e Ricevute
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Gestione completa delle tue fatture e documenti fiscali su SeaGO
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <Card className="text-center">
            <CardHeader>
              <CardTitle className="flex flex-col items-center">
                <FileText className="h-8 w-8 mb-2 text-blue-600" />
                Fatture Automatiche
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Ricevi automaticamente la fattura per ogni prenotazione completata
              </p>
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                  <span>Invio immediato via email</span>
                </div>
                <div className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                  <span>Formato PDF ufficiale</span>
                </div>
                <div className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                  <span>Archiviazione digitale</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <CardTitle className="flex flex-col items-center">
                <Building className="h-8 w-8 mb-2 text-green-600" />
                Fatturazione Aziendale
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Fatture intestate alla tua azienda con tutti i dati fiscali
              </p>
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                  <span>Partita IVA e Codice Fiscale</span>
                </div>
                <div className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                  <span>Indirizzo sede legale</span>
                </div>
                <div className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                  <span>Codice destinatario SDI</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <CardTitle className="flex flex-col items-center">
                <Download className="h-8 w-8 mb-2 text-orange-600" />
                Download e Archivio
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Accedi a tutte le tue fatture dal dashboard personale
              </p>
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                  <span>Download illimitato</span>
                </div>
                <div className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                  <span>Archivio storico completo</span>
                </div>
                <div className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                  <span>Esportazione Excel/CSV</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Cosa Include la Fattura</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold mb-4">Dettagli Prenotazione</h4>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 mr-2 text-green-500 mt-0.5" />
                    <div>
                      <h5 className="font-medium">Dati Imbarcazione</h5>
                      <p className="text-sm text-gray-600">Nome, modello, caratteristiche tecniche</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 mr-2 text-green-500 mt-0.5" />
                    <div>
                      <h5 className="font-medium">Periodo Noleggio</h5>
                      <p className="text-sm text-gray-600">Date, orari, durata della locazione</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 mr-2 text-green-500 mt-0.5" />
                    <div>
                      <h5 className="font-medium">Servizi Aggiuntivi</h5>
                      <p className="text-sm text-gray-600">Skipper, carburante, equipaggiamenti extra</p>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Informazioni Fiscali</h4>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 mr-2 text-green-500 mt-0.5" />
                    <div>
                      <h5 className="font-medium">Codice Univoco</h5>
                      <p className="text-sm text-gray-600">Numero progressivo fattura e data emissione</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 mr-2 text-green-500 mt-0.5" />
                    <div>
                      <h5 className="font-medium">Dati Fiscali SeaGO</h5>
                      <p className="text-sm text-gray-600">P.IVA, Codice Fiscale, indirizzo sede</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 mr-2 text-green-500 mt-0.5" />
                    <div>
                      <h5 className="font-medium">Calcolo IVA</h5>
                      <p className="text-sm text-gray-600">Dettaglio IVA 22% su servizi turistici</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-6 w-6 mr-2 text-blue-600" />
                Tempistiche di Emissione
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-l-4 border-green-400 pl-4">
                  <h4 className="font-semibold text-green-700">Pagamento Completato</h4>
                  <p className="text-sm text-gray-600">Fattura emessa immediatamente dopo il pagamento</p>
                  <p className="text-xs text-green-600 font-semibold">Entro 15 minuti</p>
                </div>
                <div className="border-l-4 border-blue-400 pl-4">
                  <h4 className="font-semibold text-blue-700">Invio Email</h4>
                  <p className="text-sm text-gray-600">Ricevi la fattura nella casella email registrata</p>
                  <p className="text-xs text-blue-600 font-semibold">Immediato</p>
                </div>
                <div className="border-l-4 border-orange-400 pl-4">
                  <h4 className="font-semibold text-orange-700">Disponibilità Dashboard</h4>
                  <p className="text-sm text-gray-600">Accesso completo dal tuo account personale</p>
                  <p className="text-xs text-orange-600 font-semibold">Sempre disponibile</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="h-6 w-6 mr-2 text-green-600" />
                Metodi di Pagamento in Fattura
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <h4 className="font-semibold text-blue-800">Carta di Credito</h4>
                  <p className="text-sm text-blue-700">Pagamento tracciabile con estremi transazione</p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <h4 className="font-semibold text-green-800">Bonifico Bancario</h4>
                  <p className="text-sm text-green-700">Riferimento operazione e data accredito</p>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg">
                  <h4 className="font-semibold text-purple-800">Pagamenti Digitali</h4>
                  <p className="text-sm text-purple-700">Apple Pay, Google Pay con ID transazione</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Configurazione Dati di Fatturazione</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-blue-50 p-6 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-3">Come Impostare i Tuoi Dati Fiscali</h4>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-semibold text-sm mb-2">Fatturazione Privata:</h5>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Nome e Cognome completi</li>
                    <li>• Codice Fiscale</li>
                    <li>• Indirizzo di residenza</li>
                    <li>• Email per invio fatture</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-semibold text-sm mb-2">Fatturazione Aziendale:</h5>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Ragione sociale completa</li>
                    <li>• Partita IVA e Codice Fiscale</li>
                    <li>• Indirizzo sede legale</li>
                    <li>• Codice destinatario SDI (opzionale)</li>
                  </ul>
                </div>
              </div>
              <div className="mt-4 text-center">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2">
                  Configura Dati di Fatturazione
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
            <h3 className="font-semibold text-green-900 mb-2">Conformità Fiscale</h3>
            <p className="text-sm text-green-800 mb-3">
              Tutte le fatture sono conformi alla normativa fiscale italiana ed europea
            </p>
            <div className="text-2xl font-bold text-green-600">✓</div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
            <h3 className="font-semibold text-blue-900 mb-2">Fatturazione Elettronica</h3>
            <p className="text-sm text-blue-800 mb-3">
              Sistema integrato con l'Agenzia delle Entrate per B2B
            </p>
            <div className="text-2xl font-bold text-blue-600">SDI</div>
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 text-center">
            <h3 className="font-semibold text-orange-900 mb-2">Conservazione Digitale</h3>
            <p className="text-sm text-orange-800 mb-3">
              Archiviazione sicura per 10 anni secondo normative
            </p>
            <div className="text-2xl font-bold text-orange-600">10y</div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">Fatturazione Semplice e Automatica</h3>
          <p className="mb-6 opacity-90">
            Non dovrai mai preoccuparti della documentazione fiscale. Tutto è gestito automaticamente dal nostro sistema.
          </p>
          <div className="grid md:grid-cols-4 gap-4 mt-6">
            <div className="bg-white bg-opacity-20 rounded-lg p-3">
              <div className="text-2xl font-bold mb-1">100%</div>
              <div className="text-sm opacity-90">Automatico</div>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-3">
              <div className="text-2xl font-bold mb-1">15min</div>
              <div className="text-sm opacity-90">Tempo Emissione</div>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-3">
              <div className="text-2xl font-bold mb-1">PDF</div>
              <div className="text-sm opacity-90">Formato Ufficiale</div>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-3">
              <div className="text-2xl font-bold mb-1">24/7</div>
              <div className="text-sm opacity-90">Accesso Download</div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}