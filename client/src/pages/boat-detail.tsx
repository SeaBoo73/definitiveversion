import { useState, useEffect } from "react";
import { useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { BookingModal } from "@/components/booking-modal";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { 
  MapPin, 
  Users, 
  Star, 
  Anchor, 
  Fuel, 
  Shield, 
  Calendar,
  Clock,
  ArrowLeft,
  Heart,
  Share2,
  UserCheck,
  AlertTriangle
} from "lucide-react";
import { Link } from "wouter";

export function BoatDetail() {
  const [match, params] = useRoute("/boats/:id");
  const { user } = useAuth();
  const { toast } = useToast();
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  const { data: boat, isLoading, error } = useQuery({
    queryKey: ["/api/boats", params?.id],
    enabled: !!params?.id,
  });

  // Type guard to ensure boat has the right type
  const boatData = boat as any;

  const { data: reviews } = useQuery({
    queryKey: ["/api/reviews", params?.id],
    enabled: !!params?.id,
  });

  useEffect(() => {
    if (!match) return;
    
    // Check URL for redirect parameter to auto-open booking
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('booking') === 'true' && user) {
      setShowBookingModal(true);
    }
  }, [match, user]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ocean-blue"></div>
      </div>
    );
  }

  if (error || !boatData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Imbarcazione non trovata</h1>
          <p className="text-gray-600 mb-4">L'imbarcazione che stai cercando non esiste o è stata rimossa.</p>
          <Link href="/">
            <Button>Torna alla homepage</Button>
          </Link>
        </div>
      </div>
    );
  }

  const images = boatData.images || [
    "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
  ];

  const handleBookNow = () => {
    if (!user) {
      window.location.href = `/auth?redirect=/boats/${boatData.id}?booking=true`;
    } else {
      setShowBookingModal(true);
    }
  };

  const shareBoat = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${boatData.name} - SeaGO`,
          text: `Scopri questa fantastica imbarcazione: ${boatData.name}`,
          url: window.location.href,
        });
      } catch (err: any) {
        // Fallback to clipboard
        navigator.clipboard.writeText(window.location.href);
        toast({ title: "Link copiato negli appunti!" });
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({ title: "Link copiato negli appunti!" });
    }
  };

  const getBadgeColor = () => {
    switch (boatData.type) {
      case "yacht": return "bg-coral text-white";
      case "catamarano": return "bg-deep-navy text-white";
      case "gommone": return "bg-yellow-500 text-white";
      default: return "bg-seafoam text-white";
    }
  };

  const getTypeLabel = () => {
    const labels: { [key: string]: string } = {
      gommone: "Gommone",
      yacht: "Yacht",
      catamarano: "Catamarano",
      jetski: "Moto d'acqua",
      sailboat: "Barca a vela",
      kayak: "Kayak",
      charter: "Charter",
      houseboat: "Houseboat",
      "barche-senza-patente": "Barche senza patente",
      "motorboat": "Barche a motore",
      "gulet": "Gulet"
    };
    return labels[boatData.type] || boatData.type;
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Indietro
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={shareBoat}>
                <Share2 className="h-4 w-4 mr-2" />
                Condividi
              </Button>
              {user && (
                <Button variant="ghost" size="sm" onClick={() => setIsFavorite(!isFavorite)}>
                  <Heart className={`h-4 w-4 mr-2 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
                  Preferiti
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <Card className="overflow-hidden">
              <div className="relative">
                <img
                  src={images[currentImageIndex]}
                  alt={boatData.name}
                  className="w-full h-80 object-cover"
                />
                <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-sm font-semibold ${getBadgeColor()}`}>
                  {getTypeLabel()}
                </div>
                {images.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                    {images.map((_: any, index: number) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-3 h-3 rounded-full ${
                          index === currentImageIndex ? "bg-white" : "bg-white/50"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </Card>

            {/* Boat Info */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl">{boatData.name}</CardTitle>
                    <div className="flex items-center mt-2 text-gray-600">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{boatData.port}</span>
                      <div className="flex items-center ml-4">
                        <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                        <span>4.8 (127 recensioni)</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-gray-900">€{boatData.pricePerDay}</div>
                    <div className="text-gray-600">per giorno</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="flex items-center">
                    <Users className="h-5 w-5 text-gray-400 mr-2" />
                    <div>
                      <div className="font-semibold">{boatData.maxPersons}</div>
                      <div className="text-sm text-gray-600">Persone</div>
                    </div>
                  </div>
                  {boatData.length && (
                    <div className="flex items-center">
                      <Anchor className="h-5 w-5 text-gray-400 mr-2" />
                      <div>
                        <div className="font-semibold">{boatData.length}m</div>
                        <div className="text-sm text-gray-600">Lunghezza</div>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center">
                    <Fuel className="h-5 w-5 text-gray-400 mr-2" />
                    <div>
                      <div className="font-semibold">{boatData.fuelIncluded ? "Incluso" : "Escluso"}</div>
                      <div className="text-sm text-gray-600">Carburante</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <UserCheck className="h-5 w-5 text-gray-400 mr-2" />
                    <div>
                      <div className="font-semibold">{boatData.skipperRequired ? "Obbligatorio" : "Opzionale"}</div>
                      <div className="text-sm text-gray-600">Skipper</div>
                    </div>
                  </div>
                </div>

                {/* Schedule info for specific boat types */}
                {(boatData.type === "barche-senza-patente" || boatData.type === "charter" || boatData.type === "gommone") && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center text-blue-800 mb-2">
                      <Clock className="h-5 w-5 mr-2" />
                      <h3 className="font-semibold">Orari di utilizzo</h3>
                    </div>
                    <div className="text-blue-700">
                      <p>Ritiro: {boatData.pickupTime || "09:00"} - Riconsegna: {boatData.returnTime || "18:00"}</p>
                      {boatData.dailyReturnRequired && (
                        <div className="flex items-center mt-2">
                          <AlertTriangle className="h-4 w-4 mr-1" />
                          <span className="text-sm">Rientro serale obbligatorio ogni giorno</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <Separator className="my-6" />

                <div>
                  <h3 className="font-semibold mb-3">Descrizione</h3>
                  <p className="text-gray-700 leading-relaxed">
                    {boatData.description || `Scopri il mare con ${boatData.name}, una fantastica ${getTypeLabel().toLowerCase()} perfetta per le tue avventure marittime. Con capacità fino a ${boatData.maxPersons} persone, questa imbarcazione ti garantirà comfort e sicurezza durante la tua navigazione lungo la costa italiana.`}
                  </p>
                </div>

                {boatData.equipment && (
                  <div className="mt-6">
                    <h3 className="font-semibold mb-3">Equipaggiamenti inclusi</h3>
                    <div className="flex flex-wrap gap-2">
                      {boatData.equipment.split(',').map((item: any, index: number) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {item.trim()}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-32">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Prenota ora</span>
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    Disponibile
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900 mb-1">€{boatData.pricePerDay}</div>
                  <div className="text-gray-600">per giorno</div>
                </div>

                <Button 
                  className="w-full bg-ocean-blue hover:bg-blue-600 h-12 text-lg font-semibold"
                  onClick={handleBookNow}
                  data-testid="button-prenota-detail"
                >
                  {user ? "Prenota ora" : "Accedi per prenotare"}
                </Button>

                <div className="text-center text-sm text-gray-600">
                  <div className="flex items-center justify-center">
                    <Shield className="h-4 w-4 mr-1" />
                    Prenotazione sicura con Stripe
                  </div>
                  <div className="mt-1">Cancellazione gratuita fino a 24h prima</div>
                </div>

                <Separator />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Commissione SeaGO (15%)</span>
                    <span>Inclusa nel prezzo</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Assicurazione</span>
                    <span>Inclusa</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Supporto 24/7</span>
                    <span>Incluso</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <BookingModal 
          boat={boatData} 
          onClose={() => setShowBookingModal(false)} 
        />
      )}
    </div>
  );
}