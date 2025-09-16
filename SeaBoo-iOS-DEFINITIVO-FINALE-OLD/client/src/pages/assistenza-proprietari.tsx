import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, Phone, Mail, FileText, Users, HelpCircle } from "lucide-react";

export default function AssistenzaProprietariPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Assistenza Proprietari
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Supporto dedicato per i proprietari di imbarcazioni su SeaBoo
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <Card className="text-center">
            <CardHeader>
              <CardTitle className="flex flex-col items-center">
                <MessageCircle className="h-8 w-8 mb-2 text-blue-600" />
                Chat dal Vivo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Supporto immediato tramite chat per risolvere rapidamente i tuoi dubbi.
              </p>
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                Avvia Chat
              </Button>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <CardTitle className="flex flex-col items-center">
                <Phone className="h-8 w-8 mb-2 text-green-600" />
                Supporto Telefonico
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Parla direttamente con un nostro esperto per questioni complesse.
              </p>
              <Button className="w-full bg-green-600 hover:bg-green-700">
                +39 06 1234 5678
              </Button>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <CardTitle className="flex flex-col items-center">
                <Mail className="h-8 w-8 mb-2 text-orange-600" />
                Email Dedicata
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Invia una email per questioni non urgenti. Risposta entro 4 ore.
              </p>
              <Button className="w-full bg-orange-600 hover:bg-orange-700">
                proprietari@seaboo.com
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <HelpCircle className="h-6 w-6 mr-2 text-blue-600" />
                FAQ Proprietari
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-b pb-3">
                  <h4 className="font-semibold mb-2">Come vengono elaborati i pagamenti?</h4>
                  <p className="text-sm text-gray-600">I pagamenti vengono trasferiti automaticamente ogni 7 giorni sul tuo conto corrente registrato.</p>
                </div>
                <div className="border-b pb-3">
                  <h4 className="font-semibold mb-2">Posso modificare il prezzo della mia barca?</h4>
                  <p className="text-sm text-gray-600">Sì, puoi modificare il prezzo in qualsiasi momento dalla tua dashboard proprietario.</p>
                </div>
                <div className="border-b pb-3">
                  <h4 className="font-semibold mb-2">Cosa succede in caso di danni?</h4>
                  <p className="text-sm text-gray-600">Ogni prenotazione include assicurazione. I danni vengono gestiti dal nostro team assicurativo.</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Come gestire le recensioni negative?</h4>
                  <p className="text-sm text-gray-600">Puoi rispondere alle recensioni e contattare il supporto per moderare contenuti inappropriati.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-6 w-6 mr-2 text-green-600" />
                Guide e Risorse
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                  <FileText className="h-5 w-5 mr-3 text-blue-600" />
                  <div>
                    <h4 className="font-semibold text-sm">Guida Completa Proprietario</h4>
                    <p className="text-xs text-gray-600">PDF scaricabile con tutte le informazioni</p>
                  </div>
                </div>
                <div className="flex items-center p-3 bg-green-50 rounded-lg">
                  <Users className="h-5 w-5 mr-3 text-green-600" />
                  <div>
                    <h4 className="font-semibold text-sm">Community Proprietari</h4>
                    <p className="text-xs text-gray-600">Gruppo Telegram esclusivo per proprietari</p>
                  </div>
                </div>
                <div className="flex items-center p-3 bg-orange-50 rounded-lg">
                  <MessageCircle className="h-5 w-5 mr-3 text-orange-600" />
                  <div>
                    <h4 className="font-semibold text-sm">Webinar Mensili</h4>
                    <p className="text-xs text-gray-600">Incontri online con tips e aggiornamenti</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Orari di Supporto</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">Chat Live</h3>
                <p className="text-sm text-gray-600">
                  24/7 per emergenze<br />
                  9:00-19:00 per supporto generale
                </p>
              </div>
              <div className="text-center">
                <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Phone className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="font-semibold mb-2">Telefono</h3>
                <p className="text-sm text-gray-600">
                  Lun-Ven: 9:00-18:00<br />
                  Sab-Dom: 10:00-16:00
                </p>
              </div>
              <div className="text-center">
                <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Mail className="h-8 w-8 text-orange-600" />
                </div>
                <h3 className="font-semibold mb-2">Email</h3>
                <p className="text-sm text-gray-600">
                  Risposta entro 4 ore<br />
                  (orario lavorativo)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">Hai Bisogno di Aiuto Personalizzato?</h3>
          <p className="mb-6 opacity-90">
            Il nostro Account Manager dedicato può aiutarti a ottimizzare la tua presenza su SeaBoo.
          </p>
          <Button className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-8 py-3">
            Richiedi Consulenza Gratuita
          </Button>
        </div>
      </div>

      <Footer />
    </div>
  );
}