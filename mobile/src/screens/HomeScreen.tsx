import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width } = Dimensions.get('window');

const HomeScreen = () => {
  const categories = [
    { id: 1, name: 'Yacht', icon: '🛥️', count: '85+' },
    { id: 2, name: 'Barche a vela', icon: '⛵', count: '120+' },
    { id: 3, name: 'Gommoni', icon: '🚤', count: '200+' },
    { id: 4, name: 'Catamarani', icon: '⛵', count: '45+' },
  ];

  const featuredBoats = [
    {
      id: 1,
      name: 'Azimut 55',
      location: 'Civitavecchia',
      price: '€850',
      rating: 4.9,
      image: 'https://via.placeholder.com/300x200?text=Yacht'
    },
    {
      id: 2,
      name: 'Bavaria 46',
      location: 'Gaeta',
      price: '€320',
      rating: 4.8,
      image: 'https://via.placeholder.com/300x200?text=Sailboat'
    },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Hero Section */}
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>Scopri il Mare del Lazio</Text>
        <Text style={styles.heroSubtitle}>
          Trova la barca perfetta per la tua avventura
        </Text>
        <TouchableOpacity style={styles.searchButton}>
          <Icon name="search" size={20} color="white" />
          <Text style={styles.searchButtonText}>Cerca ora</Text>
        </TouchableOpacity>
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
        <Text style={styles.sectionTitle}>Categorie Popolari</Text>
        <View style={styles.categoriesGrid}>
          {categories.map((category) => (
            <TouchableOpacity key={category.id} style={styles.categoryCard}>
              <Text style={styles.categoryIcon}>{category.icon}</Text>
              <Text style={styles.categoryName}>{category.name}</Text>
              <Text style={styles.categoryCount}>{category.count}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Featured Boats */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Barche in Evidenza</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {featuredBoats.map((boat) => (
            <View key={boat.id} style={styles.boatCard}>
              <Image source={{ uri: boat.image }} style={styles.boatImage} />
              <View style={styles.boatInfo}>
                <Text style={styles.boatName}>{boat.name}</Text>
                <Text style={styles.boatLocation}>📍 {boat.location}</Text>
                <View style={styles.boatFooter}>
                  <Text style={styles.boatPrice}>{boat.price}/giorno</Text>
                  <View style={styles.rating}>
                    <Icon name="star" size={16} color="#FFD700" />
                    <Text style={styles.ratingText}>{boat.rating}</Text>
                  </View>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
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
  searchButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  searchButtonText: {
    color: 'white',
    fontWeight: '600',
    marginLeft: 8,
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
    marginRight: 16,
    width: 250,
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
    padding: 16,
  },
  boatName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  boatLocation: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  boatFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  boatPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0ea5e9',
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

export default HomeScreen;