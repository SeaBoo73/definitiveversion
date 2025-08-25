import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const SearchScreen = () => {
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const categories = [
    { id: 'all', name: 'Tutte', icon: '🚢' },
    { id: 'yacht', name: 'Yacht', icon: '🛥️' },
    { id: 'sailing', name: 'Vela', icon: '⛵' },
    { id: 'dinghy', name: 'Gommoni', icon: '🚤' },
  ];

  const boats = [
    {
      id: 1,
      name: 'Azimut 55 Luxury',
      location: 'Civitavecchia',
      price: '€850',
      rating: 4.9,
      category: 'yacht',
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=300&h=200&fit=crop&crop=center'
    },
    {
      id: 2,
      name: 'Bavaria 46 Cruiser',
      location: 'Gaeta',
      price: '€320',
      rating: 4.8,
      category: 'sailing',
      image: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=300&h=200&fit=crop&crop=center'
    },
    {
      id: 3,
      name: 'Zodiac Pro 650',
      location: 'Anzio',
      price: '€180',
      rating: 4.7,
      category: 'dinghy',
      image: 'https://images.unsplash.com/photo-1558618047-fcd95c85cd64?w=300&h=200&fit=crop&crop=center'
    },
    {
      id: 4,
      name: 'Princess V58',
      location: 'Formia',
      price: '€950',
      rating: 4.9,
      category: 'yacht',
      image: 'https://images.unsplash.com/photo-1540946485063-a40da27545f8?w=300&h=200&fit=crop&crop=center'
    },
  ];

  const filteredBoats = boats.filter(boat => {
    const matchesSearch = boat.name.toLowerCase().includes(searchText.toLowerCase()) ||
                         boat.location.toLowerCase().includes(searchText.toLowerCase());
    const matchesCategory = selectedCategory === '' || selectedCategory === 'all' || boat.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Icon name="search" size={20} color="#6b7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Cerca barche, località..."
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

      {/* Categories Filter */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryButton,
              selectedCategory === category.id && styles.categoryButtonActive
            ]}
            onPress={() => setSelectedCategory(selectedCategory === category.id ? '' : category.id)}
          >
            <Text style={styles.categoryIcon}>{category.icon}</Text>
            <Text style={[
              styles.categoryText,
              selectedCategory === category.id && styles.categoryTextActive
            ]}>
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Results */}
      <ScrollView style={styles.resultsContainer} showsVerticalScrollIndicator={false}>
        <Text style={styles.resultsTitle}>
          {filteredBoats.length} barche trovate
        </Text>

        {filteredBoats.map((boat) => (
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
        ))}

        {filteredBoats.length === 0 && (
          <View style={styles.emptyState}>
            <Icon name="search-off" size={64} color="#d1d5db" />
            <Text style={styles.emptyTitle}>Nessuna barca trovata</Text>
            <Text style={styles.emptySubtitle}>
              Prova a modificare i filtri o la ricerca
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#1f2937',
  },
  categoriesContainer: {
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
  },
  categoryButtonActive: {
    backgroundColor: '#0ea5e9',
  },
  categoryIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  categoryText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  categoryTextActive: {
    color: 'white',
  },
  resultsContainer: {
    flex: 1,
    padding: 16,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
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
  },
  boatImage: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  boatInfo: {
    padding: 16,
  },
  boatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  boatName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    flex: 1,
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
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0ea5e9',
  },
  bookButton: {
    backgroundColor: '#0ea5e9',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
  },
  bookButtonText: {
    color: 'white',
    fontWeight: '600',
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
});

export default SearchScreen;