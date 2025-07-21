import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

export default function BoatDetailsScreen({ navigation, route }: any) {
  const { boat } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="chevron-back" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.favoriteButton}>
            <Icon name="heart-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>

        <Image source={{ uri: boat.image }} style={styles.heroImage} />

        <View style={styles.content}>
          <View style={styles.titleSection}>
            <Text style={styles.boatName}>{boat.name}</Text>
            <Text style={styles.boatType}>{boat.type} • {boat.port}</Text>
            <View style={styles.ratingContainer}>
              <Icon name="star" size={16} color="#f59e0b" />
              <Text style={styles.rating}>{boat.rating}</Text>
              <Text style={styles.reviewsCount}>(24 recensioni)</Text>
            </View>
          </View>

          <View style={styles.priceSection}>
            <Text style={styles.price}>€{boat.pricePerDay}</Text>
            <Text style={styles.priceLabel}>/giorno</Text>
          </View>

          <View style={styles.specsSection}>
            <Text style={styles.sectionTitle}>Specifiche</Text>
            <View style={styles.specsGrid}>
              <View style={styles.specItem}>
                <Icon name="people" size={20} color="#0ea5e9" />
                <Text style={styles.specText}>Max {boat.maxPersons} persone</Text>
              </View>
              <View style={styles.specItem}>
                <Icon name="resize" size={20} color="#0ea5e9" />
                <Text style={styles.specText}>8.5m lunghezza</Text>
              </View>
              <View style={styles.specItem}>
                <Icon name="checkmark-circle" size={20} color="#10b981" />
                <Text style={styles.specText}>Patente non richiesta</Text>
              </View>
              <View style={styles.specItem}>
                <Icon name="water" size={20} color="#0ea5e9" />
                <Text style={styles.specText}>Carburante incluso</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity 
            style={styles.bookButton}
            onPress={() => navigation.navigate('Booking', { boat })}
          >
            <Text style={styles.bookButtonText}>Prenota Ora</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    zIndex: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroImage: {
    width: width,
    height: 300,
  },
  content: {
    padding: 20,
  },
  titleSection: {
    marginBottom: 16,
  },
  boatName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  boatType: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 4,
    marginRight: 8,
    color: '#111827',
  },
  reviewsCount: {
    fontSize: 14,
    color: '#6b7280',
  },
  priceSection: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 24,
  },
  price: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#0ea5e9',
  },
  priceLabel: {
    fontSize: 16,
    color: '#6b7280',
    marginLeft: 4,
  },
  specsSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  specsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  specItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: '45%',
  },
  specText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
    color: '#374151',
  },
  bookButton: {
    backgroundColor: '#0ea5e9',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  bookButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});