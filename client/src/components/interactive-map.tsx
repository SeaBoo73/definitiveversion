import { useState, useEffect } from "react";
import { Anchor, MapPin, Filter, Navigation, Star, Euro, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Interfacce e tipi
interface Boat {
  id: number;
  name: string;
  type: string;
  location: string;
  pricePerDay: number;
  maxCapacity: number;
}

interface InteractiveMapProps {
  boats: Boat[];
  onBoatSelect?: (boat: Boat) => void;
  onPortSelect?: (port: string) => void;
  filters?: {
    dateFrom?: string;
    dateTo?: string;
    boatType?: string;
    maxPrice?: number;
    minCapacity?: number;
  };
}

// Coordinate reali dei porti del Lazio
const lazioPortsCoordinates = {
  "Civitavecchia": { lat: 42.0942, lng: 11.7939 },
  "Gaeta": { lat: 41.2058, lng: 13.5696 },
  "Terracina": { lat: 41.2857, lng: 13.2443 },
  "San Felice Circeo": { lat: 41.3574, lng: 13.0847 },
  "Ponza": { lat: 40.8992, lng: 12.9619 },
  "Ventotene": { lat: 40.7969, lng: 13.4279 },
  "Formia": { lat: 41.2567, lng: 13.6050 },
  "Sperlonga": { lat: 41.2566, lng: 13.4343 },
  "Santa Marinella": { lat: 42.0345, lng: 11.8709 },
  "Ladispoli": { lat: 41.9436, lng: 12.0818 },
  "Ostia": { lat: 41.7351, lng: 12.2928 },
  "Nettuno": { lat: 41.4539, lng: 12.6619 },
  "Montalto di Castro": { lat: 42.3489, lng: 11.6092 }
};

export function InteractiveMap({ boats, onBoatSelect, onPortSelect, filters }: InteractiveMapProps) {
  const [selectedPort, setSelectedPort] = useState<string | null>(null);
  const [hoveredPort, setHoveredPort] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<"map" | "list">("map");

  // Geolocalizzazione utente
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.log("Geolocation error:", error);
        }
      );
    }
  }, []);

  // Barche per porto con prezzi reali e filtri applicati - SOLO PORTI COSTIERI
  const getBoatsForPort = (port: string) => {
    const allBoatsData: Record<string, { count: number, minPrice: number, maxPrice: number, boats: Array<{name: string, price: number, type: string, capacity: number, rating: number}> }> = {
      "Civitavecchia": { 
        count: 18, 
        minPrice: 120, 
        maxPrice: 1200,
        boats: [
          { name: "Azimut 55", price: 980, type: "Yacht", capacity: 12, rating: 4.8 },
          { name: "Jeanneau Sun Odyssey 439", price: 350, type: "Barca a vela", capacity: 8, rating: 4.6 },
          { name: "Zodiac Pro 650", price: 280, type: "Gommone", capacity: 6, rating: 4.4 },
          { name: "Ferretti 720", price: 1200, type: "Yacht", capacity: 14, rating: 4.9 },
          { name: "Quicksilver 675", price: 220, type: "Gommone", capacity: 7, rating: 4.3 },
          { name: "Princess V39", price: 450, type: "Yacht", capacity: 8, rating: 4.5 }
        ]
      },
      "Gaeta": { 
        count: 15, 
        minPrice: 140, 
        maxPrice: 850,
        boats: [
          { name: "Zodiac Pro 550", price: 280, type: "Gommone", capacity: 6, rating: 4.5 },
          { name: "Ferretti 681", price: 850, type: "Yacht", capacity: 10, rating: 4.7 },
          { name: "Beneteau First 45", price: 320, type: "Barca a vela", capacity: 8, rating: 4.6 },
          { name: "Sunseeker 68", price: 750, type: "Yacht", capacity: 12, rating: 4.8 },
          { name: "Cranchi E26", price: 290, type: "Gommone", capacity: 7, rating: 4.4 }
        ]
      },
      "Ponza": { 
        count: 22, 
        minPrice: 180, 
        maxPrice: 1100,
        boats: [
          { name: "Pershing 62", price: 950, type: "Yacht", capacity: 10, rating: 4.9 },
          { name: "Lagoon 380", price: 550, type: "Catamarano", capacity: 8, rating: 4.7 },
          { name: "Bavaria Cruiser 46", price: 380, type: "Barca a vela", capacity: 10, rating: 4.5 },
          { name: "Zodiac Pro 750", price: 320, type: "Gommone", capacity: 8, rating: 4.4 },
          { name: "Azimut 68", price: 1100, type: "Yacht", capacity: 12, rating: 4.8 },
          { name: "Jeanneau Cap Camarat 10.5", price: 380, type: "Gommone", capacity: 10, rating: 4.6 }
        ]
      },
      "Ventotene": { 
        count: 8, 
        minPrice: 200, 
        maxPrice: 650,
        boats: [
          { name: "Princess V48", price: 580, type: "Yacht", capacity: 10, rating: 4.6 },
          { name: "Beneteau Oceanis 40.1", price: 320, type: "Barca a vela", capacity: 8, rating: 4.5 },
          { name: "Zodiac Pro 630", price: 280, type: "Gommone", capacity: 6, rating: 4.4 },
          { name: "Sessa Marine C32", price: 400, type: "Yacht", capacity: 8, rating: 4.5 }
        ]
      },
      "Terracina": { 
        count: 12, 
        minPrice: 140, 
        maxPrice: 650,
        boats: [
          { name: "Princess V48", price: 580, type: "Yacht", capacity: 10, rating: 4.6 },
          { name: "Beneteau Oceanis 40.1", price: 320, type: "Barca a vela", capacity: 8, rating: 4.5 },
          { name: "Quicksilver 705", price: 260, type: "Gommone", capacity: 7, rating: 4.3 },
          { name: "Cranchi Mediterranee 47", price: 520, type: "Yacht", capacity: 10, rating: 4.6 }
        ]
      },
      "San Felice Circeo": { 
        count: 10, 
        minPrice: 160, 
        maxPrice: 550,
        boats: [
          { name: "Jeanneau Cap Camarat 8.5", price: 340, type: "Gommone", capacity: 8, rating: 4.5 },
          { name: "Princess V42", price: 480, type: "Yacht", capacity: 8, rating: 4.6 },
          { name: "Beneteau First 40.7", price: 290, type: "Barca a vela", capacity: 8, rating: 4.4 }
        ]
      },
      "Formia": { 
        count: 9, 
        minPrice: 160, 
        maxPrice: 450,
        boats: [
          { name: "Jeanneau Cap Camarat 8.5", price: 340, type: "Gommone", capacity: 8, rating: 4.6 },
          { name: "Cranchi E26", price: 280, type: "Gommone", capacity: 6, rating: 4.4 },
          { name: "Sessa Marine C30", price: 380, type: "Yacht", capacity: 8, rating: 4.5 }
        ]
      },
      "Sperlonga": { 
        count: 6, 
        minPrice: 180, 
        maxPrice: 420,
        boats: [
          { name: "Zodiac Pro 620", price: 250, type: "Gommone", capacity: 6, rating: 4.3 },
          { name: "Sessa Marine C30", price: 350, type: "Yacht", capacity: 8, rating: 4.4 },
          { name: "Beneteau Flyer 7.7", price: 290, type: "Gommone", capacity: 7, rating: 4.5 }
        ]
      },
      "Santa Marinella": { 
        count: 7, 
        minPrice: 180, 
        maxPrice: 420,
        boats: [
          { name: "Sessa Marine C30", price: 350, type: "Yacht", capacity: 8, rating: 4.4 },
          { name: "Quicksilver 675", price: 240, type: "Gommone", capacity: 6, rating: 4.3 },
          { name: "Cranchi E26", price: 280, type: "Gommone", capacity: 6, rating: 4.4 }
        ]
      },
      "Ladispoli": { 
        count: 5, 
        minPrice: 160, 
        maxPrice: 380,
        boats: [
          { name: "Quicksilver 635", price: 220, type: "Gommone", capacity: 6, rating: 4.2 },
          { name: "Sessa Marine Key Largo 27", price: 320, type: "Yacht", capacity: 6, rating: 4.4 }
        ]
      },
      "Ostia": { 
        count: 11, 
        minPrice: 130, 
        maxPrice: 480,
        boats: [
          { name: "Cranchi Mediterranee 43", price: 450, type: "Yacht", capacity: 10, rating: 4.5 },
          { name: "Zodiac Pro 550", price: 250, type: "Gommone", capacity: 6, rating: 4.3 },
          { name: "Jeanneau Cap Camarat 7.5", price: 280, type: "Gommone", capacity: 7, rating: 4.4 },
          { name: "Sessa Marine C32", price: 380, type: "Yacht", capacity: 8, rating: 4.5 }
        ]
      },
      "Nettuno": { 
        count: 8, 
        minPrice: 150, 
        maxPrice: 420,
        boats: [
          { name: "Quicksilver 705", price: 260, type: "Gommone", capacity: 7, rating: 4.3 },
          { name: "Cranchi E26", price: 280, type: "Gommone", capacity: 6, rating: 4.4 },
          { name: "Sessa Marine C30", price: 360, type: "Yacht", capacity: 8, rating: 4.5 }
        ]
      }
    };

    const portData = allBoatsData[port] || { count: 0, minPrice: 0, maxPrice: 0, boats: [] };
    
    // Applica filtri
    let filteredBoats = portData.boats;
    
    if (filterType !== "all") {
      filteredBoats = filteredBoats.filter(boat => boat.type.toLowerCase().includes(filterType.toLowerCase()));
    }
    
    if (priceRange !== "all") {
      const [min, max] = priceRange.split("-").map(Number);
      filteredBoats = filteredBoats.filter(boat => boat.price >= min && boat.price <= max);
    }
    
    if (searchTerm) {
      filteredBoats = filteredBoats.filter(boat => 
        boat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        boat.type.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return {
      ...portData,
      boats: filteredBoats,
      count: filteredBoats.length,
      minPrice: filteredBoats.length > 0 ? Math.min(...filteredBoats.map(b => b.price)) : 0,
      maxPrice: filteredBoats.length > 0 ? Math.max(...filteredBoats.map(b => b.price)) : 0
    };
  };

  const handlePortClick = (port: string) => {
    setSelectedPort(port === selectedPort ? null : port);
    onPortSelect?.(port);
  };

  // Calcola distanza dall'utente
  const calculateDistance = (port: string) => {
    if (!userLocation) return null;
    const coords = lazioPortsCoordinates[port as keyof typeof lazioPortsCoordinates];
    if (!coords) return null;
    
    const R = 6371; // Raggio della Terra in km
    const dLat = (coords.lat - userLocation.lat) * Math.PI / 180;
    const dLng = (coords.lng - userLocation.lng) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(userLocation.lat * Math.PI / 180) * Math.cos(coords.lat * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return Math.round(R * c);
  };

  // Filtra porti in base ai criteri
  const getFilteredPorts = () => {
    let ports = Object.keys(lazioPortsCoordinates);
    
    if (searchTerm) {
      ports = ports.filter(port => 
        port.toLowerCase().includes(searchTerm.toLowerCase()) ||
        getBoatsForPort(port).boats.some(boat => 
          boat.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
    
    return ports.filter(port => getBoatsForPort(port).count > 0);
  };

  // Calcola posizione relativa sulla mappa
  const getPortPosition = (port: string) => {
    const coords = lazioPortsCoordinates[port as keyof typeof lazioPortsCoordinates];
    if (!coords) return { x: 50, y: 50 };
    
    // Bounding box reale della costa del Lazio
    const minLat = 40.7969, maxLat = 42.3489;
    const minLng = 11.6092, maxLng = 13.6050;
    
    const x = ((coords.lng - minLng) / (maxLng - minLng)) * 100;
    const y = ((maxLat - coords.lat) / (maxLat - minLat)) * 100;
    
    return { x: Math.max(5, Math.min(95, x)), y: Math.max(5, Math.min(95, y)) };
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header con controlli avanzati */}
      <div className="p-4 border-b bg-gradient-to-r from-blue-50 to-blue-100">
        <div className="flex flex-col space-y-4">
          {/* Riga superiore con titolo e controlli vista */}
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Mappa Interattiva Porti</h2>
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === "map" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("map")}
                className="text-xs"
              >
                <MapPin className="h-4 w-4 mr-1" />
                Mappa
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="text-xs"
              >
                Lista
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="text-xs"
              >
                <Filter className="h-4 w-4 mr-1" />
                Filtri
              </Button>
            </div>
          </div>

          {/* Barra di ricerca */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Cerca porti, barche..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filtri avanzati */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-white rounded-lg border">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <SelectValue placeholder="Tipo imbarcazione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tutti i tipi</SelectItem>
                  <SelectItem value="yacht">Yacht</SelectItem>
                  <SelectItem value="gommone">Gommone</SelectItem>
                  <SelectItem value="barca a vela">Barca a vela</SelectItem>
                  <SelectItem value="catamarano">Catamarano</SelectItem>
                </SelectContent>
              </Select>

              <Select value={priceRange} onValueChange={setPriceRange}>
                <SelectTrigger>
                  <SelectValue placeholder="Range di prezzo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tutti i prezzi</SelectItem>
                  <SelectItem value="0-200">€0 - €200</SelectItem>
                  <SelectItem value="200-500">€200 - €500</SelectItem>
                  <SelectItem value="500-1000">€500 - €1000</SelectItem>
                  <SelectItem value="1000-2000">€1000+</SelectItem>
                </SelectContent>
              </Select>

              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm("");
                  setFilterType("all");
                  setPriceRange("all");
                }}
                className="text-xs"
              >
                Cancella filtri
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Contenuto principale */}
      {viewMode === "map" ? (
        <div className="relative">
          {/* Google Maps Embed con mappa reale del Lazio costiero */}
          <div className="w-full h-[500px] relative overflow-hidden">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d394684.4457867873!2d11.761719!3d41.902782!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x132f6196f99621dd%3A0x972f72b64133a8ec!2sLazio%2C%20Italia!5e0!3m2!1sit!2sit!4v1642234567890!5m2!1sit!2sit&amp;zoom=9"
              width="100%"
              height="500"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0"
            ></iframe>
            
            {/* Markers personalizzati sui porti reali */}
            <div className="absolute inset-0 pointer-events-auto">
              {getFilteredPorts().map((port) => {
                const position = getPortPosition(port);
                const portData = getBoatsForPort(port);
                const isSelected = selectedPort === port;
                const isHovered = hoveredPort === port;
                
                return (
                  <div
                    key={port}
                    className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-200 z-10 ${
                      isSelected ? 'scale-110' : isHovered ? 'scale-105' : ''
                    }`}
                    style={{
                      left: `${position.x}%`,
                      top: `${position.y}%`,
                    }}
                    onClick={() => handlePortClick(port)}
                    onMouseEnter={() => setHoveredPort(port)}
                    onMouseLeave={() => setHoveredPort(null)}
                  >
                    {/* Marker del porto */}
                    <div className={`relative ${isSelected || isHovered ? 'z-20' : 'z-10'}`}>
                      <div className={`w-8 h-8 rounded-full shadow-lg border-2 border-white transition-all duration-200 flex items-center justify-center ${
                        isSelected 
                          ? 'bg-red-500 shadow-red-500/50' 
                          : isHovered 
                          ? 'bg-blue-500 shadow-blue-500/50' 
                          : 'bg-blue-600 shadow-blue-600/50'
                      }`}>
                        <Anchor className="h-4 w-4 text-white" />
                      </div>
                      
                      {/* Badge con numero barche */}
                      {portData.count > 0 && (
                        <div className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                          {portData.count}
                        </div>
                      )}

                      {/* Indicatore distanza se geolocalizzazione disponibile */}
                      {userLocation && calculateDistance(port) && (
                        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2">
                          <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                            {calculateDistance(port)}km
                          </div>
                        </div>
                      )}
                      
                      {/* Tooltip avanzato con informazioni porto */}
                      {(isSelected || isHovered) && (
                        <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 whitespace-nowrap z-50">
                          <div className="bg-white rounded-lg shadow-xl border p-4 max-w-sm">
                            <div className="flex items-center justify-between mb-2">
                              <div className="font-semibold text-gray-900">{port}</div>
                              <div className="flex items-center space-x-1">
                                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                <span className="text-sm text-gray-600">4.7</span>
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">{portData.count} barche disponibili</span>
                                {userLocation && calculateDistance(port) && (
                                  <span className="text-sm text-blue-600 font-medium">
                                    {calculateDistance(port)}km da te
                                  </span>
                                )}
                              </div>
                              
                              {portData.count > 0 && (
                                <>
                                  <div className="flex items-center text-sm">
                                    <Euro className="h-4 w-4 text-green-600 mr-1" />
                                    <span className="text-green-600 font-medium">
                                      €{portData.minPrice} - €{portData.maxPrice}/giorno
                                    </span>
                                  </div>
                                  
                                  <div className="border-t pt-2">
                                    <div className="text-xs text-gray-500 mb-1">Barche popolari:</div>
                                    {portData.boats.slice(0, 2).map((boat, index) => (
                                      <div key={index} className="flex items-center justify-between text-xs">
                                        <span className="text-gray-700">{boat.name}</span>
                                        <Badge variant="secondary" className="text-xs py-0">
                                          €{boat.price}
                                        </Badge>
                                      </div>
                                    ))}
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                          <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white mx-auto"></div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Legenda mappa */}
            <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg p-3 shadow-lg border">
              <div className="text-sm font-semibold text-gray-900 mb-2">Legenda</div>
              <div className="space-y-1 text-xs">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center">
                    <Anchor className="h-2 w-2 text-white" />
                  </div>
                  <span>Porto disponibile</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">12</span>
                  </div>
                  <span>N° barche</span>
                </div>
                {userLocation && (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                    <span>Distanza da te</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Vista lista */
        <div className="p-4">
          <div className="grid gap-4">
            {getFilteredPorts().map((port) => {
              const portData = getBoatsForPort(port);
              const distance = calculateDistance(port);
              
              return (
                <Card key={port} className="cursor-pointer hover:shadow-lg transition-shadow" 
                      onClick={() => handlePortClick(port)}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{port}</CardTitle>
                      <div className="flex items-center space-x-2">
                        {distance && (
                          <Badge variant="secondary">{distance}km</Badge>
                        )}
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-sm">4.7</span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-gray-600">
                        {portData.count} barche disponibili
                      </span>
                      <span className="text-sm font-medium text-green-600">
                        €{portData.minPrice} - €{portData.maxPrice}/giorno
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {portData.boats.slice(0, 4).map((boat, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {boat.type}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Dettagli porto selezionato */}
      {selectedPort && (
        <div className="border-t bg-white">
          <Card className="m-4">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                    <MapPin className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">{selectedPort}</CardTitle>
                    <div className="flex items-center space-x-4 mt-1">
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600">4.7 (128 recensioni)</span>
                      </div>
                      {userLocation && calculateDistance(selectedPort) && (
                        <Badge variant="secondary">
                          {calculateDistance(selectedPort)}km da te
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={() => console.log(`Naviga verso ${selectedPort}`)}
                  >
                    <Navigation className="h-4 w-4 mr-1" />
                    Indicazioni
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedPort(null)}
                  >
                    ✕
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              {(() => {
                const portData = getBoatsForPort(selectedPort);
                return (
                  <div className="space-y-4">
                    {/* Statistiche porto */}
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="text-xl font-bold text-blue-600">{portData.count}</div>
                        <div className="text-sm text-gray-600">Barche disponibili</div>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-xl font-bold text-green-600">€{portData.minPrice}</div>
                        <div className="text-sm text-gray-600">Prezzo minimo</div>
                      </div>
                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <div className="text-xl font-bold text-purple-600">4.7</div>
                        <div className="text-sm text-gray-600">Rating medio</div>
                      </div>
                    </div>
                    
                    {/* Lista barche */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Barche Disponibili</h4>
                      <div className="space-y-3">
                        {portData.boats.slice(0, 3).map((boat, index) => (
                          <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                              <div className="font-medium text-gray-900">{boat.name}</div>
                              <div className="text-sm text-gray-600">{boat.type} • {boat.capacity} persone</div>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-blue-600">€{boat.price}/giorno</div>
                              <Button size="sm" className="mt-1">Prenota</Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}