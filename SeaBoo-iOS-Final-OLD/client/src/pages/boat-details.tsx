import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { BookingModal } from "@/components/booking-modal";
import { ReviewSystem } from "@/components/review-system";
import { useState, useEffect } from "react";
import { 
  MapPin, 
  Users, 
  Calendar, 
  Star, 
  Anchor, 
  Shield, 
  Fuel,
  UserCheck,
  MessageCircle,
  Heart,
  Share2,
  Clock,
  AlertCircle,
  ArrowLeft
} from "lucide-react";
import { Boat } from "@shared/schema";

export default function BoatDetails() {
  const [location, setLocation] = useLocation();
  const [showBookingModal, setShowBookingModal] = useState(false);
  
  // Extract boat ID from URL path
  const pathParts = location.split('/');
  const boatIndex = pathParts.indexOf('boats') + 1;
  const id = boatIndex > 0 && pathParts[boatIndex] ? pathParts[boatIndex] : null;

  // Debug logging
  console.log('🚢 BoatDetails Debug:', { location, pathParts, boatIndex, id });

  const { data: boat, isLoading } = useQuery<Boat>({
    queryKey: ["/api/boats", id],
    enabled: !!id,
  });

  // Scroll to top when component mounts or boat changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="animate-pulse">
          <div className="h-96 bg-gray-200"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
              <div className="h-80 bg-gray-200 rounded-xl"></div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!boat) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Imbarcazione non trovata</h1>
          <p className="text-gray-600 mt-2">L'imbarcazione che stai cercando non esiste o non è più disponibile.</p>
        </div>
        <Footer />
      </div>
    );
  }

  const getTypeLabel = () => {
    const labels = {
      gommone: "Gommone",
      "barche-senza-patente": "Barche senza patente",
      yacht: "Yacht",
      catamarano: "Catamarano",
      jetski: "Moto d'acqua",
      sailboat: "Barca a vela",
      kayak: "Kayak",
      charter: "Charter",
      houseboat: "Houseboat",
    };
    return labels[boat.type as keyof typeof labels] || boat.type;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Images */}
      <div className="relative h-96 md:h-[500px]">
        <img
          src={boat.images?.[0] || "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=500"}
          alt={boat.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="absolute bottom-4 right-4 flex space-x-2">
          <Button size="sm" variant="secondary">
            <Heart className="h-4 w-4 mr-1" />
            Salva
          </Button>
          <Button size="sm" variant="secondary">
            <Share2 className="h-4 w-4 mr-1" />
            Condividi
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Boat Header */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <Badge className="mb-2">{getTypeLabel()}</Badge>
                  <h1 className="text-3xl font-bold text-gray-900">{boat.name}</h1>
                </div>
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <span className="ml-1 font-semibold">4.8</span>
                  <span className="ml-1 text-gray-600">(24 recensioni)</span>
                </div>
              </div>
              
              <div className="flex items-center text-gray-600 mb-4">
                <MapPin className="h-5 w-5 mr-2" />
                <span>{boat.port}</span>
              </div>

              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  <span>Fino a {boat.maxPersons} persone</span>
                </div>
                {boat.length && (
                  <div className="flex items-center">
                    <Anchor className="h-4 w-4 mr-1" />
                    <span>{boat.length}m</span>
                  </div>
                )}
                {boat.year && (
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>{boat.year}</span>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* Description */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Descrizione</h2>
              <p className="text-gray-600 leading-relaxed">
                {boat.description || "Bellissima imbarcazione perfetta per le tue avventure in mare. Dotata di tutti i comfort necessari per una giornata indimenticabile."}
              </p>
            </div>

            <Separator />

            {/* Orari e regole per barche senza patente e charter */}
            {(boat.type === "barche-senza-patente" || boat.type === "charter" || boat.type === "gommone") && (
              <>
                <div>
                  <h2 className="text-xl font-semibold mb-4">⏰ Orari di utilizzo</h2>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex items-center">
                        <Clock className="h-6 w-6 text-blue-600 mr-3" />
                        <div>
                          <p className="font-semibold text-blue-900">Orario di ritiro</p>
                          <p className="text-blue-700">{boat.pickupTime || "09:00"}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <Clock className="h-6 w-6 text-blue-600 mr-3" />
                        <div>
                          <p className="font-semibold text-blue-900">Orario di riconsegna</p>
                          <p className="text-blue-700">{boat.returnTime || "18:00"}</p>
                        </div>
                      </div>
                    </div>
                    
                    {boat.dailyReturnRequired && (
                      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                        <div className="flex items-start">
                          <AlertCircle className="h-5 w-5 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-semibold text-yellow-800">Rientro serale obbligatorio</p>
                            <p className="text-yellow-700 text-sm mt-1">
                              Anche per prenotazioni di più giorni, la barca deve essere riportata al punto di partenza ogni sera entro l'orario indicato.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <Separator />
              </>
            )}

            {/* Features */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Caratteristiche</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <Users className="h-5 w-5 text-ocean-blue mr-3" />
                  <div>
                    <p className="font-medium">Capacità</p>
                    <p className="text-sm text-gray-600">Fino a {boat.maxPersons} persone</p>
                  </div>
                </div>
                
                {boat.motorization && (
                  <div className="flex items-center">
                    <Anchor className="h-5 w-5 text-ocean-blue mr-3" />
                    <div>
                      <p className="font-medium">Motorizzazione</p>
                      <p className="text-sm text-gray-600">{boat.motorization}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center">
                  <Shield className="h-5 w-5 text-ocean-blue mr-3" />
                  <div>
                    <p className="font-medium">Patente richiesta</p>
                    <p className="text-sm text-gray-600">{boat.licenseRequired ? "Sì" : "No"}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <UserCheck className="h-5 w-5 text-ocean-blue mr-3" />
                  <div>
                    <p className="font-medium">Skipper</p>
                    <p className="text-sm text-gray-600">{boat.skipperRequired ? "Obbligatorio" : "Opzionale"}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Fuel className="h-5 w-5 text-ocean-blue mr-3" />
                  <div>
                    <p className="font-medium">Carburante</p>
                    <p className="text-sm text-gray-600">
                      {boat.type === "charter" ? "Incluso" : "Escluso"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Reviews System Integration */}
            <div>
              <ReviewSystem 
                boatId={boat.id} 
                canReview={false} // This would be true if user has completed booking
              />
            </div>
          </div>

          {/* Booking Card */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <div className="mb-6">
                  <div className="flex items-baseline">
                    <span className="text-3xl font-bold">€{boat.pricePerDay}</span>
                    <span className="text-gray-600 ml-1">al giorno</span>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <Button
                    className="w-full bg-coral hover:bg-orange-600 text-white py-3"
                    onClick={() => setLocation(`/boats/${boat.id}/book`)}
                  >
                    Prenota ora
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => setLocation(`/boats/${boat.id}/availability`)}
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Calendario Avanzato
                  </Button>
                  
                  <Button variant="outline" className="w-full">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Contatta il proprietario
                  </Button>
                </div>

                <div className="text-center text-sm text-gray-600 mb-4">
                  Non ti verrà addebitato nulla per ora
                </div>

                <Separator className="my-4" />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>€{boat.pricePerDay} x 1 giorno</span>
                    <span>€{boat.pricePerDay}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Commissione SeaBoo</span>
                    <span>€{(Number(boat.pricePerDay) * 0.15).toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold">
                    <span>Totale</span>
                    <span>€{(Number(boat.pricePerDay) * 1.15).toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {showBookingModal && (
        <BookingModal
          boat={boat}
          onClose={() => setShowBookingModal(false)}
        />
      )}

      <Footer />
    </div>
  );
}
