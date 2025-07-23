import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Users, Calendar, Star, ArrowLeft, Filter } from "lucide-react";
import { SearchFilters } from "@/components/search-filters";
import { BookingModal } from "@/components/booking-modal";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import type { Boat } from "@shared/schema";

// Use the Boat type from shared schema

interface SearchParams {
  location?: string;
  startDate?: string;
  endDate?: string;
  guests?: string;
  boatTypes?: string;
  skipperRequired?: string;
  fuelIncluded?: string;
}

export function SearchResults() {
  const [location, setLocation] = useLocation();
  const [selectedBoat, setSelectedBoat] = useState<Boat | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  
  // Parse URL search parameters
  const urlParams = new URLSearchParams(window.location.search);
  const searchParams: SearchParams = {
    location: urlParams.get("location") || undefined,
    startDate: urlParams.get("startDate") || undefined,
    endDate: urlParams.get("endDate") || undefined,
    guests: urlParams.get("guests") || undefined,
    boatTypes: urlParams.get("boatTypes") || undefined,
    skipperRequired: urlParams.get("skipperRequired") || undefined,
    fuelIncluded: urlParams.get("fuelIncluded") || undefined,
  };

  const { data: boats = [], isLoading } = useQuery<Boat[]>({
    queryKey: ["/api/boats"],
  });

  // Filter boats based on search parameters
  const filteredBoats = boats.filter((boat: Boat) => {
    if (searchParams.location && boat.port !== searchParams.location) return false;
    if (searchParams.boatTypes) {
      const selectedTypes = searchParams.boatTypes.split(",");
      if (!selectedTypes.includes(boat.type)) return false;
    }
    if (searchParams.guests && boat.maxPersons && boat.maxPersons < parseInt(searchParams.guests)) return false;
    if (searchParams.skipperRequired === "true" && !boat.skipperRequired) return false;
    // Note: fuelIncluded is not in the current boat schema, we'll skip this filter for now
    return true;
  });

  const getBoatTypeName = (type: string) => {
    const typeNames: { [key: string]: string } = {
      "gommone": "Gommoni",
      "barche-senza-patente": "Barche senza patente", 
      "yacht": "Yacht",
      "sailboat": "Barche a vela",
      "catamarano": "Catamarani",
      "motorboat": "Barche a motore",
      "jetski": "Moto d'acqua",
      "charter": "Charter",
      "houseboat": "Houseboat",
      "gulet": "Gulet",
      "kayak": "Caiacco"
    };
    return typeNames[type] || type;
  };

  const handleNewSearch = (filters: any) => {
    const searchParams = new URLSearchParams();
    
    if (filters.location) searchParams.set("location", filters.location);
    if (filters.startDate) {
      const dateStr = typeof filters.startDate === 'string' ? filters.startDate : filters.startDate.toISOString();
      searchParams.set("startDate", dateStr);
    }
    if (filters.endDate) {
      const dateStr = typeof filters.endDate === 'string' ? filters.endDate : filters.endDate.toISOString();
      searchParams.set("endDate", dateStr);
    }
    if (filters.guests) searchParams.set("guests", filters.guests.toString());
    if (filters.boatTypes && filters.boatTypes.length > 0) {
      searchParams.set("boatTypes", filters.boatTypes.join(","));
    }
    if (filters.skipperRequired) searchParams.set("skipperRequired", "true");
    if (filters.fuelIncluded) searchParams.set("fuelIncluded", "true");
    
    setLocation(`/search?${searchParams.toString()}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-lg text-gray-600">Caricamento imbarcazioni...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Search Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              onClick={() => setLocation("/")}
              className="text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Torna alla home
            </Button>
            
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden"
            >
              <Filter className="mr-2 h-4 w-4" />
              Filtri
            </Button>
          </div>
          
          <div className="flex flex-col lg:flex-row lg:items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Risultati di ricerca
              </h1>
              <div className="flex flex-wrap gap-2 text-sm text-gray-600">
                {searchParams.location && (
                  <Badge variant="secondary">{searchParams.location}</Badge>
                )}
                {searchParams.boatTypes && (
                  searchParams.boatTypes.split(",").map(type => (
                    <Badge key={type} variant="secondary">{getBoatTypeName(type)}</Badge>
                  ))
                )}
                {searchParams.startDate && searchParams.endDate && (
                  <Badge variant="secondary">
                    <Calendar className="mr-1 h-3 w-3" />
                    {format(new Date(searchParams.startDate), "dd/MM")} - {format(new Date(searchParams.endDate), "dd/MM")}
                  </Badge>
                )}
                {searchParams.guests && (
                  <Badge variant="secondary">
                    <Users className="mr-1 h-3 w-3" />
                    {searchParams.guests} ospiti
                  </Badge>
                )}
                {searchParams.skipperRequired === "true" && (
                  <Badge variant="secondary">Con Skipper</Badge>
                )}
                {searchParams.fuelIncluded === "true" && (
                  <Badge variant="secondary">Carburante incluso</Badge>
                )}
              </div>
            </div>
            
            <div className="mt-4 lg:mt-0">
              <p className="text-lg font-semibold text-gray-900">
                {filteredBoats.length} {filteredBoats.length === 1 ? "imbarcazione trovata" : "imbarcazioni trovate"}
              </p>
            </div>
          </div>
        </div>
        
        {/* Mobile Filters */}
        {showFilters && (
          <div className="border-t border-gray-200 px-4 py-4 md:hidden">
            <SearchFilters onSearch={handleNewSearch} />
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          {/* Desktop Filters Sidebar */}
          <div className="hidden lg:block">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 sticky top-4">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 pb-3 border-b border-gray-200">
                  Affina la ricerca
                </h3>
                <div className="space-y-6">
                  <SearchFilters onSearch={handleNewSearch} />
                  
                  {/* Auto-apply button for sidebar */}
                  <div className="pt-4 border-t border-gray-200">
                    <Button 
                      onClick={() => handleNewSearch({
                        location: "", 
                        startDate: undefined, 
                        endDate: undefined, 
                        guests: 2,
                        boatTypes: undefined,
                        skipperRequired: false,
                        fuelIncluded: false
                      })}
                      variant="outline"
                      className="w-full text-gray-600 hover:text-gray-900"
                    >
                      Pulisci tutti i filtri
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Results Grid */}
          <div className="lg:col-span-3">
            {filteredBoats.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 text-lg mb-4">Nessuna imbarcazione trovata</div>
                <p className="text-gray-600 mb-6">
                  Prova a modificare i filtri di ricerca per trovare più risultati.
                </p>
                <Button onClick={() => setLocation("/")} className="bg-coral hover:bg-orange-600">
                  Torna alla ricerca
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredBoats.map((boat: Boat) => (
                  <Card key={boat.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="aspect-[4/3] bg-gray-200">
                      {boat.images?.[0] ? (
                        <img
                          src={`/api/images/${encodeURIComponent(boat.images[0])}`}
                          alt={boat.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          Nessuna immagine
                        </div>
                      )}
                    </div>
                    
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">
                          {boat.name}
                        </h3>
                        <div className="flex items-center ml-2">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-gray-600 ml-1">4.8</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-600 mb-2">
                        <MapPin className="h-4 w-4 mr-1" />
                        {boat.port}
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-600 mb-3">
                        <Users className="h-4 w-4 mr-1" />
                        Fino a {boat.maxPersons} ospiti
                      </div>
                      
                      <div className="flex flex-wrap gap-1 mb-3">
                        <Badge variant="outline" className="text-xs">
                          {getBoatTypeName(boat.type)}
                        </Badge>
                        {boat.skipperRequired && (
                          <Badge variant="outline" className="text-xs">Skipper</Badge>
                        )}
                        {!boat.licenseRequired && (
                          <Badge variant="outline" className="text-xs">Senza patente</Badge>
                        )}
                      </div>
                      
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {boat.description || "Imbarcazione perfetta per una giornata di relax in mare."}
                      </p>
                    </CardContent>
                    
                    <CardFooter className="p-4 pt-0 flex items-center justify-between">
                      <div>
                        <span className="text-2xl font-bold text-gray-900">
                          €{boat.pricePerDay ? parseFloat(boat.pricePerDay.toString()).toFixed(0) : "0"}
                        </span>
                        <span className="text-sm text-gray-600">/giorno</span>
                      </div>
                      
                      <Button
                        className="bg-coral hover:bg-orange-600 active:bg-orange-700 transition-all duration-200 hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98]"
                        onClick={() => setSelectedBoat(boat)}
                      >
                        Prenota ora
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {selectedBoat && (
        <BookingModal
          boat={selectedBoat}
          onClose={() => setSelectedBoat(null)}
        />
      )}
    </div>
  );
}