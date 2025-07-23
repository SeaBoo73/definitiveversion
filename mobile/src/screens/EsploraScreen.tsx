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
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width } = Dimensions.get('window');

const EsploraScreen = () => {
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const categories = [
    { id: 'yacht', name: 'Yacht', icon: '🛥️', count: '85+' },
    { id: 'sailing', name: 'Barche a vela', icon: '⛵', count: '120+' },
    { id: 'dinghy', name: 'Gommoni', icon: '🚤', count: '200+' },
    { id: 'catamaran', name: 'Catamarani', icon: '⛵', count: '45+' },
    { id: 'jetski', name: 'Moto d\'acqua', icon: '🏄', count: '30+' },
    { id: 'charter', name: 'Charter', icon: '🚢', count: '25+' },
  ];

  const featuredBoats = [
    {
      id: 1,
      name: 'Azimut 55 Luxury',
      location: 'Civitavecchia',
      price: '€850',
      rating: 4.9,
      category: 'yacht',
      image: 'https://via.placeholder.com/300x200?text=Yacht'
    },
    {
      id: 2,
      name: 'Bavaria 46 Cruiser',
      location: 'Gaeta',
      price: '€320',
      rating: 4.8,
      category: 'sailing',
      image: 'https://via.placeholder.com/300x200?text=Sailboat'
    },
    {
      id: 3,
      name: 'Zodiac Pro 650',
      location: 'Anzio',
      price: '€180',
      rating: 4.7,
      category: 'dinghy',
      image: 'https://via.placeholder.com/300x200?text=Dinghy'
    },
    {
      id: 4,
      name: 'Princess V58',
      location: 'Formia',
      price: '€950',
      rating: 4.9,
      category: 'yacht',
      image: 'https://via.placeholder.com/300x200?text=Princess'
    },
  ];

  const filteredBoats = featuredBoats.filter(boat => {
    const matchesSearch = boat.name.toLowerCase().includes(searchText.toLowerCase()) ||
                         boat.location.toLowerCase().includes(searchText.toLowerCase());
    const matchesCategory = selectedCategory === '' || boat.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Hero Section */}
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>Esplora il Mare del Lazio</Text>
        <Text style={styles.heroSubtitle}>
          Trova la barca perfetta per la tua avventura
        </Text>
        
        {/* Search Bar */}
        <View style={styles.searchBar}>
          <Icon name="search" size={20} color="#6b7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Cerca barche, località..."
            placeholderTextColor="#9ca3af"
            value={searchText}
            onChangeText={setSearchText}
          />
          {searchText ? (
            <TouchableOpacity onPress={() => setSearchText('')}>
              <Icon name="clear" size={20} color="#6b7280" />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* Quick Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>500+</Text>
          <Text style={styles.statLabel}>Barche</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>6</Text>
          <Text style={styles.statLabel}>Porti</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>4.9</Text>
          <Text style={styles.statLabel}>Rating</Text>
        </View>
      </View>

      {/* Categories */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Categorie</Text>
        <View style={styles.categoriesGrid}>
          {categories.map((category) => (
            <TouchableOpacity 
              key={category.id} 
              style={[
                styles.categoryCard,
                selectedCategory === category.id && styles.categoryCardActive
              ]}
              onPress={() => setSelectedCategory(selectedCategory === category.id ? '' : category.id)}
            >
              <Text style={styles.categoryIcon}>{category.icon}</Text>
              <Text style={styles.categoryName}>{category.name}</Text>
              <Text style={styles.categoryCount}>{category.count}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Featured Boats */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          {filteredBoats.length > 0 ? `${filteredBoats.length} Barche Trovate` : 'Barche in Evidenza'}
        </Text>
        
        {filteredBoats.length > 0 ? (
          filteredBoats.map((boat) => (
            <TouchableOpacity key={boat.id} style={styles.boatCard}>
              <Image source={{ uri: boat.image }} style={styles.boatImage} />
              <View style={styles.boatInfo}>
                <View style={styles.boatHeader}>
                  <Text style={styles.boatName}>{boat.name}</Text>
                  <View style={styles.rating}>
                    <Icon name="star" size={16} color="#FFD700" />
                    <Text style={styles.ratingText}>{boat.rating}</Text>
                  </View>
                </View>
                <Text style={styles.boatLocation}>📍 {boat.location}</Text>
                <View style={styles.boatFooter}>
                  <Text style={styles.boatPrice}>{boat.price}/giorno</Text>
                  <TouchableOpacity style={styles.bookButton}>
                    <Text style={styles.bookButtonText}>Prenota</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Icon name="search-off" size={64} color="#d1d5db" />
            <Text style={styles.emptyTitle}>Nessuna barca trovata</Text>
            <Text style={styles.emptySubtitle}>
              Prova a modificare i filtri o la ricerca
            </Text>
          </View>
        )}
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Azioni Rapide</Text>
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.actionButton}>
            <Icon name="map" size={24} color="#0ea5e9" />
            <Text style={styles.actionText}>Mappa</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Icon name="filter-list" size={24} color="#0ea5e9" />
            <Text style={styles.actionText}>Filtri</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Icon name="favorite" size={24} color="#0ea5e9" />
            <Text style={styles.actionText}>Preferiti</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Icon name="help" size={24} color="#0ea5e9" />
            <Text style={styles.actionText}>Aiuto</Text>
          </TouchableOpacity>
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
  hero: {
    backgroundColor: '#0ea5e9',
    padding: 24,
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    marginBottom: 20,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    width: '100%',
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#1f2937',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    backgroundColor: 'white',
    marginTop: -15,
    marginHorizontal: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statCard: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0ea5e9',
  },
  statLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    width: (width - 60) / 2,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  categoryCardActive: {
    backgroundColor: '#e0f2fe',
    borderWidth: 2,
    borderColor: '#0ea5e9',
  },
  categoryIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    textAlign: 'center',
  },
  categoryCount: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  boatCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    flexDirection: 'row',
    padding: 16,
  },
  boatImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 16,
  },
  boatInfo: {
    flex: 1,
  },
  boatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  boatName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    flex: 1,
    marginRight: 8,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 4,
  },
  boatLocation: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 12,
  },
  boatFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  boatPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0ea5e9',
  },
  bookButton: {
    backgroundColor: '#0ea5e9',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  bookButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6b7280',
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
    marginTop: 8,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionButton: {
    alignItems: 'center',
    padding: 16,
  },
  actionText: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 8,
  },
});

export default EsploraScreen;