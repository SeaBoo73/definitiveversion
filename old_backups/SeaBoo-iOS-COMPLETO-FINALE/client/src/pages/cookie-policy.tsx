import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { ArrowLeft, Cookie, Settings, Eye, Shield } from "lucide-react";

export default function CookiePolicyPage() {
  const [location, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back to Home Button */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => setLocation("/")}
            className="text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Torna alla home
          </Button>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <Cookie className="h-16 w-16 text-blue-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Cookie Policy</h1>
          <p className="text-xl text-gray-600">
            Ultima modifica: 25 Luglio 2025 | Conforme al GDPR
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8 space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <Eye className="h-6 w-6 text-blue-600 mr-3" />
              1. Che cosa sono i Cookie
            </h2>
            <p className="text-gray-600 leading-relaxed">
              I cookie sono piccoli file di testo che vengono memorizzati sul tuo dispositivo 
              quando visiti SeaBoo. Ci aiutano a fornire un servizio migliore e personalizzato, 
              ricordando le tue preferenze e migliorando la tua esperienza di navigazione.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <Settings className="h-6 w-6 text-blue-600 mr-3" />
              2. Tipi di Cookie Utilizzati
            </h2>
            <div className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-green-900 mb-2">Cookie Essenziali</h3>
                <p className="text-green-800 text-sm mb-2">Necessari per il funzionamento del sito</p>
                <ul className="list-disc list-inside text-green-700 space-y-1 text-sm">
                  <li>Gestione delle sessioni di accesso</li>
                  <li>Carrello di prenotazione</li>
                  <li>Preferenze di lingua</li>
                  <li>Sicurezza e prevenzione frodi</li>
                </ul>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">Cookie di Performance</h3>
                <p className="text-blue-800 text-sm mb-2">Ci aiutano a migliorare il servizio</p>
                <ul className="list-disc list-inside text-blue-700 space-y-1 text-sm">
                  <li>Google Analytics (analisi traffico)</li>
                  <li>Monitoraggio velocità del sito</li>
                  <li>Statistiche di utilizzo</li>
                  <li>Ottimizzazione delle pagine</li>
                </ul>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-purple-900 mb-2">Cookie di Funzionalità</h3>
                <p className="text-purple-800 text-sm mb-2">Personalizzano la tua esperienza</p>
                <ul className="list-disc list-inside text-purple-700 space-y-1 text-sm">
                  <li>Preferenze di visualizzazione</li>
                  <li>Impostazioni della mappa</li>
                  <li>Filtri di ricerca salvati</li>
                  <li>Chat di assistenza</li>
                </ul>
              </div>

              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-orange-900 mb-2">Cookie di Marketing</h3>
                <p className="text-orange-800 text-sm mb-2">Solo con il tuo consenso</p>
                <ul className="list-disc list-inside text-orange-700 space-y-1 text-sm">
                  <li>Pubblicità personalizzata</li>
                  <li>Retargeting sui social media</li>
                  <li>Analisi del comportamento utente</li>
                  <li>Offerte personalizzate</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Cookie di Terze Parti</h2>
            <div className="space-y-4">
              <p className="text-gray-600">Utilizziamo servizi di terze parti che installano i loro cookie:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Google Analytics</h4>
                  <p className="text-gray-600 text-sm">Analisi del traffico e comportamento utenti</p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Stripe</h4>
                  <p className="text-gray-600 text-sm">Gestione sicura dei pagamenti</p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Google Maps</h4>
                  <p className="text-gray-600 text-sm">Visualizzazione mappe interattive</p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Social Media</h4>
                  <p className="text-gray-600 text-sm">Condivisione contenuti social</p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Gestione delle Preferenze</h2>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-start space-x-3">
                <Settings className="h-6 w-6 text-blue-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-blue-900 mb-2">Come Gestire i Cookie</h3>
                  <div className="space-y-3 text-blue-800 text-sm">
                    <p><strong>Browser:</strong> Puoi disabilitare i cookie dalle impostazioni del browser</p>
                    <p><strong>Sito web:</strong> Usa il banner cookie per scegliere le tue preferenze</p>
                    <p><strong>Opt-out:</strong> Alcuni cookie di terze parti hanno sistemi di opt-out dedicati</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Durata dei Cookie</h2>
            <div className="space-y-3 text-gray-600">
              <p><strong>Cookie di Sessione:</strong> Si eliminano quando chiudi il browser</p>
              <p><strong>Cookie Persistenti:</strong> Rimangono per un periodo determinato:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Cookie essenziali: Durata della sessione</li>
                <li>Cookie di preferenze: Fino a 1 anno</li>
                <li>Cookie di analytics: Fino a 2 anni</li>
                <li>Cookie di marketing: Fino a 1 anno (con consenso)</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <Shield className="h-6 w-6 text-blue-600 mr-3" />
              6. I Tuoi Diritti
            </h2>
            <div className="space-y-4 text-gray-600">
              <p>Hai il diritto di:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Essere informato sull'uso dei cookie</li>
                <li>Dare o rifiutare il consenso</li>
                <li>Modificare le tue preferenze in qualsiasi momento</li>
                <li>Eliminare i cookie dal tuo dispositivo</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Modifiche alla Cookie Policy</h2>
            <p className="text-gray-600 leading-relaxed">
              Potremmo aggiornare questa Cookie Policy periodicamente. 
              Le modifiche saranno comunicate attraverso il banner dei cookie 
              o tramite avviso sul sito web.
            </p>
          </section>

          <section className="border-t pt-8">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-start space-x-3">
                <Cookie className="h-6 w-6 text-blue-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-blue-900 mb-2">Contatti</h3>
                  <p className="text-blue-800 text-sm">
                    Per domande sui cookie o per gestire le tue preferenze:
                    <br />
                    <strong>Email:</strong> privacy@seaboo.it
                    <br />
                    <strong>Telefono:</strong> +39 06 1234 5678
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
}