import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Link, useLocation } from "wouter";
import { 
  CheckCircle2,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Clock,
  Users,
  Download,
  Share2
} from "lucide-react";

export default function PaymentSuccessEsperienza() {
  const [bookingDetails, setBookingDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get booking ID from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const bookingId = urlParams.get('booking_id');

    if (bookingId) {
      // In a real app, fetch booking details from API
      // For now, using mock data
      setBookingDetails({
        bookingId,
        bookingCode: `EXP${Date.now().toString().slice(-6)}`,
        tipo: "Tramonto in barca",
        data: "25/07/2025",
        orario: "18:00",
        porto: "Civitavecchia",
        numeroPersone: 2,
        prezzoTotale: 178,
        cliente: {
          nome: "Mario",
          cognome: "Rossi",
          email: "mario.rossi@example.com",
          telefono: "+39 123 456 7890"
        },
        status: "confirmed",
        paymentMethod: "Carta di credito",
        createdAt: new Date().toISOString()
      });
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4" />
          <p>Caricamento conferma...</p>
        </div>
      </div>
    );
  }

  if (!bookingDetails) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Prenotazione non trovata</h1>
          <p className="text-gray-600 mb-6">Non è stato possibile recuperare i dettagli della prenotazione.</p>
          <Button asChild>
            <Link href="/esperienze">Torna alle esperienze</Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Success Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
              <CheckCircle2 className="h-12 w-12 text-green-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-4">Prenotazione confermata!</h1>
          <p className="text-xl text-green-100 mb-2">
            La tua esperienza è stata prenotata con successo
          </p>
          <p className="text-green-200">
            Codice prenotazione: <span className="font-bold text-white">{bookingDetails.bookingCode}</span>
          </p>
        </div>
      </div>

      {/* Booking Details */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Main Details */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Dettagli esperienza
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg text-blue-900 mb-3">
                    {bookingDetails.tipo}
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span>{bookingDetails.data}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span>{bookingDetails.orario}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span>{bookingDetails.porto}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Users className="h-4 w-4 text-gray-500" />
                      <span>{bookingDetails.numeroPersone} {bookingDetails.numeroPersone === 1 ? "persona" : "persone"}</span>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center text-xl font-bold">
                    <span>Totale pagato</span>
                    <span className="text-green-600">€{bookingDetails.prezzoTotale}</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Pagamento con {bookingDetails.paymentMethod}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Dati del cliente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p><strong>Nome:</strong> {bookingDetails.cliente.nome} {bookingDetails.cliente.cognome}</p>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span>{bookingDetails.cliente.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span>{bookingDetails.cliente.telefono}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Actions & Info */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Prossimi passaggi</CardTitle>
                <CardDescription>
                  Cosa fare ora che hai prenotato la tua esperienza
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium">Email di conferma inviata</p>
                      <p className="text-sm text-gray-600">
                        Riceverai tutti i dettagli via email entro 5 minuti
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium">Contatto dello skipper</p>
                      <p className="text-sm text-gray-600">
                        Riceverai i contatti del tuo skipper 24h prima dell'esperienza
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium">Punto di incontro</p>
                      <p className="text-sm text-gray-600">
                        Ti invieremo le indicazioni precise per raggiungere il porto
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3 pt-4 border-t">
                  <Button className="w-full" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Scarica voucher (PDF)
                  </Button>
                  
                  <Button className="w-full" variant="outline">
                    <Share2 className="h-4 w-4 mr-2" />
                    Condividi esperienza
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Support Info */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Hai bisogno di aiuto?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="font-medium">Cancellazione gratuita</p>
                    <p className="text-gray-600">Fino a 24 ore prima dell'esperienza</p>
                  </div>
                  
                  <div>
                    <p className="font-medium">Supporto clienti</p>
                    <p className="text-gray-600">
                      <Phone className="h-4 w-4 inline mr-1" />
                      +39 06 1234 5678
                    </p>
                    <p className="text-gray-600">
                      <Mail className="h-4 w-4 inline mr-1" />
                      supporto@seago.it
                    </p>
                  </div>
                  
                  <div>
                    <p className="font-medium">Condizioni meteo</p>
                    <p className="text-gray-600">Ti contatteremo in caso di maltempo</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 mt-8">
          <Button asChild size="lg">
            <Link href="/esperienze">Esplora altre esperienze</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/">Torna alla home</Link>
          </Button>
        </div>
      </div>

      <Footer />
    </div>
  );
}