import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Anchor, Users, Euro, Navigation } from "lucide-react";
import { Boat } from "@shared/schema";

// Coordinate dei porti del Lazio
const lazioPortsCoordinates = {
  "Gaeta": { lat: 41.2071, lng: 13.5717 },
  "Terracina": { lat: 41.2906, lng: 13.2436 },
  "San Felice Circeo": { lat: 41.3583, lng: 13.0833 },
  "Ponza": { lat: 40.8967, lng: 12.9589 },
  "Formia": { lat: 41.2547, lng: 13.6058 },
  "Anzio": { lat: 41.4491, lng: 12.6194 },
  "Ventotene": { lat: 40.7969, lng: 13.4281 },
  "Sperlonga": { lat: 41.2578, lng: 13.4275 }
};

interface InteractiveMapProps {
  boats: Boat[];
  onBoatSelect?: (boat: Boat) => void;
  onPortSelect?: (port: string) => void;
}

export function InteractiveMap({ boats, onBoatSelect, onPortSelect }: InteractiveMapProps) {
  const [selectedPort, setSelectedPort] = useState<string | null>(null);
  const [hoveredPort, setHoveredPort] = useState<string | null>(null);
  const [mapCenter] = useState({ lat: 41.2, lng: 13.0 }); // Centro del Lazio costiero

  // Simula barche per porta (in una app reale verrebbe dal database)
  const getBoatsForPort = (port: string): number => {
    const distribution: Record<string, number> = {
      "Gaeta": 8,
      "Terracina": 6,
      "San Felice Circeo": 5,
      "Ponza": 12,
      "Formia": 4,
      "Anzio": 7,
      "Ventotene": 3,
      "Sperlonga": 2
    };
    return distribution[port] || 0;
  };

  const handlePortClick = (port: string) => {
    setSelectedPort(port === selectedPort ? null : port);
    onPortSelect?.(port);
  };

  // Calcola posizione relativa per visualizzazione mappa
  const getPortPosition = (port: string) => {
    const coords = lazioPortsCoordinates[port as keyof typeof lazioPortsCoordinates];
    if (!coords) return { x: 50, y: 50 };
    
    // Converte coordinate geografiche in posizioni percentuali per la mappa
    const minLat = 40.7, maxLat = 41.5;
    const minLng = 12.4, maxLng = 13.7;
    
    const x = ((coords.lng - minLng) / (maxLng - minLng)) * 100;
    const y = ((maxLat - coords.lat) / (maxLat - minLat)) * 100;
    
    return { x: Math.max(5, Math.min(95, x)), y: Math.max(5, Math.min(95, y)) };
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Mappa interattiva */}
      <div className="relative">
        {/* Background mappa (immagine del Lazio costiero) */}
        <div 
          className="w-full h-96 bg-gradient-to-br from-blue-100 to-blue-200 relative overflow-hidden"
          style={{
            backgroundImage: `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="water" patternUnits="userSpaceOnUse" width="4" height="4"><rect width="4" height="4" fill="%23dbeafe"/><path d="m0,1 l2,2 m1,-2 l2,2 m-5,2 l2,2 m1,-2 l2,2" stroke="%23bfdbfe" stroke-width="0.5" opacity="0.5"/></pattern></defs><rect width="100" height="100" fill="url(%23water)"/></svg>')`,
          }}
        >
          {/* Mare di sfondo */}
          <div className="absolute inset-0 bg-gradient-to-b from-sky-200/50 to-blue-400/50" />
          
          {/* Costa del Lazio (simulata) */}
          <div className="absolute inset-0">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path
                d="M15,20 Q25,15 35,25 T55,30 Q65,35 75,25 T95,40 L95,100 L0,100 Z"
                fill="#f3f4f6"
                opacity="0.8"
              />
              <path
                d="M15,20 Q25,15 35,25 T55,30 Q65,35 75,25 T95,40"
                stroke="#065f46"
                strokeWidth="2"
                fill="none"
                opacity="0.6"
              />
            </svg>
          </div>

          {/* Porti con icone cliccabili */}
          {Object.entries(lazioPortsCoordinates).map(([port]) => {
            const position = getPortPosition(port);
            const boatCount = getBoatsForPort(port);
            const isSelected = selectedPort === port;
            const isHovered = hoveredPort === port;

            return (
              <div
                key={port}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 ${
                  isSelected ? "scale-125 z-20" : isHovered ? "scale-110 z-10" : "z-0"
                }`}
                style={{ left: `${position.x}%`, top: `${position.y}%` }}
                onMouseEnter={() => setHoveredPort(port)}
                onMouseLeave={() => setHoveredPort(null)}
                onClick={() => handlePortClick(port)}
              >
                {/* Icona porto */}
                <div className={`relative ${isSelected || isHovered ? "animate-bounce" : ""}`}>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shadow-lg transition-all ${
                      isSelected
                        ? "bg-coral text-white ring-4 ring-coral/30"
                        : isHovered
                        ? "bg-ocean-blue text-white"
                        : boatCount > 0
                        ? "bg-white text-ocean-blue border-2 border-ocean-blue"
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    <Anchor className="h-4 w-4" />
                  </div>
                  
                  {/* Badge con numero barche */}
                  {boatCount > 0 && (
                    <div className="absolute -top-2 -right-2 bg-coral text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow">
                      {boatCount}
                    </div>
                  )}
                </div>

                {/* Tooltip al hover */}
                {(isHovered || isSelected) && (
                  <div className="absolute top-10 left-1/2 transform -translate-x-1/2 z-30">
                    <div className="bg-white rounded-lg shadow-xl p-3 border border-gray-200 min-w-32">
                      <h4 className="font-semibold text-gray-900 text-sm">{port}</h4>
                      <p className="text-xs text-gray-600 mt-1">
                        {boatCount > 0 ? `${boatCount} imbarcazioni` : "Nessuna imbarcazione"}
                      </p>
                    </div>
                    <div className="w-2 h-2 bg-white transform rotate-45 -mt-1 ml-3 border-l border-t border-gray-200" />
                  </div>
                )}
              </div>
            );
          })}

          {/* Legenda */}
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
            <div className="flex items-center space-x-2 text-sm">
              <Anchor className="h-4 w-4 text-ocean-blue" />
              <span className="text-gray-700">Porti disponibili</span>
            </div>
            <div className="flex items-center space-x-2 text-sm mt-2">
              <div className="w-4 h-4 bg-coral rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">3</span>
              </div>
              <span className="text-gray-700">N° imbarcazioni</span>
            </div>
          </div>
        </div>

        {/* Informazioni porto selezionato */}
        {selectedPort && (
          <div className="absolute bottom-4 left-4 right-4 z-30">
            <Card className="bg-white/95 backdrop-blur-sm shadow-xl">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-ocean-blue rounded-full flex items-center justify-center">
                      <MapPin className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{selectedPort}</h3>
                      <p className="text-sm text-gray-600">
                        {getBoatsForPort(selectedPort)} imbarcazioni disponibili
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      className="bg-ocean-blue hover:bg-blue-600"
                      onClick={() => console.log(`Naviga verso ${selectedPort}`)}
                    >
                      <Navigation className="h-4 w-4 mr-1" />
                      Esplora
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
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Lista porti rapida */}
      <div className="p-4 border-t">
        <div className="flex flex-wrap gap-2">
          {Object.keys(lazioPortsCoordinates).map((port) => {
            const boatCount = getBoatsForPort(port);
            return (
              <Button
                key={port}
                variant={selectedPort === port ? "default" : "outline"}
                size="sm"
                className={`text-xs ${selectedPort === port ? "bg-ocean-blue" : ""}`}
                onClick={() => handlePortClick(port)}
              >
                <MapPin className="h-3 w-3 mr-1" />
                {port}
                {boatCount > 0 && (
                  <Badge variant="secondary" className="ml-1 px-1 py-0 text-xs">
                    {boatCount}
                  </Badge>
                )}
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
}