import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { ArrowLeft, FileText, Shield, AlertCircle } from "lucide-react";

export default function CondizioniServizioPage() {
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
          <FileText className="h-16 w-16 text-blue-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Termini e Condizioni</h1>
          <p className="text-xl text-gray-600">
            Ultima modifica: 25 Luglio 2025
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8 space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduzione</h2>
            <p className="text-gray-600 leading-relaxed">
              Benvenuto su SeaBoo, la piattaforma italiana per il noleggio di imbarcazioni. 
              Utilizzando i nostri servizi, accetti di essere vincolato da questi termini e condizioni. 
              Se non accetti questi termini, non utilizzare i nostri servizi.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Definizioni</h2>
            <ul className="space-y-2 text-gray-600">
              <li><strong>SeaBoo:</strong> La piattaforma e il servizio fornito</li>
              <li><strong>Utente:</strong> Qualsiasi persona che utilizza la piattaforma</li>
              <li><strong>Proprietario:</strong> Chi mette a disposizione imbarcazioni</li>
              <li><strong>Cliente:</strong> Chi prenota un'imbarcazione</li>
              <li><strong>Imbarcazione:</strong> Qualsiasi mezzo nautico disponibile sulla piattaforma</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Utilizzo della Piattaforma</h2>
            <div className="space-y-4 text-gray-600">
              <p>
                SeaBoo fornisce una piattaforma tecnologica che connette proprietari di imbarcazioni 
                con persone interessate a noleggiarle. Non siamo proprietari delle imbarcazioni 
                né forniamo direttamente servizi di noleggio.
              </p>
              <p>
                Gli utenti devono avere almeno 18 anni e fornire informazioni accurate e complete 
                durante la registrazione.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Prenotazioni e Pagamenti</h2>
            <div className="space-y-4 text-gray-600">
              <p>
                Le prenotazioni sono soggette alla disponibilità e alla conferma del proprietario. 
                I pagamenti vengono elaborati in modo sicuro tramite Stripe.
              </p>
              <p>
                SeaBoo applica una commissione del 15% su ogni transazione per mantenere 
                e migliorare la piattaforma.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Responsabilità e Sicurezza</h2>
            <div className="space-y-4 text-gray-600">
              <p>
                I proprietari sono responsabili della manutenzione, sicurezza e conformità 
                alle normative delle loro imbarcazioni. I clienti devono utilizzare 
                le imbarcazioni in modo responsabile e conforme alle leggi.
              </p>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <p className="font-semibold text-yellow-800">Importante</p>
                    <p className="text-yellow-700 text-sm">
                      Tutte le imbarcazioni devono essere coperte da assicurazione valida. 
                      Gli utenti sono tenuti a rispettare le normative nautiche vigenti.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Cancellazioni e Rimborsi</h2>
            <div className="space-y-4 text-gray-600">
              <p>
                Le politiche di cancellazione variano per ogni imbarcazione e sono 
                stabilite dal proprietario. I rimborsi sono elaborati secondo 
                la politica specifica della prenotazione.
              </p>
              <p>
                SeaBoo si riserva il diritto di cancellare prenotazioni in caso 
                di problemi di sicurezza o violazioni dei termini.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Limitazione di Responsabilità</h2>
            <div className="space-y-4 text-gray-600">
              <p>
                SeaBoo agisce come intermediario e non è responsabile per danni, 
                incidenti o problemi che possono verificarsi durante l'utilizzo 
                delle imbarcazioni.
              </p>
              <p>
                La nostra responsabilità è limitata all'importo delle commissioni 
                ricevute per la specifica transazione.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Privacy e Dati Personali</h2>
            <p className="text-gray-600 leading-relaxed">
              Il trattamento dei dati personali è regolato dalla nostra Privacy Policy, 
              conforme al GDPR e alle normative italiane sulla protezione dei dati.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Modifiche ai Termini</h2>
            <p className="text-gray-600 leading-relaxed">
              SeaBoo si riserva il diritto di modificare questi termini. 
              Gli utenti saranno notificati di eventuali modifiche significative 
              e dovranno accettare i nuovi termini per continuare a utilizzare il servizio.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Legge Applicabile</h2>
            <p className="text-gray-600 leading-relaxed">
              Questi termini sono regolati dalla legge italiana. 
              Eventuali controversie saranno risolte dai tribunali competenti italiani.
            </p>
          </section>

          <section className="border-t pt-8">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-start space-x-3">
                <Shield className="h-6 w-6 text-blue-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-blue-900 mb-2">Contatti</h3>
                  <p className="text-blue-800 text-sm">
                    Per domande sui termini e condizioni, contattaci all'indirizzo: 
                    <br />
                    <strong>legal@seaboo.it</strong>
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