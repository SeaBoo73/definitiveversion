import { useState } from "react";
import { Search, Filter, MapPin, Calendar, Users, Star, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { MapIntegration } from "@/components/map-integration";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Boat } from "@shared/schema";

interface SearchFilters {
  location: string;
  startDate: string;
  endDate: string;
  guests: number;
  boatType: string;
  priceRange: [number, number];
  features: string[];
  rating: number;
  skipperRequired: boolean;
  instantBook: boolean;
}

export function AdvancedSearch() {
  const [showMap, setShowMap] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    location: "",
    startDate: "",
    endDate: "",
    guests: 2,
    boatType: "",
    priceRange: [50, 1000],
    features: [],
    rating: 0,
    skipperRequired: false,
    instantBook: false
  });

  const { data: boats = [], isLoading } = useQuery({
    queryKey: ['/api/boats', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.location) params.append('location', filters.location);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      if (filters.boatType) params.append('type', filters.boatType);
      if (filters.guests) params.append('maxPersons', filters.guests.toString());
      if (filters.skipperRequired) params.append('skipperRequired', 'true');
      
      const response = await fetch(`/api/boats?${params}`);
      return await response.json();
    }
  });

  const boatTypes = [
    "yacht", "gommone", "barche-senza-patente", "catamarano", 
    "jetski", "sailboat", "charter", "houseboat"
  ];

  const features = [
    "WiFi", "Aria Condizionata", "Cucina", "Bagno", "Doccia",
    "Frigorifero", "Stereo", "GPS", "Tender", "Snorkeling"
  ];

  const italianLocations = [
    "Roma", "Napoli", "Palermo", "Venezia", "Genova", "Bari",
    "La Spezia", "Olbia", "Cagliari", "Amalfi", "Cinque Terre",
    "Portofino", "Capri", "Ischia", "Taormina", "Lipari"
  ];

  const updateFilters = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const toggleFeature = (feature: string) => {
    setFilters(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }));
  };

  const clearFilters = () => {
    setFilters({
      location: "",
      startDate: "",
      endDate: "",
      guests: 2,
      boatType: "",
      priceRange: [50, 1000],
      features: [],
      rating: 0,
      skipperRequired: false,
      instantBook: false
    });
  };

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Ricerca Avanzata Barche
            </div>
            <div className="flex gap-2">
              <Button
                variant={showMap ? "default" : "outline"}
                size="sm"
                onClick={() => setShowMap(!showMap)}
                className="flex items-center gap-1"
              >
                <MapPin className="h-4 w-4" />
                {showMap ? "Lista" : "Mappa"}
              </Button>
              <Button variant="outline" size="sm" onClick={clearFilters}>
                Resetta Filtri
              </Button>
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Primary Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Destinazione</label>
              <Select value={filters.location} onValueChange={(value) => updateFilters('location', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Scegli destinazione" />
                </SelectTrigger>
                <SelectContent>
                  {italianLocations.map(location => (
                    <SelectItem key={location} value={location}>{location}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Data Inizio</label>
              <Input
                type="date"
                value={filters.startDate}
                onChange={(e) => updateFilters('startDate', e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Data Fine</label>
              <Input
                type="date"
                value={filters.endDate}
                onChange={(e) => updateFilters('endDate', e.target.value)}
                min={filters.startDate || new Date().toISOString().split('T')[0]}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Ospiti</label>
              <Select value={filters.guests.toString()} onValueChange={(value) => updateFilters('guests', parseInt(value))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1,2,3,4,5,6,7,8,9,10,12,15,20].map(num => (
                    <SelectItem key={num} value={num.toString()}>{num} ospiti</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Secondary Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="text-sm font-medium mb-2 block">Tipo Barca</label>
              <Select value={filters.boatType} onValueChange={(value) => updateFilters('boatType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Tutti i tipi" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tutti i tipi</SelectItem>
                  {boatTypes.map(type => (
                    <SelectItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Prezzo (€{filters.priceRange[0]} - €{filters.priceRange[1]}/giorno)
              </label>
              <Slider
                value={filters.priceRange}
                onValueChange={(value) => updateFilters('priceRange', value)}
                max={2000}
                min={50}
                step={50}
                className="mt-4"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Valutazione Minima</label>
              <div className="flex gap-1 mt-2">
                {[1,2,3,4,5].map(star => (
                  <button
                    key={star}
                    onClick={() => updateFilters('rating', star)}
                    className="p-1"
                  >
                    <Star 
                      className={`h-5 w-5 ${
                        star <= filters.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                      }`} 
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Features */}
          <div>
            <label className="text-sm font-medium mb-3 block">Caratteristiche</label>
            <div className="flex flex-wrap gap-2">
              {features.map(feature => (
                <Badge
                  key={feature}
                  variant={filters.features.includes(feature) ? "default" : "outline"}
                  className="cursor-pointer hover:bg-blue-100"
                  onClick={() => toggleFeature(feature)}
                >
                  {feature}
                </Badge>
              ))}
            </div>
          </div>

          {/* Checkboxes */}
          <div className="flex gap-6">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="skipper"
                checked={filters.skipperRequired}
                onCheckedChange={(checked) => updateFilters('skipperRequired', checked)}
              />
              <label htmlFor="skipper" className="text-sm font-medium">
                Skipper Richiesto
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="instant"
                checked={filters.instantBook}
                onCheckedChange={(checked) => updateFilters('instantBook', checked)}
              />
              <label htmlFor="instant" className="text-sm font-medium">
                Prenotazione Istantanea
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {showMap ? (
        <MapIntegration boats={boats} />
      ) : (
        <div className="space-y-4">
          {/* Results Header */}
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">
              {boats.length} barche trovate
            </h3>
            <Select defaultValue="relevance">
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">Più Rilevanti</SelectItem>
                <SelectItem value="price-low">Prezzo: Basso → Alto</SelectItem>
                <SelectItem value="price-high">Prezzo: Alto → Basso</SelectItem>
                <SelectItem value="rating">Valutazione</SelectItem>
                <SelectItem value="newest">Più Recenti</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Boat Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1,2,3,4,5,6].map(i => (
                <Card key={i} className="animate-pulse">
                  <div className="h-48 bg-gray-200 rounded-t-lg" />
                  <CardContent className="p-4 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                    <div className="h-4 bg-gray-200 rounded w-1/4" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {boats.map((boat: Boat) => (
                <Card key={boat.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="relative">
                    <div className="h-48 bg-gradient-to-br from-blue-400 to-blue-600 rounded-t-lg" />
                    <Badge className="absolute top-2 left-2 bg-white text-blue-600">
                      {boat.type}
                    </Badge>
                    {boat.skipperRequired && (
                      <Badge className="absolute top-2 right-2 bg-green-500">
                        Con Skipper
                      </Badge>
                    )}
                  </div>
                  
                  <CardContent className="p-4">
                    <h4 className="font-medium text-lg mb-1">{boat.name}</h4>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <MapPin className="h-3 w-3" />
                      <span>{boat.port}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-3">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{boat.maxPersons} persone</span>
                      <div className="flex items-center gap-1 ml-auto">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm">4.6</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-lg font-bold">€{boat.pricePerDay}</span>
                        <span className="text-sm text-muted-foreground">/giorno</span>
                      </div>
                      <Button size="sm">Dettagli</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {boats.length === 0 && !isLoading && (
            <Card className="text-center py-12">
              <CardContent>
                <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Nessuna barca trovata</h3>
                <p className="text-muted-foreground mb-4">
                  Prova a modificare i filtri di ricerca per trovare più opzioni
                </p>
                <Button onClick={clearFilters}>Resetta Filtri</Button>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}