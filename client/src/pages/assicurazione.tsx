import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Shield, CheckCircle, Users, Phone } from "lucide-react";

export default function AssicurazionePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Assicurazione SeaBoo
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Naviga in sicurezza con la nostra copertura assicurativa completa per tutti i noleggi
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
            <Shield className="h-12 w-12 text-ocean-blue mb-6" />
            <h3 className="text-xl font-semibold mb-4">Copertura Completa</h3>
            <p className="text-gray-600">
              Tutti i noleggi sono coperti da assicurazione per danni, furto e responsabilità civile
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
            <CheckCircle className="h-12 w-12 text-green-600 mb-6" />
            <h3 className="text-xl font-semibold mb-4">Protezione Totale</h3>
            <p className="text-gray-600">
              Copertura fino a €500.000 per danni a terzi e assistenza 24/7 in caso di emergenza
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
            <Users className="h-12 w-12 text-blue-600 mb-6" />
            <h3 className="text-xl font-semibold mb-4">Per Tutti</h3>
            <p className="text-gray-600">
              Sia noleggiatori che proprietari sono protetti durante tutto il periodo di noleggio
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-12">
          <h2 className="text-2xl font-semibold mb-6">Cosa Copre la Nostra Assicurazione</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-3">Per il Noleggiatore</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Danni accidentali all'imbarcazione</li>
                <li>• Responsabilità civile verso terzi</li>
                <li>• Assistenza in caso di avarie</li>
                <li>• Rimpatrio d'emergenza</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-3">Per il Proprietario</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Protezione del bene contro danni</li>
                <li>• Copertura furto totale/parziale</li>
                <li>• Perdita di guadagno per riparazioni</li>
                <li>• Supporto legale incluso</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-ocean-blue text-white rounded-xl p-8 text-center">
          <Phone className="h-12 w-12 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-4">Assistenza 24/7</h2>
          <p className="text-lg mb-6">
            Il nostro team di supporto è sempre disponibile per assistenza immediata
          </p>
          <p className="text-xl font-semibold">+39 800 123 456</p>
        </div>
      </div>

      <Footer />
    </div>
  );
}