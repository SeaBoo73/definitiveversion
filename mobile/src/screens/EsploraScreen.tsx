import React, { useState, useRef } from 'react';
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
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width } = Dimensions.get('window');

const EsploraScreen = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [searchFilters, setSearchFilters] = useState({
    dove: '',
    dal: '',
    al: '',
    ospiti: '',
    tipo: '',
    skipper: false,
    carburante: false
  });

  const categories = [
    { 
      id: 'gommone', 
      name: 'Gommoni', 
      image: 'https://seaboorentalboat.com/api/images/gommone%20senza%20patente_1752875806367.webp',
      count: '200+',
      description: 'Imbarcazioni pneumatiche versatili e sicure'
    },
    { 
      id: 'barche-senza-patente', 
      name: 'Barche senza patente', 
      image: 'https://seaboorentalboat.com/api/images/OIP%20(1)_1752921317486.webp',
      count: '150+',
      description: 'Facili da guidare, perfette per principianti'
    },
    { 
      id: 'yacht', 
      name: 'Yacht', 
      image: 'https://seaboorentalboat.com/api/images/R%20(1)_1752920495156.jpg',
      count: '85+',
      description: 'Lusso e comfort per una navigazione esclusiva'
    },
    { 
      id: 'sailboat', 
      name: 'Barche a vela', 
      image: 'https://seaboorentalboat.com/api/images/barca%20a%20vela%20ludovica_1752876195081.jpg',
      count: '60+',
      description: 'L\'esperienza autentica della navigazione'
    },
    { 
      id: 'jetski', 
      name: 'Moto d\'acqua', 
      image: 'https://seaboorentalboat.com/api/images/WhatsApp%20Image%202025-06-15%20at%2023.38.19_1752875703213.jpeg',
      count: '90+',
      description: 'Adrenalina e velocità sull\'acqua'
    },
    { 
      id: 'catamarano', 
      name: 'Catamarani', 
      image: 'https://seaboorentalboat.com/api/images/catamarano%20ludovica_1752876117442.jpg',
      count: '45+',
      description: 'Spazio e stabilità per gruppi numerosi'
    },
    { 
      id: 'charter', 
      name: 'Charter', 
      image: 'https://seaboorentalboat.com/api/images/WhatsApp%20Image%202025-06-12%20at%2020.22.10_1752876155096.jpeg',
      count: '70+',
      description: 'Esperienza completa con skipper professionista'
    },
    { 
      id: 'houseboat', 
      name: 'Houseboat', 
      image: 'https://seaboorentalboat.com/api/images/OIP_1752919948843.webp',
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
      image: 'https://seaboorentalboat.com/api/images/OIP%20(1)_1752921317486.webp',
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
      image: 'https://seaboorentalboat.com/api/images/gommone%20senza%20patente_1752875806367.webp',
      isPopular: true,
      capacity: 8,
      features: ['Senza patente', 'GPS incluso']
    },
    {
      id: 3,
      name: 'Ferretti 550',
      location: 'Formia',
      price: '€1200',
      rating: 4.9,
      category: 'yacht',
      image: 'https://seaboorentalboat.com/api/images/R%20(1)_1752920495156.jpg',
      isPopular: false,
      capacity: 10,
      features: ['Lusso premium', 'Capitano professionale']
    },
    {
      id: 4,
      name: 'Barca a Vela Ludovica',
      location: 'Gaeta',
      price: '€420',
      rating: 4.7,
      category: 'sailboat',
      image: 'https://seaboorentalboat.com/api/images/barca%20a%20vela%20ludovica_1752876195081.jpg',
      isPopular: true,
      capacity: 6,
      features: ['Esperienza autentica', 'Vento incluso']
    },
    {
      id: 5,
      name: 'Yamaha VX Cruiser',
      location: 'Terracina',
      price: '€180',
      rating: 4.6,
      category: 'jetski',
      image: 'https://seaboorentalboat.com/api/images/WhatsApp%20Image%202025-06-15%20at%2023.38.19_1752875703213.jpeg',
      isPopular: true,
      capacity: 3,
      features: ['Adrenalina pura', 'Facile da guidare']
    },
    {
      id: 6,
      name: 'Catamarano Ludovica',
      location: 'Ponza',
      price: '€650',
      rating: 4.8,
      category: 'catamarano',
      image: 'https://seaboorentalboat.com/api/images/catamarano%20ludovica_1752876117442.jpg',
      isPopular: true,
      capacity: 12,
      features: ['Stabilità massima', 'Spazio ampio']
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
            {/* Search Fields */}
            <View style={styles.filterGroup}>
              <Text style={styles.filterLabel}>Dove</Text>
              <TextInput
                style={styles.filterInput}
                placeholder="Destinazione o porto"
                value={searchFilters.dove}
                onChangeText={(text) => setSearchFilters({...searchFilters, dove: text})}
              />
            </View>

            <View style={styles.filterRow}>
              <View style={styles.filterHalf}>
                <Text style={styles.filterLabel}>Dal</Text>
                <TextInput
                  style={styles.filterInput}
                  placeholder="Data inizio"
                  value={searchFilters.dal}
                  onChangeText={(text) => setSearchFilters({...searchFilters, dal: text})}
                />
              </View>
              <View style={styles.filterHalf}>
                <Text style={styles.filterLabel}>Al</Text>
                <TextInput
                  style={styles.filterInput}
                  placeholder="Data fine"
                  value={searchFilters.al}
                  onChangeText={(text) => setSearchFilters({...searchFilters, al: text})}
                />
              </View>
            </View>

            <View style={styles.filterGroup}>
              <Text style={styles.filterLabel}>Ospiti</Text>
              <TextInput
                style={styles.filterInput}
                placeholder="Numero ospiti"
                keyboardType="numeric"
                value={searchFilters.ospiti}
                onChangeText={(text) => setSearchFilters({...searchFilters, ospiti: text})}
              />
            </View>

            <View style={styles.filterGroup}>
              <Text style={styles.filterLabel}>Tipo di imbarcazione</Text>
              <TextInput
                style={styles.filterInput}
                placeholder="Gommone, Yacht, Catamarano..."
                value={searchFilters.tipo}
                onChangeText={(text) => setSearchFilters({...searchFilters, tipo: text})}
              />
            </View>

            <View style={styles.toggleGroup}>
              <TouchableOpacity 
                style={[styles.toggleOption, searchFilters.skipper && styles.toggleActive]}
                onPress={() => setSearchFilters({...searchFilters, skipper: !searchFilters.skipper})}
              >
                <Text style={[styles.toggleText, searchFilters.skipper && styles.toggleTextActive]}>
                  Con skipper
                </Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.toggleOption, searchFilters.carburante && styles.toggleActive]}
                onPress={() => setSearchFilters({...searchFilters, carburante: !searchFilters.carburante})}
              >
                <Text style={[styles.toggleText, searchFilters.carburante && styles.toggleTextActive]}>
                  Carburante incluso
                </Text>
              </TouchableOpacity>
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
    backgroundColor: '#ffffff',
  },
  searchContainer: {
    padding: 20,
    paddingTop: 10,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchPlaceholder: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#6b7280',
  },
  categoriesSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: (width - 60) / 2,
    height: 140,
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  categoryImage: {
    width: '100%',
    height: '100%',
  },
  categoryOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 12,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 2,
  },
  categoryCount: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
  },
  mapSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  mapContainer: {
    height: 200,
    borderRadius: 16,
    backgroundColor: '#e0f2fe',
    position: 'relative',
    overflow: 'hidden',
  },
  mapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0ea5e9',
    marginTop: 8,
  },
  mapSubtext: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  mapPin: {
    position: 'absolute',
    alignItems: 'center',
    top: 60,
    left: 100,
  },
  pinText: {
    fontSize: 10,
    color: '#ef4444',
    fontWeight: 'bold',
    marginTop: 2,
  },
  featuredSection: {
    paddingLeft: 20,
    marginBottom: 30,
  },
  featuredList: {
    paddingRight: 20,
  },
  featuredCard: {
    width: 280,
    marginRight: 16,
    backgroundColor: 'white',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  featuredImage: {
    width: '100%',
    height: 180,
  },
  popularBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: '#ef4444',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  popularText: {
    fontSize: 10,
    color: 'white',
    fontWeight: '600',
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
    marginBottom: 4,
  },
  featuredCapacity: {
    fontSize: 13,
    color: '#4b5563',
    marginBottom: 8,
  },
  featuresContainer: {
    marginBottom: 12,
  },
  featureTag: {
    fontSize: 12,
    color: '#059669',
    marginBottom: 2,
    fontWeight: '500',
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
  },
  featuredRatingText: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 4,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  resetText: {
    fontSize: 16,
    color: '#0ea5e9',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  filterGroup: {
    marginBottom: 20,
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
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#f9fafb',
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  filterHalf: {
    width: '48%',
  },
  toggleGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  toggleOption: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  toggleActive: {
    backgroundColor: '#0ea5e9',
    borderColor: '#0ea5e9',
  },
  toggleText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  toggleTextActive: {
    color: 'white',
  },
  searchButton: {
    backgroundColor: '#0ea5e9',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  searchButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default EsploraScreen;