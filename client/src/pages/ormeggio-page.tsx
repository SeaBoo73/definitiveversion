import React, { useState, useRef, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/use-auth';
import { useMooringFavorites } from '@/hooks/use-favorites';
import { useToast } from '@/hooks/use-toast';
import { 
  Anchor, 
  MapPin, 
  Shield, 
  Clock,
  Euro,
  Star,
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
  Home,
  X,
  Plus,
  Loader2
} from 'lucide-react';
import { Link } from 'wouter';
import { Breadcrumbs } from '@/components/breadcrumbs';
import marinaBackground from "@assets/ultra-realistic_wide_banner_photo_of_a_luxury_marina_sleek_modern_yachts_and_refined_sailboats_dock_s7kkr4ovnfrvawy99jmg_2_1764074396924.png";
import type { Mooring } from '@shared/schema';
import { ImageCarousel } from '@/components/image-carousel';

// Lista completa di tutti i porti del Lazio e Campania per autofill con regioni
const portsWithRegion = [
  // Porti del Lazio
  { name: "Civitavecchia", region: "Lazio" },
  { name: "Gaeta", region: "Lazio" },
  { name: "Anzio", region: "Lazio" },
  { name: "Terracina", region: "Lazio" },
  { name: "Formia", region: "Lazio" },
  { name: "Ponza", region: "Lazio" },
  { name: "Ventotene", region: "Lazio" },
  { name: "Nettuno", region: "Lazio" },
  { name: "San Felice Circeo", region: "Lazio" },
  { name: "Sperlonga", region: "Lazio" },
  { name: "Sabaudia", region: "Lazio" },
  { name: "Latina", region: "Lazio" },
  { name: "Santa Marinella", region: "Lazio" },
  { name: "Ladispoli", region: "Lazio" },
  { name: "Fiumicino", region: "Lazio" },
  // Porti della Campania
  { name: "Napoli", region: "Campania" },
  { name: "Salerno", region: "Campania" },
  { name: "Sorrento", region: "Campania" },
  { name: "Amalfi", region: "Campania" },
  { name: "Positano", region: "Campania" },
  { name: "Capri", region: "Campania" },
  { name: "Ischia", region: "Campania" },
  { name: "Procida", region: "Campania" },
  { name: "Castellammare di Stabia", region: "Campania" },
  { name: "Marina di Stabia", region: "Campania" },
  { name: "Piano di Sorrento", region: "Campania" },
  { name: "Vico Equense", region: "Campania" },
  { name: "Massa Lubrense", region: "Campania" },
  { name: "Cetara", region: "Campania" },
  { name: "Maiori", region: "Campania" },
  { name: "Minori", region: "Campania" },
  { name: "Atrani", region: "Campania" },
  { name: "Furore", region: "Campania" },
  { name: "Conca dei Marini", region: "Campania" },
  { name: "Ravello", region: "Campania" },
  { name: "Agropoli", region: "Campania" },
  { name: "Palinuro", region: "Campania" },
  { name: "Marina di Camerota", region: "Campania" },
  { name: "Sapri", region: "Campania" },
  { name: "Scario", region: "Campania" },
  { name: "Pisciotta", region: "Campania" },
  { name: "Acciaroli", region: "Campania" },
  { name: "Santa Maria di Castellabate", region: "Campania" },
  { name: "San Marco di Castellabate", region: "Campania" },
  { name: "Punta Licosa", region: "Campania" },
  { name: "Marina di Ascea", region: "Campania" },
  { name: "Velia", region: "Campania" },
  { name: "Marina di Velia", region: "Campania" },
  { name: "Castellabate", region: "Campania" }
];

export default function OrmeggioPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { favorites, toggleFavorite, isFavorite } = useMooringFavorites();
  const [searchLocation, setSearchLocation] = useState("");
  const [maxLength, setMaxLength] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [services, setServices] = useState("all");
  const [sortBy, setSortBy] = useState("featured");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredPorts, setFilteredPorts] = useState<{ name: string; region: string }[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const { data: dbMoorings = [], isLoading: mooringsLoading } = useQuery<Mooring[]>({
    queryKey: ['/api/moorings'],
  });
  const suggestionsRef = useRef<HTMLDivElement>(null);
  
  const isOwner = user?.role === 'owner';

  const handleToggleFavorite = (spotId: string, spotTitle: string) => {
    const wasAdded = toggleFavorite(spotId, spotTitle);
    toast({
      title: wasAdded ? "Aggiunto ai preferiti" : "Rimosso dai preferiti",
      description: wasAdded 
        ? `${spotTitle} è stato salvato nei tuoi preferiti` 
        : `${spotTitle} è stato rimosso dai preferiti`,
    });
  };

  const handleShare = async (spot: Mooring) => {
    const shareUrl = `${window.location.origin}/ormeggio/${spot.id}`;
    const shareData = {
      title: spot.name,
      text: `Scopri questo ormeggio su SeaBoo: ${spot.name} - €${spot.pricePerDay}/giorno`,
      url: shareUrl,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          await navigator.clipboard.writeText(shareUrl);
          toast({
            title: "Link copiato!",
            description: "Il link è stato copiato negli appunti",
          });
        }
      }
    } else {
      await navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Link copiato!",
        description: "Il link è stato copiato negli appunti",
      });
    }
  };

  // Gestione autofill intelligente
  useEffect(() => {
    if (searchLocation.trim().length > 0) {
      const filtered = portsWithRegion.filter(port =>
        port.name.toLowerCase().includes(searchLocation.toLowerCase())
      ).slice(0, 8); // Limita a 8 suggerimenti
      setFilteredPorts(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setFilteredPorts([]);
      setShowSuggestions(false);
    }
  }, [searchLocation]);

  // Chiudi suggerimenti quando si clicca fuori
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node) &&
          inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handlePortSelection = (portName: string) => {
    setSearchLocation(portName);
    setShowSuggestions(false);
    inputRef.current?.focus(); // Mantieni il focus sull'input
  };

  const filteredSpots = dbMoorings.filter(spot => {
    if (searchLocation && !spot.location?.toLowerCase().includes(searchLocation.toLowerCase()) && !spot.port?.toLowerCase().includes(searchLocation.toLowerCase())) return false;
    if (maxLength && maxLength !== "all" && Number(spot.maxLength) < parseInt(maxLength)) return false;
    if (priceRange && priceRange !== "all") {
      const price = Number(spot.pricePerDay);
      if (priceRange === "0-30" && price > 30) return false;
      if (priceRange === "30-50" && (price < 30 || price > 50)) return false;
      if (priceRange === "50+" && price < 50) return false;
    }
    return true;
  });

  const sortedSpots = [...filteredSpots].sort((a, b) => {
    if (sortBy === "featured") return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    if (sortBy === "price") return Number(a.pricePerDay) - Number(b.pricePerDay);
    if (sortBy === "rating") return Number(b.rating || 0) - Number(a.rating || 0);
    return 0;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Breadcrumbs />
      
      {/* Hero Section */}
      <section className="relative text-white py-16 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${marinaBackground})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center center',
            backgroundRepeat: 'no-repeat'
          }}
        />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <div className="inline-block bg-blue-900/90 backdrop-blur-md rounded-3xl px-8 md:px-16 py-10 md:py-12">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
                Trova il tuo ormeggio ideale
              </h1>
              <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto mb-8">
                Trova il posto barca perfetto o affitta il tuo ormeggio.<br/>
                Mai più barche in rada!
              </p>
              <Button asChild size="lg" className="bg-coral hover:bg-orange-600 text-white px-8 py-3 text-lg">
                <a href="#ormeggi-list">Trova il tuo ormeggio</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-8 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filtri Header con pulsante Rimuovi */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-900">Filtri</h2>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchLocation('');
                setMaxLength('');
                setPriceRange('');
                setServices('');
                setSortBy('featured');
              }}
              className="text-gray-600 hover:text-red-600 hover:border-red-300"
            >
              <X className="h-4 w-4 mr-2" />
              Rimuovi filtri
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                ref={inputRef}
                placeholder="Cerca tra 48 porti di Lazio e Campania..."
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                onFocus={() => {
                  if (filteredPorts.length > 0) {
                    setShowSuggestions(true);
                  }
                }}
                className="pl-10"
              />
              
              {/* Dropdown dei suggerimenti */}
              {showSuggestions && (
                <div 
                  ref={suggestionsRef}
                  className="absolute top-full left-0 right-0 z-50 bg-white border border-gray-200 rounded-md shadow-lg mt-1 max-h-64 overflow-y-auto"
                >
                  {filteredPorts.map((port, index) => (
                    <button
                      key={index}
                      className="w-full text-left px-4 py-3 hover:bg-blue-50 hover:text-blue-700 transition-colors flex items-center gap-3 border-b border-gray-100 last:border-b-0"
                      onClick={() => handlePortSelection(port.name)}
                    >
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span className="font-medium">{port.name}</span>
                      <span className={`text-sm ml-auto px-2 py-1 rounded-full ${
                        port.region === 'Campania' 
                          ? 'bg-orange-100 text-orange-700' 
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {port.region}
                      </span>
                    </button>
                  ))}
                  {filteredPorts.length === 0 && searchLocation.trim().length > 0 && (
                    <div className="px-4 py-3 text-gray-500 text-center">
                      <Search className="h-4 w-4 mx-auto mb-2 text-gray-400" />
                      Nessun porto trovato per "{searchLocation}"
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <Select value={maxLength} onValueChange={setMaxLength}>
              <SelectTrigger>
                <SelectValue placeholder="Lunghezza barca" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tutte le lunghezze</SelectItem>
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
                <SelectItem value="all">Tutti i prezzi</SelectItem>
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
                <SelectItem value="all">Tutti i servizi</SelectItem>
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
            </div>
            {isOwner ? (
              <Button className="bg-green-600 hover:bg-green-700 font-bold" asChild>
                <Link href="/owner-dashboard?tab=moorings">
                  <Plus className="h-4 w-4 mr-2" />
                  Aggiungi Ormeggio
                </Link>
              </Button>
            ) : (
              <Button className="bg-green-600 hover:bg-green-700 font-bold" asChild>
                <Link href="/diventa-noleggiatore">
                  <Anchor className="h-4 w-4 mr-2" />
                  Affitta il Tuo Ormeggio
                </Link>
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Mooring Spots Grid */}
      <section id="ormeggi-list" className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              {filteredSpots.length} Posti Barca Disponibili
            </h2>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Filter className="h-4 w-4" />
              <span>Filtri attivi: {[
                searchLocation, 
                maxLength !== "all" ? maxLength : "", 
                priceRange !== "all" ? priceRange : "", 
                services !== "all" ? services : ""
              ].filter(Boolean).length}</span>
            </div>
          </div>

          {mooringsLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {sortedSpots.map((spot) => {
              const svc = (spot.services as any) || {};
              return (
              <Card key={spot.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <Link href={`/ormeggio/${spot.id}`} className="block">
                <div className="relative">
                  <ImageCarousel
                    images={spot.images || []}
                    alt={spot.name}
                    className="h-32"
                    fallback={
                      <div className="w-full h-32 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                        <Anchor className="h-10 w-10 text-blue-400" />
                      </div>
                    }
                  />
                  {spot.featured && (
                    <Badge className="absolute top-2 left-2 bg-yellow-500 text-white text-[10px] z-20">
                      In Evidenza
                    </Badge>
                  )}
                  <div className="absolute top-2 right-2 flex gap-1 z-20">
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="bg-white/80 hover:bg-white p-1 h-7 w-7"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleToggleFavorite(String(spot.id), spot.name);
                      }}
                    >
                      <Heart className={`h-3.5 w-3.5 ${isFavorite(String(spot.id)) ? 'fill-red-500 text-red-500' : ''}`} />
                    </Button>
                  </div>
                </div>

                <CardContent className="p-3">
                  <h3 className="font-semibold text-sm text-gray-900 truncate mb-1">{spot.name}</h3>
                  <div className="flex items-center gap-1 text-xs text-gray-600 mb-1">
                    <MapPin className="h-3 w-3" />
                    <span className="truncate">{spot.port}</span>
                  </div>

                  <div className="flex items-center text-xs text-gray-500 mb-2">
                    <span>Max {spot.maxLength}m</span>
                    <span className="mx-1">•</span>
                    <span>{spot.type}</span>
                  </div>

                  <div className="flex gap-1 mb-2">
                    {svc.security && <Shield className="h-3.5 w-3.5 text-green-500" />}
                    {svc.fuel && <Fuel className="h-3.5 w-3.5 text-orange-500" />}
                    {svc.water && <Droplet className="h-3.5 w-3.5 text-blue-500" />}
                    {svc.electricity && <Zap className="h-3.5 w-3.5 text-yellow-500" />}
                    {svc.wifi && <Wifi className="h-3.5 w-3.5 text-purple-500" />}
                  </div>

                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-bold text-sm text-green-600">€{spot.pricePerDay}</span>
                      <span className="text-xs text-gray-600">/giorno</span>
                    </div>
                  </div>
                </CardContent>
                </Link>
              </Card>
              );
            })}
          </div>
          )}

          {sortedSpots.length === 0 && (
            <div className="text-center py-12">
              <Anchor className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">Nessun posto barca trovato</h3>
              <p className="text-gray-600 mb-6">Prova a modificare i filtri di ricerca</p>
              <Button variant="outline" onClick={() => {
                setSearchLocation("");
                setMaxLength("all");
                setPriceRange("all");
                setServices("all");
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