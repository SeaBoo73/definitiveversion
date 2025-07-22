import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Phone, MessageCircle, FileText, Clock, Users, Star } from "lucide-react";

export default function AssistenzaProprietariPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Assistenza Proprietari
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Supporto dedicato 24/7 per i proprietari di imbarcazioni. Il nostro team è qui per aiutarti.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 text-center">
            <Phone className="h-12 w-12 text-ocean-blue mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-4">Hotline Dedicata</h3>
            <p className="text-gray-600 mb-4">
              Linea telefonica dedicata esclusivamente ai proprietari di imbarcazioni
            </p>
            <p className="text-2xl font-bold text-ocean-blue">+39 800 123 456</p>
            <p className="text-sm text-gray-500 mt-2">24/7 - Sempre disponibile</p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 text-center">
            <MessageCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-4">Assistente IA</h3>
            <p className="text-gray-600 mb-4">
              Consigli intelligenti e supporto automatizzato con IA
            </p>
            <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors" onClick={() => window.location.href = '/ia'}>
              Avvia IA
            </button>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 text-center">
            <FileText className="h-12 w-12 text-purple-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-4">Centro Guide</h3>
            <p className="text-gray-600 mb-4">
              Guide complete e FAQ per gestire al meglio la tua imbarcazione
            </p>
            <button className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors">
              Consulta Guide
            </button>
          </div>
        </div>

        <div className="space-y-12">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-semibold mb-6">Supporto Specializzato</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-medium mb-4">Account Manager Dedicato</h3>
                <p className="text-gray-600 mb-4">
                  Ogni proprietario ha un account manager personale che conosce la tua imbarcazione 
                  e le tue esigenze specifiche.
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li>• Ottimizzazione dei prezzi e disponibilità</li>
                  <li>• Consigli per migliorare l'attrattività</li>
                  <li>• Supporto per problematiche tecniche</li>
                  <li>• Assistenza con documentazione e assicurazioni</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-4">Team di Emergenza</h3>
                <p className="text-gray-600 mb-4">
                  In caso di emergenze o problemi durante i noleggi, il nostro team 
                  è pronto a intervenire immediatamente.
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li>• Assistenza tecnica h24</li>
                  <li>• Coordinamento con servizi di soccorso</li>
                  <li>• Gestione pratiche assicurative</li>
                  <li>• Comunicazione con clienti e autorità</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-semibold mb-6">Tempi di Risposta</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <Clock className="h-8 w-8 text-red-500 mx-auto mb-2" />
                <h3 className="font-semibold text-red-600">EMERGENZE</h3>
                <p className="text-2xl font-bold">&lt; 5 min</p>
                <p className="text-sm text-gray-600">Risposta immediata</p>
              </div>
              
              <div className="text-center">
                <Phone className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                <h3 className="font-semibold text-orange-600">URGENTE</h3>
                <p className="text-2xl font-bold">&lt; 30 min</p>
                <p className="text-sm text-gray-600">Problemi durante noleggi</p>
              </div>
              
              <div className="text-center">
                <MessageCircle className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                <h3 className="font-semibold text-yellow-600">NORMALE</h3>
                <p className="text-2xl font-bold">&lt; 2 ore</p>
                <p className="text-sm text-gray-600">Richieste generali</p>
              </div>
              
              <div className="text-center">
                <FileText className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <h3 className="font-semibold text-green-600">INFORMAZIONI</h3>
                <p className="text-2xl font-bold">&lt; 1 giorno</p>
                <p className="text-sm text-gray-600">Documentazione e guide</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-semibold mb-6">Cosa Dicono i Proprietari</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="flex items-center mb-4">
                  <Users className="w-6 h-6 text-ocean-blue mr-2" />
                  <div>
                    <h4 className="font-semibold">Marco R.</h4>
                    <p className="text-sm text-gray-600">Proprietario Beneteau 40</p>
                  </div>
                </div>
                <div className="flex mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700">
                  "Il supporto SeaGO è eccezionale. Il mio account manager mi ha aiutato 
                  ad aumentare del 40% i guadagni ottimizzando prezzi e disponibilità."
                </p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="flex items-center mb-4">
                  <Users className="w-6 h-6 text-ocean-blue mr-2" />
                  <div>
                    <h4 className="font-semibold">Sofia B.</h4>
                    <p className="text-sm text-gray-600">Proprietaria Jeanneau 42</p>
                  </div>
                </div>
                <div className="flex mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700">
                  "Quando ho avuto un problema tecnico durante un noleggio, il team di emergenza 
                  ha risolto tutto in 15 minuti. Professionalità incredibile!"
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-ocean-blue to-deep-navy text-white rounded-xl p-8 text-center">
            <h2 className="text-2xl font-semibold mb-4">Hai Bisogno di Aiuto?</h2>
            <p className="text-lg mb-8">
              Non esitare a contattarci. Il nostro team di esperti è sempre pronto ad aiutarti.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Phone className="h-8 w-8 mx-auto mb-2" />
                <h3 className="font-semibold mb-2">Chiama Ora</h3>
                <p>+39 800 123 456</p>
              </div>
              <div>
                <MessageCircle className="h-8 w-8 mx-auto mb-2" />
                <h3 className="font-semibold mb-2">Chat Live</h3>
                <p>Disponibile 24/7</p>
              </div>
              <div>
                <FileText className="h-8 w-8 mx-auto mb-2" />
                <h3 className="font-semibold mb-2">Email</h3>
                <p>proprietari@seago.it</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}