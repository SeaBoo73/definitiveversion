import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { ArrowLeft, Shield, Eye, Lock, Database, UserCheck } from "lucide-react";

export default function PrivacyPolicyPage() {
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
          <Shield className="h-16 w-16 text-blue-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-xl text-gray-600">
            Ultima modifica: 25 Luglio 2025 | Conforme al GDPR
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8 space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <Eye className="h-6 w-6 text-blue-600 mr-3" />
              1. Introduzione
            </h2>
            <p className="text-gray-600 leading-relaxed">
              SeaGO rispetta la tua privacy e si impegna a proteggere i tuoi dati personali. 
              Questa Privacy Policy spiega come raccogliamo, utilizziamo e proteggiamo 
              le tue informazioni quando utilizzi la nostra piattaforma.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <Database className="h-6 w-6 text-blue-600 mr-3" />
              2. Dati che Raccogliamo
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Dati di Registrazione:</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>Nome e cognome</li>
                  <li>Indirizzo email</li>
                  <li>Numero di telefono</li>
                  <li>Data di nascita (per verificare l'età)</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Dati di Utilizzo:</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>Informazioni sulle ricerche e prenotazioni</li>
                  <li>Dati di navigazione e utilizzo della piattaforma</li>
                  <li>Informazioni del dispositivo e browser</li>
                  <li>Indirizzo IP e dati di geolocalizzazione (se autorizzata)</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Documenti:</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>Documento d'identità (per verifica)</li>
                  <li>Patente nautica (quando richiesta)</li>
                  <li>Documenti delle imbarcazioni (per proprietari)</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <UserCheck className="h-6 w-6 text-blue-600 mr-3" />
              3. Come Utilizziamo i Tuoi Dati
            </h2>
            <div className="space-y-3 text-gray-600">
              <p><strong>Fornitura del servizio:</strong> Per gestire registrazioni, prenotazioni e pagamenti</p>
              <p><strong>Comunicazione:</strong> Per inviarti conferme, aggiornamenti e assistenza</p>
              <p><strong>Sicurezza:</strong> Per verificare l'identità e prevenire frodi</p>
              <p><strong>Miglioramento:</strong> Per analizzare l'utilizzo e migliorare la piattaforma</p>
              <p><strong>Marketing:</strong> Per inviarti offerte personalizzate (solo con il tuo consenso)</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Base Giuridica del Trattamento</h2>
            <div className="space-y-3 text-gray-600">
              <p><strong>Esecuzione del contratto:</strong> Per fornire i servizi richiesti</p>
              <p><strong>Interesse legittimo:</strong> Per la sicurezza e il miglioramento del servizio</p>
              <p><strong>Consenso:</strong> Per marketing e comunicazioni promozionali</p>
              <p><strong>Obbligo legale:</strong> Per rispettare normative fiscali e di sicurezza</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Condivisione dei Dati</h2>
            <div className="space-y-4 text-gray-600">
              <p>Non vendiamo mai i tuoi dati personali. Condividiamo informazioni solo quando necessario:</p>
              <ul className="list-disc list-inside space-y-1">
                <li><strong>Con proprietari/clienti:</strong> Dati necessari per la prenotazione</li>
                <li><strong>Con fornitori di servizi:</strong> Stripe per pagamenti, servizi cloud sicuri</li>
                <li><strong>Per obblighi legali:</strong> Se richiesto dalle autorità competenti</li>
                <li><strong>Per sicurezza:</strong> Per prevenire frodi e attività illegali</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <Lock className="h-6 w-6 text-blue-600 mr-3" />
              6. Sicurezza dei Dati
            </h2>
            <div className="space-y-4">
              <p className="text-gray-600">
                Implementiamo misure di sicurezza appropriate per proteggere i tuoi dati:
              </p>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <ul className="list-disc list-inside text-green-800 space-y-1">
                  <li>Crittografia SSL/TLS per tutte le comunicazioni</li>
                  <li>Hash sicuro delle password</li>
                  <li>Accesso limitato ai dati su base need-to-know</li>
                  <li>Monitoraggio continuo per attività sospette</li>
                  <li>Backup regolari e sicuri</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. I Tuoi Diritti (GDPR)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <p className="font-semibold text-gray-900">Hai il diritto di:</p>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>Accedere ai tuoi dati</li>
                  <li>Rettificare dati inesatti</li>
                  <li>Cancellare i tuoi dati</li>
                  <li>Limitare il trattamento</li>
                </ul>
              </div>
              <div className="space-y-3">
                <p className="font-semibold text-gray-900">Inoltre puoi:</p>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>Portabilità dei dati</li>
                  <li>Opporti al trattamento</li>
                  <li>Revocare il consenso</li>
                  <li>Presentare reclamo</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Cookie e Tecnologie Simili</h2>
            <div className="space-y-4 text-gray-600">
              <p>Utilizziamo cookie per:</p>
              <ul className="list-disc list-inside space-y-1">
                <li><strong>Essenziali:</strong> Per il funzionamento della piattaforma</li>
                <li><strong>Analitici:</strong> Per comprendere l'utilizzo del sito</li>
                <li><strong>Preferenze:</strong> Per ricordare le tue impostazioni</li>
              </ul>
              <p>Puoi gestire le preferenze dei cookie nelle impostazioni del browser.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Conservazione dei Dati</h2>
            <div className="space-y-3 text-gray-600">
              <p>Conserviamo i tuoi dati solo per il tempo necessario:</p>
              <ul className="list-disc list-inside space-y-1">
                <li><strong>Account attivi:</strong> Finché utilizzi il servizio</li>
                <li><strong>Dati di prenotazione:</strong> 7 anni per obblighi fiscali</li>
                <li><strong>Dati di marketing:</strong> Fino alla revoca del consenso</li>
                <li><strong>Log di sicurezza:</strong> 12 mesi</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Modifiche alla Privacy Policy</h2>
            <p className="text-gray-600 leading-relaxed">
              Possiamo aggiornare questa Privacy Policy periodicamente. 
              Ti notificheremo eventuali modifiche significative via email 
              o tramite avviso sulla piattaforma.
            </p>
          </section>

          <section className="border-t pt-8">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-start space-x-3">
                <Shield className="h-6 w-6 text-blue-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-blue-900 mb-2">Data Protection Officer</h3>
                  <p className="text-blue-800 text-sm">
                    Per esercitare i tuoi diritti o per domande sulla privacy, contatta il nostro DPO:
                    <br />
                    <strong>Email:</strong> privacy@seago.it
                    <br />
                    <strong>Indirizzo:</strong> Via del Porto 123, 00121 Roma
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