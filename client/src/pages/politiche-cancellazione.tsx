import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { MobileNavigation } from "@/components/mobile-navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Euro, AlertTriangle, CheckCircle } from "lucide-react";

export default function PoliticheCancellazionePage() {
  const policies = [
    {
      type: "Flessibile",
      badge: "Più popolare",
      color: "bg-green-100 text-green-800",
      icon: <CheckCircle className="h-6 w-6 text-green-600" />,
      description: "Cancellazione gratuita fino a 24 ore prima",
      rules: [
        "Rimborso del 100% fino a 24 ore prima del noleggio",
        "Rimborso del 50% tra 24 e 12 ore prima",
        "Nessun rimborso nelle ultime 12 ore",
        "Condizioni meteo estreme: rimborso completo"
      ]
    },
    {
      type: "Moderata",
      badge: "Equilibrata",
      color: "bg-blue-100 text-blue-800",
      icon: <Clock className="h-6 w-6 text-blue-600" />,
      description: "Cancellazione gratuita fino a 5 giorni prima",
      rules: [
        "Rimborso del 100% fino a 5 giorni prima del noleggio",
        "Rimborso del 75% tra 5 e 2 giorni prima",
        "Rimborso del 25% tra 2 giorni e 24 ore prima",
        "Nessun rimborso nelle ultime 24 ore"
      ]
    },
    {
      type: "Rigorosa",
      badge: "Prezzo ridotto",
      color: "bg-red-100 text-red-800",
      icon: <AlertTriangle className="h-6 w-6 text-red-600" />,
      description: "Cancellazione gratuita fino a 14 giorni prima",
      rules: [
        "Rimborso del 100% fino a 14 giorni prima del noleggio",
        "Rimborso del 50% tra 14 e 7 giorni prima",
        "Nessun rimborso negli ultimi 7 giorni",
        "Eccezioni solo per emergenze documentate"
      ]
    }
  ];

  const specialConditions = [
    {
      title: "Condizioni meteorologiche avverse",
      description: "In caso di condizioni meteo pericolose certificate dalle autorità marittime",
      action: "Rimborso del 100% o spostamento gratuito della prenotazione"
    },
    {
      title: "Problemi tecnici dell'imbarcazione",
      description: "Guasti o problemi di sicurezza dell'imbarcazione non prevedibili",
      action: "Rimborso completo o imbarcazione sostitutiva equivalente"
    },
    {
      title: "Emergenze sanitarie",
      description: "Ricovero ospedaliero o gravi problemi di salute documentati",
      action: "Rimborso del 100% con documentazione medica"
    },
    {
      title: "Restrizioni governative",
      description: "Chiusure o limitazioni imposte dalle autorità competenti",
      action: "Rimborso completo o credito per prenotazione futura"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Politiche di Cancellazione
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Informazioni complete sulle nostre politiche di cancellazione e rimborso per garantire trasparenza e flessibilità.
          </p>
        </div>

        {/* Alert */}
        <Alert className="mb-8">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Importante:</strong> La politica di cancellazione è specificata in ogni annuncio prima della prenotazione. 
            Leggi sempre attentamente i termini prima di confermare.
          </AlertDescription>
        </Alert>

        {/* Policies Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {policies.map((policy, index) => (
            <Card key={index} className="relative overflow-hidden">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-3">
                  {policy.icon}
                  <Badge className={policy.color}>
                    {policy.badge}
                  </Badge>
                </div>
                <CardTitle className="text-xl">{policy.type}</CardTitle>
                <p className="text-gray-600">{policy.description}</p>
              </CardHeader>
              
              <CardContent>
                <ul className="space-y-3">
                  {policy.rules.map((rule, ruleIndex) => (
                    <li key={ruleIndex} className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-sm text-gray-700">{rule}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* How to Cancel */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-6 w-6" />
              Come cancellare una prenotazione
            </CardTitle>
          </CardHeader>
          
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Procedura di cancellazione</h4>
                <ol className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">1</span>
                    <span>Accedi alla tua dashboard cliente</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">2</span>
                    <span>Trova la prenotazione da cancellare</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">3</span>
                    <span>Clicca su "Cancella prenotazione"</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">4</span>
                    <span>Conferma la cancellazione e ricevi l'email di conferma</span>
                  </li>
                </ol>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Tempi di rimborso</h4>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <Euro className="h-4 w-4 text-green-600" />
                    <span><strong>Carta di credito:</strong> 3-5 giorni lavorativi</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Euro className="h-4 w-4 text-green-600" />
                    <span><strong>Bonifico bancario:</strong> 5-7 giorni lavorativi</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Euro className="h-4 w-4 text-green-600" />
                    <span><strong>PayPal:</strong> 1-3 giorni lavorativi</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Euro className="h-4 w-4 text-green-600" />
                    <span><strong>Credito SeaGO:</strong> Immediato</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Special Conditions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-6 w-6" />
              Condizioni speciali per rimborso completo
            </CardTitle>
          </CardHeader>
          
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {specialConditions.map((condition, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">{condition.title}</h4>
                  <p className="text-gray-600 text-sm mb-3">{condition.description}</p>
                  <div className="bg-green-50 text-green-800 text-sm p-2 rounded">
                    <strong>Azione:</strong> {condition.action}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
      <MobileNavigation />
    </div>
  );
}