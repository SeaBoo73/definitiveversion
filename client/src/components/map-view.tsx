import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MapPin, Plus, Minus } from "lucide-react";
import { Boat } from "@shared/schema";

interface MapViewProps {
  boats: Boat[];
}

export function MapView({ boats }: MapViewProps) {
  const [mapLoaded, setMapLoaded] = useState(false);

  const loadMap = () => {
    setMapLoaded(true);
    // Here you would initialize the actual map (MapBox, Google Maps, etc.)
    // For now, we'll just show a placeholder
  };

  if (!mapLoaded) {
    return (
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div 
          className="relative h-96 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&h=600')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          
          <div className="relative z-10 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <MapPin className="h-12 w-12 text-ocean-blue mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Mappa Interattiva</h3>
              <p className="text-gray-600 mb-4">Visualizza le imbarcazioni disponibili in tempo reale</p>
              <Button 
                onClick={loadMap}
                className="bg-ocean-blue hover:bg-blue-600"
              >
                Carica Mappa
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="relative h-96 bg-gradient-to-br from-blue-100 to-blue-200">
        {/* Map placeholder - in a real implementation, this would be the actual map */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&h=600')",
          }}
        >
          {/* Sample markers */}
          <div className="absolute top-1/4 left-1/4 w-8 h-8 bg-coral rounded-full border-4 border-white shadow-lg flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
            <span className="text-white font-bold text-xs">€85</span>
          </div>
          <div className="absolute top-1/3 right-1/3 w-8 h-8 bg-coral rounded-full border-4 border-white shadow-lg flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
            <span className="text-white font-bold text-xs">€120</span>
          </div>
          <div className="absolute bottom-1/4 left-1/2 w-8 h-8 bg-coral rounded-full border-4 border-white shadow-lg flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
            <span className="text-white font-bold text-xs">€95</span>
          </div>
          
          {/* Map Controls */}
          <div className="absolute top-4 right-4 flex flex-col space-y-2">
            <Button size="sm" variant="outline" className="bg-white">
              <Plus className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="outline" className="bg-white">
              <Minus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
