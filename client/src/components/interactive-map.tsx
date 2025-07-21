import { useState } from "react";
import { Anchor, MapPin } from "lucide-react";

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

export function InteractiveMap({ boats, onBoatSelect, onPortSelect }: InteractiveMapProps) {
  const [selectedPort, setSelectedPort] = useState<string | null>(null);
  const [hoveredPort, setHoveredPort] = useState<string | null>(null);

  // Barche per porto con prezzi reali
  const getBoatsForPort = (port: string) => {
    const distribution: Record<string, { count: number, minPrice: number, maxPrice: number, boats: Array<{name: string, price: number, type: string}> }> = {
      "Civitavecchia": { 
        count: 15, 
        minPrice: 120, 
        maxPrice: 1200,
        boats: [
          { name: "Azimut 55", price: 980, type: "Yacht" },
          { name: "Jeanneau Sun Odyssey 439", price: 350, type: "Barca a vela" },
          { name: "Zodiac Pro 650", price: 280, type: "Gommone" }
        ]
      },
      "Gaeta": { 
        count: 12, 
        minPrice: 150, 
        maxPrice: 850,
        boats: [
          { name: "Zodiac Pro 550", price: 280, type: "Gommone" },
          { name: "Ferretti 681", price: 850, type: "Yacht" },
          { name: "Beneteau First 45", price: 320, type: "Barca a vela" }
        ]
      },
      "Ponza": { 
        count: 18, 
        minPrice: 180, 
        maxPrice: 950,
        boats: [
          { name: "Pershing 62", price: 950, type: "Yacht" },
          { name: "Lagoon 380", price: 550, type: "Catamarano" }
        ]
      }
    };
    return distribution[port] || { count: 0, minPrice: 0, maxPrice: 0, boats: [] };
  };

  const handlePortClick = (port: string) => {
    setSelectedPort(port === selectedPort ? null : port);
    onPortSelect?.(port);
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
      {/* Mappa interattiva reale */}
      <div className="relative">
        {/* Google Maps Embed con mappa reale del Lazio costiero */}
        <div className="w-full h-[500px] relative overflow-hidden rounded-xl">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d394684.4457867873!2d11.761719!3d41.902782!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x132f6196f99621dd%3A0x972f72b64133a8ec!2sLazio%2C%20Italia!5e0!3m2!1sit!2sit!4v1642234567890!5m2!1sit!2sit&amp;zoom=9"
            width="100%"
            height="500"
            style={{ border: 0, filter: 'hue-rotate(200deg) saturate(0.8)' }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="absolute inset-0"
          ></iframe>
          
          {/* Markers personalizzati sui porti reali */}
          <div className="absolute inset-0 pointer-events-auto">
            {Object.keys(lazioPortsCoordinates).map((port) => {
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
                    
                    {/* Tooltip con informazioni porto */}
                    {(isSelected || isHovered) && (
                      <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                        <div className="bg-white rounded-lg shadow-xl border p-3 max-w-xs">
                          <div className="font-semibold text-gray-900 mb-1">{port}</div>
                          <div className="text-sm text-gray-600 mb-2">
                            {portData.count} barche disponibili
                          </div>
                          <div className="flex items-center text-sm">
                            <span className="text-green-600 font-medium">
                              €{portData.minPrice} - €{portData.maxPrice}/giorno
                            </span>
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
        </div>
      </div>

      {/* Lista porti selezionati */}
      {selectedPort && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-900">{selectedPort}</h3>
            <button
              onClick={() => setSelectedPort(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          
          {(() => {
            const portData = getBoatsForPort(selectedPort);
            return (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-gray-600">
                    {portData.count} barche disponibili
                  </span>
                  <span className="text-sm font-medium text-green-600">
                    €{portData.minPrice} - €{portData.maxPrice}/giorno
                  </span>
                </div>
                
                <div className="grid gap-3">
                  {portData.boats.slice(0, 3).map((boat, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                      <div>
                        <div className="font-medium text-gray-900">{boat.name}</div>
                        <div className="text-sm text-gray-600">{boat.type}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-blue-600">€{boat.price}/giorno</div>
                        <button className="text-xs text-blue-600 hover:text-blue-800">
                          Vedi dettagli
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}