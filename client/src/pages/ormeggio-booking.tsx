import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { PortSelector } from '@/components/port-selector';
import { useToast } from '@/hooks/use-toast';
import { useMooringFavorites } from '@/hooks/use-favorites';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import { 
  Anchor, 
  MapPin, 
  Star, 
  Phone, 
  Euro, 
  Shield, 
  Users,
  Calendar as CalendarIcon,
  Search,
  Filter,
  Clock,
  Wifi,
  Car,
  Fuel,
  ShowerHead,
  Zap,
  ArrowRight,
  CheckCircle,
  Heart,
  Share2,
  SortAsc,
  Home,
  X
} from 'lucide-react';
import { Link, useRoute } from 'wouter';
import { Breadcrumbs } from '@/components/breadcrumbs';

interface MooringSpot {
  id: string;
  title: string;
  port: string;
  location: string;
  pricing: {
    daily: number;
    weekly: number;
    monthly: number;
  };
  specs: {
    maxLength: number;
    maxBeam: number;
    depth: number;
  };
  services: {
    security: boolean;
    fuel: boolean;
    water: boolean;
    electricity: boolean;
    wifi: boolean;
    parking: boolean;
    restaurant: boolean;
    shower: boolean;
  };
  images: string[];
  rating: number;
  reviews: number;
  description: string;
  contact: {
    name: string;
    phone: string;
    vhf: string;
  };
  availability: string[];
}

