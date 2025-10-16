import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { useToast } from "@/hooks/use-toast";
import { Link, useLocation } from "wouter";
import { 
  ArrowLeft,
  CreditCard,
  Shield,
  CheckCircle2,
  Loader2
} from "lucide-react";

// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the `Stripe` object on every render.
const stripeKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_51RmJeyRemNUXGzu7lcts67FtOOZFuYrqUSvhjCQTNrZyEgAB1051AqnVSzM0jXsDcMeWGThb3JNdMXGFAzj06GbU004axe6Kek';
const stripePromise = loadStripe(stripeKey);

const CheckoutForm = ({ bookingDetails }: { bookingDetails: any }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment-success-esperienza?booking_id=${bookingDetails?.bookingId}`,
      },
    });

    if (error) {
      toast({
        title: "Pagamento non riuscito",
        description: error.message,
        variant: "destructive",
      });
      setLoading(false);
    } else {
      toast({
        title: "Pagamento completato",
        description: "La tua esperienza è stata prenotata con successo!",
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Payment Form */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Dettagli pagamento
              </CardTitle>
              <CardDescription>
                Inserisci i dati della tua carta per completare la prenotazione
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <PaymentElement />
                
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 text-green-800">
                    <Shield className="h-4 w-4" />
                    <span className="text-sm font-medium">Pagamento sicuro</span>
                  </div>
                  <p className="text-sm text-green-700 mt-1">
                    I tuoi dati sono protetti con crittografia SSL a 256 bit
                  </p>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-coral hover:bg-orange-600 text-white text-lg py-3"
                  disabled={!stripe || loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Elaborazione pagamento...
                    </>
                  ) : (
                    <>
                      <CreditCard className="h-5 w-5 mr-2" />
                      Completa pagamento
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Booking Summary */}
        <div>
          {bookingDetails && (
            <Card>
              <CardHeader>
                <CardTitle>Riepilogo esperienza</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg">{bookingDetails.tipo}</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Data:</span>
                      <span className="font-medium">{bookingDetails.data}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Orario:</span>
                      <span className="font-medium">{bookingDetails.orario}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Porto:</span>
                      <span className="font-medium">{bookingDetails.porto}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Persone:</span>
                      <span className="font-medium">{bookingDetails.numeroPersone}</span>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center text-xl font-bold">
                    <span>Totale</span>
                    <span className="text-coral">€{bookingDetails.prezzoTotale}</span>
                  </div>
                </div>

                <div className="space-y-2 pt-4 border-t">
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Cancellazione gratuita fino a 24h prima</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Conferma immediata via email</span>
                  </div>

                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default function CheckoutEsperienza() {
  const [clientSecret, setClientSecret] = useState("");
  const [bookingDetails, setBookingDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const secret = urlParams.get('client_secret');
    const bookingId = urlParams.get('booking_id');

    if (secret) {
      setClientSecret(secret);
      // In real app, fetch booking details by ID
      // For now, we'll use stored data or fetch from API
      if (bookingId) {
        // Mock booking details - in real app this would come from API
        setBookingDetails({
          bookingId,
          tipo: "Tramonto in barca",
          data: "25/07/2025",
          orario: "18:00",
          porto: "Civitavecchia",
          numeroPersone: 2,
          prezzoTotale: 178
        });
      }
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Caricamento checkout...</p>
        </div>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Errore di checkout</h1>
          <p className="text-gray-600 mb-6">Non è stato possibile inizializzare il pagamento.</p>
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
      
      {/* Back Button */}
      <div className="bg-white border-b px-4 py-3">
        <div className="max-w-4xl mx-auto">
          <Button variant="ghost" asChild className="text-blue-600 hover:text-blue-800 hover:bg-blue-50">
            <Link href="/esperienze">
              <ArrowLeft className="h-4 w-4 mr-2" />
              ← Torna alle esperienze
            </Link>
          </Button>
        </div>
      </div>

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-2">Completa la prenotazione</h1>
          <p className="text-blue-100 text-lg">Sei a un passo dalla tua esperienza in mare</p>
        </div>
      </div>

      {/* Make SURE to wrap the form in <Elements> which provides the stripe context. */}
      <Elements stripe={stripePromise} options={{ clientSecret }}>
        <CheckoutForm bookingDetails={bookingDetails} />
      </Elements>

      <Footer />
    </div>
  );
}