import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

interface Boat {
  id: number;
  name: string;
  type: string;
  port: string;
  pricePerDay: string;
  maxPersons: number;
  image: string;
  rating: number;
}

const featuredBoats: Boat[] = [
  {
    id: 1,
    name: "Zodiac Pro 550",
    type: "Gommone",
    port: "Civitavecchia",
    pricePerDay: "150",
    maxPersons: 6,
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400",
    rating: 4.8
  },
  {
    id: 2,
    name: "Luxury Yacht 40ft",
    type: "Yacht",
    port: "Porto di Roma",
    pricePerDay: "800",
    maxPersons: 12,
    image: "https://images.unsplash.com/photo-1540946485063-a40da27545f8?w=400",
    rating: 4.9
  },
];

const categories = [
  { id: 1, name: "Gommoni", icon: "boat", color: "#0ea5e9" },
  { id: 2, name: "Yacht", icon: "diamond", color: "#f59e0b" },
  { id: 3, name: "Barche a vela", icon: "triangle", color: "#10b981" },
  { id: 4, name: "Charter", icon: "flag", color: "#8b5cf6" },
];

export default function EsploraScreen({ navigation }: any) {
  const [searchText, setSearchText] = useState('');

  const renderBoatCard = ({ item }: { item: Boat }) => (
    <TouchableOpacity 
      style={styles.boatCard}
      onPress={() => navigation.navigate('BoatDetails', { boat: item })}
    >
      <Image source={{ uri: item.image }} style={styles.boatImage} />
      <View style={styles.boatInfo}>
        <Text style={styles.boatName}>{item.name}</Text>
        <Text style={styles.boatType}>{item.type} • {item.port}</Text>
        <View style={styles.boatFooter}>
          <View style={styles.ratingContainer}>
            <Icon name="star" size={14} color="#f59e0b" />
            <Text style={styles.rating}>{item.rating}</Text>
          </View>
          <Text style={styles.price}>€{item.pricePerDay}/giorno</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderCategory = ({ item }: any) => (
    <TouchableOpacity style={[styles.categoryCard, { borderColor: item.color }]}>
      <Icon name={item.icon} size={24} color={item.color} />
      <Text style={styles.categoryName}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>SeaGO</Text>
          <Text style={styles.headerSubtitle}>Naviga verso l'avventura</Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Icon name="search" size={20} color="#6b7280" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Cerca barche, destinazioni..."
            value={searchText}
            onChangeText={setSearchText}
          />
          <TouchableOpacity style={styles.filterButton}>
            <Icon name="options" size={20} color="#0ea5e9" />
          </TouchableOpacity>
        </View>

        {/* Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categorie</Text>
          <FlatList
            data={categories}
            renderItem={renderCategory}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesList}
          />
        </View>

        {/* Featured Boats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Barche in evidenza</Text>
          <FlatList
            data={featuredBoats}
            renderItem={renderBoatCard}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.boatsList}
          />
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Azioni rapide</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity style={styles.quickAction}>
              <Icon name="location" size={24} color="#0ea5e9" />
              <Text style={styles.quickActionText}>Vicino a me</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickAction}>
              <Icon name="time" size={24} color="#0ea5e9" />
              <Text style={styles.quickActionText}>Disponibili ora</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickAction}>
              <Icon name="star" size={24} color="#0ea5e9" />
              <Text style={styles.quickActionText}>Più votate</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0ea5e9',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#6b7280',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    margin: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
  },
  filterButton: {
    padding: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginHorizontal: 20,
    marginBottom: 16,
  },
  categoriesList: {
    paddingHorizontal: 16,
  },
  categoryCard: {
    backgroundColor: 'white',
    padding: 16,
    marginHorizontal: 4,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    minWidth: 90,
  },
  categoryName: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
  },
  boatsList: {
    paddingHorizontal: 16,
  },
  boatCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginHorizontal: 4,
    width: width * 0.75,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  boatImage: {
    width: '100%',
    height: 160,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  boatInfo: {
    padding: 16,
  },
  boatName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  boatType: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 12,
  },
  boatFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
    color: '#111827',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0ea5e9',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
  },
  quickAction: {
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    flex: 1,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  quickActionText: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
    color: '#374151',
  },
});