import { useEffect, useRef } from 'react';

interface Port {
  id: string;
  name: string;
  lat: number;
  lng: number;
  boats: number;
  priceRange: string;
  description: string;
}

const lazioCoastPorts: Port[] = [
  {
    id: 'civitavecchia',
    name: 'Porto di Civitavecchia',
    lat: 42.0942,
    lng: 11.7939,
    boats: 4,
    priceRange: '€280 - €1200',
    description: 'Porto principale del Lazio'
  },
  {
    id: 'gaeta',
    name: 'Porto di Gaeta',
    lat: 41.2058,
    lng: 13.5696,
    boats: 2,
    priceRange: '€280 - €850',
    description: 'Località turistica rinomata'
  },
  {
    id: 'ponza',
    name: 'Porto di Ponza',
    lat: 40.8992,
    lng: 12.9619,
    boats: 2,
    priceRange: '€550 - €950',
    description: 'Isola paradisiaca'
  },
  {
    id: 'terracina',
    name: 'Porto di Terracina',
    lat: 41.2857,
    lng: 13.2443,
    boats: 2,
    priceRange: '€320 - €580',
    description: 'Costa laziale storica'
  },
  {
    id: 'anzio',
    name: 'Marina di Anzio',
    lat: 41.4471,
    lng: 12.6221,
    boats: 3,
    priceRange: '€200 - €750',
    description: 'Porto turistico moderno'
  },
  {
    id: 'formia',
    name: 'Porto di Formia',
    lat: 41.2565,
    lng: 13.6058,
    boats: 2,
    priceRange: '€300 - €600',
    description: 'Golfo di Gaeta'
  }
];

declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

export function GoogleMapsLazio() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    const initializeMap = () => {
      if (!window.google || !mapRef.current) return;

      try {
        // Centro della costa del Lazio
        const centerLazio = { lat: 41.5, lng: 12.5 };

        const map = new window.google.maps.Map(mapRef.current, {
          zoom: 8,
          center: centerLazio,
          styles: [
            {
              featureType: 'water',
              elementType: 'geometry',
              stylers: [{ color: '#3b82f6' }]
            }
          ]
        });

        mapInstanceRef.current = map;

      // Aggiungi marker per ogni porto
      lazioCoastPorts.forEach((port) => {
        const marker = new window.google.maps.Marker({
          position: { lat: port.lat, lng: port.lng },
          map: map,
          title: port.name,
          icon: {
            url: 'data:image/svg+xml;base64,' + btoa(`
              <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                <circle cx="20" cy="20" r="18" fill="#3b82f6" stroke="white" stroke-width="3"/>
                <text x="20" y="26" text-anchor="middle" fill="white" font-size="16" font-weight="bold">⚓</text>
              </svg>
            `),
            scaledSize: new window.google.maps.Size(40, 40)
          }
        });

        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div style="padding: 12px; max-width: 250px;">
              <h3 style="margin: 0 0 8px 0; color: #1f2937; font-size: 16px; font-weight: bold;">${port.name}</h3>
              <p style="margin: 4px 0; color: #6b7280; font-size: 14px;">📍 ${port.lat.toFixed(4)}°N, ${port.lng.toFixed(4)}°E</p>
              <p style="margin: 4px 0; color: #6b7280; font-size: 14px;">⚓ ${port.description}</p>
              <div style="margin: 8px 0; padding: 4px 8px; background: #3b82f6; color: white; border-radius: 12px; display: inline-block; font-size: 12px;">
                ${port.boats} barche disponibili
              </div>
              <p style="margin: 8px 0 0 0; color: #16a34a; font-weight: bold; font-size: 14px;">${port.priceRange}/giorno</p>
            </div>
          `
        });

        marker.addListener('click', () => {
          infoWindow.open(map, marker);
        });
      });
      } catch (error) {
        console.error('Errore inizializzazione mappa:', error);
        // Fallback: mostra messaggio di errore
        if (mapRef.current) {
          mapRef.current.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: center; height: 100%; background: #f3f4f6; color: #6b7280; text-align: center; padding: 20px;">
              <div>
                <p style="font-size: 18px; font-weight: bold; margin-bottom: 8px;">🗺️ Mappa in Configurazione</p>
                <p style="font-size: 14px;">La mappa Google sarà disponibile a breve con la chiave API corretta</p>
              </div>
            </div>
          `;
        }
      }
    };

    // Carica Google Maps API se non è già caricata
    if (!window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&callback=initMap`;
      script.async = true;
      script.defer = true;
      
      window.initMap = initializeMap;
      
      // Gestisci errori di caricamento
      script.onerror = () => {
        if (mapRef.current) {
          mapRef.current.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: center; height: 100%; background: #fef2f2; color: #dc2626; text-align: center; padding: 20px; border: 2px dashed #f87171;">
              <div>
                <p style="font-size: 18px; font-weight: bold; margin-bottom: 8px;">⚠️ Chiave API Google Maps</p>
                <p style="font-size: 14px;">La chiave API fornita non è valida per Maps JavaScript API</p>
              </div>
            </div>
          `;
        }
      };
      
      document.head.appendChild(script);
    } else {
      initializeMap();
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div className="w-full h-96 rounded-lg overflow-hidden border border-gray-200">
      <div ref={mapRef} className="w-full h-full bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
        <div className="text-center text-gray-600 px-8">
          <div className="mb-4">
            <div className="text-4xl mb-2">🗺️</div>
            <p className="text-lg font-semibold mb-2">Mappa Google Maps del Lazio</p>
            <p className="text-sm mb-4">Configurazione API Google Maps in corso...</p>
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-white/50 p-2 rounded">
              <div className="font-semibold">📍 Civitavecchia</div>
              <div>42.0942°N, 11.7939°E</div>
            </div>
            <div className="bg-white/50 p-2 rounded">
              <div className="font-semibold">📍 Gaeta</div>
              <div>41.2058°N, 13.5696°E</div>
            </div>
            <div className="bg-white/50 p-2 rounded">
              <div className="font-semibold">📍 Ponza</div>
              <div>40.8992°N, 12.9619°E</div>
            </div>
            <div className="bg-white/50 p-2 rounded">
              <div className="font-semibold">📍 Terracina</div>
              <div>41.2857°N, 13.2443°E</div>
            </div>
          </div>
          <p className="text-xs mt-4 text-blue-600">La mappa sarà attiva non appena l'API key sarà completamente configurata</p>
        </div>
      </div>
    </div>
  );
}