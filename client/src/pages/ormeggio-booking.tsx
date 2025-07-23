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
  SortAsc
} from 'lucide-react';
import { Link } from 'wouter';

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
  const [destination, setDestination] = useState<string>('');
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();
  const [boatLength, setBoatLength] = useState<string>('');
  const [guests, setGuests] = useState<string>('1');
  const [sortBy, setSortBy] = useState<string>('price');
  const [priceRange, setPriceRange] = useState<string>('all');

  // Mock data per ormeggi stile Booking.com con opzioni noleggiatori
  const mooringSpots: MooringSpot[] = [
    {
      id: '1',
      title: 'Porto di Civitavecchia - Pontile Premium',
      port: 'Civitavecchia',
      location: 'Porto Commerciale, Civitavecchia',
      pricing: { daily: 700, weekly: 4200, monthly: 16800 },
      specs: { maxLength: 25, maxBeam: 6.5, depth: 5.0 },
      services: {
        security: true, fuel: true, water: true, electricity: true,
        wifi: true, parking: true, restaurant: true, shower: true
      },
      images: ['/attached_assets/civitavecchia-porto.jpg'],
      rating: 4.9,
      reviews: 87,
      description: 'Pontile esclusivo per yacht e imbarcazioni di lusso. Servizi premium inclusi.',
      contact: { name: 'Marina Premium Civitavecchia', phone: '+39 0766 123456', vhf: 'Canale 09' },
      availability: ['2025-07-24', '2025-07-25', '2025-07-26']
    },
    {
      id: '2',
      title: 'Marina di Gaeta - Boa Campo Boe',
      port: 'Gaeta',
      location: 'Campo Boe Gaeta, Baia del Sole',
      pricing: { daily: 150, weekly: 900, monthly: 3600 },
      specs: { maxLength: 18, maxBeam: 5.0, depth: 8.0 },
      services: {
        security: false, fuel: false, water: false, electricity: false,
        wifi: false, parking: false, restaurant: false, shower: false
      },
      images: ['/attached_assets/gaeta-marina.jpg'],
      rating: 4.2,
      reviews: 156,
      description: 'Boa sicura nel campo boe di Gaeta. Ideale per soste brevi e medie.',
      contact: { name: 'Ormeggi Gaeta', phone: '+39 0771 987654', vhf: 'Canale 12' },
      availability: ['2025-07-24', '2025-07-25', '2025-07-26']
    },
    {
      id: '3',
      title: 'Porto di Anzio - Pontile Standard',
      port: 'Anzio',
      location: 'Porto di Anzio, Molo Commerciale',
      pricing: { daily: 450, weekly: 2700, monthly: 10800 },
      specs: { maxLength: 20, maxBeam: 5.5, depth: 4.0 },
      services: {
        security: true, fuel: true, water: true, electricity: true,
        wifi: true, parking: true, restaurant: false, shower: true
      },
      images: ['/attached_assets/anzio-porto.jpg'],
      rating: 4.5,
      reviews: 93,
      description: 'Pontile standard con servizi essenziali nel centro di Anzio.',
      contact: { name: 'Porto Anzio', phone: '+39 06 123789', vhf: 'Canale 16' },
      availability: ['2025-07-24', '2025-07-25', '2025-07-26']
    },
    {
      id: '4',
      title: 'Terracina - Boa Economica',
      port: 'Terracina',
      location: 'Campo Boe Terracina, Riviera di Ponente',
      pricing: { daily: 120, weekly: 720, monthly: 2880 },
      specs: { maxLength: 15, maxBeam: 4.5, depth: 6.0 },
      services: {
        security: false, fuel: false, water: false, electricity: false,
        wifi: false, parking: false, restaurant: false, shower: false
      },
      images: ['/attached_assets/terracina-porto.jpg'],
      rating: 3.9,
      reviews: 201,
      description: 'Boa economica per ormeggi di breve durata. Solo ancoraggio sicuro.',
      contact: { name: 'Boe Terracina', phone: '+39 0773 456789', vhf: 'Canale 14' },
      availability: ['2025-07-24', '2025-07-25', '2025-07-26']
    },
    {
      id: '5',
      title: 'Formia - Pontile Medio',
      port: 'Formia',
      location: 'Marina di Formia, Via del Porto',
      pricing: { daily: 350, weekly: 2100, monthly: 8400 },
      specs: { maxLength: 16, maxBeam: 4.8, depth: 3.5 },
      services: {
        security: true, fuel: false, water: true, electricity: true,
        wifi: false, parking: true, restaurant: true, shower: true
      },
      images: ['/attached_assets/formia-marina.jpg'],
      rating: 4.4,
      reviews: 67,
      description: 'Pontile con servizi base in posizione strategica tra Gaeta e Sperlonga.',
      contact: { name: 'Marina Formia', phone: '+39 0771 234567', vhf: 'Canale 11' },
      availability: ['2025-07-24', '2025-07-25', '2025-07-26']
    },
    {
      id: '6',
      title: 'Nettuno - Boa Premium',
      port: 'Nettuno',
      location: 'Campo Boe Nettuno, Costa Sud',
      pricing: { daily: 200, weekly: 1200, monthly: 4800 },
      specs: { maxLength: 22, maxBeam: 5.8, depth: 10.0 },
      services: {
        security: false, fuel: false, water: false, electricity: false,
        wifi: false, parking: false, restaurant: false, shower: false
      },
      images: ['/attached_assets/nettuno-porto.jpg'],
      rating: 4.1,
      reviews: 134,
      description: 'Boa premium in acque profonde, ideale per imbarcazioni di grandi dimensioni.',
      contact: { name: 'Ormeggi Nettuno', phone: '+39 06 987654', vhf: 'Canale 13' },
      availability: ['2025-07-24', '2025-07-25', '2025-07-26']
    }
  ];

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
      
      {/* Hero Search Section - Stile Booking.com */}
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
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Dove vuoi ormeggiare?"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      className="pl-10"
                    />
                  </div>
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

      {/* Filters and Results */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-80 space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-4 flex items-center">
                  <Filter className="h-5 w-5 mr-2" />
                  Filtri
                </h3>
                
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

          {/* Results */}
          <div className="flex-1 space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">
                {sortedSpots.length} ormeggi trovati
              </h2>
              <Button variant="outline" size="sm">
                <SortAsc className="h-4 w-4 mr-2" />
                Ordina
              </Button>
            </div>

            {/* Mooring Cards */}
            {sortedSpots.map((spot) => (
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
                      <Button size="sm" variant="ghost" className="bg-white/80 hover:bg-white">
                        <Heart className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="bg-white/80 hover:bg-white">
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

                    {/* Action Buttons */}
                    <div className="flex justify-between items-center">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          Dettagli
                        </Button>
                        <Button variant="outline" size="sm">
                          <Phone className="h-4 w-4 mr-1" />
                          {spot.contact.vhf}
                        </Button>
                      </div>
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        Prenota Ora
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </Button>
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

export default OrmeggioBookingPage;