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
import { ArrowLeft, CreditCard, Smartphone, Wallet, Ship, Anchor, Compass } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { SiApplepay, SiGooglepay } from "react-icons/si";

const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_51RmJeyRemNUXGzu7lcts67FtOOZFuYrqUSvhjCQTNrZyEgAB1051AqnVSzM0jXsDcMeWGThb3JNdMXGFAzj06GbU004axe6Kek';
const stripePromise = loadStripe(stripeKey);

interface BookingInfo {
  type: 'boat' | 'mooring' | 'experience';
  name: string;
  amount: number;
  bookingId?: string;
  startDate?: string;
  endDate?: string;
  date?: string;
  participants?: number;
}

function parseCheckoutParams(): BookingInfo {
  const params = new URLSearchParams(window.location.search);
  const type = (params.get('type') || 'boat') as BookingInfo['type'];
  const amount = parseFloat(params.get('amount') || '0');
  const name = params.get('name') || '';
  const bookingId = params.get('bookingId') || undefined;
  const startDate = params.get('startDate') || params.get('checkIn') || undefined;
  const endDate = params.get('endDate') || params.get('checkOut') || undefined;
  const date = params.get('date') || undefined;
  const participants = params.get('participants') ? parseInt(params.get('participants')!) : undefined;

  return { type, name, amount, bookingId, startDate, endDate, date, participants };
}

interface CheckoutFormProps {
  clientSecret: string;
  amount: number;
  bookingInfo: BookingInfo;
}

const CheckoutForm = ({ clientSecret, amount, bookingInfo }: CheckoutFormProps) => {
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

  const successUrl = bookingInfo.type === 'experience' 
    ? `/payment-success?type=experience` 
    : `/payment-success?type=${bookingInfo.type}`;
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin + successUrl,
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
      setLocation(successUrl);
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
      setLocation(successUrl);
    } else {
      toast({
        title: "Pagamento Fallito",
        description: "Si è verificato un errore con Google Pay",
        variant: "destructive",
      });
    }
    setIsProcessing(false);
  };

  const typeIcon = bookingInfo.type === 'boat' ? <Ship className="h-5 w-5" /> 
    : bookingInfo.type === 'mooring' ? <Anchor className="h-5 w-5" /> 
    : <Compass className="h-5 w-5" />;

  const typeLabel = bookingInfo.type === 'boat' ? 'Imbarcazione' 
    : bookingInfo.type === 'mooring' ? 'Ormeggio' 
    : 'Esperienza';

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    try {
      return new Date(dateStr).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' });
    } catch { return dateStr; }
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-lg space-y-3">
        <div className="flex items-center gap-2 text-ocean-blue font-semibold">
          {typeIcon}
          <span>{typeLabel}</span>
        </div>
        {bookingInfo.name && (
          <p className="font-medium text-gray-900">{decodeURIComponent(bookingInfo.name)}</p>
        )}
        <div className="text-sm text-gray-600 space-y-1">
          {bookingInfo.startDate && bookingInfo.endDate && (
            <p>Dal {formatDate(bookingInfo.startDate)} al {formatDate(bookingInfo.endDate)}</p>
          )}
          {bookingInfo.date && (
            <p>Data: {formatDate(bookingInfo.date)}</p>
          )}
          {bookingInfo.participants && (
            <p>{bookingInfo.participants} {bookingInfo.participants === 1 ? 'partecipante' : 'partecipanti'}</p>
          )}
        </div>
        <Separator />
        <div className="flex justify-between items-center font-bold text-lg">
          <span>Totale</span>
          <span className="text-ocean-blue">{amount.toFixed(2)}</span>
        </div>
      </div>

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
            `Paga €${amount.toFixed(2)}`
          )}
        </Button>
      </form>
      
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
  const [bookingInfo, setBookingInfo] = useState<BookingInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [, setLocation] = useLocation();

  useEffect(() => {
    const info = parseCheckoutParams();
    
    if (!info.amount || info.amount <= 0) {
      setError("Importo non valido. Torna alla pagina di prenotazione e riprova.");
      setLoading(false);
      return;
    }

    setBookingInfo(info);

    const metadata: Record<string, string> = {
      type: info.type,
      platform: 'seaboo',
    };
    if (info.bookingId) metadata.bookingId = info.bookingId;

    apiRequest("POST", "/api/create-payment-intent", { 
      amount: info.amount,
      currency: "eur",
      bookingId: info.bookingId,
      metadata,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.clientSecret) {
          setClientSecret(data.clientSecret);
        } else {
          setError("Errore nella creazione del pagamento. Riprova.");
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error creating payment intent:', err);
        setError("Errore nella connessione al sistema di pagamento.");
        setLoading(false);
      });
  }, []);

  if (loading) {
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

  if (error || !clientSecret || !bookingInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pb-20 md:pb-0">
        <Header />
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Card>
            <CardContent className="pt-6 text-center space-y-4">
              <p className="text-red-600 font-medium">{error || "Dati di pagamento non disponibili."}</p>
              <Button 
                onClick={() => window.history.back()} 
                variant="outline"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Torna indietro
              </Button>
            </CardContent>
          </Card>
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
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => window.history.back()}
            className="text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Torna indietro
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
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <CheckoutForm clientSecret={clientSecret} amount={bookingInfo.amount} bookingInfo={bookingInfo} />
            </Elements>
          </CardContent>
        </Card>
      </div>
      
      <Footer />
      <MobileNavigation />
    </div>
  );
}