export default function OrmeggioBookingPage() {
  const [match, params] = useRoute('/ormeggio/:id');
  const [destination, setDestination] = useState<string>('');
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();
  const [boatLength, setBoatLength] = useState<string>('');
  const [guests, setGuests] = useState<string>('1');
  const [sortBy, setSortBy] = useState<string>('price');
  const [priceRange, setPriceRange] = useState<string>('all');
  const { toast } = useToast();
  const { toggleFavorite, isFavorite } = useMooringFavorites();

  // Funzione per condividere l'ormeggio
  const handleShare = async (spot: MooringSpot) => {
    const shareUrl = `${window.location.origin}/ormeggio/${spot.id}`;
    const shareData = {
      title: spot.title,
      text: `Scopri questo ormeggio su SeaBoo: ${spot.title} - €${spot.pricing.daily}/notte`,
      url: shareUrl,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        toast({
          title: "Condiviso!",
          description: "Link condiviso con successo",
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        toast({
          title: "Link copiato!",
          description: "Il link è stato copiato negli appunti",
        });
      }
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        try {
          await navigator.clipboard.writeText(shareUrl);
          toast({
            title: "Link copiato!",
            description: "Il link è stato copiato negli appunti",
          });
        } catch {
          toast({
            title: "Errore",
            description: "Impossibile condividere o copiare il link",
            variant: "destructive",
          });
        }
      }
    }
  };

  // Funzione per gestire i preferiti
  const handleToggleFavorite = (spotId: string, spotTitle: string) => {
    const wasFavorite = isFavorite(spotId);
    toggleFavorite(spotId);
    toast({
      title: wasFavorite ? "Rimosso dai preferiti" : "Aggiunto ai preferiti",
      description: wasFavorite 
        ? `${spotTitle} è stato rimosso dai tuoi preferiti`
        : `${spotTitle} è stato aggiunto ai tuoi preferiti`,
    });
  };

  // Array vuoto - i dati reali verranno caricati dal database
  const mooringSpots: MooringSpot[] = [];

  // Find the specific mooring based on the URL parameter
  const mooringId = params?.id;
  const selectedMooring = mooringSpots.find(spot => spot.id === mooringId);

  // If no mooring found, redirect to list or show error
  if (!selectedMooring && mooringId) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Card>
            <CardContent className="p-12 text-center">
              <Anchor className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-4">Ormeggio Non Trovato</h2>
              <p className="text-gray-600 mb-6">L'ormeggio che stai cercando non esiste.</p>
              <Button asChild>
                <Link href="/ormeggio">
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Torna alla Lista Ormeggi
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  const filteredSpots = mooringSpots.filter(spot => {
    if (destination && !spot.location.toLowerCase().includes(destination.toLowerCase())) {
      return false;
    }
    if (boatLength && spot.specs.maxLength < parseInt(boatLength)) {
      return false;
    }
    if (priceRange !== 'all') {
      const [min, max] = priceRange.split('-').map(Number);
      if (spot.pricing.daily < min || spot.pricing.daily > max) {
        return false;
      }
    }
    return true;
  });

  const sortedSpots = [...filteredSpots].sort((a, b) => {
    switch (sortBy) {
      case 'price': return a.pricing.daily - b.pricing.daily;
      case 'rating': return b.rating - a.rating;
      case 'reviews': return b.reviews - a.reviews;
      case 'services': {
        const aServices = Object.values(a.services).filter(Boolean).length;
        const bServices = Object.values(b.services).filter(Boolean).length;
        return bServices - aServices;
      }
      default: return 0;
    }
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Breadcrumbs />
      
      {/* Hero Search Section - Stile Booking.com - Nascondi se c'è un mooring selezionato */}
      {!selectedMooring && (
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">Trova il Tuo Ormeggio Perfetto</h1>
            <p className="text-xl text-blue-100">
              Prenota posti barca sicuri nei migliori porti del Lazio
            </p>
          </div>

          {/* Search Box */}
          <Card className="bg-white text-gray-900 shadow-2xl max-w-6xl mx-auto">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {/* Destinazione */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Destinazione</label>
                  <PortSelector
                    value={destination}
                    onChange={setDestination}
                    placeholder="Dove vuoi ormeggiare?"
                  />
                </div>

                {/* Check-in */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Arrivo</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {checkIn ? format(checkIn, "dd/MM/yyyy", { locale: it }) : "Seleziona data"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={checkIn}
                        onSelect={setCheckIn}
                        initialFocus
                        locale={it}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Check-out */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Partenza</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {checkOut ? format(checkOut, "dd/MM/yyyy", { locale: it }) : "Seleziona data"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={checkOut}
                        onSelect={setCheckOut}
                        initialFocus
                        locale={it}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Lunghezza barca */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Lunghezza (m)</label>
                  <Select value={boatLength} onValueChange={setBoatLength}>
                    <SelectTrigger>
                      <SelectValue placeholder="Metri" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="8">Fino a 8m</SelectItem>
                      <SelectItem value="12">Fino a 12m</SelectItem>
                      <SelectItem value="15">Fino a 15m</SelectItem>
                      <SelectItem value="20">Fino a 20m</SelectItem>
                      <SelectItem value="25">Oltre 20m</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Search Button */}
                <div className="flex items-end">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 h-10">
                    <Search className="h-4 w-4 mr-2" />
                    Cerca
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
      )}

      {/* Filters and Results */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters - Nascondi se c'è un mooring selezionato */}
          {!selectedMooring && (
          <div className="lg:w-80 space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-lg flex items-center">
                    <Filter className="h-5 w-5 mr-2" />
                    Filtri
                  </h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setDestination('');
                      setCheckIn(undefined);
                      setCheckOut(undefined);
                      setBoatLength('');
                      setPriceRange('all');
                      setSortBy('price');
                    }}
                    className="text-gray-600 hover:text-red-600 hover:border-red-300"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Rimuovi filtri
                  </Button>
                </div>
                
                {/* Price Range */}
                <div className="space-y-3 mb-6">
                  <label className="text-sm font-medium">Prezzo per notte</label>
                  <Select value={priceRange} onValueChange={setPriceRange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tutti i prezzi</SelectItem>
                      <SelectItem value="100-200">€100 - €200 (Boa)</SelectItem>
                      <SelectItem value="200-400">€200 - €400 (Pontile Base)</SelectItem>
                      <SelectItem value="400-600">€400 - €600 (Pontile Standard)</SelectItem>
                      <SelectItem value="600-800">€600+ (Pontile Premium)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Sort By */}
                <div className="space-y-3">
                  <label className="text-sm font-medium">Ordina per</label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="price">Prezzo più basso</SelectItem>
                      <SelectItem value="rating">Miglior valutazione</SelectItem>
                      <SelectItem value="reviews">Più recensioni</SelectItem>
                      <SelectItem value="services">Più servizi</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>
          )}

          {/* Results */}
          <div className="flex-1 space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">
                Dettagli Ormeggio
              </h2>
            </div>

            {/* Mooring Cards */}
            {selectedMooring && [selectedMooring].map((spot) => (
              <Card key={spot.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="flex flex-col md:flex-row">
                  {/* Image */}
                  <div className="md:w-80 h-64 md:h-auto bg-gray-200 relative">
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      <Badge className="bg-green-600">Disponibile</Badge>
                      <Badge className={`${spot.title.includes('Pontile') ? 'bg-blue-600' : 'bg-orange-600'}`}>
                        {spot.title.includes('Pontile') ? 'Pontile' : 'Boa'}
                      </Badge>
                    </div>
                    <div className="absolute top-4 right-4 flex gap-2">
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="bg-white/80 hover:bg-white"
                        onClick={() => handleToggleFavorite(spot.id, spot.title)}
                        data-testid="button-favorite"
                      >
                        <Heart className={`h-4 w-4 ${isFavorite(spot.id) ? 'fill-red-500 text-red-500' : ''}`} />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="bg-white/80 hover:bg-white"
                        onClick={() => handleShare(spot)}
                        data-testid="button-share"
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                      <Anchor className="h-16 w-16 text-white" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-6">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">
                          {spot.title}
                        </h3>
                        <div className="flex items-center text-gray-600 mb-2">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span className="text-sm">{spot.location}</span>
                        </div>
                        <div className="flex items-center mb-3">
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="font-medium ml-1">{spot.rating}</span>
                            <span className="text-gray-600 ml-1">({spot.reviews} recensioni)</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600">
                          €{spot.pricing.daily}
                        </div>
                        <div className="text-sm text-gray-600">per notte</div>
                      </div>
                    </div>

                    <p className="text-gray-700 mb-4 text-sm">
                      {spot.description}
                    </p>

                    {/* Specs */}
                    <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-600">
                      <span>Max {spot.specs.maxLength}m</span>
                      <span>Larghezza {spot.specs.maxBeam}m</span>
                      <span>Profondità {spot.specs.depth}m</span>
                    </div>

                    {/* Services */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {spot.services.security && (
                        <Badge variant="secondary" className="text-xs">
                          <Shield className="h-3 w-3 mr-1" />
                          Sicurezza
                        </Badge>
                      )}
                      {spot.services.fuel && (
                        <Badge variant="secondary" className="text-xs">
                          <Fuel className="h-3 w-3 mr-1" />
                          Carburante
                        </Badge>
                      )}
                      {spot.services.wifi && (
                        <Badge variant="secondary" className="text-xs">
                          <Wifi className="h-3 w-3 mr-1" />
                          WiFi
                        </Badge>
                      )}
                      {spot.services.parking && (
                        <Badge variant="secondary" className="text-xs">
                          <Car className="h-3 w-3 mr-1" />
                          Parcheggio
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                {/* Calendario Disponibilità */}
                <div id="disponibilita" className="p-6 border-t bg-gray-50">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <CalendarIcon className="h-5 w-5 mr-2 text-blue-600" />
                    Verifica Disponibilità
                  </h3>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Calendario */}
                    <div className="bg-white rounded-lg p-4 border">
                      <Calendar
                        mode="range"
                        selected={{ from: checkIn, to: checkOut }}
                        onSelect={(range) => {
                          setCheckIn(range?.from);
                          setCheckOut(range?.to);
                        }}
                        numberOfMonths={2}
                        locale={it}
                        disabled={(date) => {
                          const today = new Date();
                          today.setHours(0, 0, 0, 0);
                          if (date < today) return true;
                          
                          // Date già prenotate (esempio)
                          const bookedDates = [
                            new Date(2025, 11, 5),
                            new Date(2025, 11, 6),
                            new Date(2025, 11, 7),
                            new Date(2025, 11, 15),
                            new Date(2025, 11, 16),
                            new Date(2025, 11, 20),
                            new Date(2025, 11, 21),
                            new Date(2025, 11, 22),
                          ];
                          
                          return bookedDates.some(bookedDate => 
                            date.getFullYear() === bookedDate.getFullYear() &&
                            date.getMonth() === bookedDate.getMonth() &&
                            date.getDate() === bookedDate.getDate()
                          );
                        }}
                        className="rounded-md"
                      />
                      
                      {/* Legenda */}
                      <div className="mt-4 flex flex-wrap gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded bg-blue-600"></div>
                          <span>Selezionato</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded bg-gray-200"></div>
                          <span>Non disponibile</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded bg-white border"></div>
                          <span>Disponibile</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Riepilogo Prenotazione */}
                    <div className="bg-white rounded-lg p-4 border">
                      <h4 className="font-semibold text-gray-900 mb-4">Riepilogo Prenotazione</h4>
                      
                      {checkIn && checkOut ? (
                        <div className="space-y-4">
                          <div className="flex justify-between items-center pb-3 border-b">
                            <span className="text-gray-600">Check-in</span>
                            <span className="font-medium">{format(checkIn, "dd MMMM yyyy", { locale: it })}</span>
                          </div>
                          <div className="flex justify-between items-center pb-3 border-b">
                            <span className="text-gray-600">Check-out</span>
                            <span className="font-medium">{format(checkOut, "dd MMMM yyyy", { locale: it })}</span>
                          </div>
                          <div className="flex justify-between items-center pb-3 border-b">
                            <span className="text-gray-600">Durata</span>
                            <span className="font-medium">
                              {Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))} notti
                            </span>
                          </div>
                          <div className="flex justify-between items-center pb-3 border-b">
                            <span className="text-gray-600">Prezzo per notte</span>
                            <span className="font-medium">€{spot.pricing.daily}</span>
                          </div>
                          <div className="flex justify-between items-center text-lg font-bold">
                            <span>Totale</span>
                            <span className="text-blue-600">
                              €{spot.pricing.daily * Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))}
                            </span>
                          </div>
                          
                          <Button className="w-full bg-blue-600 hover:bg-blue-700 mt-4" asChild>
                            <Link href={`/checkout?type=mooring&id=${spot.id}&checkIn=${checkIn.toISOString()}&checkOut=${checkOut.toISOString()}`}>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Procedi con la Prenotazione
                            </Link>
                          </Button>
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <CalendarIcon className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                          <p>Seleziona le date di arrivo e partenza nel calendario per vedere il prezzo totale</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

