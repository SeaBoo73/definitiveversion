import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import Icon from '@expo/vector-icons/MaterialIcons';

const ServiziScreen = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTab, setSelectedTab] = useState('meteo');

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  };

  const meteoData = {
    location: 'Roma/Fiumicino',
    temperature: '23°C',
    conditions: 'Soleggiato',
    windSpeed: '8 km/h',
    windDirection: 'NE',
    waveHeight: '0.5m',
    visibility: '10+ km',
    forecast: [
      { day: 'Oggi', temp: '23°C', icon: 'wb-sunny', conditions: 'Soleggiato' },
      { day: 'Domani', temp: '25°C', icon: 'wb-sunny', conditions: 'Sereno' },
      { day: 'Dopodomani', temp: '22°C', icon: 'cloud', conditions: 'Nuvoloso' },
    ]
  };

  const emergencyContacts = [
    { name: 'Guardia Costiera', number: '1530', icon: 'local-police', urgent: true },
    { name: 'Emergenza Medica', number: '118', icon: 'local-hospital', urgent: true },
    { name: 'Carabinieri', number: '112', icon: 'security', urgent: true },
    { name: 'Capitaneria Roma', number: '+39 06 5910251', icon: 'phone', urgent: false },
  ];

  const fuelPrices = [
    { station: 'Marina Civitavecchia', price: '€1.85/L', distance: '2.3 km', type: 'Benzina' },
    { station: 'Porto Gaeta', price: '€1.78/L', distance: '5.1 km', type: 'Gasolio' },
    { station: 'Marina Anzio', price: '€1.82/L', distance: '3.7 km', type: 'Benzina' },
  ];

  const renderMeteoTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.currentWeather}>
        <View style={styles.weatherHeader}>
          <View>
            <Text style={styles.weatherLocation}>{meteoData.location}</Text>
            <Text style={styles.weatherTemp}>{meteoData.temperature}</Text>
            <Text style={styles.weatherConditions}>{meteoData.conditions}</Text>
          </View>
          <Icon name="wb-sunny" size={48} color="#f59e0b" />
        </View>
        
        <View style={styles.weatherDetails}>
          <View style={styles.weatherDetailItem}>
            <Icon name="air" size={20} color="#6b7280" />
            <Text style={styles.weatherDetailText}>Vento: {meteoData.windSpeed} {meteoData.windDirection}</Text>
          </View>
          <View style={styles.weatherDetailItem}>
            <Icon name="waves" size={20} color="#0ea5e9" />
            <Text style={styles.weatherDetailText}>Onde: {meteoData.waveHeight}</Text>
          </View>
          <View style={styles.weatherDetailItem}>
            <Icon name="visibility" size={20} color="#6b7280" />
            <Text style={styles.weatherDetailText}>Visibilità: {meteoData.visibility}</Text>
          </View>
        </View>
      </View>

      <View style={styles.forecast}>
        <Text style={styles.sectionTitle}>Previsioni 3 giorni</Text>
        {meteoData.forecast.map((day, index) => (
          <View key={index} style={styles.forecastItem}>
            <Text style={styles.forecastDay}>{day.day}</Text>
            <Icon name={day.icon} size={24} color="#f59e0b" />
            <Text style={styles.forecastTemp}>{day.temp}</Text>
            <Text style={styles.forecastConditions}>{day.conditions}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  const renderEmergencyTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.emergencyHeader}>
        <Icon name="warning" size={24} color="#ef4444" />
        <Text style={styles.emergencyTitle}>Contatti di Emergenza</Text>
      </View>
      
      {emergencyContacts.map((contact, index) => (
        <TouchableOpacity 
          key={index} 
          style={[styles.emergencyItem, contact.urgent && styles.emergencyUrgent]}
        >
          <Icon name={contact.icon} size={24} color={contact.urgent ? "#ef4444" : "#6b7280"} />
          <View style={styles.emergencyInfo}>
            <Text style={styles.emergencyName}>{contact.name}</Text>
            <Text style={styles.emergencyNumber}>{contact.number}</Text>
          </View>
          <Icon name="phone" size={20} color="#0ea5e9" />
        </TouchableOpacity>
      ))}

      <View style={styles.emergencyTips}>
        <Text style={styles.sectionTitle}>In caso di emergenza:</Text>
        <Text style={styles.tipText}>• Mantieni la calma e valuta la situazione</Text>
        <Text style={styles.tipText}>• Comunica la tua posizione GPS</Text>
        <Text style={styles.tipText}>• Descrivi chiaramente il problema</Text>
        <Text style={styles.tipText}>• Segui le istruzioni degli operatori</Text>
      </View>
    </View>
  );

  const renderCarburanteTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Prezzi Carburante Marino</Text>
      
      {fuelPrices.map((fuel, index) => (
        <View key={index} style={styles.fuelItem}>
          <View style={styles.fuelInfo}>
            <Text style={styles.fuelStation}>{fuel.station}</Text>
            <Text style={styles.fuelDistance}>📍 {fuel.distance}</Text>
            <Text style={styles.fuelType}>{fuel.type}</Text>
          </View>
          <View style={styles.fuelPrice}>
            <Text style={styles.fuelPriceText}>{fuel.price}</Text>
          </View>
        </View>
      ))}

      <View style={styles.fuelTips}>
        <Text style={styles.sectionTitle}>Consigli sul Carburante</Text>
        <Text style={styles.tipText}>• Controlla i prezzi prima di partire</Text>
        <Text style={styles.tipText}>• Considera il consumo per la distanza</Text>
        <Text style={styles.tipText}>• Tieni sempre una riserva del 25%</Text>
        <Text style={styles.tipText}>• Verifica la compatibilità del carburante</Text>
      </View>
    </View>
  );

  const tabs = [
    { id: 'meteo', name: 'Meteo', icon: 'wb-sunny' },
    { id: 'emergenza', name: 'Emergenza', icon: 'emergency' },
    { id: 'carburante', name: 'Carburante', icon: 'local-gas-station' },
  ];

  return (
    <View style={styles.container}>
      {/* Tab Navigation */}
      <View style={styles.tabNavigation}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[
              styles.tabButton,
              selectedTab === tab.id && styles.tabButtonActive
            ]}
            onPress={() => setSelectedTab(tab.id)}
          >
            <Icon 
              name={tab.icon} 
              size={20} 
              color={selectedTab === tab.id ? '#0ea5e9' : '#6b7280'} 
            />
            <Text style={[
              styles.tabButtonText,
              selectedTab === tab.id && styles.tabButtonTextActive
            ]}>
              {tab.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Tab Content */}
      <ScrollView 
        style={styles.scrollView}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
      >
        {selectedTab === 'meteo' && renderMeteoTab()}
        {selectedTab === 'emergenza' && renderEmergencyTab()}
        {selectedTab === 'carburante' && renderCarburanteTab()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  tabNavigation: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 6,
  },
  tabButtonActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#0ea5e9',
  },
  tabButtonText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  tabButtonTextActive: {
    color: '#0ea5e9',
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  tabContent: {
    padding: 16,
  },
  currentWeather: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  weatherHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  weatherLocation: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 4,
  },
  weatherTemp: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  weatherConditions: {
    fontSize: 16,
    color: '#0ea5e9',
  },
  weatherDetails: {
    gap: 12,
  },
  weatherDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  weatherDetailText: {
    fontSize: 14,
    color: '#4b5563',
  },
  forecast: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  forecastItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  forecastDay: {
    width: 80,
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
  },
  forecastTemp: {
    width: 60,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0ea5e9',
    marginLeft: 12,
  },
  forecastConditions: {
    flex: 1,
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 12,
  },
  emergencyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
    backgroundColor: '#fef2f2',
    padding: 16,
    borderRadius: 12,
  },
  emergencyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ef4444',
  },
  emergencyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    gap: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  emergencyUrgent: {
    borderLeftWidth: 4,
    borderLeftColor: '#ef4444',
  },
  emergencyInfo: {
    flex: 1,
  },
  emergencyName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 2,
  },
  emergencyNumber: {
    fontSize: 14,
    color: '#0ea5e9',
    fontWeight: '600',
  },
  emergencyTips: {
    backgroundColor: '#f0f9ff',
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
  },
  tipText: {
    fontSize: 14,
    color: '#1e40af',
    marginBottom: 8,
    lineHeight: 20,
  },
  fuelItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  fuelInfo: {
    flex: 1,
  },
  fuelStation: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 2,
  },
  fuelDistance: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  fuelType: {
    fontSize: 12,
    color: '#059669',
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  fuelPrice: {
    alignItems: 'flex-end',
  },
  fuelPriceText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0ea5e9',
  },
  fuelTips: {
    backgroundColor: '#fffbeb',
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
  },
});

export default ServiziScreen;