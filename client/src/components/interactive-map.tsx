import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Anchor, Users, Euro, Navigation, Star } from "lucide-react";
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

  // Simula barche per porta con prezzi (in una app reale verrebbe dal database)
  const getBoatsForPort = (port: string) => {
    const distribution: Record<string, { count: number, minPrice: number, maxPrice: number, boats: Array<{name: string, price: number, type: string}> }> = {
      "Gaeta": { 
        count: 8, 
        minPrice: 150, 
        maxPrice: 850,
        boats: [
          { name: "Zodiac Pro 550", price: 280, type: "Gommone" },
          { name: "Ferretti 681", price: 850, type: "Yacht" },
          { name: "Beneteau First 45", price: 320, type: "Barca a vela" }
        ]
      },
      "Terracina": { 
        count: 6, 
        minPrice: 120, 
        maxPrice: 450,
        boats: [
          { name: "Ranieri Shadow 20", price: 180, type: "Gommone" },
          { name: "Jeanneau Sun Odyssey", price: 290, type: "Barca a vela" }
        ]
      },
      "San Felice Circeo": { 
        count: 5, 
        minPrice: 200, 
        maxPrice: 600,
        boats: [
          { name: "Azimut 43", price: 480, type: "Yacht" },
          { name: "Lagoon 380", price: 550, type: "Catamarano" }
        ]
      },
      "Ponza": { 
        count: 12, 
        minPrice: 180, 
        maxPrice: 950,
        boats: [
          { name: "Pershing 62", price: 950, type: "Yacht" },
          { name: "Bavaria 46", price: 280, type: "Barca a vela" },
          { name: "Nuova Jolly 700", price: 220, type: "Gommone" }
        ]
      },
      "Formia": { 
        count: 4, 
        minPrice: 160, 
        maxPrice: 380,
        boats: [
          { name: "Sessa Marine C35", price: 320, type: "Yacht" }
        ]
      },
      "Anzio": { 
        count: 7, 
        minPrice: 140, 
        maxPrice: 520,
        boats: [
          { name: "Cranchi Endurance 33", price: 380, type: "Yacht" },
          { name: "Yamaha EX Sport", price: 140, type: "Moto d'acqua" }
        ]
      },
      "Ventotene": { 
        count: 3, 
        minPrice: 250, 
        maxPrice: 400,
        boats: [
          { name: "Dufour 412", price: 350, type: "Barca a vela" }
        ]
      },
      "Sperlonga": { 
        count: 2, 
        minPrice: 180, 
        maxPrice: 280,
        boats: [
          { name: "Zodiac Medline 580", price: 240, type: "Gommone" }
        ]
      }
    };
    return distribution[port] || { count: 0, minPrice: 0, maxPrice: 0, boats: [] };
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
          className="w-full h-[500px] bg-gradient-to-br from-blue-50 to-blue-100 relative overflow-hidden rounded-xl"
          style={{
            backgroundImage: `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="water" patternUnits="userSpaceOnUse" width="6" height="6"><rect width="6" height="6" fill="%23e0f2fe"/><circle cx="2" cy="2" r="0.5" fill="%23b3e5fc" opacity="0.3"/><circle cx="4" cy="4" r="0.3" fill="%2381d4fa" opacity="0.4"/></pattern></defs><rect width="100" height="100" fill="url(%23water)"/></svg>')`,
          }}
        >
          {/* Mare di sfondo con effetto ondulato */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-b from-sky-100/60 to-blue-300/60" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          </div>
          
          {/* Costa del Lazio (più dettagliata) */}
          <div className="absolute inset-0">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              {/* Terra principale */}
              <path
                d="M10,25 Q20,20 30,28 T50,35 Q60,40 70,30 T90,45 L90,100 L0,100 Z"
                fill="#f8fafc"
                opacity="0.9"
              />
              {/* Dettagli costieri */}
              <path
                d="M10,25 Q20,20 30,28 T50,35 Q60,40 70,30 T90,45"
                stroke="#10b981"
                strokeWidth="1.5"
                fill="none"
                opacity="0.7"
              />
              {/* Piccole isole (Ponza, Ventotene) */}
              <circle cx="25" cy="45" r="2" fill="#f8fafc" opacity="0.8" />
              <circle cx="35" cy="50" r="1.5" fill="#f8fafc" opacity="0.8" />
              {/* Ombreggiatura della costa */}
              <path
                d="M10,25 Q20,20 30,28 T50,35 Q60,40 70,30 T90,45 L90,50 Q70,35 60,45 T50,40 Q30,33 20,25 T10,30 Z"
                fill="#e2e8f0"
                opacity="0.3"
              />
            </svg>
          </div>

          {/* Porti con icone cliccabili e prezzi */}
          {Object.entries(lazioPortsCoordinates).map(([port]) => {
            const position = getPortPosition(port);
            const portData = getBoatsForPort(port);
            const isSelected = selectedPort === port;
            const isHovered = hoveredPort === port;

            return (
              <div
                key={port}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 ${
                  isSelected ? "scale-110 z-20" : isHovered ? "scale-105 z-10" : "z-0"
                }`}
                style={{ left: `${position.x}%`, top: `${position.y}%` }}
                onMouseEnter={() => setHoveredPort(port)}
                onMouseLeave={() => setHoveredPort(null)}
                onClick={() => handlePortClick(port)}
              >
                {/* Icona porto con design migliorato */}
                <div className={`relative ${isSelected || isHovered ? "animate-pulse" : ""}`}>
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center shadow-xl transition-all border-2 ${
                      isSelected
                        ? "bg-coral text-white border-coral/50 ring-4 ring-coral/20"
                        : isHovered
                        ? "bg-ocean-blue text-white border-ocean-blue/50 ring-2 ring-ocean-blue/20"
                        : portData.count > 0
                        ? "bg-white text-ocean-blue border-ocean-blue/30 hover:border-ocean-blue"
                        : "bg-gray-100 text-gray-400 border-gray-200"
                    }`}
                  >
                    <Anchor className="h-5 w-5" />
                  </div>
                  
                  {/* Badge con numero barche */}
                  {portData.count > 0 && (
                    <div className="absolute -top-1 -right-1 bg-coral text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold shadow-lg border-2 border-white">
                      {portData.count}
                    </div>
                  )}

                  {/* Prezzo minimo sempre visibile */}
                  {portData.count > 0 && (
                    <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
                      <div className="bg-white/95 backdrop-blur-sm rounded-lg px-2 py-1 shadow-lg border border-gray-200">
                        <div className="text-xs font-bold text-ocean-blue">
                          da €{portData.minPrice}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Tooltip avanzato al hover */}
                {(isHovered || isSelected) && (
                  <div className="absolute top-16 left-1/2 transform -translate-x-1/2 z-30">
                    <div className="bg-white rounded-xl shadow-2xl p-4 border border-gray-200 min-w-64 max-w-80">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-bold text-gray-900 text-lg">{port}</h4>
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-gray-600">4.8</span>
                        </div>
                      </div>
                      
                      {portData.count > 0 ? (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">{portData.count} imbarcazioni</span>
                            <div className="text-sm font-semibold text-ocean-blue">
                              €{portData.minPrice} - €{portData.maxPrice}
                            </div>
                          </div>
                          
                          <div className="border-t pt-3">
                            <div className="text-sm font-medium text-gray-700 mb-2">Popolari:</div>
                            <div className="space-y-1">
                              {portData.boats.slice(0, 3).map((boat, index) => (
                                <div key={index} className="flex items-center justify-between text-xs">
                                  <span className="text-gray-600">{boat.name}</span>
                                  <div className="flex items-center space-x-2">
                                    <Badge variant="secondary" className="text-xs py-0">
                                      {boat.type}
                                    </Badge>
                                    <span className="font-medium text-ocean-blue">€{boat.price}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">Nessuna imbarcazione disponibile</p>
                      )}
                    </div>
                    <div className="w-3 h-3 bg-white transform rotate-45 -mt-1.5 ml-4 border-l border-t border-gray-200" />
                  </div>
                )}
              </div>
            );
          })}

          {/* Legenda migliorata */}
          <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-xl border border-gray-200">
            <div className="text-sm font-semibold text-gray-900 mb-3">Legenda Mappa</div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm">
                <Anchor className="h-4 w-4 text-ocean-blue" />
                <span className="text-gray-700">Porti disponibili</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <div className="w-4 h-4 bg-coral rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">8</span>
                </div>
                <span className="text-gray-700">N° imbarcazioni</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <div className="bg-white/95 rounded px-2 py-1 border border-gray-200">
                  <Euro className="h-3 w-3 text-ocean-blue inline mr-1" />
                  <span className="text-xs font-bold text-ocean-blue">150</span>
                </div>
                <span className="text-gray-700">Prezzo da</span>
              </div>
            </div>
          </div>
        </div>

        {/* Informazioni porto selezionato con prezzi */}
        {selectedPort && (
          <div className="absolute bottom-4 left-4 right-4 z-30">
            <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border-t-4 border-ocean-blue">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-ocean-blue rounded-full flex items-center justify-center">
                      <MapPin className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-bold text-gray-900 text-lg">{selectedPort}</h3>
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-gray-600">4.8</span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-600">
                          {getBoatsForPort(selectedPort).count} imbarcazioni disponibili
                        </p>
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <Euro className="h-4 w-4 text-ocean-blue" />
                            <span className="text-sm font-semibold text-ocean-blue">
                              €{getBoatsForPort(selectedPort).minPrice} - €{getBoatsForPort(selectedPort).maxPrice}
                            </span>
                            <span className="text-xs text-gray-500">al giorno</span>
                          </div>
                        </div>
                      </div>
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

      {/* Lista porti rapida con prezzi */}
      <div className="p-4 border-t bg-gray-50">
        <div className="flex flex-wrap gap-2">
          {Object.keys(lazioPortsCoordinates).map((port) => {
            const portData = getBoatsForPort(port);
            return (
              <Button
                key={port}
                variant={selectedPort === port ? "default" : "outline"}
                size="sm"
                className={`text-xs h-auto py-2 ${selectedPort === port ? "bg-ocean-blue" : "hover:bg-ocean-blue/5"}`}
                onClick={() => handlePortClick(port)}
              >
                <div className="flex items-center space-x-1">
                  <MapPin className="h-3 w-3" />
                  <span>{port}</span>
                  {portData.count > 0 && (
                    <>
                      <Badge variant="secondary" className="ml-1 px-1 py-0 text-xs">
                        {portData.count}
                      </Badge>
                      <span className="text-xs font-semibold text-ocean-blue">
                        €{portData.minPrice}+
                      </span>
                    </>
                  )}
                </div>
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
}