import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { CreditCard, Shield, CheckCircle } from "lucide-react";

export default function MetodiPagamentoPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Metodi di Pagamento Accettati
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Paga in modo sicuro e conveniente con i nostri metodi di pagamento supportati
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 text-center">
            <CreditCard className="h-16 w-16 text-ocean-blue mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-4">Carte di Credito</h3>
            <ul className="space-y-2 text-gray-600">
              <li>• Visa</li>
              <li>• Mastercard</li>
              <li>• American Express</li>
              <li>• Maestro</li>
            </ul>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 text-center">
            <Shield className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-4">Portafogli Digitali</h3>
            <ul className="space-y-2 text-gray-600">
              <li>• PayPal</li>
              <li>• Apple Pay</li>
              <li>• Google Pay</li>
              <li>• Samsung Pay</li>
            </ul>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 text-center">
            <CheckCircle className="h-16 w-16 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-4">Bonifico Bancario</h3>
            <ul className="space-y-2 text-gray-600">
              <li>• SEPA</li>
              <li>• Bonifico istantaneo</li>
              <li>• Per prenotazioni anticipate</li>
              <li>• Senza commissioni extra</li>
            </ul>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-12">
          <h2 className="text-2xl font-semibold mb-6">Sicurezza dei Pagamenti</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-medium mb-4">Protezione SSL 256-bit</h3>
              <p className="text-gray-600 mb-6">
                Tutti i pagamenti sono protetti da crittografia SSL avanzata per garantire 
                la massima sicurezza delle tue informazioni finanziarie.
              </p>
              
              <h3 className="text-lg font-medium mb-4">Conformità PCI DSS</h3>
              <p className="text-gray-600">
                SeaGO è conforme agli standard PCI DSS per il trattamento sicuro 
                delle informazioni delle carte di credito.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-4">Protezione 3D Secure</h3>
              <p className="text-gray-600 mb-6">
                Supportiamo l'autenticazione 3D Secure per un ulteriore livello 
                di sicurezza sui pagamenti con carta.
              </p>
              
              <h3 className="text-lg font-medium mb-4">Monitoraggio Frodi</h3>
              <p className="text-gray-600">
                Sistema avanzato di rilevamento frodi che monitora tutte le 
                transazioni in tempo reale per la tua protezione.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-100 rounded-xl p-8">
          <h2 className="text-2xl font-semibold mb-4">Commissioni e Costi</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Nessuna Commissione Extra</h3>
              <p className="text-gray-600">
                Non applichiamo commissioni aggiuntive sui pagamenti. 
                Il prezzo che vedi è quello che paghi.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">Conversione Valuta</h3>
              <p className="text-gray-600">
                Per pagamenti in valute diverse dall'Euro, si applicano 
                i tassi di cambio standard della tua banca.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}