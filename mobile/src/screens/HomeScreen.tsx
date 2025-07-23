import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
  Alert,
  Dimensions
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from '../services/LocationService';
import { OfflineService } from '../services/OfflineService';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width } = Dimensions.get('window');

interface Boat {
  id: number;
  name: string;
  type: string;
  pricePerDay: number;
  location: string;
  images: string[];
  rating: number;
  distance?: number;
}

export default function HomeScreen({ navigation }: any) {
  const [refreshing, setRefreshing] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const { currentLocation, getNearbyBoats } = useLocation();

  // Query per barche featured
  const { data: featuredBoats = [], isLoading, refetch } = useQuery({
    queryKey: ['boats', 'featured'],
    queryFn: async () => {
      if (OfflineService.isOfflineMode()) {
        return await OfflineService.getCachedBoats();
      }
      
      const response = await fetch('/api/boats?featured=true');
      if (!response.ok) throw new Error('Network error');
      const boats = await response.json();
      
      // Cache per uso offline
      await OfflineService.cacheBoats(boats);
      return boats;
    },
    staleTime: 10 * 60 * 1000, // 10 minuti
  });

  // Query per barche vicine
  const { data: nearbyBoats = [] } = useQuery({
    queryKey: ['boats', 'nearby', currentLocation],
    queryFn: () => getNearbyBoats(50), // 50km raggio
    enabled: !!currentLocation,
    staleTime: 5 * 60 * 1000, // 5 minuti
  });

  useEffect(() => {
    setIsOffline(OfflineService.isOfflineMode());
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      if (!OfflineService.isOfflineMode()) {
        await refetch();
        await OfflineService.syncOfflineData();
      } else {
        Alert.alert(
          'Modalità Offline',
          'Impossibile aggiornare i dati in modalità offline. I dati mostrati potrebbero non essere aggiornati.'
        );
      }
    } catch (error) {
      console.error('Errore refresh:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const navigateToBoatDetails = (boat: Boat) => {
    navigation.navigate('BoatDetails', { boatId: boat.id, boat });
  };

  const navigateToMap = () => {
    if (!currentLocation) {
      Alert.alert(
        'Geolocalizzazione non disponibile',
        'Abilita la geolocalizzazione per vedere le barche sulla mappa.'
      );
      return;
    }
    navigation.navigate('Map');
  };

  const navigateToSearch = () => {
    navigation.navigate('Search');
  };

  const BoatCard = ({ boat }: { boat: Boat }) => (
    <TouchableOpacity
      style={styles.boatCard}
      onPress={() => navigateToBoatDetails(boat)}
    >
      <Image
        source={{ uri: boat.images?.[0] || 'https://via.placeholder.com/300x200' }}
        style={styles.boatImage}
        resizeMode="cover"
      />
      <View style={styles.boatInfo}>
        <Text style={styles.boatName}>{boat.name}</Text>
        <Text style={styles.boatType}>{boat.type}</Text>
        <Text style={styles.boatLocation}>📍 {boat.location}</Text>
        <View style={styles.boatDetails}>
          <Text style={styles.boatPrice}>€{boat.pricePerDay}/giorno</Text>
          <View style={styles.ratingContainer}>
            <Icon name="star" size={16} color="#FFD700" />
            <Text style={styles.rating}>{boat.rating?.toFixed(1) || 'N/A'}</Text>
          </View>
        </View>
        {boat.distance && (
          <Text style={styles.distance}>🚗 {boat.distance.toFixed(1)} km</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  const QuickActionCard = ({ icon, title, subtitle, onPress, color = '#0066CC' }: any) => (
    <TouchableOpacity style={[styles.quickAction, { borderLeftColor: color }]} onPress={onPress}>
      <Icon name={icon} size={24} color={color} style={styles.quickActionIcon} />
      <View style={styles.quickActionText}>
        <Text style={styles.quickActionTitle}>{title}</Text>
        <Text style={styles.quickActionSubtitle}>{subtitle}</Text>
      </View>
      <Icon name="chevron-right" size={20} color="#ccc" />
    </TouchableOpacity>
  );

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header offline */}
      {isOffline && (
        <View style={styles.offlineHeader}>
          <Icon name="cloud-off" size={20} color="#FFF" />
          <Text style={styles.offlineText}>Modalità Offline</Text>
        </View>
      )}

      {/* Hero Section */}
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>Scopri il Mare del Lazio</Text>
        <Text style={styles.heroSubtitle}>
          Trova e prenota la barca perfetta per la tua avventura
        </Text>
        
        <TouchableOpacity style={styles.searchButton} onPress={navigateToSearch}>
          <Icon name="search" size={20} color="#FFF" style={styles.searchIcon} />
          <Text style={styles.searchButtonText}>Cerca barche disponibili</Text>
        </TouchableOpacity>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Azioni Rapide</Text>
        
        <QuickActionCard
          icon="map"
          title="Barche Vicine"
          subtitle={currentLocation ? `${nearbyBoats.length} barche nei dintorni` : 'Abilita geolocalizzazione'}
          onPress={navigateToMap}
          color="#4CAF50"
        />
        
        <QuickActionCard
          icon="event"
          title="Le Mie Prenotazioni"
          subtitle="Gestisci le tue prenotazioni"
          onPress={() => navigation.navigate('Bookings')}
          color="#FF9800"
        />
        
        <QuickActionCard
          icon="message"
          title="Messaggi"
          subtitle="Comunica con i proprietari"
          onPress={() => navigation.navigate('Messages')}
          color="#9C27B0"
        />
      </View>

      {/* Barche nelle vicinanze */}
      {nearbyBoats.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Barche Vicine a Te</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {nearbyBoats.slice(0, 5).map((boat) => (
              <BoatCard key={boat.id} boat={boat} />
            ))}
          </ScrollView>
        </View>
      )}

      {/* Barche in evidenza */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Barche in Evidenza</Text>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <Text>Caricamento...</Text>
          </View>
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {featuredBoats.slice(0, 10).map((boat) => (
              <BoatCard key={boat.id} boat={boat} />
            ))}
          </ScrollView>
        )}
      </View>

      {/* Info zone migliori */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Zone Popolari</Text>
        <View style={styles.popularZones}>
          {[
            { name: 'Fiumicino', count: 15 },
            { name: 'Anzio', count: 12 },
            { name: 'Gaeta', count: 8 },
            { name: 'Sperlonga', count: 6 }
          ].map((zone, index) => (
            <TouchableOpacity
              key={index}
              style={styles.zoneCard}
              onPress={() => navigation.navigate('Search', { location: zone.name })}
            >
              <Text style={styles.zoneName}>{zone.name}</Text>
              <Text style={styles.zoneCount}>{zone.count} barche</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Footer spacer */}
      <View style={styles.footer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  offlineHeader: {
    backgroundColor: '#FF6B35',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    gap: 8,
  },
  offlineText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  hero: {
    backgroundColor: '#0066CC',
    padding: 20,
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#E3F2FD',
    textAlign: 'center',
    marginBottom: 20,
  },
  searchButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchButtonText: {
    color: '#FFF',
    fontWeight: '600',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  quickAction: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickActionIcon: {
    marginRight: 15,
  },
  quickActionText: {
    flex: 1,
  },
  quickActionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  quickActionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  boatCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    marginRight: 15,
    width: width * 0.7,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  boatImage: {
    width: '100%',
    height: 150,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  boatInfo: {
    padding: 15,
  },
  boatName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  boatType: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  boatLocation: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  boatDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  boatPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0066CC',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rating: {
    fontSize: 14,
    color: '#666',
  },
  distance: {
    fontSize: 12,
    color: '#4CAF50',
    marginTop: 4,
  },
  popularZones: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  zoneCard: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    width: (width - 60) / 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  zoneName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  zoneCount: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  footer: {
    height: 20,
  },
});