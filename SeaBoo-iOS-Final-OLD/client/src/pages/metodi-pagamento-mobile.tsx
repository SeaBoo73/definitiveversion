import { useState } from "react";
import { ArrowLeft, CreditCard, Smartphone, Globe, Plus, Shield, Lock } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

export default function MetodiPagamentoMobile() {
  const [selectedMethod, setSelectedMethod] = useState<string>("");
  const [savedCards] = useState([
    {
      id: "card_1",
      type: "visa",
      last4: "4242",
      expiry: "12/25",
      isDefault: true
    }
  ]);

  const paymentMethods = [
    {
      id: "card",
      title: "Carta di Credito/Debito",
      description: "Visa, Mastercard, American Express",
      icon: CreditCard,
      popular: true,
      available: true
    },
    {
      id: "applepay",
      title: "Apple Pay",
      description: "Pagamento rapido con Touch ID/Face ID",
      icon: Smartphone,
      popular: false,
      available: true
    },
    {
      id: "googlepay",
      title: "Google Pay",
      description: "Pagamento con il tuo account Google",
      icon: Smartphone,
      popular: false,
      available: true
    },
    {
      id: "paypal",
      title: "PayPal",
      description: "Paga con il tuo conto PayPal",
      icon: Globe,
      popular: true,
      available: true
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center">
            <Link href="/profilo">
              <Button variant="ghost" size="icon" className="mr-3" data-testid="button-back">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="font-semibold text-lg">Metodi di Pagamento</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-md mx-auto p-4 space-y-6">
        {/* Info Card */}
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-blue-600" />
              <CardTitle className="text-blue-900 text-base">Pagamenti Sicuri con Stripe</CardTitle>
            </div>
            <CardDescription className="text-blue-700">
              I tuoi pagamenti sono protetti dai più alti standard di sicurezza internazionali. Potrai pagare al momento della prenotazione.
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Saved Payment Methods */}
        {savedCards.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-medium text-gray-900">Metodi Salvati</h2>
              <Button variant="outline" size="sm" data-testid="button-add-card">
                <Plus className="h-4 w-4 mr-1" />
                Aggiungi
              </Button>
            </div>
            
            {savedCards.map((card) => (
              <Card key={card.id} className="border-gray-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <CreditCard className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-medium text-gray-900">
                            •••• •••• •••• {card.last4}
                          </h3>
                          {card.isDefault && (
                            <Badge variant="secondary" className="text-xs">
                              Predefinita
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">
                          {card.type.toUpperCase()} • Scade {card.expiry}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" data-testid={`button-edit-card-${card.id}`}>
                      Modifica
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Available Payment Methods */}
        <div className="space-y-3">
          <h2 className="font-medium text-gray-900">Metodi Disponibili</h2>
          <p className="text-sm text-gray-600">
            Scegli come vuoi pagare i tuoi noleggi. Potrai selezionare il metodo preferito al momento della prenotazione.
          </p>
          
          {paymentMethods.map((method) => {
            const IconComponent = method.icon;
            return (
              <Card 
                key={method.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedMethod === method.id ? 'ring-2 ring-blue-500 border-blue-500' : ''
                } ${!method.available ? 'opacity-50' : ''}`}
                onClick={() => method.available && setSelectedMethod(method.id)}
                data-testid={`card-payment-method-${method.id}`}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        <IconComponent className="h-5 w-5 text-gray-600" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-medium text-gray-900">{method.title}</h3>
                          {method.popular && (
                            <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                              Popolare
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">{method.description}</p>
                      </div>
                    </div>
                    {method.available && (
                      <div className={`w-4 h-4 rounded-full border-2 ${
                        selectedMethod === method.id 
                          ? 'bg-blue-500 border-blue-500' 
                          : 'border-gray-300'
                      }`}>
                        {selectedMethod === method.id && (
                          <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5" />
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Separator />

        {/* Payment Process Info */}
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <Lock className="h-5 w-5 text-amber-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-amber-900 mb-2">Come Funziona il Pagamento</h3>
                <div className="space-y-1 text-sm text-amber-800">
                  <p>1. Scegli la barca e le date</p>
                  <p>2. Seleziona il metodo di pagamento</p>
                  <p>3. Paga in modo sicuro con Stripe</p>
                  <p>4. Ricevi conferma immediata</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Info */}
        <div className="space-y-3">
          <h3 className="font-medium text-gray-900">Sicurezza e Privacy</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-start space-x-2">
              <span className="text-green-500 mt-0.5">✓</span>
              <span>Pagamenti protetti da crittografia SSL/TLS</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-green-500 mt-0.5">✓</span>
              <span>Standard PCI DSS per la sicurezza delle carte</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-green-500 mt-0.5">✓</span>
              <span>Gestito da Stripe, leader mondiale nei pagamenti</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-green-500 mt-0.5">✓</span>
              <span>Rimborsi automatici secondo le nostre politiche</span>
            </div>
          </div>
        </div>

        {/* Nota importante */}
        <Card className="border-gray-200">
          <CardContent className="p-4">
            <p className="text-sm text-gray-600 text-center">
              💡 <strong>Nota:</strong> I dati delle tue carte non vengono mai memorizzati sui nostri server. 
              Stripe gestisce tutte le informazioni sensibili secondo i più alti standard di sicurezza.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}