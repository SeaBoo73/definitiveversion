import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Lock, Shield, Eye, CheckCircle } from "lucide-react";

export default function SicurezzaPagamentiPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Sicurezza dei Pagamenti
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            La tua sicurezza è la nostra priorità. Scopri come proteggiamo i tuoi dati e pagamenti
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
            <Lock className="h-12 w-12 text-ocean-blue mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Crittografia SSL</h3>
            <p className="text-sm text-gray-600">256-bit SSL per tutti i pagamenti</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
            <Shield className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="font-semibold mb-2">PCI DSS</h3>
            <p className="text-sm text-gray-600">Conformità agli standard di sicurezza</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
            <Eye className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Monitoraggio 24/7</h3>
            <p className="text-sm text-gray-600">Controllo continuo delle transazioni</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
            <CheckCircle className="h-12 w-12 text-purple-600 mx-auto mb-4" />
            <h3 className="font-semibold mb-2">3D Secure</h3>
            <p className="text-sm text-gray-600">Autenticazione aggiuntiva</p>
          </div>
        </div>

        <div className="space-y-12">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-semibold mb-6">Come Proteggiamo i Tuoi Pagamenti</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-medium mb-4 flex items-center">
                  <Lock className="w-5 h-5 text-ocean-blue mr-2" />
                  Crittografia Avanzata
                </h3>
                <p className="text-gray-600 mb-4">
                  Utilizziamo la crittografia SSL 256-bit, lo stesso standard utilizzato dalle banche, 
                  per proteggere tutte le informazioni sensibili durante la trasmissione.
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li>• Dati della carta crittografati</li>
                  <li>• Connessione sicura certificata</li>
                  <li>• Nessun dato salvato sui nostri server</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-4 flex items-center">
                  <Shield className="w-5 h-5 text-green-600 mr-2" />
                  Standard PCI DSS
                </h3>
                <p className="text-gray-600 mb-4">
                  SeaGO è certificata PCI DSS Level 1, il più alto livello di conformità 
                  per la sicurezza dei dati delle carte di pagamento.
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li>• Audit di sicurezza regolari</li>
                  <li>• Controlli di accesso rigorosi</li>
                  <li>• Procedure di sicurezza certificate</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-semibold mb-6">Protezione dalle Frodi</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="text-lg font-medium mb-3">Rilevamento Automatico</h3>
                <p className="text-gray-600">
                  Sistema AI avanzato che analizza ogni transazione per identificare 
                  pattern sospetti in tempo reale.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-3">Verifica dell'Identità</h3>
                <p className="text-gray-600">
                  Controlli aggiuntivi per verificare l'identità dell'utente 
                  in caso di transazioni anomale.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-3">Blocco Immediato</h3>
                <p className="text-gray-600">
                  Sospensione automatica delle transazioni sospette con 
                  notifica immediata al cliente.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-ocean-blue to-deep-navy text-white rounded-xl p-8">
            <h2 className="text-2xl font-semibold mb-4">La Tua Protezione</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium mb-3">Garanzia di Rimborso</h3>
                <p className="mb-4">
                  In caso di transazioni fraudolente, garantiamo il rimborso completo 
                  entro 48 ore dalla segnalazione.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-3">Supporto Dedicato</h3>
                <p className="mb-4">
                  Team di sicurezza disponibile 24/7 per assistenza immediata 
                  in caso di problemi con i pagamenti.
                </p>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-blue-400">
              <p className="text-lg font-medium">Hotline Sicurezza: +39 800 123 456</p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}