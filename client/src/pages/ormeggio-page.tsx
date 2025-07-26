import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Anchor, 
  MapPin, 
  Shield, 
  Clock,
  Euro,
  Star,
  Phone,
  Wifi,
  Fuel,
  Droplet,
  Zap,
  Car,
  Search,
  Filter,
  Calendar,
  Users,
  CheckCircle2,
  Heart,
  Share2,
  ArrowLeft
} from 'lucide-react';
import { Link } from 'wouter';

interface MooringSpot {
  id: string;
  ownerId: number;
  title: string;
  port: string;
  location: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  pricing: {
    daily: number;
    weekly: number;
    monthly: number;
    seasonal: number;
  };
  specs: {
    maxLength: number;
    maxBeam: number;
    depth: number;
    draft: number;
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
  availability: {
    startDate: string;
    endDate: string;
    minStay: number;
  };
  images: string[];
  rating: number;
  reviews: number;
  description: string;
  contact: {
    name: string;
    phone: string;
    email: string;
  };
  rules: string[];
  featured: boolean;
}

// Dati mock per i posti barca disponibili
const mooringSpots: MooringSpot[] = [
  {
    id: "mooring-1",
    ownerId: 1,
    title: "Posto Barca Premium - Marina Civitavecchia",
    port: "Marina di Civitavecchia",
    location: "Civitavecchia, Roma",
    coordinates: { lat: 42.0942, lng: 11.7939 },
    pricing: {
      daily: 45,
      weekly: 280,
      monthly: 1050,
      seasonal: 5200
    },
    specs: {
      maxLength: 15,
      maxBeam: 4.5,
      depth: 3.5,
      draft: 2.8
    },
    services: {
      security: true,
      fuel: true,
      water: true,
      electricity: true,
      wifi: true,
      parking: true,
      restaurant: true,
      shower: true
    },
    availability: {
      startDate: "2025-01-25",
      endDate: "2025-10-31",
      minStay: 1
    },
    images: ["/api/images/marina-civitavecchia.jpg"],
    rating: 4.8,
    reviews: 24,
    description: "Posto barca in marina protetta con tutti i servizi. Ideale per barche fino a 15 metri. Accesso diretto al centro città e ottimi collegamenti con Roma.",
    contact: {
      name: "Marco Rossi",
      phone: "+39 335 1234567",
      email: "marco.rossi@email.com"
    },
    rules: [
      "Check-in dalle 9:00 alle 18:00",
      "Mantenere la barca in condizioni pulite",
      "Rispettare il regolamento del porto",
      "Assicurazione obbligatoria"
    ],
    featured: true
  },
  {
    id: "mooring-2",
    ownerId: 2,
    title: "Ormeggio Economico - Porto di Anzio",
    port: "Porto di Anzio",
    location: "Anzio, Roma",
    coordinates: { lat: 41.4498, lng: 12.6194 },
    pricing: {
      daily: 32,
      weekly: 195,
      monthly: 750,
      seasonal: 3600
    },
    specs: {
      maxLength: 12,
      maxBeam: 3.8,
      depth: 2.8,
      draft: 2.2
    },
    services: {
      security: true,
      fuel: true,
      water: true,
      electricity: true,
      wifi: false,
      parking: true,
      restaurant: false,
      shower: true
    },
    availability: {
      startDate: "2025-01-25",
      endDate: "2025-09-30",
      minStay: 2
    },
    images: ["/api/images/porto-anzio.jpg"],
    rating: 4.5,
    reviews: 18,
    description: "Posto barca economico nel porto storico di Anzio. Servizi essenziali disponibili, vicino alle spiagge e ai ristoranti di pesce.",
    contact: {
      name: "Giulia Bianchi",
      phone: "+39 347 9876543",
      email: "giulia.bianchi@email.com"
    },
    rules: [
      "Check-in dalle 8:00 alle 20:00",
      "Soggiorno minimo 2 giorni",
      "Pulizia inclusa nel prezzo",
      "Accesso limitato dopo le 22:00"
    ],
    featured: false
  },
  {
    id: "mooring-3",
    ownerId: 3,
    title: "Posto Yacht di Lusso - Marina Gaeta",
    port: "Marina di Gaeta",
    location: "Gaeta, Latina",
    coordinates: { lat: 41.2133, lng: 13.5681 },
    pricing: {
      daily: 65,
      weekly: 420,
      monthly: 1580,
      seasonal: 7800
    },
    specs: {
      maxLength: 25,
      maxBeam: 6.0,
      depth: 4.5,
      draft: 3.5
    },
    services: {
      security: true,
      fuel: true,
      water: true,
      electricity: true,
      wifi: true,
      parking: true,
      restaurant: true,
      shower: true
    },
    availability: {
      startDate: "2025-01-25",
      endDate: "2025-11-15",
      minStay: 3
    },
    images: ["/api/images/marina-gaeta.jpg"],
    rating: 4.9,
    reviews: 31,
    description: "Posto barca premium per yacht di lusso nella splendida baia di Gaeta. Servizi di concierge, ristorante gourmet e spa.",
    contact: {
      name: "Antonio Verdi",
      phone: "+39 328 5555777",
      email: "antonio.verdi@email.com"
    },
    rules: [
      "Check-in con servizio concierge",
      "Yacht fino a 25 metri",
      "Servizio pulizia professionale",
      "Accesso VIP al club nautico"
    ],
    featured: true
  }
];

export default function OrmeggioPage() {
  const [searchLocation, setSearchLocation] = useState("");
  const [maxLength, setMaxLength] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [services, setServices] = useState("");
  const [sortBy, setSortBy] = useState("featured");

  const filteredSpots = mooringSpots.filter(spot => {
    if (searchLocation && !spot.location.toLowerCase().includes(searchLocation.toLowerCase())) return false;
    if (maxLength && spot.specs.maxLength < parseInt(maxLength)) return false;
    if (priceRange) {
      const price = spot.pricing.daily;
      if (priceRange === "0-30" && price > 30) return false;
      if (priceRange === "30-50" && (price < 30 || price > 50)) return false;
      if (priceRange === "50+" && price < 50) return false;
    }
    return true;
  });

  const sortedSpots = [...filteredSpots].sort((a, b) => {
    if (sortBy === "featured") return b.featured ? 1 : -1;
    if (sortBy === "price") return a.pricing.daily - b.pricing.daily;
    if (sortBy === "rating") return b.rating - a.rating;
    return 0;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back to Home Button */}
          <div className="mb-6">
            <Button variant="outline" asChild className="text-white border-white hover:bg-white hover:text-blue-600">
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Torna alla Home
              </Link>
            </Button>
          </div>
          
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Marketplace Ormeggi
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Trova il posto barca perfetto o affitta il tuo ormeggio. Mai più barche in rada!
            </p>
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-12">
            <div className="text-center">
              <div className="text-3xl font-bold">{mooringSpots.length}</div>
              <div className="text-blue-200">Posti Disponibili</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">5</div>
              <div className="text-blue-200">Porti Partner</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">€32+</div>
              <div className="text-blue-200">Da /giorno</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">4.7★</div>
              <div className="text-blue-200">Rating Medio</div>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-8 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Dove vuoi ormeggiare?"
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={maxLength} onValueChange={setMaxLength}>
              <SelectTrigger>
                <SelectValue placeholder="Lunghezza barca" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Tutte le lunghezze</SelectItem>
                <SelectItem value="8">Fino a 8m</SelectItem>
                <SelectItem value="12">Fino a 12m</SelectItem>
                <SelectItem value="15">Fino a 15m</SelectItem>
                <SelectItem value="20">Fino a 20m</SelectItem>
                <SelectItem value="25">Fino a 25m</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={priceRange} onValueChange={setPriceRange}>
              <SelectTrigger>
                <SelectValue placeholder="Prezzo/giorno" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Tutti i prezzi</SelectItem>
                <SelectItem value="0-30">€0 - €30</SelectItem>
                <SelectItem value="30-50">€30 - €50</SelectItem>
                <SelectItem value="50+">€50+</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={services} onValueChange={setServices}>
              <SelectTrigger>
                <SelectValue placeholder="Servizi" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Tutti i servizi</SelectItem>
                <SelectItem value="wifi">WiFi</SelectItem>
                <SelectItem value="fuel">Carburante</SelectItem>
                <SelectItem value="restaurant">Ristorante</SelectItem>
                <SelectItem value="parking">Parcheggio</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Ordina per" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">In evidenza</SelectItem>
                <SelectItem value="price">Prezzo crescente</SelectItem>
                <SelectItem value="rating">Rating più alto</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* CTA for Boat Owners */}
      <section className="py-8 bg-green-50 border-y">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-bold text-gray-900">Hai un posto barca libero?</h3>
              <p className="text-gray-600">Affittalo e guadagna fino a €1.500+ al mese</p>
            </div>
            <Button className="bg-green-600 hover:bg-green-700 font-bold" asChild>
              <Link href="/diventa-noleggiatore">
                <Anchor className="h-4 w-4 mr-2" />
                Affitta il Tuo Ormeggio
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Mooring Spots Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              {filteredSpots.length} Posti Barca Disponibili
            </h2>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Filter className="h-4 w-4" />
              <span>Filtri attivi: {[searchLocation, maxLength, priceRange, services].filter(Boolean).length}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {sortedSpots.map((spot) => (
              <Card key={spot.id} className="overflow-hidden hover:shadow-xl transition-shadow">
                <div className="relative">
                  <img 
                    src={spot.images[0]} 
                    alt={spot.title}
                    className="w-full h-48 object-cover"
                  />
                  {spot.featured && (
                    <Badge className="absolute top-3 left-3 bg-yellow-500 text-white">
                      In Evidenza
                    </Badge>
                  )}
                  <div className="absolute top-3 right-3 flex gap-2">
                    <Button size="sm" variant="ghost" className="bg-white/80 hover:bg-white p-2">
                      <Heart className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="bg-white/80 hover:bg-white p-2">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-bold text-lg text-gray-900 mb-1">{spot.title}</h3>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <MapPin className="h-4 w-4" />
                        <span>{spot.location}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="font-medium">{spot.rating}</span>
                      <span className="text-sm text-gray-500">({spot.reviews})</span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-700 mb-4 line-clamp-2">
                    {spot.description}
                  </p>

                  {/* Specs */}
                  <div className="grid grid-cols-2 gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm">
                      <span className="text-gray-600">Max:</span>
                      <span className="font-medium ml-1">{spot.specs.maxLength}m</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-600">Pescaggio:</span>
                      <span className="font-medium ml-1">{spot.specs.draft}m</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-600">Larghezza:</span>
                      <span className="font-medium ml-1">{spot.specs.maxBeam}m</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-600">Profondità:</span>
                      <span className="font-medium ml-1">{spot.specs.depth}m</span>
                    </div>
                  </div>

                  {/* Services Icons */}
                  <div className="flex gap-2 mb-4">
                    {spot.services.security && <Shield className="h-5 w-5 text-green-500" />}
                    {spot.services.fuel && <Fuel className="h-5 w-5 text-orange-500" />}
                    {spot.services.water && <Droplet className="h-5 w-5 text-blue-500" />}
                    {spot.services.electricity && <Zap className="h-5 w-5 text-yellow-500" />}
                    {spot.services.wifi && <Wifi className="h-5 w-5 text-purple-500" />}
                    {spot.services.parking && <Car className="h-5 w-5 text-gray-500" />}
                  </div>

                  {/* Pricing */}
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="text-2xl font-bold text-green-600">€{spot.pricing.daily}</div>
                      <div className="text-sm text-gray-600">per metro/giorno</div>
                    </div>
                    <div className="text-right text-sm text-gray-600">
                      <div>Settimanale: €{spot.pricing.weekly}</div>
                      <div>Mensile: €{spot.pricing.monthly}</div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-2">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700" asChild>
                      <Link href={`/ormeggio/${spot.id}`}>
                        Prenota Ormeggio
                      </Link>
                    </Button>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Phone className="h-4 w-4 mr-1" />
                        Chiama
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Calendar className="h-4 w-4 mr-1" />
                        Disponibilità
                      </Button>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="mt-4 pt-4 border-t text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>Proprietario: {spot.contact.name}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {sortedSpots.length === 0 && (
            <div className="text-center py-12">
              <Anchor className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">Nessun posto barca trovato</h3>
              <p className="text-gray-600 mb-6">Prova a modificare i filtri di ricerca</p>
              <Button variant="outline" onClick={() => {
                setSearchLocation("");
                setMaxLength("");
                setPriceRange("");
                setServices("");
              }}>
                Resetta Filtri
              </Button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}