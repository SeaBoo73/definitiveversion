import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Linking
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface WeatherData {
  location: string;
  temperature: number;
  description: string;
  windSpeed: number;
  windDirection: number;
  humidity: number;
  pressure: number;
  visibility: number;
  waves: {
    height: number;
    direction: number;
    period: number;
  };
}

interface FuelPrice {
  station: string;
  location: string;
  gasoline: number;
  diesel: number;
  lastUpdated: string;
  distance: number;
  services: string[];
}

interface PortService {
  id: string;
  name: string;
  location: string;
  contact: {
    phone: string;
    email: string;
    vhf?: string;
  };
  services: {
    mooring: boolean;
    fuel: boolean;
    water: boolean;
    electricity: boolean;
  };
  pricing: {
    mooring: number;
    fuel: number;
  };
  availability: {
    total: number;
    available: number;
  };
  rating: number;
}

export default function ServicesScreen() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [fuelPrices, setFuelPrices] = useState<FuelPrice[]>([]);
  const [portServices, setPortServices] = useState<PortService[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTab, setSelectedTab] = useState('weather');

  const API_BASE = 'http://192.168.1.1:5000/api/external'; // Sostituisci con il tuo IP

  const fetchData = async () => {
    try {
      const [weatherRes, fuelRes, portsRes] = await Promise.all([
        fetch(`${API_BASE}/weather?location=Roma`),
        fetch(`${API_BASE}/fuel-prices`),
        fetch(`${API_BASE}/port-services`)
      ]);

      if (weatherRes.ok) {
        const weather = await weatherRes.json();
        setWeatherData(weather);
      }

      if (fuelRes.ok) {
        const fuel = await fuelRes.json();
        setFuelPrices(fuel);
      }

      if (portsRes.ok) {
        const ports = await portsRes.json();
        setPortServices(ports);
      }
    } catch (error) {
      console.error('Error fetching services data:', error);
      Alert.alert('Errore', 'Impossibile caricare i dati dei servizi');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const callPort = (phone: string) => {
    Linking.openURL(`tel:${phone}`);
  };

  const getWaveCondition = (height: number) => {
    if (height <= 0.5) return { text: 'Calmo', color: '#22c55e' };
    if (height <= 1.0) return { text: 'Leggero', color: '#eab308' };
    if (height <= 2.0) return { text: 'Moderato', color: '#f97316' };
    return { text: 'Mosso', color: '#ef4444' };
  };

  const renderWeatherTab = () => (
    <View style={styles.tabContent}>
      {weatherData && (
        <>
          <View style={styles.weatherCard}>
            <View style={styles.weatherHeader}>
              <Icon name="cloud" size={24} color="#0066CC" />
              <Text style={styles.cardTitle}>Condizioni Attuali - {weatherData.location}</Text>
            </View>
            
            <View style={styles.weatherGrid}>
              <View style={styles.weatherItem}>
                <Icon name="thermostat" size={32} color="#f97316" />
                <Text style={styles.weatherValue}>{weatherData.temperature}°C</Text>
                <Text style={styles.weatherLabel}>{weatherData.description}</Text>
              </View>
              
              <View style={styles.weatherItem}>
                <Icon name="air" size={32} color="#0066CC" />
                <Text style={styles.weatherValue}>{weatherData.windSpeed} kn</Text>
                <Text style={styles.weatherLabel}>Vento</Text>
              </View>
              
              <View style={styles.weatherItem}>
                <Icon name="waves" size={32} color="#14b8a6" />
                <Text style={styles.weatherValue}>{weatherData.waves.height} m</Text>
                <View style={[styles.waveBadge, { backgroundColor: getWaveCondition(weatherData.waves.height).color }]}>
                  <Text style={styles.waveBadgeText}>{getWaveCondition(weatherData.waves.height).text}</Text>
                </View>
              </View>
              
              <View style={styles.weatherItem}>
                <Icon name="visibility" size={32} color="#8b5cf6" />
                <Text style={styles.weatherValue}>{weatherData.visibility} km</Text>
                <Text style={styles.weatherLabel}>Visibilità</Text>
              </View>
            </View>
            
            <View style={styles.weatherDetails}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Pressione:</Text>
                <Text style={styles.detailValue}>{weatherData.pressure} hPa</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Umidità:</Text>
                <Text style={styles.detailValue}>{weatherData.humidity}%</Text>
              </View>
            </View>
          </View>

          <View style={styles.navigationCard}>
            <Text style={styles.cardTitle}>Raccomandazioni Navigazione</Text>
            <View style={[styles.recommendationBadge, {
              backgroundColor: weatherData.waves.height <= 0.5 && weatherData.windSpeed <= 10 
                ? '#22c55e' 
                : weatherData.waves.height <= 1.5 && weatherData.windSpeed <= 20
                ? '#eab308'
                : '#ef4444'
            }]}>
              <Text style={styles.recommendationText}>
                {weatherData.waves.height <= 0.5 && weatherData.windSpeed <= 10 
                  ? 'Condizioni Ottime - Ideale per tutte le imbarcazioni' 
                  : weatherData.waves.height <= 1.5 && weatherData.windSpeed <= 20
                  ? 'Condizioni Moderate - Prestare attenzione'
                  : 'Condizioni Difficili - Solo navigatori esperti'
                }
              </Text>
            </View>
          </View>
        </>
      )}
    </View>
  );

  const renderFuelTab = () => (
    <View style={styles.tabContent}>
      {fuelPrices.map((station, index) => (
        <View key={index} style={styles.fuelCard}>
          <View style={styles.stationHeader}>
            <Text style={styles.stationName}>{station.station}</Text>
            <View style={styles.distanceBadge}>
              <Text style={styles.distanceText}>{station.distance} km</Text>
            </View>
          </View>
          <Text style={styles.stationLocation}>{station.location}</Text>
          
          <View style={styles.priceGrid}>
            <View style={styles.priceItem}>
              <Text style={styles.fuelType}>Benzina</Text>
              <Text style={styles.price}>€{station.gasoline.toFixed(2)}</Text>
            </View>
            <View style={styles.priceItem}>
              <Text style={styles.fuelType}>Gasolio</Text>
              <Text style={styles.price}>€{station.diesel.toFixed(2)}</Text>
            </View>
          </View>
          
          <View style={styles.servicesContainer}>
            <Text style={styles.servicesTitle}>Servizi:</Text>
            <View style={styles.servicesGrid}>
              {station.services.map((service, i) => (
                <View key={i} style={styles.serviceBadge}>
                  <Text style={styles.serviceText}>{service}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      ))}
    </View>
  );

  const renderPortsTab = () => (
    <View style={styles.tabContent}>
      {portServices.map((port) => (
        <View key={port.id} style={styles.portCard}>
          <View style={styles.portHeader}>
            <Text style={styles.portName}>{port.name}</Text>
            <View style={styles.ratingContainer}>
              <Icon name="star" size={16} color="#fbbf24" />
              <Text style={styles.rating}>{port.rating}</Text>
            </View>
          </View>
          <Text style={styles.portLocation}>{port.location}</Text>
          
          <View style={styles.portServices}>
            <Text style={styles.servicesTitle}>Servizi disponibili:</Text>
            <View style={styles.servicesRow}>
              {port.services.mooring && <Icon name="anchor" size={20} color="#22c55e" />}
              {port.services.fuel && <Icon name="local-gas-station" size={20} color="#22c55e" />}
              {port.services.water && <Icon name="water-drop" size={20} color="#22c55e" />}
              {port.services.electricity && <Icon name="bolt" size={20} color="#22c55e" />}
            </View>
          </View>
          
          <View style={styles.availabilityRow}>
            <Text style={styles.availabilityLabel}>Disponibilità:</Text>
            <Text style={[styles.availabilityValue, { 
              color: port.availability.available > 20 ? '#22c55e' : '#ef4444' 
            }]}>
              {port.availability.available}/{port.availability.total} posti
            </Text>
          </View>
          
          <View style={styles.pricingRow}>
            <Text style={styles.pricingLabel}>Ormeggio: €{port.pricing.mooring}/m/giorno</Text>
            {port.services.fuel && <Text style={styles.pricingLabel}>Carburante: €{port.pricing.fuel}/L</Text>}
          </View>
          
          <TouchableOpacity 
            style={styles.callButton}
            onPress={() => callPort(port.contact.phone)}
          >
            <Icon name="phone" size={20} color="white" />
            <Text style={styles.callButtonText}>Chiama Porto</Text>
          </TouchableOpacity>
          
          {port.contact.vhf && (
            <Text style={styles.vhfInfo}>VHF: {port.contact.vhf}</Text>
          )}
        </View>
      ))}
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0066CC" />
          <Text style={styles.loadingText}>Caricamento servizi...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Icon name="cloud" size={28} color="#0066CC" />
        <Text style={styles.title}>Servizi Esterni</Text>
      </View>

      <View style={styles.tabBar}>
        <TouchableOpacity 
          style={[styles.tab, selectedTab === 'weather' && styles.activeTab]}
          onPress={() => setSelectedTab('weather')}
        >
          <Icon name="cloud" size={20} color={selectedTab === 'weather' ? '#0066CC' : '#6b7280'} />
          <Text style={[styles.tabText, selectedTab === 'weather' && styles.activeTabText]}>Meteo</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, selectedTab === 'fuel' && styles.activeTab]}
          onPress={() => setSelectedTab('fuel')}
        >
          <Icon name="local-gas-station" size={20} color={selectedTab === 'fuel' ? '#0066CC' : '#6b7280'} />
          <Text style={[styles.tabText, selectedTab === 'fuel' && styles.activeTabText]}>Carburante</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, selectedTab === 'ports' && styles.activeTab]}
          onPress={() => setSelectedTab('ports')}
        >
          <Icon name="anchor" size={20} color={selectedTab === 'ports' ? '#0066CC' : '#6b7280'} />
          <Text style={[styles.tabText, selectedTab === 'ports' && styles.activeTabText]}>Porti</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {selectedTab === 'weather' && renderWeatherTab()}
        {selectedTab === 'fuel' && renderFuelTab()}
        {selectedTab === 'ports' && renderPortsTab()}
      </ScrollView>
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
    marginTop: 16,
    fontSize: 16,
    color: '#6b7280',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 12,
    color: '#1f2937',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#0066CC',
  },
  tabText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
  },
  activeTabText: {
    color: '#0066CC',
  },
  content: {
    flex: 1,
  },
  tabContent: {
    padding: 16,
  },
  weatherCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  weatherHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
    color: '#1f2937',
  },
  weatherGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  weatherItem: {
    width: '48%',
    alignItems: 'center',
    marginBottom: 16,
  },
  weatherValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 8,
    color: '#1f2937',
  },
  weatherLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  waveBadge: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginTop: 4,
  },
  waveBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  weatherDetails: {
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1f2937',
  },
  navigationCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  recommendationBadge: {
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
  },
  recommendationText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  fuelCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  stationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  stationName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  distanceBadge: {
    backgroundColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  distanceText: {
    fontSize: 12,
    color: '#6b7280',
  },
  stationLocation: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 12,
  },
  priceGrid: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  priceItem: {
    flex: 1,
    marginRight: 12,
  },
  fuelType: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#22c55e',
  },
  servicesContainer: {
    marginTop: 8,
  },
  servicesTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1f2937',
    marginBottom: 8,
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  serviceBadge: {
    backgroundColor: '#dbeafe',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 8,
    marginBottom: 4,
  },
  serviceText: {
    fontSize: 12,
    color: '#1e40af',
  },
  portCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  portHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  portName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    flex: 1,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
    color: '#1f2937',
  },
  portLocation: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 12,
  },
  portServices: {
    marginBottom: 12,
  },
  servicesRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  availabilityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  availabilityLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  availabilityValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  pricingRow: {
    marginBottom: 12,
  },
  pricingLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 2,
  },
  callButton: {
    backgroundColor: '#0066CC',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    paddingVertical: 10,
    marginBottom: 8,
  },
  callButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
  vhfInfo: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
});