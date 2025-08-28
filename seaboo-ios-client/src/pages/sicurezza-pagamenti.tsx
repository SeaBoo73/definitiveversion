import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Lock, Eye, AlertTriangle, CheckCircle, CreditCard } from "lucide-react";

export default function SicurezzaPagamentiPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Sicurezza dei Pagamenti
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Come proteggiamo i tuoi dati e le tue transazioni su SeaBoo
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <Card className="text-center">
            <CardHeader>
              <CardTitle className="flex flex-col items-center">
                <Shield className="h-10 w-10 mb-3 text-green-600" />
                Crittografia SSL
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Tutti i dati vengono crittografati con tecnologia SSL 256-bit, lo stesso standard utilizzato dalle banche.
              </p>
              <div className="bg-green-50 p-3 rounded-lg">
                <p className="text-sm text-green-800 font-semibold">Certificato di Sicurezza Verificato</p>
              </div>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <CardTitle className="flex flex-col items-center">
                <Lock className="h-10 w-10 mb-3 text-blue-600" />
                PCI DSS Compliant
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Certificazione PCI DSS Level 1, il più alto livello di sicurezza per le transazioni con carte di credito.
              </p>
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm text-blue-800 font-semibold">Standard Internazionale</p>
              </div>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <CardTitle className="flex flex-col items-center">
                <Eye className="h-10 w-10 mb-3 text-purple-600" />
                Monitoraggio 24/7
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Sistema di rilevamento frodi attivo 24 ore su 24 per identificare e bloccare attività sospette.
              </p>
              <div className="bg-purple-50 p-3 rounded-lg">
                <p className="text-sm text-purple-800 font-semibold">Protezione Continua</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Come Proteggiamo i Tuoi Dati</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold mb-4 flex items-center">
                  <CreditCard className="h-5 w-5 mr-2 text-blue-600" />
                  Dati delle Carte di Credito
                </h4>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 mr-2 text-green-500 mt-0.5" />
                    <div>
                      <h5 className="font-medium">Tokenizzazione</h5>
                      <p className="text-sm text-gray-600">I dati della carta vengono sostituiti con token sicuri</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 mr-2 text-green-500 mt-0.5" />
                    <div>
                      <h5 className="font-medium">Non Memorizzazione</h5>
                      <p className="text-sm text-gray-600">Non salviamo mai i dati completi della carta</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 mr-2 text-green-500 mt-0.5" />
                    <div>
                      <h5 className="font-medium">Elaborazione Sicura</h5>
                      <p className="text-sm text-gray-600">Gestito direttamente da Stripe, leader mondiale</p>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-4 flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-green-600" />
                  Dati Personali
                </h4>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 mr-2 text-green-500 mt-0.5" />
                    <div>
                      <h5 className="font-medium">Crittografia End-to-End</h5>
                      <p className="text-sm text-gray-600">Tutti i dati sono crittografati in transito e a riposo</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 mr-2 text-green-500 mt-0.5" />
                    <div>
                      <h5 className="font-medium">Accesso Limitato</h5>
                      <p className="text-sm text-gray-600">Solo personale autorizzato può accedere ai dati</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 mr-2 text-green-500 mt-0.5" />
                    <div>
                      <h5 className="font-medium">Conformità GDPR</h5>
                      <p className="text-sm text-gray-600">Rispettiamo tutte le normative europee sulla privacy</p>
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
                <AlertTriangle className="h-6 w-6 mr-2 text-orange-600" />
                Rilevamento Frodi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-600 text-sm">
                  Il nostro sistema di sicurezza avanzato monitora ogni transazione per:
                </p>
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                    <span>Attività di spesa insolite</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                    <span>Tentativi di accesso sospetti</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                    <span>Transazioni da dispositivi non riconosciuti</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                    <span>Pattern di comportamento anomali</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lock className="h-6 w-6 mr-2 text-blue-600" />
                Autenticazione 3D Secure
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-600 text-sm">
                  Verifica aggiuntiva per transazioni ad alto valore attraverso:
                </p>
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                    <span>SMS con codice di verifica</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                    <span>App bancaria mobile</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                    <span>Biometria (Touch ID, Face ID)</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                    <span>Token di sicurezza hardware</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Cosa Fare in Caso di Problemi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-red-50 p-4 rounded-lg">
                <h4 className="font-semibold text-red-800 mb-2">🚨 Transazione Sospetta</h4>
                <p className="text-sm text-red-700 mb-3">
                  Se noti attività non autorizzate sul tuo account
                </p>
                <ul className="text-xs text-red-600 space-y-1">
                  <li>• Cambia immediatamente la password</li>
                  <li>• Contatta il supporto SeaBoo</li>
                  <li>• Avvisa la tua banca</li>
                </ul>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <h4 className="font-semibold text-orange-800 mb-2">⚠️ Pagamento Rifiutato</h4>
                <p className="text-sm text-orange-700 mb-3">
                  Se la transazione viene bloccata dal sistema
                </p>
                <ul className="text-xs text-orange-600 space-y-1">
                  <li>• Verifica i dati inseriti</li>
                  <li>• Controlla il saldo disponibile</li>
                  <li>• Contatta la tua banca</li>
                </ul>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">💬 Supporto Tecnico</h4>
                <p className="text-sm text-blue-700 mb-3">
                  Per qualsiasi dubbio sulla sicurezza
                </p>
                <ul className="text-xs text-blue-600 space-y-1">
                  <li>• Chat live 24/7</li>
                  <li>• Email: sicurezza@seaboo.com</li>
                  <li>• Tel: +39 06 1234 5678</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-lg p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">La Tua Sicurezza è la Nostra Priorità</h3>
          <p className="mb-6 opacity-90">
            Investiamo continuamente nelle migliori tecnologie di sicurezza per proteggere ogni transazione.
          </p>
          <div className="grid md:grid-cols-4 gap-4 mt-6">
            <div className="bg-white bg-opacity-20 rounded-lg p-3">
              <div className="text-2xl font-bold mb-1">99.9%</div>
              <div className="text-sm opacity-90">Uptime Garantito</div>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-3">
              <div className="text-2xl font-bold mb-1">0</div>
              <div className="text-sm opacity-90">Violazioni Dati</div>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-3">
              <div className="text-2xl font-bold mb-1">24/7</div>
              <div className="text-sm opacity-90">Monitoraggio</div>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-3">
              <div className="text-2xl font-bold mb-1">SSL</div>
              <div className="text-sm opacity-90">256-bit</div>
            </div>
          </div>
        </div>
      </div>

      <Footer />    
    </div>
  );
}