import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../services/AuthContext';

const API_BASE_URL = 'https://a3dac1fb-3964-4fef-85b1-2870a8c6ce84-00-67b16wtsvwza.worf.replit.dev';

type Boat = {
  id: number;
  name: string;
  type: string;
  port: string;
  pricePerDay: string;
  images: string[];
  maxPersons: number;
  length: number;
};

export default function HomeScreen({ navigation }: any) {
  const { user } = useAuth();
  const [boats, setBoats] = useState<Boat[]>([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBoats();
  }, []);

  const fetchBoats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/boats`);
      if (response.ok) {
        const data = await response.json();
        setBoats(data);
      }
    } catch (error) {
      Alert.alert('Errore', 'Impossibile caricare le barche');
    } finally {
      setLoading(false);
    }
  };

  const filteredBoats = boats.filter(boat =>
    boat.name.toLowerCase().includes(searchText.toLowerCase()) ||
    boat.port.toLowerCase().includes(searchText.toLowerCase())
  );

  const renderBoatCard = ({ item }: { item: Boat }) => (
    <TouchableOpacity
      style={styles.boatCard}
      onPress={() => navigation.navigate('BoatDetails', { boatId: item.id })}
    >
      <Image
        source={{ uri: item.images[0] || 'https://via.placeholder.com/300x200' }}
        style={styles.boatImage}
      />
      <View style={styles.boatInfo}>
        <Text style={styles.boatName}>{item.name}</Text>
        <Text style={styles.boatType}>{item.type}</Text>
        <Text style={styles.boatPort}>{item.port}</Text>
        <View style={styles.boatDetails}>
          <Text style={styles.boatCapacity}>👥 {item.maxPersons}</Text>
          <Text style={styles.boatLength}>📏 {item.length}m</Text>
        </View>
        <Text style={styles.boatPrice}>€{item.pricePerDay}/giorno</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Image
              source={require('../../assets/logo.jpeg')}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.welcomeText}>
              {user ? `Ciao, ${user.firstName}!` : 'Benvenuto su SeaGO'}
            </Text>
          </View>
          {!user && (
            <TouchableOpacity
              style={styles.loginButton}
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={styles.loginButtonText}>Accedi</Text>
            </TouchableOpacity>
          )}
          {user?.role === 'owner' && (
            <TouchableOpacity
              style={styles.dashboardButton}
              onPress={() => navigation.navigate('OwnerDashboard')}
            >
              <Text style={styles.dashboardButtonText}>Dashboard</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Cerca barche per nome o porto..."
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>

        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Text style={styles.heroTitle}>Naviga verso l'avventura</Text>
          <Text style={styles.heroSubtitle}>
            Prenota barche, yacht e imbarcazioni uniche in tutta Italia
          </Text>
        </View>

        {/* Boats List */}
        <View style={styles.boatsSection}>
          <Text style={styles.sectionTitle}>Imbarcazioni disponibili</Text>
          {loading ? (
            <Text style={styles.loadingText}>Caricamento...</Text>
          ) : (
            <FlatList
              data={filteredBoats}
              renderItem={renderBoatCard}
              keyExtractor={(item) => item.id.toString()}
              numColumns={1}
              scrollEnabled={false}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#0ea5e9',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 12,
    borderRadius: 20,
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  loginButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  loginButtonText: {
    color: '#0ea5e9',
    fontWeight: 'bold',
  },
  dashboardButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  dashboardButtonText: {
    color: '#0ea5e9',
    fontWeight: 'bold',
  },
  searchContainer: {
    padding: 16,
  },
  searchInput: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    fontSize: 16,
  },
  heroSection: {
    padding: 16,
    backgroundColor: '#0ea5e9',
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#bfdbfe',
    textAlign: 'center',
  },
  boatsSection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 16,
  },
  loadingText: {
    textAlign: 'center',
    color: '#64748b',
    fontSize: 16,
  },
  boatCard: {
    backgroundColor: '#fff',
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
  boatName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  boatType: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 4,
  },
  boatPort: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 8,
  },
  boatDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  boatCapacity: {
    fontSize: 14,
    color: '#64748b',
  },
  boatLength: {
    fontSize: 14,
    color: '#64748b',
  },
  boatPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0ea5e9',
  },
});