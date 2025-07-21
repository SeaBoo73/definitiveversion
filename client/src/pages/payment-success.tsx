import { useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Calendar, MapPin, Users, Home } from "lucide-react";

export default function PaymentSuccess() {
  const [, setLocation] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  const bookingId = searchParams.get("booking");

  useEffect(() => {
    if (!bookingId) {
      setLocation("/");
      return;
    }
  }, [bookingId, setLocation]);

  if (!bookingId) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6 pt-12">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Pagamento Completato!
          </h1>
          <p className="text-gray-600 text-lg">
            La tua prenotazione è stata confermata con successo
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Booking Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-ocean-blue" />
                Dettagli Prenotazione
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3 pt-4">
                <div className="flex justify-between">
                  <span className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    ID Prenotazione
                  </span>
                  <span className="font-medium">#{bookingId}</span>
                </div>
                <div className="flex justify-between">
                  <span>Stato</span>
                  <Badge className="bg-green-100 text-green-800">
                    ✅ Confermata
                  </Badge>
                </div>
              </div>

              <div className="pt-4 border-t">
                <p className="text-sm text-gray-600 mb-4">
                  Riceverai una email di conferma con tutti i dettagli della prenotazione 
                  e le istruzioni per il ritiro dell'imbarcazione.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Loyalty Rewards */}
          <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-800">
                <Users className="h-5 w-5" />
                Punti Fedeltà Guadagnati
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">+100</div>
                <p className="text-purple-700">Punti SeaGO</p>
              </div>
              
              <div className="bg-white/50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-purple-800">Livello attuale</span>
                  <Badge className="bg-purple-100 text-purple-800">Bronze</Badge>
                </div>
                <div className="w-full bg-purple-200 rounded-full h-2">
                  <div className="bg-purple-600 h-2 rounded-full w-1/3"></div>
                </div>
                <p className="text-xs text-purple-700 mt-2">
                  200 punti al prossimo livello
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Button onClick={() => setLocation("/customer-dashboard")} className="bg-ocean-blue hover:bg-blue-600">
            <Calendar className="h-4 w-4 mr-2" />
            Vai alle mie prenotazioni
          </Button>
          <Button variant="outline" onClick={() => setLocation("/")}>
            <Home className="h-4 w-4 mr-2" />
            Torna alla home
          </Button>
        </div>

        {/* Success Tips */}
        <Card className="mt-8 bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <h3 className="font-semibold text-blue-900 mb-3">Prossimi Passi:</h3>
            <ul className="space-y-2 text-blue-800 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-blue-600">•</span>
                Controlla la tua email per la conferma e i dettagli della prenotazione
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600">•</span>
                Prepara i documenti richiesti per il ritiro
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600">•</span>
                Contatta il proprietario tramite chat per coordinare il ritiro
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600">•</span>
                Scarica l'app SeaGO per gestire la prenotazione in mobilità
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}