import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ServiziScreen = () => {
  const [selectedTab, setSelectedTab] = useState('meteo');

  const [weatherData, setWeatherData] = useState({
    location: 'Roma/Fiumicino',
    temperature: 26.5,
    conditions: 'Soleggiato',
    windSpeed: 8.2,
    windDirection: 'SW',
    waveHeight: 0.8,
    visibility: 12.5,
    humidity: 68,
    pressure: 1018.2,
    uvIndex: 7,
    recommendations: 'Condizioni ottime per la navigazione. Vento leggero da Sud-Ovest.',
    forecast: {
      tomorrow: { temp: 28, conditions: 'Soleggiato', waves: 0.6 },
      dayAfter: { temp: 25, conditions: 'Parzialmente nuvoloso', waves: 1.2 }
    },
    lastUpdated: new Date().toLocaleTimeString('it-IT')
  });

  const [fuelPrices, setFuelPrices] = useState([
    { 
      station: 'IP Gruppo Api Marina', 
      location: 'Marina di Civitavecchia', 
      gasoline: 1.89, 
      diesel: 1.76, 
      distance: 0.2,
      services: ['Self-service 24h', 'Carta di credito', 'Fatturazione'],
      contact: '+39 0766 581234',
      lastUpdate: '2 ore fa'
    },
    { 
      station: 'Esso Portuale', 
      location: 'Porto di Gaeta', 
      gasoline: 1.84, 
      diesel: 1.72, 
      distance: 1.8,
      services: ['Assistito', 'Lubrificanti', 'AdBlue'],
      contact: '+39 0771 469852',
      lastUpdate: '1 ora fa'
    },
    { 
      station: 'Tamoil Marine', 
      location: 'Marina di Anzio', 
      gasoline: 1.92, 
      diesel: 1.78, 
      distance: 0.5,
      services: ['Self-service', 'Lavaggio barche', 'Shop nautico'],
      contact: '+39 06 9847521',
      lastUpdate: '30 min fa'
    },
    { 
      station: 'Agip Nautica', 
      location: 'Porto di Formia', 
      gasoline: 1.87, 
      diesel: 1.74, 
      distance: 0.8,
      services: ['Assistito', 'Oli motore', 'Rifornimento rapido'],
      contact: '+39 0771 725896',
      lastUpdate: '45 min fa'
    },
    { 
      station: 'Q8 Marina', 
      location: 'Porto di Terracina', 
      gasoline: 1.91, 
      diesel: 1.77, 
      distance: 1.2,
      services: ['Self-service 24h', 'Bonifici', 'Fatturazione elettronica'],
      contact: '+39 0773 852147',
      lastUpdate: '1 ora fa'
    }
  ]);

  const [portServices, setPortServices] = useState([
    {
      id: 'marina-civitavecchia',
      name: 'Marina di Civitavecchia',
      location: 'Civitavecchia, Roma',
      services: {
        mooring: true, fuel: true, water: true, electricity: true, 
        wifi: true, restaurant: true, repair: true, security: true
      },
      pricing: { mooring: 45, fuel: 1.89, water: 2.5, electricity: 0.5 },
      contact: { phone: '+39 0766 581111', email: 'info@marinacivitavecchia.it', vhf: 'Canale 12' },
      availability: { total: 350, available: 42, reserved: 18 },
      rating: 4.7,
      reviews: 189,
      coordinates: { lat: 42.0942, lng: 11.7939 }
    },
    {
      id: 'marina-gaeta',
      name: 'Marina di Gaeta',
      location: 'Gaeta, Latina',
      services: {
        mooring: true, fuel: true, water: true, electricity: true, 
        wifi: true, restaurant: true, repair: false, security: true
      },
      pricing: { mooring: 38, fuel: 1.84, water: 2.0, electricity: 0.45 },
      contact: { phone: '+39 0771 461528', email: 'porto@gaeta.it', vhf: 'Canale 16' },
      availability: { total: 280, available: 23, reserved: 12 },
      rating: 4.5,
      reviews: 156,
      coordinates: { lat: 41.2071, lng: 13.5722 }
    },
    {
      id: 'marina-anzio',
      name: 'Marina di Anzio',
      location: 'Anzio, Roma',
      services: {
        mooring: true, fuel: true, water: true, electricity: true, 
        wifi: false, restaurant: false, repair: true, security: true
      },
      pricing: { mooring: 35, fuel: 1.92, water: 2.2, electricity: 0.48 },
      contact: { phone: '+39 06 9847521', email: 'marina@anzio.com', vhf: 'Canale 14' },
      availability: { total: 180, available: 31, reserved: 8 },
      rating: 4.2,
      reviews: 98,
      coordinates: { lat: 41.4489, lng: 12.6219 }
    },
    {
      id: 'marina-formia',
      name: 'Marina di Formia',
      location: 'Formia, Latina',
      services: {
        mooring: true, fuel: true, water: true, electricity: true, 
        wifi: true, restaurant: true, repair: true, security: true
      },
      pricing: { mooring: 42, fuel: 1.87, water: 2.3, electricity: 0.52 },
      contact: { phone: '+39 0771 725896', email: 'info@marinaformia.it', vhf: 'Canale 09' },
      availability: { total: 240, available: 18, reserved: 15 },
      rating: 4.6,
      reviews: 134,
      coordinates: { lat: 41.2567, lng: 13.6058 }
    },
    {
      id: 'marina-terracina',
      name: 'Marina di Terracina',
      location: 'Terracina, Latina',
      services: {
        mooring: true, fuel: true, water: true, electricity: true, 
        wifi: true, restaurant: false, repair: false, security: true
      },
      pricing: { mooring: 32, fuel: 1.91, water: 1.8, electricity: 0.42 },
      contact: { phone: '+39 0773 852147', email: 'porto@terracina.gov.it', vhf: 'Canale 11' },
      availability: { total: 160, available: 28, reserved: 7 },
      rating: 4.1,
      reviews: 87,
      coordinates: { lat: 41.2905, lng: 13.2544 }
    }
  ]);

  const emergencyContacts = [
    { name: 'Guardia Costiera', number: '1530', type: 'emergency', description: 'Emergenze e soccorso in mare 24/7' },
    { name: 'Emergenza Sanitaria', number: '118', type: 'medical', description: 'Pronto soccorso medico immediato' },
    { name: 'Capitaneria di Porto Roma', number: '+39 06 59084409', type: 'port', description: 'Capitaneria principale Lazio' },
    { name: 'Capitaneria Civitavecchia', number: '+39 0766 366200', type: 'port', description: 'Controllo traffico marittimo' },
    { name: 'Capitaneria Gaeta', number: '+39 0771 469837', type: 'port', description: 'Servizi portuali Golfo di Gaeta' },
    { name: 'Assistenza SeaGO 24/7', number: '+39 06 8937 4562', type: 'support', description: 'Supporto tecnico piattaforma' },
    { name: 'Assistenza Meccanica Mobile', number: '+39 335 1847592', type: 'technical', description: 'Riparazioni in acqua e porto' },
    { name: 'Rimorchio Nautico', number: '+39 347 2951874', type: 'towing', description: 'Recupero imbarcazioni in avaria' }
  ];

  const renderWeatherTab = () => (
    <ScrollView style={styles.tabContent}>
      <View style={styles.weatherCard}>
        <View style={styles.weatherHeader}>
          <Text style={styles.weatherLocation}>{weatherData.location}</Text>
          <Text style={styles.weatherTemp}>{weatherData.temperature}</Text>
        </View>
        
        <Text style={styles.weatherConditions}>{weatherData.conditions}</Text>
        
        <View style={styles.weatherDetails}>
          <View style={styles.weatherDetail}>
            <Icon name="air" size={20} color="#0ea5e9" />
            <Text style={styles.weatherDetailText}>Vento: {weatherData.windSpeed}</Text>
          </View>
          <View style={styles.weatherDetail}>
            <Icon name="waves" size={20} color="#0ea5e9" />
            <Text style={styles.weatherDetailText}>Onde: {weatherData.waveHeight}</Text>
          </View>
          <View style={styles.weatherDetail}>
            <Icon name="visibility" size={20} color="#0ea5e9" />
            <Text style={styles.weatherDetailText}>Visibilità: {weatherData.visibility}</Text>
          </View>
        </View>

        <View style={styles.recommendationCard}>
          <Icon name="check-circle" size={24} color="#10b981" />
          <Text style={styles.recommendationText}>{weatherData.recommendations}</Text>
        </View>
      </View>

      <View style={styles.forecastSection}>
        <Text style={styles.sectionTitle}>Previsioni prossime ore</Text>
        <View style={styles.forecastList}>
          {['14:00', '16:00', '18:00', '20:00'].map((time, index) => (
            <View key={time} style={styles.forecastItem}>
              <Text style={styles.forecastTime}>{time}</Text>
              <Text style={styles.forecastTemp}>{24 - index}°C</Text>
              <Text style={styles.forecastWind}>{12 + index * 2} km/h</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );

  const renderFuelTab = () => (
    <ScrollView style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Prezzi Carburante Nautico</Text>
      {fuelPrices.map((fuel, index) => (
        <View key={index} style={styles.serviceCard}>
          <View style={styles.serviceHeader}>
            <Text style={styles.serviceName}>{fuel.port}</Text>
            <Text style={styles.fuelPrice}>{fuel.price}</Text>
          </View>
          <Text style={styles.serviceDistance}>📍 Distanza: {fuel.distance}</Text>
          <TouchableOpacity style={styles.actionButton}>
            <Icon name="directions" size={16} color="#0ea5e9" />
            <Text style={styles.actionButtonText}>Naviga</Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );

  const renderPortsTab = () => (
    <ScrollView style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Servizi Portuali</Text>
      {portServices.map((port, index) => (
        <View key={index} style={styles.serviceCard}>
          <View style={styles.serviceHeader}>
            <Text style={styles.serviceName}>{port.name}</Text>
            <View style={[
              styles.availabilityBadge,
              { backgroundColor: port.availability === 'Disponibile' ? '#10b981' : '#f59e0b' }
            ]}>
              <Text style={styles.availabilityText}>{port.availability}</Text>
            </View>
          </View>
          
          <Text style={styles.serviceTariff}>💰 Tariffa: {port.tariff}</Text>
          <Text style={styles.serviceContact}>📻 Contatto: {port.contact}</Text>
          
          <View style={styles.servicesList}>
            <Text style={styles.servicesTitle}>Servizi disponibili:</Text>
            <View style={styles.servicesContainer}>
              {port.services.map((service, idx) => (
                <Text key={idx} style={styles.serviceTag}>{service}</Text>
              ))}
            </View>
          </View>
        </View>
      ))}
    </ScrollView>
  );

  const renderEmergencyTab = () => (
    <ScrollView style={styles.tabContent}>
      <View style={styles.emergencyAlert}>
        <Icon name="warning" size={24} color="#ef4444" />
        <Text style={styles.emergencyAlertText}>
          In caso di emergenza, contatta immediatamente i numeri sottostanti
        </Text>
      </View>

      <Text style={styles.sectionTitle}>Contatti di Emergenza</Text>
      {emergencyContacts.map((contact, index) => (
        <TouchableOpacity 
          key={index} 
          style={[
            styles.emergencyCard,
            contact.type === 'emergency' && styles.emergencyCardPriority
          ]}
          onPress={() => Alert.alert('Chiamata', `Chiamare ${contact.name} al ${contact.number}?`)}
        >
          <View style={styles.emergencyInfo}>
            <Icon 
              name={
                contact.type === 'emergency' ? 'local-police' :
                contact.type === 'medical' ? 'local-hospital' :
                contact.type === 'port' ? 'anchor' : 'support-agent'
              } 
              size={24} 
              color={contact.type === 'emergency' ? '#ef4444' : '#0ea5e9'} 
            />
            <View style={styles.emergencyDetails}>
              <Text style={styles.emergencyName}>{contact.name}</Text>
              <Text style={styles.emergencyNumber}>{contact.number}</Text>
            </View>
          </View>
          <Icon name="phone" size={20} color="#10b981" />
        </TouchableOpacity>
      ))}

      <View style={styles.safetyTips}>
        <Text style={styles.safetyTitle}>Consigli di Sicurezza</Text>
        <View style={styles.tipsList}>
          <Text style={styles.tipItem}>• Controlla sempre le condizioni meteo prima di partire</Text>
          <Text style={styles.tipItem}>• Comunica sempre la tua rotta e orario di rientro</Text>
          <Text style={styles.tipItem}>• Assicurati di avere dispositivi di sicurezza a bordo</Text>
          <Text style={styles.tipItem}>• Mantieni il VHF sempre acceso sul canale 16</Text>
        </View>
      </View>
    </ScrollView>
  );

  const tabs = [
    { id: 'meteo', name: 'Meteo', icon: 'cloud', content: renderWeatherTab },
    { id: 'carburante', name: 'Carburante', icon: 'local-gas-station', content: renderFuelTab },
    { id: 'porti', name: 'Porti', icon: 'anchor', content: renderPortsTab },
    { id: 'emergenze', name: 'Emergenze', icon: 'emergency', content: renderEmergencyTab },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Servizi Marittimi</Text>
        <Text style={styles.headerSubtitle}>
          Informazioni essenziali per la navigazione
        </Text>
      </View>

      {/* Tab Navigation */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.tabsContainer}
      >
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[
              styles.tab,
              selectedTab === tab.id && styles.activeTab
            ]}
            onPress={() => setSelectedTab(tab.id)}
          >
            <Icon 
              name={tab.icon} 
              size={20} 
              color={selectedTab === tab.id ? '#0ea5e9' : '#6b7280'} 
            />
            <Text style={[
              styles.tabText,
              selectedTab === tab.id && styles.activeTabText
            ]}>
              {tab.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Tab Content */}
      <View style={styles.contentContainer}>
        {tabs.find(tab => tab.id === selectedTab)?.content()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#0ea5e9',
    padding: 24,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
  },
  tabsContainer: {
    backgroundColor: 'white',
    paddingVertical: 16,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
  },
  activeTab: {
    backgroundColor: '#e0f2fe',
  },
  tabText: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 6,
    fontWeight: '500',
  },
  activeTabText: {
    color: '#0ea5e9',
  },
  contentContainer: {
    flex: 1,
  },
  tabContent: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  weatherLocation: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  weatherTemp: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#0ea5e9',
  },
  weatherConditions: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 16,
  },
  weatherDetails: {
    gap: 12,
    marginBottom: 16,
  },
  weatherDetail: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  weatherDetailText: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 8,
  },
  recommendationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    padding: 12,
    borderRadius: 8,
  },
  recommendationText: {
    fontSize: 14,
    color: '#166534',
    marginLeft: 8,
    flex: 1,
  },
  forecastSection: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  forecastList: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  forecastItem: {
    alignItems: 'center',
  },
  forecastTime: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  forecastTemp: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  forecastWind: {
    fontSize: 12,
    color: '#6b7280',
  },
  serviceCard: {
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
  serviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    flex: 1,
  },
  fuelPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0ea5e9',
  },
  serviceDistance: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  serviceTariff: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  serviceContact: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 12,
  },
  availabilityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  availabilityText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '600',
  },
  servicesList: {
    marginBottom: 12,
  },
  servicesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 6,
  },
  servicesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  serviceTag: {
    backgroundColor: '#e0f2fe',
    color: '#0ea5e9',
    fontSize: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 4,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#e0f2fe',
    borderRadius: 6,
  },
  actionButtonText: {
    fontSize: 12,
    color: '#0ea5e9',
    marginLeft: 4,
    fontWeight: '500',
  },
  emergencyAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef2f2',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  emergencyAlertText: {
    fontSize: 14,
    color: '#991b1b',
    marginLeft: 12,
    flex: 1,
    fontWeight: '500',
  },
  emergencyCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  emergencyCardPriority: {
    borderLeftWidth: 4,
    borderLeftColor: '#ef4444',
  },
  emergencyInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  emergencyDetails: {
    marginLeft: 12,
  },
  emergencyName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  emergencyNumber: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  safetyTips: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  safetyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
  },
  tipsList: {
    gap: 8,
  },
  tipItem: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
});

export default ServiziScreen;