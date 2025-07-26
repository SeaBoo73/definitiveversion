import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export default function SicurezzaPagamentiPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-20 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">
              Sicurezza dei Pagamenti
            </h1>
            
            <div className="prose max-w-none">
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
                <h2 className="text-xl font-semibold text-green-900 mb-4">🔒 I Tuoi Pagamenti Sono Sicuri</h2>
                <p className="text-green-800">
                  SeaGO utilizza Stripe, uno dei processori di pagamento più sicuri al mondo, 
                  per gestire tutte le transazioni. I tuoi dati sono sempre protetti.
                </p>
              </div>
              
              <h2 className="text-xl font-semibold mb-4">Standard di Sicurezza</h2>
              
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Crittografia SSL</h3>
                  <p className="text-gray-600">
                    Tutti i dati sono trasmessi con crittografia SSL a 256-bit, 
                    lo stesso standard utilizzato dalle banche.
                  </p>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Conformità PCI DSS</h3>
                  <p className="text-gray-600">
                    Rispettiamo tutti gli standard PCI DSS per la sicurezza 
                    dei dati delle carte di pagamento.
                  </p>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Tokenizzazione</h3>
                  <p className="text-gray-600">
                    I dati delle carte sono tokenizzati e mai memorizzati 
                    sui nostri server.
                  </p>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">3D Secure</h3>
                  <p className="text-gray-600">
                    Supporto per l'autenticazione 3D Secure per una 
                    maggiore protezione.
                  </p>
                </div>
              </div>
              
              <h2 className="text-xl font-semibold mb-4">Protezione dalle Frodi</h2>
              <ul className="list-disc list-inside space-y-2">
                <li>Monitoraggio delle transazioni in tempo reale</li>
                <li>Algoritmi avanzati di rilevamento frodi</li>
                <li>Verifica dell'identità per transazioni sospette</li>
                <li>Rimborso completo in caso di transazioni fraudolente</li>
              </ul>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                <h3 className="font-semibold text-blue-900 mb-2">Hai Domande sulla Sicurezza?</h3>
                <p className="text-blue-800">
                  Il nostro team di supporto è disponibile 24/7 per rispondere 
                  a qualsiasi domanda sulla sicurezza dei pagamenti.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}