import { useState, useEffect, useRef } from "react";
import { Anchor, Star, Euro, Navigation, Filter, Search, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

declare global {
  interface Window {
    google: any;
    initMap: () => void;
    viewAllBoats: (portName: string) => void;
  }
}

interface Boat {
  id: number;
  name: string;
  type: string;
  location: string;
  pricePerDay: number;
  maxCapacity: number;
  rating: number;
  port: string;
  lat: number;
  lng: number;
}

interface GoogleMapProps {
  boats: any[];
  onBoatSelect?: (boat: any) => void;
  onPortSelect?: (port: string) => void;
}

// Database completo dei porti del Lazio con coordinate GPS precise
const lazioPortsDatabase = {
  "Porto di Civitavecchia": { 
    lat: 42.0942, 
    lng: 11.7939,
    boats: [
      { id: 1, name: "Azimut 55", price: 980, type: "Yacht", capacity: 12, rating: 4.8 },
      { id: 2, name: "Jeanneau Sun Odyssey 439", price: 350, type: "Barca a vela", capacity: 8, rating: 4.6 },
      { id: 3, name: "Zodiac Pro 650", price: 280, type: "Gommone", capacity: 6, rating: 4.4 },
      { id: 4, name: "Ferretti 720", price: 1200, type: "Yacht", capacity: 14, rating: 4.9 },
      { id: 5, name: "Quicksilver 675", price: 220, type: "Gommone", capacity: 7, rating: 4.3 },
      { id: 6, name: "Princess V39", price: 450, type: "Yacht", capacity: 8, rating: 4.5 }
    ]
  },
  "Porto di Gaeta": { 
    lat: 41.2058, 
    lng: 13.5696,
    boats: [
      { id: 7, name: "Zodiac Pro 550", price: 280, type: "Gommone", capacity: 6, rating: 4.5 },
      { id: 8, name: "Ferretti 681", price: 850, type: "Yacht", capacity: 10, rating: 4.7 },
      { id: 9, name: "Beneteau First 45", price: 320, type: "Barca a vela", capacity: 8, rating: 4.6 },
      { id: 10, name: "Sunseeker 68", price: 750, type: "Yacht", capacity: 12, rating: 4.8 },
      { id: 11, name: "Cranchi E26", price: 290, type: "Gommone", capacity: 7, rating: 4.4 }
    ]
  },
  "Porto di Ponza": { 
    lat: 40.8992, 
    lng: 12.9619,
    boats: [
      { id: 12, name: "Pershing 62", price: 950, type: "Yacht", capacity: 10, rating: 4.9 },
      { id: 13, name: "Lagoon 380", price: 550, type: "Catamarano", capacity: 8, rating: 4.7 },
      { id: 14, name: "Bavaria Cruiser 46", price: 380, type: "Barca a vela", capacity: 10, rating: 4.5 },
      { id: 15, name: "Zodiac Pro 750", price: 320, type: "Gommone", capacity: 8, rating: 4.4 },
      { id: 16, name: "Azimut 68", price: 1100, type: "Yacht", capacity: 12, rating: 4.8 },
      { id: 17, name: "Jeanneau Cap Camarat 10.5", price: 380, type: "Gommone", capacity: 10, rating: 4.6 }
    ]
  },
  "Porto di Ventotene": { 
    lat: 40.7969, 
    lng: 13.4279,
    boats: [
      { id: 18, name: "Princess V48", price: 580, type: "Yacht", capacity: 10, rating: 4.6 },
      { id: 19, name: "Beneteau Oceanis 40.1", price: 320, type: "Barca a vela", capacity: 8, rating: 4.5 },
      { id: 20, name: "Zodiac Pro 630", price: 280, type: "Gommone", capacity: 6, rating: 4.4 },
      { id: 21, name: "Sessa Marine C32", price: 400, type: "Yacht", capacity: 8, rating: 4.5 }
    ]
  },
  "Porto di Terracina": { 
    lat: 41.2857, 
    lng: 13.2443,
    boats: [
      { id: 22, name: "Princess V48", price: 580, type: "Yacht", capacity: 10, rating: 4.6 },
      { id: 23, name: "Beneteau Oceanis 40.1", price: 320, type: "Barca a vela", capacity: 8, rating: 4.5 },
      { id: 24, name: "Quicksilver 705", price: 260, type: "Gommone", capacity: 7, rating: 4.3 },
      { id: 25, name: "Cranchi Mediterranee 47", price: 520, type: "Yacht", capacity: 10, rating: 4.6 }
    ]
  },
  "Porto Badino": { 
    lat: 41.3574, 
    lng: 13.0847,
    boats: [
      { id: 26, name: "Jeanneau Cap Camarat 8.5", price: 340, type: "Gommone", capacity: 8, rating: 4.5 },
      { id: 27, name: "Princess V42", price: 480, type: "Yacht", capacity: 8, rating: 4.6 },
      { id: 28, name: "Beneteau First 40.7", price: 290, type: "Barca a vela", capacity: 8, rating: 4.4 }
    ]
  },
  "Porto di Formia": { 
    lat: 41.2567, 
    lng: 13.6050,
    boats: [
      { id: 29, name: "Jeanneau Cap Camarat 8.5", price: 340, type: "Gommone", capacity: 8, rating: 4.6 },
      { id: 30, name: "Cranchi E26", price: 280, type: "Gommone", capacity: 6, rating: 4.4 },
      { id: 31, name: "Sessa Marine C30", price: 380, type: "Yacht", capacity: 8, rating: 4.5 }
    ]
  },
  "Porto di Sperlonga": { 
    lat: 41.2566, 
    lng: 13.4343,
    boats: [
      { id: 32, name: "Zodiac Pro 620", price: 250, type: "Gommone", capacity: 6, rating: 4.3 },
      { id: 33, name: "Sessa Marine C30", price: 350, type: "Yacht", capacity: 8, rating: 4.4 },
      { id: 34, name: "Beneteau Flyer 7.7", price: 290, type: "Gommone", capacity: 7, rating: 4.5 }
    ]
  },
  "Porto di Santa Marinella": { 
    lat: 42.0345, 
    lng: 11.8709,
    boats: [
      { id: 35, name: "Sessa Marine C30", price: 350, type: "Yacht", capacity: 8, rating: 4.4 },
      { id: 36, name: "Quicksilver 675", price: 240, type: "Gommone", capacity: 6, rating: 4.3 },
      { id: 37, name: "Cranchi E26", price: 280, type: "Gommone", capacity: 6, rating: 4.4 }
    ]
  },
  "Porto di Ostia": { 
    lat: 41.7351, 
    lng: 12.2928,
    boats: [
      { id: 38, name: "Cranchi Mediterranee 43", price: 450, type: "Yacht", capacity: 10, rating: 4.5 },
      { id: 39, name: "Zodiac Pro 550", price: 250, type: "Gommone", capacity: 6, rating: 4.3 },
      { id: 40, name: "Jeanneau Cap Camarat 7.5", price: 280, type: "Gommone", capacity: 7, rating: 4.4 },
      { id: 41, name: "Sessa Marine C32", price: 380, type: "Yacht", capacity: 8, rating: 4.5 }
    ]
  },
  "Porto di Nettuno": { 
    lat: 41.4539, 
    lng: 12.6619,
    boats: [
      { id: 42, name: "Quicksilver 705", price: 260, type: "Gommone", capacity: 7, rating: 4.3 },
      { id: 43, name: "Cranchi E26", price: 280, type: "Gommone", capacity: 6, rating: 4.4 },
      { id: 44, name: "Sessa Marine C30", price: 360, type: "Yacht", capacity: 8, rating: 4.5 }
    ]
  }
};

export function GoogleMap({ boats, onBoatSelect, onPortSelect }: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);
  const markers = useRef<any[]>([]);
  const infoWindows = useRef<any[]>([]);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [selectedPort, setSelectedPort] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);

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

  // Carica Google Maps API
  useEffect(() => {
    const loadGoogleMaps = () => {
      if (window.google) {
        initializeMap();
        return;
      }

      window.initMap = initializeMap;
      
      // Only load Google Maps if API key is available
      const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "AIzaSyBsiEdXHR6KxjHvLVxSkKMu5LV3dkOBIT4";
      if (!apiKey) {
        console.log("Google Maps API key not available, showing fallback view");
        setIsMapLoaded(false);
        return;
      }
      
      console.log("Loading Google Maps with API key...");

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap&libraries=places`;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    };

    loadGoogleMaps();
  }, []);

  const initializeMap = () => {
    if (!mapRef.current) return;

    // Inizializza la mappa centrata sul Lazio
    map.current = new window.google.maps.Map(mapRef.current, {
      center: { lat: 41.5, lng: 12.5 },
      zoom: 8,
      mapTypeId: 'roadmap',
      styles: [
        {
          featureType: "water",
          elementType: "geometry",
          stylers: [
            { color: "#4285f4" }
          ]
        }
      ],
      zoomControl: true,
      mapTypeControl: true,
      scaleControl: true,
      streetViewControl: true,
      rotateControl: true,
      fullscreenControl: true
    });

    // Aggiungi marker per ogni porto
    addPortMarkers();
    
    // Aggiungi marker utente se disponibile
    if (userLocation) {
      addUserLocationMarker();
    }

    setIsMapLoaded(true);
  };

  const addUserLocationMarker = () => {
    if (!userLocation || !map.current) return;

    new window.google.maps.Marker({
      position: userLocation,
      map: map.current,
      title: "La tua posizione",
      icon: {
        url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(`
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="10" cy="10" r="8" fill="#4285f4" stroke="white" stroke-width="2"/>
            <circle cx="10" cy="10" r="3" fill="white"/>
          </svg>
        `),
        scaledSize: new window.google.maps.Size(20, 20)
      }
    });
  };

  const addPortMarkers = () => {
    // Pulisci marker esistenti
    markers.current.forEach(marker => marker.setMap(null));
    infoWindows.current.forEach(infoWindow => infoWindow.close());
    markers.current = [];
    infoWindows.current = [];

    // Filtra porti in base ai criteri
    const filteredPorts = Object.entries(lazioPortsDatabase).filter(([portName, portData]) => {
      if (searchTerm && !portName.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }

      if (filterType !== "all") {
        const hasMatchingBoats = portData.boats.some(boat => 
          boat.type.toLowerCase().includes(filterType.toLowerCase())
        );
        if (!hasMatchingBoats) return false;
      }

      return true;
    });

    filteredPorts.forEach(([portName, portData]) => {
      const marker = new window.google.maps.Marker({
        position: { lat: portData.lat, lng: portData.lng },
        map: map.current,
        title: portName,
        icon: {
          url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(`
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="16" cy="16" r="14" fill="#1e40af" stroke="white" stroke-width="2"/>
              <path d="M16 8L20 12H18V20H14V12H12L16 8Z" fill="white"/>
              <circle cx="24" cy="8" r="6" fill="#f97316" stroke="white" stroke-width="1"/>
              <text x="24" y="12" text-anchor="middle" fill="white" font-size="8" font-weight="bold">${portData.boats.length}</text>
            </svg>
          `),
          scaledSize: new window.google.maps.Size(32, 32),
          anchor: new window.google.maps.Point(16, 16)
        }
      });

      // Crea InfoWindow per ogni porto
      const infoWindow = new window.google.maps.InfoWindow({
        content: createInfoWindowContent(portName, portData)
      });

      marker.addListener('click', () => {
        // Chiudi altre InfoWindow
        infoWindows.current.forEach(iw => iw.close());
        
        // Apri questa InfoWindow
        infoWindow.open(map.current, marker);
        
        // Aggiorna stato
        setSelectedPort(portName);
        onPortSelect?.(portName);
      });

      markers.current.push(marker);
      infoWindows.current.push(infoWindow);
    });
  };

  const createInfoWindowContent = (portName: string, portData: any) => {
    const filteredBoats = filterType !== "all" 
      ? portData.boats.filter((boat: any) => boat.type.toLowerCase().includes(filterType.toLowerCase()))
      : portData.boats;

    const minPrice = Math.min(...filteredBoats.map((b: any) => b.price));
    const maxPrice = Math.max(...filteredBoats.map((b: any) => b.price));
    const avgRating = (filteredBoats.reduce((sum: number, boat: any) => sum + boat.rating, 0) / filteredBoats.length).toFixed(1);

    return `
      <div style="max-width: 300px; padding: 8px;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
          <h3 style="margin: 0; font-size: 16px; font-weight: bold; color: #1f2937;">${portName}</h3>
          <div style="display: flex; align-items: center; gap: 4px;">
            <span style="color: #fbbf24;">⭐</span>
            <span style="font-size: 14px; color: #6b7280;">${avgRating}</span>
          </div>
        </div>
        
        <div style="margin-bottom: 8px;">
          <div style="font-size: 14px; color: #6b7280; margin-bottom: 4px;">
            ${filteredBoats.length} barche disponibili
          </div>
          <div style="font-size: 14px; color: #059669; font-weight: 500;">
            €${minPrice} - €${maxPrice}/giorno
          </div>
        </div>
        
        <div style="max-height: 120px; overflow-y: auto;">
          ${filteredBoats.slice(0, 3).map((boat: any) => `
            <div style="padding: 6px; border: 1px solid #e5e7eb; border-radius: 6px; margin-bottom: 4px; display: flex; justify-content: space-between; align-items: center;">
              <div>
                <div style="font-size: 13px; font-weight: 500; color: #1f2937;">${boat.name}</div>
                <div style="font-size: 12px; color: #6b7280;">${boat.type} • ${boat.capacity} persone</div>
              </div>
              <div style="text-align: right;">
                <div style="font-size: 13px; font-weight: bold; color: #1e40af;">€${boat.price}</div>
                <div style="font-size: 11px; color: #6b7280;">al giorno</div>
              </div>
            </div>
          `).join('')}
        </div>
        
        ${filteredBoats.length > 3 ? `
          <div style="text-align: center; margin-top: 8px;">
            <button 
              onclick="window.viewAllBoats('${portName}')"
              style="background: #1e40af; color: white; border: none; padding: 6px 12px; border-radius: 4px; font-size: 12px; cursor: pointer;"
            >
              Vedi tutte le ${filteredBoats.length} barche
            </button>
          </div>
        ` : ''}
      </div>
    `;
  };

  // Aggiorna marker quando cambiano i filtri
  useEffect(() => {
    if (isMapLoaded) {
      addPortMarkers();
    }
  }, [searchTerm, filterType, isMapLoaded]);

  // Funzione globale per aprire dettagli porto
  useEffect(() => {
    window.viewAllBoats = (portName: string) => {
      setSelectedPort(portName);
      onPortSelect?.(portName);
    };
  }, [onPortSelect]);

  // Fallback map if Google Maps fails to load
  if (!isMapLoaded) {
    return (
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-4 border-b bg-gradient-to-r from-blue-50 to-blue-100">
          <h2 className="text-xl font-bold text-gray-900">Mappa Interattiva Porti del Lazio</h2>
          <p className="text-sm text-gray-600 mt-1">Vista semplificata con tutti i porti disponibili</p>
        </div>
        
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(lazioPortsDatabase).map(([portName, portData]) => (
              <div key={portName} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                   onClick={() => {
                     setSelectedPort(portName);
                     onPortSelect?.(portName);
                   }}>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">{portName}</h3>
                  <Badge variant="secondary">{portData.boats.length} barche</Badge>
                </div>
                
                <div className="text-sm text-gray-600 mb-2">
                  📍 {portData.lat.toFixed(4)}, {portData.lng.toFixed(4)}
                </div>
                
                <div className="text-sm">
                  <div className="text-green-600 font-medium">
                    €{Math.min(...portData.boats.map(b => b.price))} - €{Math.max(...portData.boats.map(b => b.price))}/giorno
                  </div>
                  <div className="text-gray-500">
                    Valutazione media: ⭐ {(portData.boats.reduce((sum, boat) => sum + boat.rating, 0) / portData.boats.length).toFixed(1)}
                  </div>
                </div>
                
                {selectedPort === portName && (
                  <div className="mt-3 pt-3 border-t">
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {portData.boats.slice(0, 3).map((boat, idx) => (
                        <div key={idx} className="flex justify-between text-xs">
                          <span className="font-medium">{boat.name}</span>
                          <span className="text-blue-600">€{boat.price}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        
        <div className="p-4 bg-yellow-50 border-t">
          <div className="flex items-center text-yellow-800">
            <span className="text-lg mr-2">⚠️</span>
            <div>
              <p className="font-medium">Google Maps temporaneamente non disponibile</p>
              <p className="text-sm">Per attivare la mappa interattiva, abilita la fatturazione nell'API di Google Maps.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header con controlli */}
      <div className="p-4 border-b bg-gradient-to-r from-blue-50 to-blue-100">
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Mappa Interattiva Google Maps</h2>
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

          {/* Barra di ricerca */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Cerca porti..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filtri */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-white rounded-lg border">
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

              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm("");
                  setFilterType("all");
                }}
                className="text-xs"
              >
                Cancella filtri
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Mappa Google Maps */}
      <div className="relative">
        <div ref={mapRef} className="w-full h-[600px]" />
        
        {!isMapLoaded && !import.meta.env.VITE_GOOGLE_MAPS_API_KEY && (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-sky-100 p-8">
            <div className="text-center mb-8">
              <MapPin className="h-16 w-16 text-blue-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Porti e Marine del Lazio</h3>
              <p className="text-gray-600">Esplora le nostre destinazioni nautiche più belle</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-h-[400px] overflow-y-auto">
              {Object.entries(lazioPortsDatabase).map(([portName, portData]) => (
                <Card key={portName} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setSelectedPort(portName)}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{portName}</CardTitle>
                      <Anchor className="h-5 w-5 text-blue-600" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Barche disponibili</span>
                        <span className="font-semibold text-blue-600">{portData.boats.length}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Coordinate</span>
                        <span className="text-xs font-mono">{portData.lat.toFixed(3)}, {portData.lng.toFixed(3)}</span>
                      </div>
                      <div className="pt-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedPort(portName);
                            onPortSelect?.(portName);
                          }}
                        >
                          Vedi barche disponibili
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {!isMapLoaded && import.meta.env.VITE_GOOGLE_MAPS_API_KEY && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="text-center">
              <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-2"></div>
              <div className="text-gray-600">Caricamento mappa...</div>
            </div>
          </div>
        )}

        {/* Legenda */}
        {isMapLoaded && (
          <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg p-3 shadow-lg border">
            <div className="text-sm font-semibold text-gray-900 mb-2">Legenda</div>
            <div className="space-y-1 text-xs">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center">
                  <Anchor className="h-2 w-2 text-white" />
                </div>
                <span>Porto con barche</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">12</span>
                </div>
                <span>N° barche disponibili</span>
              </div>
              {userLocation && (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-blue-400 rounded-full"></div>
                  <span>La tua posizione</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Dettagli porto selezionato */}
      {selectedPort && (
        <div className="border-t bg-white p-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{selectedPort}</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedPort(null)}
                >
                  ✕
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {lazioPortsDatabase[selectedPort as keyof typeof lazioPortsDatabase]?.boats.slice(0, 5).map((boat) => (
                  <div key={boat.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900">{boat.name}</div>
                      <div className="text-sm text-gray-600">{boat.type} • {boat.capacity} persone</div>
                      <div className="flex items-center space-x-1 mt-1">
                        <Star className="h-3 w-3 text-yellow-400 fill-current" />
                        <span className="text-xs text-gray-600">{boat.rating}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-blue-600">€{boat.price}/giorno</div>
                      <Button size="sm" className="mt-1">Prenota</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}