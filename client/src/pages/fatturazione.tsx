import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { FileText, Download, CreditCard, Calendar } from "lucide-react";

export default function FatturazionePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Fatturazione
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Gestisci le tue fatture e i documenti fiscali in modo semplice e trasparente
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
            <FileText className="h-12 w-12 text-ocean-blue mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Fatture Digitali</h3>
            <p className="text-sm text-gray-600">Formato XML per PA e privati</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
            <Download className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Download Immediato</h3>
            <p className="text-sm text-gray-600">Scarica subito dopo il pagamento</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
            <CreditCard className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="font-semibold mb-2">IVA Inclusa</h3>
            <p className="text-sm text-gray-600">Tutti i prezzi sono IVA inclusa</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
            <Calendar className="h-12 w-12 text-purple-600 mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Storico Completo</h3>
            <p className="text-sm text-gray-600">Accesso a tutte le fatture passate</p>
          </div>
        </div>

        <div className="space-y-12">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-semibold mb-6">Come Funziona la Fatturazione</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <div className="bg-ocean-blue text-white w-8 h-8 rounded-full flex items-center justify-center font-semibold mb-4">1</div>
                <h3 className="text-lg font-medium mb-3">Prenotazione</h3>
                <p className="text-gray-600">
                  Al momento della prenotazione, ricevi una conferma con i dettagli del servizio e l'importo.
                </p>
              </div>
              <div>
                <div className="bg-ocean-blue text-white w-8 h-8 rounded-full flex items-center justify-center font-semibold mb-4">2</div>
                <h3 className="text-lg font-medium mb-3">Pagamento</h3>
                <p className="text-gray-600">
                  Dopo il pagamento confermato, generiamo automaticamente la fattura elettronica.
                </p>
              </div>
              <div>
                <div className="bg-ocean-blue text-white w-8 h-8 rounded-full flex items-center justify-center font-semibold mb-4">3</div>
                <h3 className="text-lg font-medium mb-3">Invio</h3>
                <p className="text-gray-600">
                  La fattura viene inviata via email e tramessa al Sistema di Interscambio se richiesto.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-semibold mb-6">Dettagli Fatturazione</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-medium mb-4">Per Privati</h3>
                <ul className="space-y-3 text-gray-600">
                  <li>• Fattura elettronica in formato XML</li>
                  <li>• Invio automatico all'Agenzia delle Entrate</li>
                  <li>• Copia PDF scaricabile dal tuo profilo</li>
                  <li>• Dettaglio completo dei servizi utilizzati</li>
                  <li>• IVA 22% su tutti i servizi</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-4">Per Aziende/PA</h3>
                <ul className="space-y-3 text-gray-600">
                  <li>• Fattura B2B con Codice Univoco/PEC</li>
                  <li>• Possibilità di split payment per PA</li>
                  <li>• Reverse charge per operatori EU</li>
                  <li>• Codici CIG/CUP per gare pubbliche</li>
                  <li>• Termini di pagamento personalizzabili</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-semibold mb-6">Gestione Fiscale</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-medium mb-4">Documenti Disponibili</h3>
                <div className="space-y-3">
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <FileText className="w-5 h-5 text-ocean-blue mr-3" />
                    <span>Fattura elettronica XML</span>
                  </div>
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <Download className="w-5 h-5 text-green-600 mr-3" />
                    <span>Copia analogica PDF</span>
                  </div>
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <FileText className="w-5 h-5 text-blue-600 mr-3" />
                    <span>Ricevuta di consegna SDI</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-4">Supporto Contabile</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Conservazione digitale a norma</li>
                  <li>• Esportazione dati per software contabili</li>
                  <li>• Assistenza per dichiarazioni fiscali</li>
                  <li>• Report periodici per amministratori</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-ocean-blue to-deep-navy text-white rounded-xl p-8">
            <h2 className="text-2xl font-semibold mb-4">Hai Domande sulla Fatturazione?</h2>
            <p className="text-lg mb-6">
              Il nostro team amministrativo è a disposizione per aiutarti con qualsiasi questione fiscale.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-2">Supporto Amministrativo</h3>
                <p>amministrazione@seago.it</p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Telefono</h3>
                <p>+39 800 123 456 (Lun-Ven 9-18)</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}