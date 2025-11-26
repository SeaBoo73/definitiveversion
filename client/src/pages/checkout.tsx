import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useApplePay } from "@/hooks/use-apple-pay";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { MobileNavigation } from "@/components/mobile-navigation";
import { useLocation } from "wouter";
import { ArrowLeft, CreditCard, Smartphone, Wallet } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { SiApplepay, SiGooglepay } from "react-icons/si";

// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the `Stripe` object on every render.
const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_51RmJeyRemNUXGzu7lcts67FtOOZFuYrqUSvhjCQTNrZyEgAB1051AqnVSzM0jXsDcMeWGThb3JNdMXGFAzj06GbU004axe6Kek';
const stripePromise = loadStripe(stripeKey);

interface CheckoutFormProps {
  clientSecret: string;
  amount: number;
}

const CheckoutForm = ({ clientSecret, amount }: CheckoutFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [, setLocation] = useLocation();
  
  const { 
    isApplePayAvailable, 
    isGooglePayAvailable, 
    isLoading: isNativePayLoading,
    presentApplePay,
    presentGooglePay 
  } = useApplePay();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin + "/payment-success",
      },
    });

    if (error) {
      toast({
        title: "Pagamento Fallito",
        description: error.message,
        variant: "destructive",
      });
      setIsProcessing(false);
    } else {
      toast({
        title: "Pagamento Completato",
        description: "Grazie per la tua prenotazione!",
      });
    }
  };

  const handleApplePay = async () => {
    setIsProcessing(true);
    const success = await presentApplePay(amount, 'EUR', clientSecret);
    if (success) {
      toast({
        title: "Pagamento Completato",
        description: "Grazie per la tua prenotazione con Apple Pay!",
      });
      setLocation("/payment-success");
    } else {
      toast({
        title: "Pagamento Fallito",
        description: "Si è verificato un errore con Apple Pay",
        variant: "destructive",
      });
    }
    setIsProcessing(false);
  };

  const handleGooglePay = async () => {
    setIsProcessing(true);
    const success = await presentGooglePay(amount, 'EUR', clientSecret);
    if (success) {
      toast({
        title: "Pagamento Completato",
        description: "Grazie per la tua prenotazione con Google Pay!",
      });
      setLocation("/payment-success");
    } else {
      toast({
        title: "Pagamento Fallito",
        description: "Si è verificato un errore con Google Pay",
        variant: "destructive",
      });
    }
    setIsProcessing(false);
  };

  return (
    <div className="space-y-6">
      {/* Native Payment Methods - Apple Pay / Google Pay */}
      {!isNativePayLoading && (isApplePayAvailable || isGooglePayAvailable) && (
        <div className="space-y-3">
          <p className="text-sm text-gray-600 flex items-center gap-2">
            <Wallet className="h-4 w-4" />
            Pagamento rapido
          </p>
          
          <div className="flex flex-col gap-3">
            {isApplePayAvailable && (
              <Button
                type="button"
                onClick={handleApplePay}
                disabled={isProcessing}
                className="w-full h-12 bg-black hover:bg-gray-800 text-white flex items-center justify-center gap-2"
                data-testid="button-apple-pay"
              >
                <SiApplepay className="h-6 w-6" />
                Apple Pay
              </Button>
            )}
            
            {isGooglePayAvailable && (
              <Button
                type="button"
                onClick={handleGooglePay}
                disabled={isProcessing}
                className="w-full h-12 bg-white hover:bg-gray-50 text-gray-800 border border-gray-300 flex items-center justify-center gap-2"
                data-testid="button-google-pay"
              >
                <SiGooglepay className="h-6 w-6" />
                Google Pay
              </Button>
            )}
          </div>
          
          <div className="relative py-4">
            <Separator />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-4 text-sm text-gray-500">
              oppure
            </span>
          </div>
        </div>
      )}
      
      {/* Card and other payment methods */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <p className="text-sm text-gray-600 flex items-center gap-2">
          <CreditCard className="h-4 w-4" />
          Carta di credito o altri metodi
        </p>
        
        <PaymentElement 
          options={{
            layout: 'accordion',
          }}
        />
        
        <Button 
          type="submit" 
          className="w-full bg-coral hover:bg-orange-600 text-white h-12 text-lg"
          disabled={!stripe || !elements || isProcessing}
          data-testid="button-complete-payment"
        >
          {isProcessing ? (
            <span className="flex items-center gap-2">
              <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
              Elaborazione...
            </span>
          ) : (
            "Completa Pagamento"
          )}
        </Button>
      </form>
      
      {/* Payment methods info */}
      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <p className="text-xs text-gray-500 text-center mb-3">
          Metodi di pagamento accettati
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          <span className="text-xs text-gray-600 bg-white px-2 py-1 rounded font-semibold">VISA</span>
          <span className="text-xs text-gray-600 bg-white px-2 py-1 rounded font-semibold">Mastercard</span>
          <span className="text-xs text-gray-600 bg-white px-2 py-1 rounded font-semibold">AMEX</span>
          <span className="text-xs text-gray-600 bg-white px-2 py-1 rounded flex items-center gap-1">
            <Smartphone className="h-3 w-3" /> Apple Pay
          </span>
          <span className="text-xs text-gray-600 bg-white px-2 py-1 rounded">Google Pay</span>
          <span className="text-xs text-blue-600 bg-white px-2 py-1 rounded font-semibold">PayPal</span>
          <span className="text-xs text-pink-500 bg-white px-2 py-1 rounded font-semibold">Klarna</span>
        </div>
      </div>
    </div>
  );
};

export default function Checkout() {
  const [clientSecret, setClientSecret] = useState("");
  const [amount, setAmount] = useState(250);
  const [loading, setLoading] = useState(true);
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    const bookingAmount = 250; // €250 for boat rental
    apiRequest("POST", "/api/create-payment-intent", { 
      amount: bookingAmount,
      currency: "eur"
    })
      .then((res) => res.json())
      .then((data) => {
        setClientSecret(data.clientSecret);
        setAmount(bookingAmount);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error creating payment intent:', error);
        setLoading(false);
      });
  }, []);

  if (loading || !clientSecret) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="h-screen flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-4 border-coral border-t-transparent rounded-full" aria-label="Loading"/>
        </div>
        <Footer />
        <MobileNavigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pb-20 md:pb-0">
      <Header />
      
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Back to Home Button */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => setLocation("/")}
            className="text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Torna alla home
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-deep-navy text-center">
              Completa la tua Prenotazione
            </CardTitle>
            <p className="text-sea-gray text-center">
              Inserisci i dettagli di pagamento per finalizzare la prenotazione
            </p>
          </CardHeader>
          <CardContent>
            {/* Make SURE to wrap the form in <Elements> which provides the stripe context. */}
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <CheckoutForm clientSecret={clientSecret} amount={amount} />
            </Elements>
          </CardContent>
        </Card>
      </div>
      
      <Footer />
      <MobileNavigation />
    </div>
  );
}