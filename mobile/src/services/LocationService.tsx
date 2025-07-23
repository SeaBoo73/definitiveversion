import React, { createContext, useContext, useEffect, useState } from 'react';
import Geolocation from '@react-native-geolocation-service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform, PermissionsAndroid } from 'react-native';

interface Location {
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp?: number;
}

interface LocationContextType {
  currentLocation: Location | null;
  isLocationEnabled: boolean;
  getCurrentLocation: () => Promise<Location | null>;
  watchLocation: () => void;
  stopWatching: () => void;
  getNearbyBoats: (radius?: number) => Promise<any[]>;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};

interface LocationProviderProps {
  children: React.ReactNode;
  hasPermission: boolean;
}

export const LocationProvider: React.FC<LocationProviderProps> = ({ 
  children, 
  hasPermission 
}) => {
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [isLocationEnabled, setIsLocationEnabled] = useState(false);
  const [watchId, setWatchId] = useState<number | null>(null);

  useEffect(() => {
    if (hasPermission) {
      setIsLocationEnabled(true);
      getCurrentLocation();
      loadCachedLocation();
    }
  }, [hasPermission]);

  const loadCachedLocation = async () => {
    try {
      const cached = await AsyncStorage.getItem('last_location');
      if (cached) {
        const location = JSON.parse(cached);
        // Usa posizione cached se non più vecchia di 1 ora
        if (Date.now() - location.timestamp < 3600000) {
          setCurrentLocation(location);
        }
      }
    } catch (error) {
      console.error('Errore caricamento posizione cached:', error);
    }
  };

  const saveLocationToCache = async (location: Location) => {
    try {
      const locationWithTimestamp = {
        ...location,
        timestamp: Date.now()
      };
      await AsyncStorage.setItem('last_location', JSON.stringify(locationWithTimestamp));
    } catch (error) {
      console.error('Errore salvataggio posizione:', error);
    }
  };

  const getCurrentLocation = (): Promise<Location | null> => {
    return new Promise((resolve) => {
      if (!hasPermission) {
        resolve(null);
        return;
      }

      Geolocation.getCurrentPosition(
        (position) => {
          const location: Location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp
          };
          
          setCurrentLocation(location);
          saveLocationToCache(location);
          resolve(location);
        },
        (error) => {
          console.error('Errore geolocalizzazione:', error);
          resolve(null);
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 10000,
          distanceFilter: 10
        }
      );
    });
  };

  const watchLocation = () => {
    if (!hasPermission || watchId !== null) {
      return;
    }

    const id = Geolocation.watchPosition(
      (position) => {
        const location: Location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp
        };
        
        setCurrentLocation(location);
        saveLocationToCache(location);
      },
      (error) => {
        console.error('Errore watch location:', error);
      },
      {
        enableHighAccuracy: true,
        distanceFilter: 50, // Aggiorna ogni 50 metri
        interval: 30000, // Ogni 30 secondi
        fastestInterval: 10000 // Minimo 10 secondi
      }
    );

    setWatchId(id);
  };

  const stopWatching = () => {
    if (watchId !== null) {
      Geolocation.clearWatch(watchId);
      setWatchId(null);
    }
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Raggio Terra in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const getNearbyBoats = async (radius: number = 50): Promise<any[]> => {
    if (!currentLocation) {
      return [];
    }

    try {
      // Carica barche cached per modalità offline
      const cachedBoats = await AsyncStorage.getItem('cached_boats');
      const boats = cachedBoats ? JSON.parse(cachedBoats) : [];

      // Filtra barche nel raggio specificato
      const nearbyBoats = boats.filter((boat: any) => {
        if (!boat.location?.latitude || !boat.location?.longitude) {
          return false;
        }

        const distance = calculateDistance(
          currentLocation.latitude,
          currentLocation.longitude,
          boat.location.latitude,
          boat.location.longitude
        );

        return distance <= radius;
      });

      // Aggiungi distanza a ogni barca
      return nearbyBoats.map((boat: any) => ({
        ...boat,
        distance: calculateDistance(
          currentLocation.latitude,
          currentLocation.longitude,
          boat.location.latitude,
          boat.location.longitude
        )
      })).sort((a, b) => a.distance - b.distance);

    } catch (error) {
      console.error('Errore ricerca barche vicine:', error);
      return [];
    }
  };

  const value: LocationContextType = {
    currentLocation,
    isLocationEnabled,
    getCurrentLocation,
    watchLocation,
    stopWatching,
    getNearbyBoats
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
};