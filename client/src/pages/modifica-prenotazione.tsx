import { useState } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { MobileNavigation } from "@/components/mobile-navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Calendar, Edit3, Search, AlertTriangle, CheckCircle, Clock, Mail } from "lucide-react";
import { Link } from "wouter";

export default function ModificaPrenotazionePage() {
  const [bookingCode, setBookingCode] = useState("");
  const [email, setEmail] = useState("");
  const [step, setStep] = useState<"search" | "found" | "edit">("search");
  
  // Dati di esempio per la prenotazione trovata
  const mockBooking = {
    id: "SEA-2025-1234",
    boatName: "Azimut 62 Luxury",
    startDate: "2025-08-15",
    endDate: "2025-08-22",
    port: "Marina di Ostia",
    totalPrice: 2800,
    status: "confermata",
    guests: 8,
    skipperIncluded: true,
    fuelIncluded: false
  };

  const handleSearch = () => {
    // Simula la ricerca della prenotazione
    if (bookingCode && email) {
      setStep("found");
    }
  };

  const canModify = () => {
    const startDate = new Date(mockBooking.startDate);
    const now = new Date();
    const timeDiff = startDate.getTime() - now.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysDiff > 7; // Modificabile fino a 7 giorni prima
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Modifica Prenotazione
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Trova e modifica la tua prenotazione inserendo il codice e l'email utilizzata per la prenotazione.
          </p>
        </div>

        {step === "search" && (
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-6 w-6" />
                Trova la tua prenotazione
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="booking-code">Codice prenotazione</Label>
                <Input
                  id="booking-code"
                  placeholder="es. SEA-2025-1234"
                  value={bookingCode}
                  onChange={(e) => setBookingCode(e.target.value)}
                  className="mt-1"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Trovi il codice nell'email di conferma
                </p>
              </div>

              <div>
                <Label htmlFor="email">Email di prenotazione</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="la-tua-email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1"
                />
              </div>

              <Button 
                onClick={handleSearch}
                className="w-full"
                disabled={!bookingCode || !email}
              >
                Cerca prenotazione
              </Button>

              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Non trovi il codice prenotazione? <Link href="/contatti" className="text-blue-600 hover:underline">Contatta il supporto</Link>
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        )}

        {step === "found" && (
          <div className="space-y-6">
            {/* Prenotazione trovata */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                    Prenotazione trovata
                  </CardTitle>
                  <Badge className="bg-green-100 text-green-800">
                    {mockBooking.status}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Dettagli prenotazione</h4>
                    <dl className="space-y-2">
                      <div>
                        <dt className="text-sm text-gray-600">Codice:</dt>
                        <dd className="font-mono text-sm">{mockBooking.id}</dd>
                      </div>
                      <div>
                        <dt className="text-sm text-gray-600">Imbarcazione:</dt>
                        <dd className="font-semibold">{mockBooking.boatName}</dd>
                      </div>
                      <div>
                        <dt className="text-sm text-gray-600">Porto:</dt>
                        <dd>{mockBooking.port}</dd>
                      </div>
                      <div>
                        <dt className="text-sm text-gray-600">Date:</dt>
                        <dd>{mockBooking.startDate} → {mockBooking.endDate}</dd>
                      </div>
                    </dl>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Servizi inclusi</h4>
                    <dl className="space-y-2">
                      <div>
                        <dt className="text-sm text-gray-600">Ospiti:</dt>
                        <dd>{mockBooking.guests} persone</dd>
                      </div>
                      <div>
                        <dt className="text-sm text-gray-600">Skipper:</dt>
                        <dd>{mockBooking.skipperIncluded ? "Incluso" : "Non incluso"}</dd>
                      </div>
                      <div>
                        <dt className="text-sm text-gray-600">Carburante:</dt>
                        <dd>{mockBooking.fuelIncluded ? "Incluso" : "Non incluso"}</dd>
                      </div>
                      <div>
                        <dt className="text-sm text-gray-600">Totale:</dt>
                        <dd className="text-lg font-bold text-blue-600">€{mockBooking.totalPrice}</dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Opzioni di modifica */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Edit3 className="h-6 w-6" />
                  Cosa puoi modificare
                </CardTitle>
              </CardHeader>
              
              <CardContent>
                {canModify() ? (
                  <div className="space-y-4">
                    <Alert className="border-green-200 bg-green-50">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <AlertDescription className="text-green-800">
                        Puoi modificare la tua prenotazione fino a 7 giorni prima della partenza.
                      </AlertDescription>
                    </Alert>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Button variant="outline" className="h-auto p-4 text-left">
                        <div>
                          <div className="font-semibold">Modifica date</div>
                          <div className="text-sm text-gray-500">Cambia le date del noleggio</div>
                        </div>
                      </Button>

                      <Button variant="outline" className="h-auto p-4 text-left">
                        <div>
                          <div className="font-semibold">Aggiungi servizi</div>
                          <div className="text-sm text-gray-500">Skipper, carburante, extras</div>
                        </div>
                      </Button>

                      <Button variant="outline" className="h-auto p-4 text-left">
                        <div>
                          <div className="font-semibold">Modifica ospiti</div>
                          <div className="text-sm text-gray-500">Cambia numero di persone</div>
                        </div>
                      </Button>

                      <Button variant="outline" className="h-auto p-4 text-left">
                        <div>
                          <div className="font-semibold">Contatta proprietario</div>
                          <div className="text-sm text-gray-500">Invia un messaggio</div>
                        </div>
                      </Button>
                    </div>

                    <div className="pt-4 border-t">
                      <Button className="mr-4">
                        Procedi con le modifiche
                      </Button>
                      <Button variant="destructive" className="mr-4">
                        Cancella prenotazione
                      </Button>
                      <Button variant="outline" onClick={() => setStep("search")}>
                        Cerca un'altra prenotazione
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Alert className="border-red-200 bg-red-50">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-800">
                      Non è più possibile modificare questa prenotazione. Per modifiche dell'ultimo minuto, 
                      <Link href="/contatti" className="underline ml-1">contatta il supporto</Link>.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            {/* Assistenza */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-6 w-6" />
                  Serve aiuto?
                </CardTitle>
              </CardHeader>
              
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button variant="outline" asChild>
                    <Link href="/contatti">
                      Contatta supporto
                    </Link>
                  </Button>
                  
                  <Button variant="outline" asChild>
                    <Link href="/politiche-cancellazione">
                      Politiche cancellazione
                    </Link>
                  </Button>
                  
                  <Button variant="outline" asChild>
                    <Link href="/customer-dashboard">
                      La mia dashboard
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      <Footer />
      <MobileNavigation />
    </div>
  );
}