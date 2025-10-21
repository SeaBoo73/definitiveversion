import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { MobileNavigation } from "@/components/mobile-navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Euro, Clock, CheckCircle, CreditCard, RefreshCw, AlertCircle } from "lucide-react";

export default function RimborsiPage() {
  const refundMethods = [
    {
      method: "Carta di Credito",
      icon: <CreditCard className="h-6 w-6 text-blue-600" />,
      time: "3-5 giorni lavorativi",
      description: "Rimborso diretto sulla carta utilizzata per il pagamento"
    },
    {
      method: "PayPal",
      icon: <Euro className="h-6 w-6 text-blue-600" />,
      time: "1-3 giorni lavorativi",
      description: "Rimborso immediato sul conto PayPal"
    },
    {
      method: "Bonifico Bancario",
      icon: <RefreshCw className="h-6 w-6 text-blue-600" />,
      time: "5-7 giorni lavorativi",
      description: "Bonifico diretto sul conto corrente indicato"
    },
    {
      method: "Credito SeaBoo",
      icon: <CheckCircle className="h-6 w-6 text-green-600" />,
      time: "Immediato",
      description: "Credito utilizzabile per future prenotazioni"
    }
  ];

  const refundScenarios = [
    {
      title: "Cancellazione entro i termini",
      percentage: "Secondo politica",
      description: "Rimborso in base alla politica di cancellazione dell'annuncio",
      details: [
        "Flessibile: 100% fino a 24h prima",
        "Moderata: 100% fino a 5 giorni prima",
        "Rigorosa: 100% fino a 14 giorni prima"
      ]
    },
    {
      title: "Condizioni meteo avverse",
      percentage: "100%",
      description: "Maltempo certificato dalle autorità marittime",
      details: [
        "Avviso di burrasca o mareggiata",
        "Divieto di navigazione",
        "Condizioni di sicurezza compromesse",
        "Porti chiusi per allerta meteo"
      ]
    },
    {
      title: "Problemi tecnici imbarcazione",
      percentage: "100%",
      description: "Guasti o malfunzionamenti non prevedibili",
      details: [
        "Avaria motore il giorno del noleggio",
        "Problemi di sicurezza dell'imbarcazione",
        "Mancanza documenti di navigazione",
        "Imbarcazione non conforme all'annuncio"
      ]
    },
    {
      title: "Emergenze documentate",
      percentage: "100%",
      description: "Situazioni di emergenza con documentazione",
      details: [
        "Ricovero ospedaliero improvviso",
        "Lutto in famiglia",
        "Emergenze sanitarie certificate",
        "Restrizioni governative di viaggio"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Politica Rimborsi
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Informazioni complete sui rimborsi SeaBoo. La nostra priorità è garantire un servizio trasparente e giusto per tutti i nostri utenti.
          </p>
        </div>

        {/* Important Notice */}
        <Alert className="mb-8">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Nota importante:</strong> I rimborsi vengono elaborati automaticamente secondo la politica di cancellazione specificata in ogni annuncio. 
            Per casi speciali, contatta il nostro supporto clienti.
          </AlertDescription>
        </Alert>

        {/* Refund Methods */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Euro className="h-6 w-6" />
              Metodi di Rimborso
            </CardTitle>
          </CardHeader>
          
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {refundMethods.map((method, index) => (
                <div key={index} className="text-center p-4 border rounded-lg">
                  <div className="flex justify-center mb-3">
                    {method.icon}
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">{method.method}</h4>
                  <div className="flex items-center justify-center gap-1 mb-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium text-blue-600">{method.time}</span>
                  </div>
                  <p className="text-sm text-gray-600">{method.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Refund Scenarios */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-6 w-6" />
              Scenari di Rimborso
            </CardTitle>
          </CardHeader>
          
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {refundScenarios.map((scenario, index) => (
                <div key={index} className="border rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-gray-900">{scenario.title}</h4>
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                      {scenario.percentage}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-4">{scenario.description}</p>
                  
                  <ul className="space-y-2">
                    {scenario.details.map((detail, detailIndex) => (
                      <li key={detailIndex} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-sm text-gray-700">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Refund Process */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Processo di Rimborso Automatico</CardTitle>
            </CardHeader>
            
            <CardContent>
              <ol className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">1</span>
                  <div>
                    <h4 className="font-medium">Cancellazione prenotazione</h4>
                    <p className="text-sm text-gray-600">Il sistema calcola automaticamente l'importo del rimborso</p>
                  </div>
                </li>
                
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">2</span>
                  <div>
                    <h4 className="font-medium">Elaborazione rimborso</h4>
                    <p className="text-sm text-gray-600">Il rimborso viene processato entro 24 ore</p>
                  </div>
                </li>
                
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">3</span>
                  <div>
                    <h4 className="font-medium">Notifica email</h4>
                    <p className="text-sm text-gray-600">Ricevi conferma via email con i dettagli del rimborso</p>
                  </div>
                </li>
                
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">4</span>
                  <div>
                    <h4 className="font-medium">Accredito</h4>
                    <p className="text-sm text-gray-600">L'importo viene accreditato secondo i tempi del metodo scelto</p>
                  </div>
                </li>
              </ol>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Rimborsi Speciali</CardTitle>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <h4 className="font-medium text-yellow-800 mb-2">Richieste manuali</h4>
                  <p className="text-sm text-yellow-700">
                    Per situazioni eccezionali non coperte dalle politiche automatiche, 
                    contatta il supporto con documentazione appropriata.
                  </p>
                </div>
                
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="font-medium text-green-800 mb-2">Credito SeaBoo</h4>
                  <p className="text-sm text-green-700">
                    Scegli il credito SeaBoo per rimborsi immediati e ottieni 
                    un bonus del 5% sull'importo per future prenotazioni.
                  </p>
                </div>
                
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-blue-800 mb-2">Assicurazione viaggio</h4>
                  <p className="text-sm text-blue-700">
                    Considera l'assicurazione viaggio per copertura aggiuntiva 
                    su cancellazioni dovute a emergenze personali.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contact Support */}
        <Card>
          <CardContent className="text-center py-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Hai bisogno di assistenza per un rimborso?
            </h3>
            <p className="text-gray-600 mb-6">
              Il nostro team di supporto è sempre disponibile per aiutarti con richieste speciali o domande sui rimborsi.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-blue-600 hover:bg-blue-700">
                Contatta Supporto
              </Button>
              <Button variant="outline">
                Visualizza le tue prenotazioni
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
      <MobileNavigation />
    </div>
  );
}