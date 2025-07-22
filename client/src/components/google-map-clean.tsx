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
    ]
  },
  "Porto di Gaeta": { 
    lat: 41.2058, 
    lng: 13.5696,
    boats: [
      { id: 7, name: "Zodiac Pro 550", price: 280, type: "Gommone", capacity: 6, rating: 4.5 },
      { id: 8, name: "Ferretti 681", price: 850, type: "Yacht", capacity: 10, rating: 4.7 },
    ]
  },
  "Porto di Ponza": { 
    lat: 40.8992, 
    lng: 12.9619,
    boats: [
      { id: 12, name: "Pershing 62", price: 950, type: "Yacht", capacity: 10, rating: 4.9 },
      { id: 13, name: "Lagoon 380", price: 550, type: "Catamarano", capacity: 8, rating: 4.7 },
    ]
  },
  "Porto di Terracina": { 
    lat: 41.2857, 
    lng: 13.2443,
    boats: [
      { id: 22, name: "Princess V48", price: 580, type: "Yacht", capacity: 10, rating: 4.6 },
      { id: 23, name: "Beneteau Oceanis 40.1", price: 320, type: "Barca a vela", capacity: 8, rating: 4.5 },
    ]
  },
};

export function GoogleMap({ boats, onBoatSelect, onPortSelect }: GoogleMapProps) {
  console.log("GoogleMap component rendering...");
  const [selectedPort, setSelectedPort] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  // Filtra porti in base ai criteri per la vista alternativa
  const getFilteredPorts = () => {
    return Object.entries(lazioPortsDatabase).filter(([portName, portData]) => {
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
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden min-h-[700px] border-4 border-red-500">
      <div className="p-4 bg-red-100 text-red-800 font-bold text-center">
        COMPONENTE MAPPA CARICATO - Se vedi questo, il componente funziona!
      </div>
      
      {/* Header con controlli */}
      <div className="p-4 border-b bg-gradient-to-r from-blue-50 to-blue-100">
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Mappa Interattiva Porti del Lazio</h2>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        </div>
      </div>

      {/* Vista Porti */}
      <div className="w-full min-h-[600px] bg-gradient-to-br from-blue-50 to-sky-100">
        <div className="p-6">
          <div className="text-center mb-6">
            <MapPin className="h-12 w-12 text-blue-600 mx-auto mb-3" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Porti e Marine del Lazio</h3>
            <p className="text-gray-600">Esplora le nostre destinazioni nautiche più belle</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[450px] overflow-y-auto">
            {getFilteredPorts().map(([portName, portData]) => (
              <Card key={portName} className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-blue-300" 
                    onClick={() => {
                      setSelectedPort(portName);
                      onPortSelect?.(portName);
                    }}>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between">
                    <span className="text-sm font-semibold">{portName}</span>
                    <Badge variant="secondary" className="text-xs">{portData.boats.length}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="text-xs text-gray-600 mb-2">
                    📍 {portData.lat.toFixed(4)}, {portData.lng.toFixed(4)}
                  </div>
                  
                  <div className="text-sm mb-3">
                    <div className="text-green-600 font-medium">
                      €{Math.min(...portData.boats.map(b => b.price))} - €{Math.max(...portData.boats.map(b => b.price))}/giorno
                    </div>
                    <div className="text-gray-500 text-xs">
                      ⭐ {(portData.boats.reduce((sum, boat) => sum + boat.rating, 0) / portData.boats.length).toFixed(1)} valutazione
                    </div>
                  </div>
                  
                  {selectedPort === portName && (
                    <div className="border-t pt-3">
                      <div className="space-y-1 max-h-24 overflow-y-auto">
                        {portData.boats.slice(0, 3).map((boat, idx) => (
                          <div key={idx} className="flex justify-between text-xs">
                            <span className="font-medium">{boat.name}</span>
                            <span className="text-blue-600">€{boat.price}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
          
          {getFilteredPorts().length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">Nessun porto trovato con i filtri selezionati</p>
            </div>
          )}
        </div>
        
        {/* Status */}
        <div className="p-4 bg-blue-50 border-t">
          <div className="flex items-center text-blue-800">
            <span className="text-lg mr-2">🗺️</span>
            <div>
              <p className="font-medium">Mappa Interattiva Attiva</p>
              <p className="text-sm">Vista con tutti i porti del Lazio e relative imbarcazioni</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}