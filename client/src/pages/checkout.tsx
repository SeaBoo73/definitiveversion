import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocation } from "wouter";

// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the `Stripe` object on every render.
if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const CheckoutForm = ({ booking }: { booking: any }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin + "/customer-dashboard",
      },
    });

    if (error) {
      toast({
        title: "Pagamento Fallito",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Pagamento Completato",
        description: "La tua prenotazione è stata confermata!",
      });
      setLocation("/customer-dashboard");
    }

    setIsLoading(false);
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-center">Completa il Pagamento</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-lg mb-2">{booking?.boatName}</h3>
          <p className="text-sm text-gray-600 mb-1">Dal: {booking?.startDate}</p>
          <p className="text-sm text-gray-600 mb-1">Al: {booking?.endDate}</p>
          <p className="text-lg font-bold text-ocean-blue">Totale: €{booking?.totalPrice}</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <PaymentElement />
          <Button 
            type="submit" 
            disabled={!stripe || isLoading}
            className="w-full bg-ocean-blue hover:bg-blue-600"
          >
            {isLoading ? "Elaborazione..." : `Paga €${booking?.totalPrice}`}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default function Checkout() {
  const [clientSecret, setClientSecret] = useState("");
  const [booking, setBooking] = useState<any>(null);
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Get booking details from URL params or session storage
    const urlParams = new URLSearchParams(window.location.search);
    const bookingId = urlParams.get('bookingId');
    
    if (!bookingId) {
      setLocation("/");
      return;
    }

    // Create PaymentIntent for the booking
    apiRequest("POST", "/api/create-payment-intent", { bookingId })
      .then((res) => res.json())
      .then((data) => {
        setClientSecret(data.clientSecret);
        setBooking(data.booking);
      })
      .catch((error) => {
        console.error("Payment setup error:", error);
        setLocation("/");
      });
  }, [setLocation]);

  if (!clientSecret || !booking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-ocean-blue border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-600">Preparazione pagamento...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Checkout SeaGO</h1>
          <p className="text-gray-600 mt-2">Completa la tua prenotazione</p>
        </div>
        
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <CheckoutForm booking={booking} />
        </Elements>
      </div>
    </div>
  );
}