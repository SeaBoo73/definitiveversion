import { useState, useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { BookingCalendar } from "@/components/booking-calendar";
import { BookingForm } from "@/components/booking-form";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Boat } from "@shared/schema";
import { 
  MapPin, 
  Users, 
  Star, 
  Wifi, 
  Anchor, 
  ArrowLeft,
  Camera,
  Calendar,
  Shield,
  CheckCircle
} from "lucide-react";

export default function BoatBooking() {
  const [, params] = useRoute("/boats/:id/book");
  const [, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState<'calendar' | 'form' | 'payment'>('calendar');
  const [bookingData, setBookingData] = useState<{
    startDate: Date;
    endDate: Date;
    totalPrice: number;
    days: number;
  } | null>(null);

  const boatId = params?.id ? parseInt(params.id) : null;

  const { data: boat, isLoading, error } = useQuery<Boat>({
    queryKey: ["/api/boats", boatId],
    enabled: !!boatId,
  });

  const handleDateSelect = (startDate: Date, endDate: Date, totalPrice: number, days: number) => {
    setBookingData({ startDate, endDate, totalPrice, days });
    setCurrentStep('form');
  };

  const handleBookingComplete = (bookingId: number) => {
    // Redirect to payment page
    setLocation(`/checkout/${bookingId}`);
  };

  if (!boatId) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Imbarcazione non trovata</h1>
          <p className="text-gray-600 mt-2">L'imbarcazione che stai cercando non esiste.</p>
          <Button 
            onClick={() => setLocation("/")}
            className="mt-4 bg-ocean-blue hover:bg-blue-600"
          >
            Torna alla ricerca
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="h-6 bg-gray-200 rounded"></div>
                <div className="h-40 bg-gray-200 rounded"></div>
              </div>
              <div className="h-96 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !boat) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Errore nel caricamento</h1>
          <p className="text-gray-600 mt-2">Non riusciamo a caricare i dettagli dell'imbarcazione.</p>
          <Button 
            onClick={() => setLocation("/")}
            className="mt-4 bg-ocean-blue hover:bg-blue-600"
          >
            Torna alla ricerca
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
          onClick={() => setLocation(`/boats/${boat.id}`)}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Torna ai dettagli
        </Button>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-8">
            <div className={`flex items-center ${currentStep === 'calendar' ? 'text-ocean-blue' : currentStep === 'form' || currentStep === 'payment' ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep === 'calendar' ? 'bg-ocean-blue text-white' : 
                currentStep === 'form' || currentStep === 'payment' ? 'bg-green-600 text-white' : 
                'bg-gray-200 text-gray-400'
              }`}>
                {currentStep === 'form' || currentStep === 'payment' ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <Calendar className="h-4 w-4" />
                )}
              </div>
              <span className="ml-2 text-sm font-medium">Seleziona date</span>
            </div>

            <div className={`h-px w-16 ${currentStep === 'form' || currentStep === 'payment' ? 'bg-green-600' : 'bg-gray-200'}`}></div>

            <div className={`flex items-center ${currentStep === 'form' ? 'text-ocean-blue' : currentStep === 'payment' ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep === 'form' ? 'bg-ocean-blue text-white' : 
                currentStep === 'payment' ? 'bg-green-600 text-white' : 
                'bg-gray-200 text-gray-400'
              }`}>
                {currentStep === 'payment' ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  '2'
                )}
              </div>
              <span className="ml-2 text-sm font-medium">Dettagli prenotazione</span>
            </div>

            <div className={`h-px w-16 ${currentStep === 'payment' ? 'bg-green-600' : 'bg-gray-200'}`}></div>

            <div className={`flex items-center ${currentStep === 'payment' ? 'text-ocean-blue' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep === 'payment' ? 'bg-ocean-blue text-white' : 'bg-gray-200 text-gray-400'
              }`}>
                <Shield className="h-4 w-4" />
              </div>
              <span className="ml-2 text-sm font-medium">Pagamento</span>
            </div>
          </div>
        </div>

        {/* Boat Header */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <img
                src={boat.images?.[0] || "/api/placeholder/300/200"}
                alt={boat.name}
                className="w-full md:w-80 h-48 object-cover rounded-lg"
              />
              
              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">{boat.name}</h1>
                    <p className="text-gray-600 flex items-center gap-1 mt-1">
                      <MapPin className="h-4 w-4" />
                      {boat.port}
                    </p>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex items-center gap-1 mb-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="font-medium">4.8</span>
                      <span className="text-sm text-gray-500">(24 recensioni)</span>
                    </div>
                    <p className="text-2xl font-bold text-ocean-blue">€{boat.pricePerDay}/giorno</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">Fino a {boat.maxPersons} ospiti</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Anchor className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{boat.type}</span>
                  </div>
                  
                  {boat.wifiAvailable && (
                    <div className="flex items-center gap-2">
                      <Wifi className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">WiFi</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <Camera className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{boat.images?.length || 0} foto</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {boat.skipperRequired && (
                    <Badge variant="outline">Skipper richiesto</Badge>
                  )}
                  {boat.fuelIncluded && (
                    <Badge variant="outline">Carburante incluso</Badge>
                  )}
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    Cancellazione gratuita
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        {currentStep === 'calendar' && (
          <BookingCalendar
            boatId={boat.id}
            pricePerDay={boat.pricePerDay}
            onDateSelect={handleDateSelect}
          />
        )}

        {currentStep === 'form' && bookingData && (
          <BookingForm
            boat={boat}
            booking={bookingData}
            onBookingComplete={handleBookingComplete}
          />
        )}
      </div>

      <Footer />
    </div>
  );
}