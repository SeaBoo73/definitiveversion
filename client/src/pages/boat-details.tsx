import { useRoute, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { BookingModal } from "@/components/booking-modal";
import { useState } from "react";
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
  Share2
} from "lucide-react";
import { Boat } from "@shared/schema";

export default function BoatDetails() {
  const [, params] = useRoute("/boats/:id");
  const [, setLocation] = useLocation();
  const [showBookingModal, setShowBookingModal] = useState(false);
  
  const id = params?.id;

  const { data: boat, isLoading } = useQuery<Boat>({
    queryKey: ["/api/boats", id],
    enabled: !!id,
  });

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
      yacht: "Yacht",
      catamarano: "Catamarano",
      jetski: "Moto d'acqua",
      sailboat: "Barca a vela",
      kayak: "Kayak",
      charter: "Charter",
      houseboat: "Houseboat",
    };
    return labels[boat.type] || boat.type;
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
                    <p className="text-sm text-gray-600">Escluso</p>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Reviews */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Recensioni</h2>
              <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    </div>
                    <span className="ml-2 font-medium">Marco</span>
                    <span className="ml-2 text-sm text-gray-600">• 2 settimane fa</span>
                  </div>
                  <p className="text-gray-600">
                    Esperienza fantastica! L'imbarcazione era perfetta e il proprietario molto disponibile. 
                    Consiglio assolutamente!
                  </p>
                </div>
              </div>
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
                    <span>Commissione SeaGO</span>
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
