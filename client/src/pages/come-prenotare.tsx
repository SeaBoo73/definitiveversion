import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export default function ComePrenotarePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-20 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">
              Come Prenotare una Barca
            </h1>
            
            <div className="prose max-w-none">
              <h2 className="text-xl font-semibold mb-4">Guida Passo-Passo</h2>
              
              <div className="space-y-6">
                <div className="flex gap-4 p-4 bg-blue-50 rounded-lg">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Cerca la Barca Perfetta</h3>
                    <p className="text-gray-600">
                      Utilizza i filtri di ricerca per trovare la barca ideale: tipo, 
                      dimensioni, località, date disponibili e servizi inclusi.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4 p-4 bg-green-50 rounded-lg">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Seleziona Date e Orari</h3>
                    <p className="text-gray-600">
                      Scegli le date di noleggio e gli orari di ritiro/riconsegna. 
                      Controlla la disponibilità in tempo reale.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4 p-4 bg-yellow-50 rounded-lg">
                  <div className="flex-shrink-0 w-8 h-8 bg-yellow-500 text-white rounded-full flex items-center justify-center font-bold">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Aggiungi Servizi Extra</h3>
                    <p className="text-gray-600">
                      Personalizza la tua esperienza con servizi aggiuntivi come 
                      skipper professionale, carburante incluso o attrezzature extra.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4 p-4 bg-purple-50 rounded-lg">
                  <div className="flex-shrink-0 w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold">
                    4
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Completa i Tuoi Dati</h3>
                    <p className="text-gray-600">
                      Inserisci i dati personali e i documenti richiesti. 
                      Verifica che tutti i partecipanti abbiano i documenti necessari.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4 p-4 bg-red-50 rounded-lg">
                  <div className="flex-shrink-0 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center font-bold">
                    5
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Effettua il Pagamento</h3>
                    <p className="text-gray-600">
                      Procedi al checkout sicuro e completa il pagamento con carta 
                      di credito, PayPal o altri metodi disponibili.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
                <h3 className="font-semibold text-blue-900 mb-2">✅ Conferma Immediata</h3>
                <p className="text-blue-800">
                  Riceverai immediatamente una email di conferma con tutti i dettagli 
                  della prenotazione e le informazioni per il check-in.
                </p>
              </div>
              
              <div className="bg-gray-50 border rounded-lg p-4 mt-6">
                <h3 className="font-semibold mb-2">💡 Consigli Utili</h3>
                <ul className="text-gray-600 space-y-1">
                  <li>• Prenota in anticipo per migliore disponibilità</li>
                  <li>• Controlla le condizioni meteo prima della partenza</li>
                  <li>• Porta documenti di identità e patente nautica se richiesta</li>
                  <li>• Arrivi 30 minuti prima dell'orario di ritiro</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}