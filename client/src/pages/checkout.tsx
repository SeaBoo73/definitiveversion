import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { DiscountSystem } from "@/components/discount-system";
import { LoyaltySystem } from "@/components/loyalty-system";
import { DocumentManager } from "@/components/document-manager";
import { CreditCard, Calendar, MapPin, Users, Clock } from "lucide-react";

// Stripe setup
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const CheckoutForm = ({ booking, clientSecret, user }: any) => {
  const stripe = useStripe();
  const elements = useElements();
  const [, setLocation] = useLocation();
  const [processing, setProcessing] = useState(false);
  const [discountApplied, setDiscountApplied] = useState<any>(null);
  const { toast } = useToast();

  const calculateLoyaltyDiscount = (totalPrice: number, level: string) => {
    const discounts = {
      bronze: 0.05,   // 5%
      silver: 0.10,   // 10%
      gold: 0.15,     // 15%
      platinum: 0.20  // 20%
    };
    return totalPrice * discounts[level] || 0;
  };

  const loyaltyDiscount = calculateLoyaltyDiscount(parseFloat(booking.totalPrice), user.customerLevel);
  const finalPrice = discountApplied 
    ? discountApplied.finalPrice - loyaltyDiscount
    : parseFloat(booking.totalPrice) - loyaltyDiscount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment-success?booking=${booking.id}`,
        },
      });

      if (error) {
        toast({
          title: "Errore Pagamento",
          description: error.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante il pagamento",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Booking Summary & Loyalty */}
        <div className="space-y-6">
          {/* Booking Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-ocean-blue" />
                Riepilogo Prenotazione
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

              <Separator />

              <div className="space-y-2">
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
                {booking.boat?.pickupTime && (
                  <div className="flex justify-between">
                    <span className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Orari
                    </span>
                    <span className="font-medium">
                      {booking.boat.pickupTime} - {booking.boat.returnTime}
                    </span>
                  </div>
                )}
              </div>

              <Separator />

              {/* Pricing Breakdown */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Prezzo base</span>
                  <span>€{booking.originalPrice || booking.totalPrice}</span>
                </div>
                
                {loyaltyDiscount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span className="flex items-center gap-2">
                      Sconto livello {user.customerLevel}
                      <Badge className="bg-green-100 text-green-800">
                        {user.customerLevel === 'bronze' && '5%'}
                        {user.customerLevel === 'silver' && '10%'}
                        {user.customerLevel === 'gold' && '15%'}
                        {user.customerLevel === 'platinum' && '20%'}
                      </Badge>
                    </span>
                    <span>-€{loyaltyDiscount.toFixed(2)}</span>
                  </div>
                )}

                {discountApplied && (
                  <div className="flex justify-between text-green-600">
                    <span>Sconto codice {discountApplied.code}</span>
                    <span>-€{discountApplied.amount.toFixed(2)}</span>
                  </div>
                )}

                <Separator />
                
                <div className="flex justify-between text-lg font-bold">
                  <span>Totale</span>
                  <span className="text-ocean-blue">€{finalPrice.toFixed(2)}</span>
                </div>

                <p className="text-sm text-gray-600">
                  Commissione SeaGO (15%) e tasse incluse
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Loyalty System */}
          <LoyaltySystem user={user} />
        </div>

        {/* Right Column - Discount & Payment */}
        <div className="space-y-6">
          {/* Discount System */}
          <DiscountSystem
            totalPrice={parseFloat(booking.totalPrice)}
            customerLevel={user.customerLevel}
            onDiscountApplied={setDiscountApplied}
          />

          {/* Payment Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-ocean-blue" />
                Metodo di Pagamento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <PaymentElement />
                
                <div className="pt-4">
                  <Button
                    type="submit"
                    disabled={!stripe || !elements || processing}
                    className="w-full bg-ocean-blue hover:bg-blue-600 h-12 text-lg"
                  >
                    {processing ? "Elaborazione..." : `Paga €${finalPrice.toFixed(2)}`}
                  </Button>
                </div>

                <p className="text-xs text-gray-600 text-center">
                  Il pagamento è sicuro e protetto da Stripe. 
                  Accettiamo tutte le principali carte di credito, Apple Pay e Google Pay.
                </p>
              </form>
            </CardContent>
          </Card>

          {/* Document Manager */}
          <DocumentManager 
            bookingId={booking.id} 
            userRole="customer" 
          />
        </div>
      </div>
    </div>
  );
};

export default function Checkout() {
  const [, setLocation] = useLocation();
  const [clientSecret, setClientSecret] = useState("");
  const searchParams = new URLSearchParams(window.location.search);
  const bookingId = searchParams.get("booking");

  const { data: user } = useQuery({
    queryKey: ["/api/user"],
  });

  const { data: booking, isLoading } = useQuery({
    queryKey: ["/api/bookings", bookingId],
    enabled: !!bookingId,
  });

  useEffect(() => {
    if (!bookingId) {
      setLocation("/");
      return;
    }

    // Create payment intent
    apiRequest("POST", "/api/create-payment-intent", { bookingId: parseInt(bookingId) })
      .then((res) => res.json())
      .then((data) => {
        setClientSecret(data.clientSecret);
      })
      .catch((error) => {
        console.error("Payment intent error:", error);
        setLocation("/");
      });
  }, [bookingId, setLocation]);

  if (!user || !booking || !clientSecret || isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const options = {
    clientSecret,
    appearance: {
      theme: 'stripe' as const,
      variables: {
        colorPrimary: '#0f766e',
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto p-6">
          <h1 className="text-3xl font-bold text-gray-900">Completa la Prenotazione</h1>
          <p className="text-gray-600 mt-2">
            Quasi fatto! Completa il pagamento per confermare la tua prenotazione.
          </p>
        </div>
      </div>

      <Elements options={options} stripe={stripePromise}>
        <CheckoutForm booking={booking} clientSecret={clientSecret} user={user} />
      </Elements>
    </div>
  );
}