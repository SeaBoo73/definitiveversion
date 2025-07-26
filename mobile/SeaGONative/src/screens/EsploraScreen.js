import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Image,
  Dimensions,
  FlatList,
  Modal,
} from 'react-native';
import Icon from '@expo/vector-icons/MaterialIcons';

const { width } = Dimensions.get('window');

const EsploraScreen = () => {
  const [showFilters, setShowFilters] = useState(false);

  const categories = [
    { 
      id: 'gommone', 
      name: 'Gommoni', 
      image: 'https://seagorentalboat.com/api/images/gommone%20senza%20patente_1752875806367.webp',
      count: '200+',
      description: 'Imbarcazioni pneumatiche versatili e sicure'
    },
    { 
      id: 'barche-senza-patente', 
      name: 'Barche senza patente', 
      image: 'https://seagorentalboat.com/api/images/OIP%20(1)_1752921317486.webp',
      count: '150+',
      description: 'Facili da guidare, perfette per principianti'
    },
    { 
      id: 'yacht', 
      name: 'Yacht', 
      image: 'https://seagorentalboat.com/api/images/R%20(1)_1752920495156.jpg',
      count: '85+',
      description: 'Lusso e comfort per una navigazione esclusiva'
    },
    { 
      id: 'sailboat', 
      name: 'Barche a vela', 
      image: 'https://seagorentalboat.com/api/images/barca%20a%20vela%20ludovica_1752876195081.jpg',
      count: '60+',
      description: 'L\'esperienza autentica della navigazione'
    },
    { 
      id: 'jetski', 
      name: 'Moto d\'acqua', 
      image: 'https://seagorentalboat.com/api/images/WhatsApp%20Image%202025-06-15%20at%2023.38.19_1752875703213.jpeg',
      count: '90+',
      description: 'Adrenalina e velocità sull\'acqua'
    },
    { 
      id: 'catamarano', 
      name: 'Catamarani', 
      image: 'https://seagorentalboat.com/api/images/catamarano%20ludovica_1752876117442.jpg',
      count: '45+',
      description: 'Spazio e stabilità per gruppi numerosi'
    },
    { 
      id: 'charter', 
      name: 'Charter', 
      image: 'https://seagorentalboat.com/api/images/WhatsApp%20Image%202025-06-12%20at%2020.22.10_1752876155096.jpeg',
      count: '70+',
      description: 'Esperienza completa con skipper professionista'
    },
    { 
      id: 'houseboat', 
      name: 'Houseboat', 
      image: 'https://seagorentalboat.com/api/images/OIP_1752919948843.webp',
      count: '25+',
      description: 'La tua casa galleggiante per vacanze uniche'
    }
  ];

  const featuredBoats = [
    {
      id: 1,
      name: 'Azimut 50',
      location: 'Civitavecchia',
      price: '€850',
      rating: 4.9,
      category: 'yacht',
      image: 'https://seagorentalboat.com/api/images/OIP%20(1)_1752921317486.webp',
      isPopular: true,
      capacity: 12,
      features: ['Skipper incluso', 'Carburante incluso']
    },
    {
      id: 2,
      name: 'Sea Ray 240',
      location: 'Anzio',
      price: '€280',
      rating: 4.8,
      category: 'gommone',
      image: 'https://seagorentalboat.com/api/images/gommone%20senza%20patente_1752875806367.webp',
      isPopular: true,
      capacity: 8,
      features: ['Senza patente', 'GPS incluso']
    },
    {
      id: 3,
      name: 'Barca a Vela Ludovica',
      location: 'Gaeta',
      price: '€420',
      rating: 4.7,
      category: 'sailboat',
      image: 'https://seagorentalboat.com/api/images/barca%20a%20vela%20ludovica_1752876195081.jpg',
      isPopular: true,
      capacity: 6,
      features: ['Esperienza autentica', 'Vento incluso']
    }
  ];

  const ports = [
    { id: 1, name: 'Civitavecchia', lat: 42.0942, lng: 11.7998, boats: 45 },
    { id: 2, name: 'Gaeta', lat: 41.2071, lng: 13.5722, boats: 32 },
    { id: 3, name: 'Anzio', lat: 41.4489, lng: 12.6219, boats: 28 },
    { id: 4, name: 'Formia', lat: 41.2567, lng: 13.6058, boats: 21 },
  ];

  const renderBoatCard = ({ item }) => (
    <TouchableOpacity style={styles.featuredCard}>
      <Image source={{ uri: item.image }} style={styles.featuredImage} />
      {item.isPopular && (
        <View style={styles.popularBadge}>
          <Text style={styles.popularText}>Popolare</Text>
        </View>
      )}
      <View style={styles.featuredInfo}>
        <Text style={styles.featuredName}>{item.name}</Text>
        <Text style={styles.featuredLocation}>📍 {item.location}</Text>
        <Text style={styles.featuredCapacity}>👥 Fino a {item.capacity} persone</Text>
        <View style={styles.featuresContainer}>
          {item.features?.slice(0, 2).map((feature, index) => (
            <Text key={index} style={styles.featureTag}>• {feature}</Text>
          ))}
        </View>
        <View style={styles.featuredFooter}>
          <Text style={styles.featuredPrice}>{item.price}/giorno</Text>
          <View style={styles.featuredRating}>
            <Icon name="star" size={14} color="#FFD700" />
            <Text style={styles.featuredRatingText}>{item.rating}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TouchableOpacity 
          style={styles.searchBar}
          onPress={() => setShowFilters(true)}
        >
          <Icon name="search" size={20} color="#6b7280" />
          <Text style={styles.searchPlaceholder}>Dove vuoi andare?</Text>
          <Icon name="tune" size={20} color="#0ea5e9" />
        </TouchableOpacity>
      </View>

      {/* Categories */}
      <View style={styles.categoriesSection}>
        <View style={styles.categoriesGrid}>
          {categories.map((category) => (
            <TouchableOpacity 
              key={category.id} 
              style={styles.categoryCard}
            >
              <Image source={{ uri: category.image }} style={styles.categoryImage} />
              <View style={styles.categoryOverlay}>
                <Text style={styles.categoryName}>{category.name}</Text>
                <Text style={styles.categoryCount}>{category.count} barche</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Interactive Map */}
      <View style={styles.mapSection}>
        <Text style={styles.sectionTitle}>Esplora la Mappa</Text>
        <View style={styles.mapContainer}>
          <View style={styles.mapPlaceholder}>
            <Icon name="map" size={48} color="#0ea5e9" />
            <Text style={styles.mapText}>Mappa Interattiva</Text>
            <Text style={styles.mapSubtext}>Visualizza porti e barche in tempo reale</Text>
          </View>
          {ports.map((port) => (
            <TouchableOpacity key={port.id} style={styles.mapPin}>
              <Icon name="place" size={20} color="#ef4444" />
              <Text style={styles.pinText}>{port.boats}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Featured Boats Carousel */}
      <View style={styles.featuredSection}>
        <Text style={styles.sectionTitle}>Barche in Evidenza</Text>
        <FlatList
          data={featuredBoats}
          renderItem={renderBoatCard}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.featuredList}
        />
      </View>

      {/* Search Filters Modal */}
      <Modal
        visible={showFilters}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowFilters(false)}>
              <Icon name="close" size={24} color="#1f2937" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Ricerca e Affitta</Text>
            <TouchableOpacity>
              <Text style={styles.resetText}>Reset</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.filterGroup}>
              <Text style={styles.filterLabel}>Dove</Text>
              <TextInput
                style={styles.filterInput}
                placeholder="Destinazione o porto"
              />
            </View>

            <View style={styles.filterRow}>
              <View style={styles.filterHalf}>
                <Text style={styles.filterLabel}>Dal</Text>
                <TextInput
                  style={styles.filterInput}
                  placeholder="Data inizio"
                />
              </View>
              <View style={styles.filterHalf}>
                <Text style={styles.filterLabel}>Al</Text>
                <TextInput
                  style={styles.filterInput}
                  placeholder="Data fine"
                />
              </View>
            </View>

            <TouchableOpacity style={styles.searchButton}>
              <Text style={styles.searchButtonText}>Cerca Barche</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
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
  searchPlaceholder: {
    flex: 1,
    color: '#6b7280',
    fontSize: 16,
  },
  categoriesSection: {
    padding: 16,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryCard: {
    width: (width - 48) / 2,
    height: 120,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  categoryImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  categoryOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 12,
  },
  categoryName: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  categoryCount: {
    color: '#e2e8f0',
    fontSize: 12,
  },
  mapSection: {
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
  mapContainer: {
    height: 200,
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  mapPlaceholder: {
    alignItems: 'center',
  },
  mapText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0ea5e9',
    marginTop: 8,
  },
  mapSubtext: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
    textAlign: 'center',
  },
  mapPin: {
    position: 'absolute',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 4,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  pinText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#ef4444',
  },
  featuredSection: {
    padding: 16,
    backgroundColor: 'white',
    marginTop: 8,
  },
  featuredList: {
    paddingRight: 16,
  },
  featuredCard: {
    width: 280,
    marginRight: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  featuredImage: {
    width: '100%',
    height: 160,
    resizeMode: 'cover',
  },
  popularBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: '#f59e0b',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  popularText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  featuredInfo: {
    padding: 16,
  },
  featuredName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  featuredLocation: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 2,
  },
  featuredCapacity: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  featuresContainer: {
    marginBottom: 12,
  },
  featureTag: {
    fontSize: 12,
    color: '#059669',
    marginBottom: 2,
  },
  featuredFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  featuredPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0ea5e9',
  },
  featuredRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  featuredRatingText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  resetText: {
    fontSize: 16,
    color: '#0ea5e9',
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  filterGroup: {
    marginBottom: 16,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  filterInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#f9fafb',
  },
  filterRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  filterHalf: {
    flex: 1,
  },
  searchButton: {
    backgroundColor: '#0ea5e9',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
  },
  searchButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EsploraScreen;