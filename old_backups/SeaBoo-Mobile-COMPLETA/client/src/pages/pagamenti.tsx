import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { MobileNavigation } from "@/components/mobile-navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Smartphone, Shield, Clock } from "lucide-react";

export default function PagamentiPage() {
  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <CreditCard className="h-16 w-16 text-coral mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Metodi di Pagamento
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Paga in modo sicuro e conveniente con i metodi che preferisci
          </p>
        </div>

        <div className="space-y-8">
          {/* Carte di Credito */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CreditCard className="h-6 w-6 text-blue-600" />
                <span>Carte di Credito e Debito</span>
                <Badge className="bg-green-100 text-green-800">Raccomandato</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="bg-gray-100 rounded-lg p-4 text-center">
                  <p className="font-semibold text-blue-600">Visa</p>
                </div>
                <div className="bg-gray-100 rounded-lg p-4 text-center">
                  <p className="font-semibold text-red-600">Mastercard</p>
                </div>
                <div className="bg-gray-100 rounded-lg p-4 text-center">
                  <p className="font-semibold text-blue-600">American Express</p>
                </div>
                <div className="bg-gray-100 rounded-lg p-4 text-center">
                  <p className="font-semibold text-green-600">Maestro</p>
                </div>
              </div>
              <div className="flex items-center space-x-2 text-green-600">
                <Shield className="h-4 w-4" />
                <span className="text-sm">Pagamento sicuro con crittografia SSL</span>
              </div>
            </CardContent>
          </Card>

          {/* Pagamenti Digitali */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Smartphone className="h-6 w-6 text-purple-600" />
                <span>Pagamenti Digitali</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                <div className="bg-gray-100 rounded-lg p-4 text-center">
                  <p className="font-semibold">Apple Pay</p>
                </div>
                <div className="bg-gray-100 rounded-lg p-4 text-center">
                  <p className="font-semibold">Google Pay</p>
                </div>
                <div className="bg-gray-100 rounded-lg p-4 text-center">
                  <p className="font-semibold">PayPal</p>
                </div>
              </div>
              <div className="flex items-center space-x-2 text-blue-600">
                <Clock className="h-4 w-4" />
                <span className="text-sm">Pagamento istantaneo e sicuro</span>
              </div>
            </CardContent>
          </Card>

          {/* Informazioni Sicurezza */}
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-6 w-6 text-blue-600" />
                <span>Sicurezza dei Pagamenti</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-gray-700">
                <li>• Tutti i pagamenti sono elaborati tramite Stripe, leader mondiale nei pagamenti online</li>
                <li>• I tuoi dati di pagamento sono crittografati e non vengono mai memorizzati sui nostri server</li>
                <li>• Protezione acquirenti: rimborso garantito in caso di problemi</li>
                <li>• Monitoraggio anti-frode 24/7 per la massima sicurezza</li>
              </ul>
            </CardContent>
          </Card>

          {/* FAQ Pagamenti */}
          <Card>
            <CardHeader>
              <CardTitle>Domande Frequenti</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900">Quando viene addebitato il pagamento?</h4>
                  <p className="text-gray-600">Il pagamento viene addebitato immediatamente alla conferma della prenotazione.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Posso modificare il metodo di pagamento?</h4>
                  <p className="text-gray-600">Sì, puoi modificare il metodo di pagamento prima di confermare la prenotazione.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Ci sono commissioni aggiuntive?</h4>
                  <p className="text-gray-600">No, non ci sono commissioni nascoste. Il prezzo mostrato è quello finale.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
      <MobileNavigation />
    </div>
  );
}