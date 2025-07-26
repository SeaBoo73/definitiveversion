import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export default function MetodiPagamentoPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-20 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">
              Metodi di Pagamento
            </h1>
            
            <div className="prose max-w-none">
              <h2 className="text-xl font-semibold mb-4">Metodi di Pagamento Accettati</h2>
              
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Carte di Credito/Debito</h3>
                  <ul className="text-gray-600 space-y-1">
                    <li>• Visa</li>
                    <li>• Mastercard</li>
                    <li>• American Express</li>
                    <li>• Maestro</li>
                  </ul>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Pagamenti Digitali</h3>
                  <ul className="text-gray-600 space-y-1">
                    <li>• Apple Pay</li>
                    <li>• Google Pay</li>
                    <li>• PayPal</li>
                  </ul>
                </div>
              </div>
              
              <h2 className="text-xl font-semibold mb-4">Come Funziona il Pagamento</h2>
              <ol className="list-decimal list-inside space-y-2">
                <li>Scegli la barca e le date desiderate</li>
                <li>Completa i tuoi dati di prenotazione</li>
                <li>Inserisci i dati di pagamento nel checkout sicuro</li>
                <li>Ricevi conferma immediata via email</li>
              </ol>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                <h3 className="font-semibold text-blue-900 mb-2">Sicurezza dei Pagamenti</h3>
                <p className="text-blue-800">
                  Tutti i pagamenti sono processati tramite Stripe, con crittografia SSL a 256-bit. 
                  I tuoi dati di pagamento sono protetti secondo gli standard PCI DSS.
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