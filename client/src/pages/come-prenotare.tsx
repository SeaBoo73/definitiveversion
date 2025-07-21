import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { MobileNavigation } from "@/components/mobile-navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Search, CreditCard, Ship, CheckCircle, Clock } from "lucide-react";
import { Link } from "wouter";

export default function ComePrenotarePage() {
  const steps = [
    {
      icon: <Search className="h-8 w-8 text-blue-600" />,
      title: "1. Cerca la tua barca",
      description: "Utilizza i filtri per trovare l'imbarcazione perfetta per le tue esigenze",
      details: [
        "Seleziona destinazione e date",
        "Scegli il tipo di imbarcazione",
        "Filtra per numero di ospiti",
        "Verifica disponibilità skipper"
      ]
    },
    {
      icon: <Calendar className="h-8 w-8 text-green-600" />,
      title: "2. Seleziona date e servizi",
      description: "Scegli le date del noleggio e i servizi aggiuntivi",
      details: [
        "Calendario con disponibilità in tempo reale",
        "Servizi extra: skipper, carburante, attrezzature",
        "Calcolo automatico del prezzo totale",
        "Verifica condizioni meteo"
      ]
    },
    {
      icon: <CreditCard className="h-8 w-8 text-purple-600" />,
      title: "3. Procedi al pagamento",
      description: "Completa la prenotazione con pagamento sicuro",
      details: [
        "Pagamenti protetti con Stripe",
        "Carta di credito, Apple Pay, Google Pay",
        "Ricevuta automatica via email",
        "Conferma istantanea della prenotazione"
      ]
    },
    {
      icon: <Ship className="h-8 w-8 text-orange-600" />,
      title: "4. Goditi la navigazione",
      description: "Ritira la barca e inizia la tua avventura",
      details: [
        "Check-in al porto designato",
        "Briefing di sicurezza incluso",
        "Assistenza 24/7 durante il noleggio",
        "Check-out semplice e veloce"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Come prenotare un'imbarcazione
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Prenotare con SeaGO è semplice e veloce. Segui questi 4 passaggi per la tua prossima avventura in mare.
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-8 mb-12">
          {steps.map((step, index) => (
            <Card key={index} className="overflow-hidden">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row items-start gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                      {step.icon}
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                      {step.title}
                    </h3>
                    <p className="text-lg text-gray-600 mb-4">
                      {step.description}
                    </p>
                    
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {step.details.map((detail, detailIndex) => (
                        <li key={detailIndex} className="flex items-center gap-2">
                          <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                          <span className="text-gray-700">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tips Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-6 w-6" />
              Consigli per una prenotazione perfetta
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Prima di prenotare</h4>
                <ul className="space-y-2 text-gray-600">
                  <li>• Verifica le tue competenze nautiche</li>
                  <li>• Controlla se serve la patente nautica</li>
                  <li>• Leggi attentamente le condizioni</li>
                  <li>• Considera l'assicurazione aggiuntiva</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Il giorno del noleggio</h4>
                <ul className="space-y-2 text-gray-600">
                  <li>• Arriva in anticipo per il check-in</li>
                  <li>• Porta documenti di identità validi</li>
                  <li>• Segui il briefing di sicurezza</li>
                  <li>• Controlla l'imbarcazione prima della partenza</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="text-center">
          <Link href="/">
            <Button size="lg" className="px-8">
              Inizia a cercare la tua barca
            </Button>
          </Link>
        </div>
      </div>

      <Footer />
      <MobileNavigation />
    </div>
  );
}