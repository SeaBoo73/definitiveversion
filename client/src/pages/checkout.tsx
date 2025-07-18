import { useEffect, useState } from "react";
import { useSearchParams } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Booking, Boat } from "@shared/schema";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { 
  CreditCard, 
  Shield, 
  CheckCircle, 
  Loader2,
  MapPin,
  Calendar,
  Users,
  UserCheck
} from "lucide-react";

// Stripe integration temporaneamente disabilitata
// const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

function CheckoutForm({ booking, boat }: { booking: Booking; boat: Boat }) {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsProcessing(true);

    try {
      // Simulazione pagamento (senza Stripe per ora)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Pagamento completato!",
        description: "La tua prenotazione è stata confermata.",
      });
      
      // Redirect to customer dashboard
      window.location.href = `/customer-dashboard?success=true`;
    } catch (error) {
      toast({
        title: "Errore nel pagamento",
        description: "Si è verificato un errore imprevisto",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const days = Math.ceil((new Date(booking.endDate).getTime() - new Date(booking.startDate).getTime()) / (1000 * 60 * 60 * 24));
  const basePrice = Number(boat.pricePerDay) * days;
  const commission = Number(booking.commission);
  const totalPrice = Number(booking.totalPrice);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Booking Summary */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Riepilogo prenotazione</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Boat Info */}
              <div className="flex space-x-4">
                <img
                  src={boat.images?.[0] || "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=200&h=150"}
                  alt={boat.name}
                  className="w-20 h-16 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="font-semibold">{boat.name}</h3>
                  <div className="flex items-center text-sm text-gray-600 mt-1">
                    <MapPin className="h-4 w-4 mr-1" />
                    {boat.port}
                  </div>
                </div>
              </div>

              <Separator />

              {/* Booking Details */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-gray-600" />
                    <span className="text-sm">Date</span>
                  </div>
                  <span className="text-sm">
                    {format(new Date(booking.startDate), "dd MMM", { locale: it })} - {format(new Date(booking.endDate), "dd MMM yyyy", { locale: it })}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2 text-gray-600" />
                    <span className="text-sm">Durata</span>
                  </div>
                  <span className="text-sm">{days} {days === 1 ? "giorno" : "giorni"}</span>
                </div>

                {booking.skipperRequested && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <UserCheck className="h-4 w-4 mr-2 text-gray-600" />
                      <span className="text-sm">Skipper</span>
                    </div>
                    <Badge variant="secondary">Incluso</Badge>
                  </div>
                )}
              </div>

              <Separator />

              {/* Price Breakdown */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Prezzo base ({days} {days === 1 ? "giorno" : "giorni"})</span>
                  <span>€{basePrice.toFixed(2)}</span>
                </div>
                {booking.skipperRequested && (
                  <div className="flex justify-between text-sm">
                    <span>Skipper</span>
                    <span>€{(totalPrice - basePrice - commission).toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span>Commissione SeaGO</span>
                  <span>€{commission}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold">
                  <span>Totale</span>
                  <span>€{totalPrice}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security Info */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start space-x-3">
                <Shield className="h-5 w-5 text-green-600 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-gray-900 mb-1">Pagamento sicuro</p>
                  <p className="text-gray-600">
                    I tuoi dati di pagamento sono protetti da crittografia SSL e processati da Stripe.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payment Form */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="h-5 w-5 mr-2" />
                Pagamento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-4">
                    Funzionalità di pagamento temporaneamente disabilitata per lo sviluppo.
                  </p>
                  <div className="space-y-4">
                    <div className="bg-white p-4 rounded border-2 border-dashed border-gray-300">
                      <div className="flex items-center justify-center text-gray-500">
                        <CreditCard className="h-6 w-6 mr-2" />
                        <span>Simulazione pagamento</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-xs text-gray-600">
                  Completando questo acquisto accetti i nostri{" "}
                  <a href="#" className="text-ocean-blue hover:underline">
                    Termini di Servizio
                  </a>{" "}
                  e la{" "}
                  <a href="#" className="text-ocean-blue hover:underline">
                    Privacy Policy
                  </a>
                  .
                </div>

                <Button
                  type="submit"
                  className="w-full bg-coral hover:bg-orange-600"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <div className="flex items-center">
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Elaborazione...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <span>Simula pagamento €{totalPrice}</span>
                    </div>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function Checkout() {
  const searchParams = new URLSearchParams(window.location.search);
  const bookingId = searchParams.get("bookingId");

  const { data: booking, isLoading: bookingLoading } = useQuery<Booking>({
    queryKey: ["/api/bookings", bookingId],
    enabled: !!bookingId,
  });

  const { data: boat, isLoading: boatLoading } = useQuery<Boat>({
    queryKey: ["/api/boats", booking?.boatId],
    enabled: !!booking?.boatId,
  });

  if (bookingLoading || boatLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-8 w-8 animate-spin text-ocean-blue" />
            <span className="text-lg">Caricamento...</span>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!booking || !boat) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Prenotazione non trovata</h1>
          <p className="text-gray-600 mt-2">La prenotazione che stai cercando non esiste.</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Completa la prenotazione</h1>
          <p className="text-gray-600 mt-2">Sei a un passo dalla tua avventura in mare!</p>
        </div>

        <CheckoutForm booking={booking} boat={boat} />
      </div>

      <Footer />
    </div>
  );
}
