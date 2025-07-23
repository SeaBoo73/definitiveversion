import { useEffect, useRef, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Anchor, Star } from "lucide-react";

// Declare google maps types
declare global {
  interface Window {
    google: any;
  }
}

const GOOGLE_MAPS_API_KEY = "AIzaSyDTjTGKA-CO281BTK3-WEx5vyfQ-_ah4Bo";

interface BoatMarker {
  id: number;
  name: string;
  type: string;
  port: string;
  price: string;
  rating: number;
  lat: number;
  lng: number;
  image?: string;
}

const lazioBoats: BoatMarker[] = [
  {
    id: 1,
    name: "Azimut 55 Luxury",
    type: "Yacht",
    port: "Civitavecchia",
    price: "€850",
    rating: 4.9,
    lat: 42.0942,
    lng: 11.7965
  },
  {
    id: 2,
    name: "Bavaria 46 Cruiser",
    type: "Barca a vela",
    port: "Gaeta",
    price: "€320",
    rating: 4.8,
    lat: 41.2133,
    lng: 13.5681
  },
  {
    id: 3,
    name: "Zodiac Pro 650",
    type: "Gommone",
    port: "Anzio",
    price: "€180",
    rating: 4.7,
    lat: 41.4498,
    lng: 12.6219
  },
  {
    id: 4,
    name: "Jeanneau Sun Fast",
    type: "Barca a vela",
    port: "Terracina",
    price: "€280",
    rating: 4.6,
    lat: 41.2906,
    lng: 13.2434
  },
  {
    id: 5,
    name: "Catamaran Lagoon",
    type: "Catamarano",
    port: "Ponza",
    price: "€650",
    rating: 4.9,
    lat: 40.9003,
    lng: 12.9667
  },
  {
    id: 6,
    name: "Princess V58",
    type: "Yacht",
    port: "Formia",
    price: "€950",
    rating: 4.8,
    lat: 41.2567,
    lng: 13.6056
  }
];

export function GoogleMapsReal() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [selectedBoat, setSelectedBoat] = useState<BoatMarker | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const loadGoogleMaps = () => {
      if (window.google && window.google.maps) {
        initializeMap();
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        initializeMap();
      };
      script.onerror = () => {
        console.error('Errore nel caricamento di Google Maps');
        setError(true);
        setIsLoaded(false);
      };
      document.head.appendChild(script);
    };

    const initializeMap = () => {
      if (!mapRef.current || !window.google?.maps) return;

      try {
        const mapInstance = new window.google.maps.Map(mapRef.current, {
        zoom: 9,
        center: { lat: 41.5, lng: 12.8 }, // Centro del Lazio
        styles: [
          {
            featureType: "water",
            elementType: "geometry",
            stylers: [{ color: "#0ea5e9" }]
          },
          {
            featureType: "landscape",
            elementType: "geometry",
            stylers: [{ color: "#f8fafc" }]
          }
        ],
        mapTypeControl: true,
        streetViewControl: false,
        fullscreenControl: true,
      });

        // Aggiungi marker per ogni barca
        lazioBoats.forEach((boat) => {
          const marker = new window.google.maps.Marker({
          position: { lat: boat.lat, lng: boat.lng },
          map: mapInstance,
          title: boat.name,
          icon: {
            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
              <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                <circle cx="20" cy="20" r="18" fill="#0ea5e9" stroke="#ffffff" stroke-width="3"/>
                <path d="M12 20 L20 14 L28 20 L20 26 Z" fill="#ffffff"/>
              </svg>
            `),
            scaledSize: new window.google.maps.Size(40, 40),
            anchor: new window.google.maps.Point(20, 20)
          }
        });

          const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div style="padding: 8px; min-width: 200px;">
              <h3 style="margin: 0 0 8px 0; font-weight: bold; color: #1e293b;">${boat.name}</h3>
              <p style="margin: 0 0 4px 0; color: #64748b; font-size: 14px;">${boat.type} • ${boat.port}</p>
              <div style="display: flex; align-items: center; gap: 8px; margin: 8px 0;">
                <span style="font-weight: bold; color: #f97316; font-size: 16px;">${boat.price}/giorno</span>
                <span style="display: flex; align-items: center; gap: 4px; color: #64748b;">
                  ⭐ ${boat.rating}
                </span>
              </div>
              <button onclick="window.location.href='/boats/${boat.id}'" 
                      style="background: #0ea5e9; color: white; border: none; padding: 6px 12px; border-radius: 6px; cursor: pointer; font-size: 14px;">
                Vedi dettagli
              </button>
            </div>
          `
        });

          marker.addListener('click', () => {
            infoWindow.open(mapInstance, marker);
            setSelectedBoat(boat);
          });
        });

        setMap(mapInstance);
        setIsLoaded(true);
      } catch (error) {
        console.error('Errore nell\'inizializzazione della mappa:', error);
        setError(true);
      }
    };

    loadGoogleMaps();
  }, []);

  if (error) {
    return (
      <div className="h-96 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🗺️</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Mappa Interattiva</h3>
          <p className="text-gray-600 mb-4">Esplora tutte le imbarcazioni disponibili nei porti del Lazio</p>
          <p className="text-sm text-gray-500">La mappa Google si sta caricando...</p>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="h-96 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-blue-800 font-medium">Caricamento mappa Google...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="h-96 rounded-xl overflow-hidden shadow-lg">
        <div ref={mapRef} className="w-full h-full" />
      </div>
      
      {selectedBoat && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-gray-900">{selectedBoat.name}</h3>
                <p className="text-sm text-gray-600 flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {selectedBoat.port}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-coral">{selectedBoat.price}/giorno</p>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm">{selectedBoat.rating}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between mt-3">
              <Badge variant="secondary">{selectedBoat.type}</Badge>
              <Button size="sm" className="bg-coral hover:bg-orange-600">
                Prenota ora
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}