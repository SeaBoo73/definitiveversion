import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Alert
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { OfflineService } from '../services/OfflineService';
import { useLocation } from '../services/LocationService';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function SearchScreen({ navigation, route }: any) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    type: '',
    location: route?.params?.location || '',
    priceRange: [0, 1000],
    capacity: '',
    skipperRequired: false
  });
  const { getNearbyBoats } = useLocation();

  const { data: boats = [], isLoading, refetch } = useQuery({
    queryKey: ['boats', 'search', searchQuery, filters],
    queryFn: async () => {
      if (OfflineService.isOfflineMode()) {
        return await OfflineService.searchBoatsOffline(searchQuery);
      }
      
      const params = new URLSearchParams({
        q: searchQuery,
        type: filters.type,
        location: filters.location,
        minPrice: filters.priceRange[0].toString(),
        maxPrice: filters.priceRange[1].toString(),
        capacity: filters.capacity,
        skipperRequired: filters.skipperRequired.toString()
      });
      
      const response = await fetch(`/api/boats/search?${params}`);
      if (!response.ok) throw new Error('Network error');
      return await response.json();
    },
    enabled: searchQuery.length > 0 || Object.values(filters).some(v => v !== '' && v !== false)
  });

  const boatTypes = [
    'Yacht', 'Gommone', 'Catamarano', 'Moto d\'acqua', 
    'Barca a vela', 'Charter', 'Houseboat'
  ];

  const locations = [
    'Fiumicino', 'Anzio', 'Gaeta', 'Sperlonga', 
    'Terracina', 'Civitavecchia', 'Ponza', 'Formia'
  ];

  const FilterButton = ({ title, isActive, onPress }: any) => (
    <TouchableOpacity
      style={[styles.filterButton, isActive && styles.filterButtonActive]}
      onPress={onPress}
    >
      <Text style={[styles.filterButtonText, isActive && styles.filterButtonTextActive]}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  const BoatItem = ({ boat }: any) => (
    <TouchableOpacity
      style={styles.boatItem}
      onPress={() => navigation.navigate('BoatDetails', { boatId: boat.id, boat })}
    >
      <View style={styles.boatInfo}>
        <Text style={styles.boatName}>{boat.name}</Text>
        <Text style={styles.boatType}>{boat.type}</Text>
        <Text style={styles.boatLocation}>📍 {boat.location}</Text>
        <Text style={styles.boatPrice}>€{boat.pricePerDay}/giorno</Text>
      </View>
      <Icon name="chevron-right" size={24} color="#ccc" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Search Header */}
      <View style={styles.searchHeader}>
        <View style={styles.searchBox}>
          <Icon name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Cerca barche, località..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Icon name="clear" size={20} color="#666" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filters */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersContainer}>
        <View style={styles.filters}>
          <TouchableOpacity
            style={styles.filterToggle}
            onPress={() => navigation.navigate('Map')}
          >
            <Icon name="map" size={16} color="#0066CC" />
            <Text style={styles.filterToggleText}>Mappa</Text>
          </TouchableOpacity>

          <Text style={styles.filterLabel}>Tipo:</Text>
          {boatTypes.map(type => (
            <FilterButton
              key={type}
              title={type}
              isActive={filters.type === type}
              onPress={() => setFilters(prev => ({ 
                ...prev, 
                type: prev.type === type ? '' : type 
              }))}
            />
          ))}
        </View>
      </ScrollView>

      {/* Location Filters */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.locationContainer}>
        <View style={styles.locations}>
          <Text style={styles.filterLabel}>Zona:</Text>
          {locations.map(location => (
            <FilterButton
              key={location}
              title={location}
              isActive={filters.location === location}
              onPress={() => setFilters(prev => ({ 
                ...prev, 
                location: prev.location === location ? '' : location 
              }))}
            />
          ))}
        </View>
      </ScrollView>

      {/* Results */}
      <View style={styles.resultsContainer}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <Text>Caricamento...</Text>
          </View>
        ) : boats.length > 0 ? (
          <>
            <Text style={styles.resultsCount}>
              {boats.length} barche trovate
            </Text>
            <FlatList
              data={boats}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => <BoatItem boat={item} />}
              showsVerticalScrollIndicator={false}
            />
          </>
        ) : searchQuery.length > 0 || Object.values(filters).some(v => v !== '' && v !== false) ? (
          <View style={styles.emptyContainer}>
            <Icon name="search-off" size={48} color="#ccc" />
            <Text style={styles.emptyTitle}>Nessuna barca trovata</Text>
            <Text style={styles.emptySubtitle}>
              Prova a modificare i filtri di ricerca
            </Text>
          </View>
        ) : (
          <View style={styles.suggestionsContainer}>
            <Text style={styles.suggestionsTitle}>Suggerimenti</Text>
            
            <TouchableOpacity
              style={styles.suggestionCard}
              onPress={async () => {
                const nearby = await getNearbyBoats(25);
                if (nearby.length > 0) {
                  // Navigate to nearby boats
                  Alert.alert('Barche Vicine', `Trovate ${nearby.length} barche nei dintorni`);
                }
              }}
            >
              <Icon name="near-me" size={24} color="#4CAF50" />
              <View style={styles.suggestionText}>
                <Text style={styles.suggestionTitle}>Barche Vicine</Text>
                <Text style={styles.suggestionSubtitle}>Trova barche nella tua zona</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.suggestionCard}
              onPress={() => setFilters(prev => ({ ...prev, type: 'Gommone' }))}
            >
              <Icon name="directions-boat" size={24} color="#2196F3" />
              <View style={styles.suggestionText}>
                <Text style={styles.suggestionTitle}>Gommoni</Text>
                <Text style={styles.suggestionSubtitle}>Ideali per esplorare la costa</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.suggestionCard}
              onPress={() => setFilters(prev => ({ ...prev, location: 'Anzio' }))}
            >
              <Icon name="place" size={24} color="#FF9800" />
              <View style={styles.suggestionText}>
                <Text style={styles.suggestionTitle}>Anzio</Text>
                <Text style={styles.suggestionSubtitle}>Destinazione popolare</Text>
              </View>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchHeader: {
    backgroundColor: '#FFF',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  filtersContainer: {
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  filters: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    gap: 10,
  },
  locationContainer: {
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  locations: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    gap: 10,
  },
  filterToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    gap: 5,
  },
  filterToggleText: {
    color: '#0066CC',
    fontWeight: '600',
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginRight: 5,
  },
  filterButton: {
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  filterButtonActive: {
    backgroundColor: '#0066CC',
    borderColor: '#0066CC',
  },
  filterButtonText: {
    fontSize: 14,
    color: '#666',
  },
  filterButtonTextActive: {
    color: '#FFF',
    fontWeight: '600',
  },
  resultsContainer: {
    flex: 1,
    padding: 15,
  },
  resultsCount: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  boatItem: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  boatInfo: {
    flex: 1,
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
    marginBottom: 4,
  },
  boatLocation: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  boatPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0066CC',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 10,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  suggestionsContainer: {
    flex: 1,
  },
  suggestionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  suggestionCard: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  suggestionText: {
    marginLeft: 15,
    flex: 1,
  },
  suggestionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  suggestionSubtitle: {
    fontSize: 14,
    color: '#666',
  },
});