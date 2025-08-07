import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Dimensions,
} from 'react-native';
import Icon from '@expo/vector-icons/MaterialIcons';

const { width } = Dimensions.get('window');

const OrmeggioScreen = () => {
  const [selectedType, setSelectedType] = useState('pontile');

  const ormeggi = [
    {
      id: 1,
      name: 'Marina di Civitavecchia',
      location: 'Civitavecchia, RM',
      price: selectedType === 'pontile' ? '€450' : '€150',
      type: selectedType,
      rating: 4.8,
      services: ['Acqua', 'Corrente', 'WiFi', 'Sicurezza 24h'],
      availability: 'Disponibile',
      distance: '2.3 km dal centro',
    },
    {
      id: 2,
      name: 'Porto di Gaeta',
      location: 'Gaeta, LT',
      price: selectedType === 'pontile' ? '€380' : '€120',
      type: selectedType,
      rating: 4.7,
      services: ['Acqua', 'Corrente', 'Docce', 'Bar'],
      availability: 'Disponibile',
      distance: '1.8 km dal centro',
    },
    {
      id: 3,
      name: 'Marina di Anzio',
      location: 'Anzio, RM',
      price: selectedType === 'pontile' ? '€420' : '€140',
      type: selectedType,
      rating: 4.6,
      services: ['Acqua', 'Corrente', 'Carburante', 'Ristorante'],
      availability: 'Pochi posti',
      distance: '1.2 km dal centro',
    },
  ];

  const renderOrmeggioCard = (ormeggio) => (
    <TouchableOpacity key={ormeggio.id} style={styles.ormeggioCard}>
      <View style={styles.cardHeader}>
        <View style={styles.cardInfo}>
          <Text style={styles.ormeggioName}>{ormeggio.name}</Text>
          <Text style={styles.ormeggioLocation}>📍 {ormeggio.location}</Text>
          <Text style={styles.ormeggioDistance}>🚗 {ormeggio.distance}</Text>
        </View>
        <View style={styles.cardPrice}>
          <Text style={styles.priceText}>{ormeggio.price}</Text>
          <Text style={styles.priceUnit}>/giorno</Text>
        </View>
      </View>

      <View style={styles.cardMeta}>
        <View style={styles.ratingContainer}>
          <Icon name="star" size={16} color="#FFD700" />
          <Text style={styles.ratingText}>{ormeggio.rating}</Text>
        </View>
        <View style={[
          styles.availabilityBadge,
          ormeggio.availability === 'Disponibile' ? styles.available : styles.limited
        ]}>
          <Text style={[
            styles.availabilityText,
            ormeggio.availability === 'Disponibile' ? styles.availableText : styles.limitedText
          ]}>
            {ormeggio.availability}
          </Text>
        </View>
      </View>

      <View style={styles.servicesContainer}>
        {ormeggio.services.map((service, index) => (
          <View key={index} style={styles.serviceTag}>
            <Text style={styles.serviceText}>• {service}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity style={styles.bookButton}>
        <Text style={styles.bookButtonText}>Prenota Ormeggio</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Icon name="search" size={20} color="#6b7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Cerca porto o località"
            placeholderTextColor="#6b7280"
          />
        </View>
      </View>

      {/* Type Selector */}
      <View style={styles.typeSelector}>
        <Text style={styles.sectionTitle}>Tipo di Ormeggio</Text>
        <View style={styles.typeButtons}>
          <TouchableOpacity
            style={[
              styles.typeButton,
              selectedType === 'pontile' && styles.typeButtonActive
            ]}
            onPress={() => setSelectedType('pontile')}
          >
            <Icon 
              name="dock" 
              size={20} 
              color={selectedType === 'pontile' ? '#fff' : '#0ea5e9'} 
            />
            <Text style={[
              styles.typeButtonText,
              selectedType === 'pontile' && styles.typeButtonTextActive
            ]}>
              Pontile
            </Text>
            <Text style={[
              styles.typeButtonPrice,
              selectedType === 'pontile' && styles.typeButtonPriceActive
            ]}>
              €350-700/giorno
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.typeButton,
              selectedType === 'boa' && styles.typeButtonActive
            ]}
            onPress={() => setSelectedType('boa')}
          >
            <Icon 
              name="waves" 
              size={20} 
              color={selectedType === 'boa' ? '#fff' : '#0ea5e9'} 
            />
            <Text style={[
              styles.typeButtonText,
              selectedType === 'boa' && styles.typeButtonTextActive
            ]}>
              Boa
            </Text>
            <Text style={[
              styles.typeButtonPrice,
              selectedType === 'boa' && styles.typeButtonPriceActive
            ]}>
              €120-200/giorno
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Filters */}
      <View style={styles.filtersContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity style={styles.filterChip}>
            <Icon name="tune" size={16} color="#0ea5e9" />
            <Text style={styles.filterChipText}>Filtri</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterChip}>
            <Text style={styles.filterChipText}>Prezzo</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterChip}>
            <Text style={styles.filterChipText}>Servizi</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterChip}>
            <Text style={styles.filterChipText}>Distanza</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Results */}
      <View style={styles.resultsContainer}>
        <Text style={styles.resultsText}>
          {ormeggi.length} ormeggi disponibili - {selectedType}
        </Text>
        
        {ormeggi.map(renderOrmeggioCard)}
      </View>

      {/* Info Section */}
      <View style={styles.infoSection}>
        <Text style={styles.infoTitle}>Vantaggi SeaBoo</Text>
        <View style={styles.infoList}>
          <View style={styles.infoItem}>
            <Icon name="verified" size={20} color="#059669" />
            <Text style={styles.infoText}>Posto garantito</Text>
          </View>
          <View style={styles.infoItem}>
            <Icon name="support-agent" size={20} color="#059669" />
            <Text style={styles.infoText}>Assistenza dedicata</Text>
          </View>
          <View style={styles.infoItem}>
            <Icon name="security" size={20} color="#059669" />
            <Text style={styles.infoText}>Sicurezza H24</Text>
          </View>
          <View style={styles.infoItem}>
            <Icon name="discount" size={20} color="#059669" />
            <Text style={styles.infoText}>Sconto 20% noleggiatori</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  searchContainer: {
    padding: 16,
    backgroundColor: 'white',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1f2937',
  },
  typeSelector: {
    padding: 16,
    backgroundColor: 'white',
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  typeButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  typeButton: {
    flex: 1,
    backgroundColor: '#f8fafc',
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  typeButtonActive: {
    backgroundColor: '#0ea5e9',
    borderColor: '#0ea5e9',
  },
  typeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0ea5e9',
    marginTop: 8,
    marginBottom: 4,
  },
  typeButtonTextActive: {
    color: 'white',
  },
  typeButtonPrice: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  typeButtonPriceActive: {
    color: '#e2e8f0',
  },
  filtersContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    gap: 4,
  },
  filterChipText: {
    fontSize: 14,
    color: '#0ea5e9',
    fontWeight: '500',
  },
  resultsContainer: {
    padding: 16,
  },
  resultsText: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 16,
  },
  ormeggioCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  cardInfo: {
    flex: 1,
  },
  ormeggioName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  ormeggioLocation: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 2,
  },
  ormeggioDistance: {
    fontSize: 14,
    color: '#6b7280',
  },
  cardPrice: {
    alignItems: 'flex-end',
  },
  priceText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0ea5e9',
  },
  priceUnit: {
    fontSize: 12,
    color: '#6b7280',
  },
  cardMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  availabilityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  available: {
    backgroundColor: '#d1fae5',
  },
  limited: {
    backgroundColor: '#fef3c7',
  },
  availabilityText: {
    fontSize: 12,
    fontWeight: '600',
  },
  availableText: {
    color: '#059669',
  },
  limitedText: {
    color: '#d97706',
  },
  servicesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  serviceTag: {
    backgroundColor: '#f0f9ff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  serviceText: {
    fontSize: 12,
    color: '#0369a1',
  },
  bookButton: {
    backgroundColor: '#0ea5e9',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  bookButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoSection: {
    backgroundColor: 'white',
    padding: 16,
    marginTop: 8,
    marginBottom: 20,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  infoList: {
    gap: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#1f2937',
  },
});

export default OrmeggioScreen;