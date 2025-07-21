import { useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Calendar, MapPin, Users, Star } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

export default function PaymentSuccess() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const searchParams = new URLSearchParams(window.location.search);
  const bookingId = searchParams.get("booking");

  const { data: booking } = useQuery({
    queryKey: ["/api/bookings", bookingId],
    enabled: !!bookingId,
  });

  const { data: user } = useQuery({
    queryKey: ["/api/user"],
  });

  const updateLoyaltyMutation = useMutation({
    mutationFn: async () => {
      if (booking && user) {
        const pointsEarned = Math.floor(parseFloat(booking.totalPrice));
        return apiRequest("POST", `/api/users/${user.id}/update-loyalty`, {
          totalSpent: booking.totalPrice,
          pointsEarned
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
    }
  });

  useEffect(() => {
    if (!bookingId) {
      setLocation("/");
      return;
    }

    // Update user loyalty points after successful payment
    if (booking && user && !updateLoyaltyMutation.isSuccess) {
      updateLoyaltyMutation.mutate();
    }
  }, [bookingId, booking, user, setLocation]);

  if (!booking || !user) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const pointsEarned = Math.floor(parseFloat(booking.totalPrice));

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
              <div className="flex items-center gap-3">
                <img 
                  src={booking.boat?.images?.[0] || "/api/placeholder/boat"} 
                  alt={booking.boatName}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div>
                  <h3 className="font-semibold text-lg">{booking.boatName}</h3>
                  <p className="text-gray-600 flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {booking.boat?.port || "Porto"}
                  </p>
                </div>
              </div>

              <div className="space-y-3 pt-4">
                <div className="flex justify-between">
                  <span className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Check-in
                  </span>
                  <span className="font-medium">
                    {new Date(booking.startDate).toLocaleDateString('it-IT')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Check-out
                  </span>
                  <span className="font-medium">
                    {new Date(booking.endDate).toLocaleDateString('it-IT')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Ospiti
                  </span>
                  <span className="font-medium">{booking.guests || booking.boat?.maxPersons} persone</span>
                </div>
                <div className="flex justify-between">
                  <span>Totale pagato</span>
                  <span className="font-bold text-lg text-ocean-blue">€{booking.totalPrice}</span>
                </div>
              </div>

              <div className="pt-4 border-t">
                <Badge className="bg-green-100 text-green-800">
                  ✅ Prenotazione confermata
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Loyalty Rewards */}
          <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-900">
                <Star className="h-5 w-5 text-purple-600" />
                Punti Fedeltà Guadagnati
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-600 mb-2">
                  +{pointsEarned}
                </div>
                <p className="text-purple-800">Punti aggiunti al tuo account</p>
              </div>

              <div className="space-y-3 pt-4">
                <div className="flex justify-between text-sm">
                  <span>Il tuo livello:</span>
                  <Badge className={`
                    ${user.customerLevel === 'bronze' && 'bg-amber-100 text-amber-800'}
                    ${user.customerLevel === 'silver' && 'bg-gray-100 text-gray-800'}
                    ${user.customerLevel === 'gold' && 'bg-yellow-100 text-yellow-800'}
                    ${user.customerLevel === 'platinum' && 'bg-purple-100 text-purple-800'}
                  `}>
                    {user.customerLevel?.charAt(0).toUpperCase() + user.customerLevel?.slice(1)}
                  </Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Prenotazioni totali:</span>
                  <span className="font-medium">{user.totalBookings + 1}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Punti totali:</span>
                  <span className="font-medium">{user.loyaltyPoints + pointsEarned}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-purple-200">
                <p className="text-sm text-purple-700">
                  💡 Usa i punti per ottenere sconti sulle prossime prenotazioni!
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Next Steps */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Prossimi Passi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-blue-600 font-bold">1</span>
                </div>
                <h3 className="font-semibold mb-2">Carica i Documenti</h3>
                <p className="text-sm text-gray-600">
                  Carica carta d'identità e altri documenti richiesti
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-blue-600 font-bold">2</span>
                </div>
                <h3 className="font-semibold mb-2">Contatta il Proprietario</h3>
                <p className="text-sm text-gray-600">
                  Coordinati per il check-in e dettagli specifici
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-blue-600 font-bold">3</span>
                </div>
                <h3 className="font-semibold mb-2">Goditi la Navigazione</h3>
                <p className="text-sm text-gray-600">
                  Presentati al porto il giorno del check-in
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center">
          <Button 
            onClick={() => setLocation("/customer-dashboard")}
            className="bg-ocean-blue hover:bg-blue-600"
          >
            Vai alla Dashboard
          </Button>
          <Button 
            variant="outline"
            onClick={() => setLocation("/")}
          >
            Torna alla Home
          </Button>
        </div>
      </div>
    </div>
  );
}