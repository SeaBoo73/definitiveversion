import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions
} from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import { useLocation } from '../services/LocationService';
import { useQuery } from '@tanstack/react-query';
import { OfflineService } from '../services/OfflineService';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width, height } = Dimensions.get('window');

export default function MapScreen({ navigation }: any) {
  const { currentLocation, getCurrentLocation } = useLocation();
  const [region, setRegion] = useState<Region>({
    latitude: 41.9028,
    longitude: 12.4964,
    latitudeDelta: 1.0,
    longitudeDelta: 1.0,
  });

  const { data: boats = [] } = useQuery({
    queryKey: ['boats', 'map'],
    queryFn: async () => {
      if (OfflineService.isOfflineMode()) {
        return await OfflineService.getCachedBoats();
      }
      
      const response = await fetch('/api/boats');
      if (!response.ok) throw new Error('Network error');
      return await response.json();
    }
  });

  useEffect(() => {
    if (currentLocation) {
      setRegion({
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        latitudeDelta: 0.5,
        longitudeDelta: 0.5,
      });
    }
  }, [currentLocation]);

  const centerOnUser = async () => {
    const location = await getCurrentLocation();
    if (location) {
      setRegion({
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
      });
    } else {
      Alert.alert(
        'Geolocalizzazione non disponibile',
        'Impossibile ottenere la tua posizione attuale.'
      );
    }
  };

  const onMarkerPress = (boat: any) => {
    navigation.navigate('BoatDetails', { boatId: boat.id, boat });
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={region}
        onRegionChange={setRegion}
        showsUserLocation={true}
        showsMyLocationButton={false}
        loadingEnabled={true}
      >
        {/* User location marker */}
        {currentLocation && (
          <Marker
            coordinate={{
              latitude: currentLocation.latitude,
              longitude: currentLocation.longitude,
            }}
            title="La tua posizione"
            pinColor="blue"
          />
        )}

        {/* Boat markers */}
        {boats.map((boat) => {
          if (!boat.location?.coordinates) return null;
          
          return (
            <Marker
              key={boat.id}
              coordinate={{
                latitude: boat.location.coordinates.latitude,
                longitude: boat.location.coordinates.longitude,
              }}
              title={boat.name}
              description={`${boat.type} - €${boat.pricePerDay}/giorno`}
              onPress={() => onMarkerPress(boat)}
            />
          );
        })}
      </MapView>

      {/* Controls */}
      <View style={styles.controls}>
        <TouchableOpacity
          style={styles.controlButton}
          onPress={centerOnUser}
        >
          <Icon name="my-location" size={24} color="#0066CC" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.controlButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color="#0066CC" />
        </TouchableOpacity>
      </View>

      {/* Legend */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendMarker, { backgroundColor: 'red' }]} />
          <Text style={styles.legendText}>Barche disponibili</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendMarker, { backgroundColor: 'blue' }]} />
          <Text style={styles.legendText}>La tua posizione</Text>
        </View>
      </View>

      {/* Stats */}
      <View style={styles.stats}>
        <Text style={styles.statsText}>
          {boats.length} barche sulla mappa
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: width,
    height: height,
  },
  controls: {
    position: 'absolute',
    top: 50,
    right: 20,
    gap: 10,
  },
  controlButton: {
    backgroundColor: '#FFF',
    padding: 12,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  legend: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  legendMarker: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    fontSize: 14,
    color: '#333',
  },
  stats: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 10,
    borderRadius: 20,
  },
  statsText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
});