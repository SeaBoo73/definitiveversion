import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const OrmeggioScreen = () => {
  const [selectedType, setSelectedType] = useState('all');

  const mooringTypes = [
    { id: 'all', name: 'Tutti', icon: '⚓' },
    { id: 'pontile', name: 'Pontile', icon: '🏗️' },
    { id: 'boa', name: 'Boa', icon: '🔵' },
    { id: 'ancora', name: 'Ancora', icon: '⚓' },
  ];

  const moorings = [
    {
      id: 1,
      name: 'Porto di Civitavecchia - Pontile Premium',
      location: 'Civitavecchia, Roma',
      type: 'pontile',
      price: '€45',
      priceWeekly: '€280',
      maxLength: '25m',
      maxBeam: '6.5m',
      depth: '5.0m',
      services: ['Sicurezza 24h', 'Carburante', 'Acqua', 'Elettricità', 'WiFi', 'Parcheggio', 'Ristorante', 'Docce'],
      rating: 4.9,
      reviews: 87,
      available: true,
      featured: true,
      image: 'https://seagorentalboat.com/api/images/WhatsApp%20Image%202025-07-21%20at%2016.20.47_1753107683462.jpeg',
      contact: { name: 'Marina Premium Civitavecchia', phone: '+39 0766 123456', vhf: 'Canale 09' },
      description: 'Pontile esclusivo per yacht e imbarcazioni di lusso. Servizi premium inclusi.'
    },
    {
      id: 2,
      name: 'Marina di Gaeta - Boa Campo Boe',
      location: 'Gaeta, Baia del Sole',
      type: 'boa',
      price: '€22',
      priceWeekly: '€128',
      maxLength: '18m',
      maxBeam: '5.0m',
      depth: '8.0m',
      services: ['Trasporto a terra', 'Assistenza ormeggio'],
      rating: 4.2,
      reviews: 156,
      available: true,
      featured: false,
      image: 'https://seagorentalboat.com/api/images/WhatsApp%20Image%202025-06-12%20at%2018.53.09_1752873223407.jpeg',
      contact: { name: 'Campo Boe Gaeta', phone: '+39 0771 987654', vhf: 'Canale 12' },
      description: 'Boa sicura nel campo boe di Gaeta. Ideale per soste brevi e medie.'
    },
    {
      id: 3,
      name: 'Porto di Anzio - Pontile Nord',
      location: 'Anzio, Roma',
      type: 'pontile',
      price: '€35',
      priceWeekly: '€210',
      maxLength: '16m',
      maxBeam: '4.8m',
      depth: '3.5m',
      services: ['Elettricità', 'Acqua', 'WiFi', 'Parcheggio'],
      rating: 4.5,
      reviews: 73,
      available: true,
      featured: false,
      image: 'https://seagorentalboat.com/api/images/WhatsApp%20Image%202025-07-21%20at%2012.54.16_1753095763473.jpeg',
      contact: { name: 'Porto di Anzio', phone: '+39 06 9876543', vhf: 'Canale 16' },
      description: 'Ormeggio comodo nel centro di Anzio con facile accesso ai servizi cittadini.'
    },
    {
      id: 4,
      name: 'Marina di Formia - Pontile Sud',
      location: 'Formia, Latina',
      type: 'pontile',
      price: '€38',
      priceWeekly: '€228',
      maxLength: '20m',
      maxBeam: '5.5m',
      depth: '4.0m',
      services: ['Elettricità', 'Acqua', 'WiFi', 'Bar/Ristorante', 'Carburante', 'Docce'],
      rating: 4.7,
      reviews: 92,
      available: true,
      featured: true,
      image: 'https://seagorentalboat.com/api/images/WhatsApp%20Image%202025-06-15%20at%2023.36.59_1752875633742.jpeg',
      contact: { name: 'Marina di Formia', phone: '+39 0771 456789', vhf: 'Canale 08' },
      description: 'Marina moderna con tutti i servizi nel cuore del Golfo di Gaeta.'
    },
    {
      id: 5,
      name: 'Porto di Terracina - Boa Mare Aperto',
      location: 'Terracina, Latina',
      type: 'boa',
      price: '€18',
      priceWeekly: '€105',
      maxLength: '14m',
      maxBeam: '4.0m',
      depth: '6.0m',
      services: ['Assistenza ormeggio', 'Trasporto a terra su richiesta'],
      rating: 4.0,
      reviews: 48,
      available: false,
      featured: false,
      image: 'https://seagorentalboat.com/api/images/WhatsApp%20Image%202025-06-15%20at%2023.37.00%20(1)_1752875876213.jpeg',
      contact: { name: 'Servizi Marittimi Terracina', phone: '+39 0773 123789', vhf: 'Canale 14' },
      description: 'Boa economica per soste brevi davanti al litorale di Terracina.'
    },
    {
      id: 6,
      name: 'Marina di Ponza - Ormeggio Isola',
      location: 'Ponza, Latina',
      type: 'pontile',
      price: '€65',
      priceWeekly: '€390',
      maxLength: '22m',
      maxBeam: '6.0m',
      depth: '5.5m',
      services: ['Elettricità', 'Acqua', 'Carburante', 'WiFi', 'Ristorante', 'Bar', 'Servizio taxi boat'],
      rating: 4.8,
      reviews: 134,
      available: true,
      featured: true,
      image: 'https://seagorentalboat.com/api/images/image_1753208188327.png',
      contact: { name: 'Marina di Ponza', phone: '+39 0771 987321', vhf: 'Canale 06' },
      description: 'Ormeggio esclusivo sull\'isola di Ponza con vista mozzafiato e servizi di lusso.'
    }
  ];

  const filteredMoorings = moorings.filter(mooring => 
    selectedType === 'all' || mooring.type === selectedType
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Servizi Ormeggio</Text>
        <Text style={styles.headerSubtitle}>
          Trova il posto sicuro per la tua barca
        </Text>
      </View>

      {/* Quick Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>6</Text>
          <Text style={styles.statLabel}>Porti Partner</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>150+</Text>
          <Text style={styles.statLabel}>Posti Disponibili</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>24/7</Text>
          <Text style={styles.statLabel}>Assistenza</Text>
        </View>
      </View>

      {/* Type Filter */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.filterContainer}
      >
        {mooringTypes.map((type) => (
          <TouchableOpacity
            key={type.id}
            style={[
              styles.filterButton,
              selectedType === type.id && styles.filterButtonActive
            ]}
            onPress={() => setSelectedType(type.id)}
          >
            <Text style={styles.filterIcon}>{type.icon}</Text>
            <Text style={[
              styles.filterText,
              selectedType === type.id && styles.filterTextActive
            ]}>
              {type.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Moorings List */}
      <View style={styles.mooringsSection}>
        <Text style={styles.sectionTitle}>
          {filteredMoorings.length} Ormeggi Disponibili
        </Text>

        {filteredMoorings.map((mooring) => (
          <View key={mooring.id} style={styles.mooringCard}>
            <Image source={{ uri: mooring.image }} style={styles.mooringImage} />
            
            <View style={styles.mooringInfo}>
              <View style={styles.mooringHeader}>
                <Text style={styles.mooringName}>{mooring.name}</Text>
                <View style={styles.availabilityBadge}>
                  <View style={[
                    styles.availabilityDot,
                    { backgroundColor: mooring.available ? '#10b981' : '#ef4444' }
                  ]} />
                  <Text style={[
                    styles.availabilityText,
                    { color: mooring.available ? '#10b981' : '#ef4444' }
                  ]}>
                    {mooring.available ? 'Disponibile' : 'Occupato'}
                  </Text>
                </View>
              </View>

              <Text style={styles.mooringLocation}>📍 {mooring.location}</Text>
              
              <View style={styles.mooringDetails}>
                <Text style={styles.mooringType}>
                  🏷️ {mooring.type.charAt(0).toUpperCase() + mooring.type.slice(1)}
                </Text>
                <Text style={styles.mooringLength}>📏 Max {mooring.maxLength}</Text>
              </View>

              <View style={styles.servicesContainer}>
                <Text style={styles.servicesTitle}>Servizi inclusi:</Text>
                <View style={styles.servicesList}>
                  {mooring.services.map((service, index) => (
                    <Text key={index} style={styles.serviceItem}>• {service}</Text>
                  ))}
                </View>
              </View>

              <View style={styles.mooringFooter}>
                <View style={styles.priceSection}>
                  <Text style={styles.price}>{mooring.price}</Text>
                  <Text style={styles.priceLabel}>/notte</Text>
                </View>
                
                <View style={styles.ratingSection}>
                  <Icon name="star" size={16} color="#FFD700" />
                  <Text style={styles.ratingText}>{mooring.rating}</Text>
                </View>

                <TouchableOpacity 
                  style={[
                    styles.bookButton,
                    !mooring.available && styles.bookButtonDisabled
                  ]}
                  disabled={!mooring.available}
                >
                  <Text style={[
                    styles.bookButtonText,
                    !mooring.available && styles.bookButtonTextDisabled
                  ]}>
                    {mooring.available ? 'Prenota' : 'Non disponibile'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </View>

      {/* Info Section */}
      <View style={styles.infoSection}>
        <Text style={styles.infoTitle}>Perché scegliere SeaGO Ormeggio?</Text>
        
        <View style={styles.benefitsList}>
          <View style={styles.benefitItem}>
            <Icon name="security" size={24} color="#0ea5e9" />
            <View style={styles.benefitContent}>
              <Text style={styles.benefitTitle}>Sicurezza Garantita</Text>
              <Text style={styles.benefitDescription}>
                Sorveglianza 24/7 e assicurazione inclusa
              </Text>
            </View>
          </View>

          <View style={styles.benefitItem}>
            <Icon name="support-agent" size={24} color="#10b981" />
            <View style={styles.benefitContent}>
              <Text style={styles.benefitTitle}>Assistenza Dedicata</Text>
              <Text style={styles.benefitDescription}>
                Staff qualificato sempre disponibile
              </Text>
            </View>
          </View>

          <View style={styles.benefitItem}>
            <Icon name="discount" size={24} color="#f59e0b" />
            <View style={styles.benefitContent}>
              <Text style={styles.benefitTitle}>Tariffe Vantaggiose</Text>
              <Text style={styles.benefitDescription}>
                20% di sconto per utenti SeaGO
              </Text>
            </View>
          </View>
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
  filterContainer: {
    backgroundColor: 'white',
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginTop: 8,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
  },
  filterButtonActive: {
    backgroundColor: '#0ea5e9',
  },
  filterIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  filterText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  filterTextActive: {
    color: 'white',
  },
  mooringsSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  mooringCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  mooringImage: {
    width: '100%',
    height: 160,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  mooringInfo: {
    padding: 16,
  },
  mooringHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  mooringName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    flex: 1,
    marginRight: 12,
  },
  availabilityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  availabilityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  availabilityText: {
    fontSize: 12,
    fontWeight: '600',
  },
  mooringLocation: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  mooringDetails: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  mooringType: {
    fontSize: 14,
    color: '#6b7280',
    marginRight: 16,
  },
  mooringLength: {
    fontSize: 14,
    color: '#6b7280',
  },
  servicesContainer: {
    marginBottom: 16,
  },
  servicesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 6,
  },
  servicesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  serviceItem: {
    fontSize: 12,
    color: '#6b7280',
    marginRight: 12,
    marginBottom: 2,
  },
  mooringFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceSection: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0ea5e9',
  },
  priceLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginLeft: 2,
  },
  ratingSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 4,
  },
  bookButton: {
    backgroundColor: '#0ea5e9',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  bookButtonDisabled: {
    backgroundColor: '#e5e7eb',
  },
  bookButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  bookButtonTextDisabled: {
    color: '#9ca3af',
  },
  infoSection: {
    backgroundColor: 'white',
    margin: 20,
    marginTop: 0,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  benefitsList: {
    gap: 16,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  benefitContent: {
    flex: 1,
    marginLeft: 12,
  },
  benefitTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  benefitDescription: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
});

export default OrmeggioScreen;