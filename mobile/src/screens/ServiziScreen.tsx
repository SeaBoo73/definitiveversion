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

  const weatherData = {
    location: 'Roma/Fiumicino',
    temperature: '24°C',
    conditions: 'Soleggiato',
    windSpeed: '12 km/h',
    waveHeight: '0.5m',
    visibility: '15 km',
    recommendations: 'Condizioni ideali per la navigazione'
  };

  const fuelPrices = [
    { port: 'Marina di Civitavecchia', price: '€1.85/L', distance: '0 km' },
    { port: 'Porto di Gaeta', price: '€1.82/L', distance: '120 km' },
    { port: 'Marina di Anzio', price: '€1.88/L', distance: '65 km' },
    { port: 'Porto di Formia', price: '€1.84/L', distance: '140 km' },
  ];

  const portServices = [
    {
      name: 'Marina di Civitavecchia',
      services: ['Ormeggio', 'Rifornimento', 'Meccanico'],
      contact: 'VHF Ch 12',
      tariff: '€45/m',
      availability: 'Disponibile'
    },
    {
      name: 'Porto di Gaeta',
      services: ['Ormeggio', 'Rifornimento', 'Bar'],
      contact: 'VHF Ch 16',
      tariff: '€38/m',
      availability: 'Limitata'
    },
    {
      name: 'Marina di Formia',
      services: ['Ormeggio', 'Meccanico', 'Ristorante'],
      contact: 'VHF Ch 09',
      tariff: '€42/m',
      availability: 'Disponibile'
    },
  ];

  const emergencyContacts = [
    { name: 'Guardia Costiera', number: '1530', type: 'emergency' },
    { name: 'Emergenza Sanitaria', number: '118', type: 'medical' },
    { name: 'Capitaneria Roma', number: '+39 06 123 4567', type: 'port' },
    { name: 'Assistenza SeaGO', number: '+39 06 987 6543', type: 'support' },
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