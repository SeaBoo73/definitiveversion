import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');
const API_BASE_URL = 'https://a3dac1fb-3964-4fef-85b1-2870a8c6ce84-00-67b16wtsvwza.worf.replit.dev';

type Boat = {
  id: number;
  name: string;
  manufacturer: string;
  type: string;
  year: number;
  maxPersons: number;
  length: number;
  motorization: string;
  licenseRequired: boolean;
  skipperRequired: boolean;
  port: string;
  pricePerDay: string;
  description: string;
  images: string[];
  documentsRequired: string;
};

export default function BoatDetailsScreen({ route, navigation }: any) {
  const { boatId } = route.params;
  const [boat, setBoat] = useState<Boat | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    fetchBoatDetails();
  }, [boatId]);

  const fetchBoatDetails = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/boats/${boatId}`);
      if (response.ok) {
        const data = await response.json();
        setBoat(data);
      } else {
        Alert.alert('Errore', 'Impossibile caricare i dettagli della barca');
      }
    } catch (error) {
      Alert.alert('Errore', 'Errore di connessione');
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = () => {
    Alert.alert(
      'Prenotazione',
      'Funzionalità di prenotazione in arrivo!',
      [{ text: 'OK' }]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Caricamento...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!boat) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Barca non trovata</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Image Gallery */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: boat.images[currentImageIndex] || 'https://via.placeholder.com/400x300' }}
            style={styles.image}
          />
          {boat.images.length > 1 && (
            <View style={styles.imageIndicators}>
              {boat.images.map((_, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.indicator,
                    index === currentImageIndex && styles.activeIndicator,
                  ]}
                  onPress={() => setCurrentImageIndex(index)}
                />
              ))}
            </View>
          )}
        </View>

        {/* Boat Info */}
        <View style={styles.infoContainer}>
          <Text style={styles.boatName}>{boat.name}</Text>
          <Text style={styles.manufacturer}>{boat.manufacturer} - {boat.year}</Text>
          <Text style={styles.port}>📍 {boat.port}</Text>
          
          <View style={styles.priceContainer}>
            <Text style={styles.price}>€{boat.pricePerDay}</Text>
            <Text style={styles.priceLabel}>/ giorno</Text>
          </View>

          {/* Specifications */}
          <View style={styles.specsContainer}>
            <Text style={styles.sectionTitle}>Caratteristiche</Text>
            <View style={styles.specsGrid}>
              <View style={styles.specItem}>
                <Text style={styles.specLabel}>Tipo</Text>
                <Text style={styles.specValue}>{boat.type}</Text>
              </View>
              <View style={styles.specItem}>
                <Text style={styles.specLabel}>Persone</Text>
                <Text style={styles.specValue}>{boat.maxPersons}</Text>
              </View>
              <View style={styles.specItem}>
                <Text style={styles.specLabel}>Lunghezza</Text>
                <Text style={styles.specValue}>{boat.length}m</Text>
              </View>
              <View style={styles.specItem}>
                <Text style={styles.specLabel}>Motorizzazione</Text>
                <Text style={styles.specValue}>{boat.motorization}</Text>
              </View>
            </View>
          </View>

          {/* Requirements */}
          <View style={styles.requirementsContainer}>
            <Text style={styles.sectionTitle}>Requisiti</Text>
            <View style={styles.requirementsList}>
              <View style={styles.requirementItem}>
                <Text style={styles.requirementIcon}>
                  {boat.licenseRequired ? '✅' : '❌'}
                </Text>
                <Text style={styles.requirementText}>Patente nautica</Text>
              </View>
              <View style={styles.requirementItem}>
                <Text style={styles.requirementIcon}>
                  {boat.skipperRequired ? '✅' : '❌'}
                </Text>
                <Text style={styles.requirementText}>Skipper richiesto</Text>
              </View>
            </View>
            <Text style={styles.documentsText}>
              Documenti richiesti: {boat.documentsRequired}
            </Text>
          </View>

          {/* Description */}
          <View style={styles.descriptionContainer}>
            <Text style={styles.sectionTitle}>Descrizione</Text>
            <Text style={styles.description}>{boat.description}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Booking Button */}
      <View style={styles.bookingContainer}>
        <TouchableOpacity style={styles.bookingButton} onPress={handleBooking}>
          <Text style={styles.bookingButtonText}>Prenota ora</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#64748b',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#ef4444',
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: width,
    height: 300,
  },
  imageIndicators: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 4,
  },
  activeIndicator: {
    backgroundColor: '#fff',
  },
  infoContainer: {
    padding: 16,
  },
  boatName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  manufacturer: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 8,
  },
  port: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 16,
  },
  priceContainer: {
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
    color: '#64748b',
    marginLeft: 4,
  },
  specsContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 16,
  },
  specsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  specItem: {
    width: '48%',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  specLabel: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 4,
  },
  specValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  requirementsContainer: {
    marginBottom: 24,
  },
  requirementsList: {
    marginBottom: 12,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  requirementIcon: {
    fontSize: 16,
    marginRight: 12,
  },
  requirementText: {
    fontSize: 16,
    color: '#1e293b',
  },
  documentsText: {
    fontSize: 14,
    color: '#64748b',
    fontStyle: 'italic',
  },
  descriptionContainer: {
    marginBottom: 24,
  },
  description: {
    fontSize: 16,
    color: '#1e293b',
    lineHeight: 24,
  },
  bookingContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  bookingButton: {
    backgroundColor: '#0ea5e9',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  bookingButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});