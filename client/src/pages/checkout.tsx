import { useState, useEffect } from "react";
import { useRoute, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import {
  CreditCard,
  Shield,
  MapPin,
  Calendar,
  Users,
  Ship,
  CheckCircle,
  Lock,
  ArrowLeft,
  Loader2
} from "lucide-react";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY!);

interface Booking {
  id: number;
  boatId: number;
  startDate: string;
  endDate: string;
  totalPrice: string;
  numberOfGuests: number;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  status: string;
  skipperRequired: boolean;
  fuelIncluded: boolean;
  notes?: string;
}

interface Boat {
  id: number;
  name: string;
  port: string;
  images?: string[];
}

function CheckoutForm({ booking, boat }: { booking: Booking; boat: Boat }) {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSucceeded, setPaymentSucceeded] = useState(false);

  const createPaymentIntentMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", "/api/create-payment-intent", {
        bookingId: booking.id
      });
    }
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      // Create payment intent
      const { clientSecret } = await createPaymentIntentMutation.mutateAsync();

      const card = elements.getElement(CardElement);
      if (!card) {
        throw new Error("Card element not found");
      }

      // Confirm payment
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: card,
          billing_details: {
            name: booking.guestName,
            email: booking.guestEmail,
          },
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      if (paymentIntent.status === "succeeded") {
        setPaymentSucceeded(true);
        toast({
          title: "Pagamento completato!",
          description: "La tua prenotazione è confermata. Riceverai una email di conferma."
        });

        // Redirect to customer dashboard after 3 seconds
        setTimeout(() => {
          setLocation("/customer-dashboard?success=true");
        }, 3000);
      }
    } catch (error: any) {
      toast({
        title: "Errore nel pagamento",
        description: error.message || "Si è verificato un errore durante il pagamento",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const totalDays = Math.ceil(
    (new Date(booking.endDate).getTime() - new Date(booking.startDate).getTime()) / (1000 * 60 * 60 * 24)
  ) + 1;

  if (paymentSucceeded) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-8 text-center">
          <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Pagamento completato!</h2>
          <p className="text-gray-600 mb-4">
            La tua prenotazione #{booking.id} è stata confermata.
          </p>
          <p className="text-sm text-gray-500">
            Verrai reindirizzato alla tua dashboard in pochi secondi...
          </p>
          <Button
            onClick={() => setLocation("/customer-dashboard?success=true")}
            className="mt-4 bg-ocean-blue hover:bg-blue-600"
          >
            Vai alla dashboard
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Booking Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Ship className="h-5 w-5 text-ocean-blue" />
            Riepilogo prenotazione #{booking.id}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <img
              src={boat.images?.[0] || "/api/placeholder/100/80"}
              alt={boat.name}
              className="w-20 h-16 object-cover rounded-lg"
            />
            <div className="flex-1">
              <h3 className="font-semibold">{boat.name}</h3>
              <p className="text-sm text-gray-600 flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {boat.port}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Date:</p>
              <p className="font-medium">
                {format(new Date(booking.startDate), "dd MMM", { locale: it })} - {format(new Date(booking.endDate), "dd MMM yyyy", { locale: it })}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Ospiti:</p>
              <p className="font-medium">{booking.numberOfGuests} {booking.numberOfGuests === 1 ? 'ospite' : 'ospiti'}</p>
            </div>
            <div>
              <p className="text-gray-600">Durata:</p>
              <p className="font-medium">{totalDays} {totalDays === 1 ? 'giorno' : 'giorni'}</p>
            </div>
            <div>
              <p className="text-gray-600">Ospite principale:</p>
              <p className="font-medium">{booking.guestName}</p>
            </div>
          </div>

          {(booking.skipperRequired || booking.fuelIncluded) && (
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2">Servizi aggiuntivi:</p>
              <div className="flex flex-wrap gap-2">
                {booking.skipperRequired && (
                  <Badge variant="outline">Skipper incluso</Badge>
                )}
                {booking.fuelIncluded && (
                  <Badge variant="outline">Carburante incluso</Badge>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-ocean-blue" />
            Dettagli pagamento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Payment Method */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Carta di credito o debito
              </label>
              <div className="border rounded-lg p-4 bg-white">
                <CardElement
                  options={{
                    style: {
                      base: {
                        fontSize: "16px",
                        color: "#424770",
                        "::placeholder": {
                          color: "#aab7c4",
                        },
                      },
                    },
                  }}
                />
              </div>
            </div>

            {/* Security Notice */}
            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  <span>
                    <strong>Pagamento sicuro:</strong> I tuoi dati sono protetti da crittografia SSL a 256-bit.
                    Supportiamo Visa, Mastercard, American Express e carte prepagate.
                  </span>
                </div>
              </AlertDescription>
            </Alert>

            {/* Price Breakdown */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold mb-3">Riepilogo prezzi</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotale:</span>
                  <span>€{booking.totalPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span>Commissioni di servizio:</span>
                  <span>€0</span>
                </div>
                <div className="flex justify-between">
                  <span>Tasse:</span>
                  <span>Incluse</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Totale:</span>
                  <span className="text-ocean-blue">€{booking.totalPrice}</span>
                </div>
              </div>
            </div>

            {/* Terms */}
            <div className="text-xs text-gray-500 space-y-1">
              <p>
                Cliccando "Completa pagamento", accetti i nostri{" "}
                <a href="/termini" className="text-ocean-blue hover:underline">
                  Termini di servizio
                </a>{" "}
                e confermi di aver letto la nostra{" "}
                <a href="/privacy" className="text-ocean-blue hover:underline">
                  Informativa sulla privacy
                </a>.
              </p>
              <p>
                In caso di cancellazione entro 24 ore prima del check-in, riceverai un rimborso completo.
              </p>
            </div>

            <Button
              type="submit"
              disabled={!stripe || isProcessing || createPaymentIntentMutation.isPending}
              className="w-full bg-ocean-blue hover:bg-blue-600 h-12"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Elaborazione pagamento...
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4 mr-2" />
                  Completa pagamento - €{booking.totalPrice}
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function Checkout() {
  const [, params] = useRoute("/checkout/:bookingId");
  const [, setLocation] = useLocation();
  const { user } = useAuth();

  const bookingId = params?.bookingId ? parseInt(params.bookingId) : null;

  const { data: booking, isLoading: bookingLoading } = useQuery<Booking>({
    queryKey: ["/api/bookings", bookingId],
    enabled: !!bookingId,
  });

  const { data: boat, isLoading: boatLoading } = useQuery<Boat>({
    queryKey: ["/api/boats", booking?.boatId],
    enabled: !!booking?.boatId,
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Accesso richiesto</h1>
          <p className="text-gray-600 mt-2">Devi effettuare l'accesso per completare il pagamento.</p>
          <Button 
            onClick={() => setLocation("/auth")}
            className="mt-4 bg-ocean-blue hover:bg-blue-600"
          >
            Accedi
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  if (!bookingId) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Prenotazione non trovata</h1>
          <p className="text-gray-600 mt-2">La prenotazione che stai cercando non esiste.</p>
          <Button 
            onClick={() => setLocation("/customer-dashboard")}
            className="mt-4 bg-ocean-blue hover:bg-blue-600"
          >
            Vai alle tue prenotazioni
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  if (bookingLoading || boatLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="h-96 bg-gray-200 rounded"></div>
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
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Errore nel caricamento</h1>
          <p className="text-gray-600 mt-2">Non riusciamo a caricare i dettagli della prenotazione.</p>
          <Button 
            onClick={() => setLocation("/customer-dashboard")}
            className="mt-4 bg-ocean-blue hover:bg-blue-600"
          >
            Vai alle tue prenotazioni
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => setLocation("/customer-dashboard")}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Torna alle prenotazioni
        </Button>

        {/* Page Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Completa il pagamento</h1>
          <p className="text-gray-600">Ultimo passo per confermare la tua prenotazione</p>
        </div>

        {/* Stripe Elements Provider */}
        <Elements stripe={stripePromise}>
          <CheckoutForm booking={booking} boat={boat} />
        </Elements>
      </div>

      <Footer />
    </div>
  );
}