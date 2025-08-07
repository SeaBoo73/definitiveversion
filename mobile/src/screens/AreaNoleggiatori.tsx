import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';

const ownerFeatures = [
  {
    id: 1,
    title: 'Aggiungi le tue barche',
    description: 'Carica foto, descrizioni e disponibilità',
    icon: 'boat',
    color: '#0ea5e9',
  },
  {
    id: 2,
    title: 'Gestisci prenotazioni',
    description: 'Approva richieste e comunica con i clienti',
    icon: 'calendar',
    color: '#10b981',
  },
  {
    id: 3,
    title: 'Monitora i guadagni',
    description: 'Dashboard completa con statistiche dettagliate',
    icon: 'trending-up',
    color: '#f59e0b',
  },
  {
    id: 4,
    title: 'Supporto dedicato',
    description: 'Assistenza personalizzata per i proprietari',
    icon: 'headset',
    color: '#8b5cf6',
  },
];

const benefits = [
  'Commissione competitiva del 15%',
  'Pagamenti sicuri garantiti',
  'Assicurazione inclusa per ogni noleggio',
  'Promozione su tutto il territorio italiano',
  'App mobile dedicata per gestire tutto',
];

export default function AreaNoleggiatori({ navigation }: any) {
  const handleGetStarted = () => {
    Alert.alert(
      'Diventa Noleggiatore',
      'Vuoi iniziare a guadagnare con le tue barche su SeaBoo?',
      [
        { text: 'Annulla', style: 'cancel' },
        { 
          text: 'Registrati', 
          onPress: () => {
            // Navigate to owner registration or web portal
            Alert.alert('Registrazione', 'Ti reindirizzeremo al portale web per completare la registrazione come noleggiatore.');
          }
        },
      ]
    );
  };

  const handleContactSupport = () => {
    Alert.alert(
      'Contatta il Team',
      'Come preferisci contattarci?',
      [
        { text: 'Annulla', style: 'cancel' },
        { text: 'Email', onPress: () => console.log('Email support') },
        { text: 'WhatsApp', onPress: () => console.log('WhatsApp support') },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Area Noleggiatori</Text>
          <Text style={styles.headerSubtitle}>Trasforma le tue barche in un business</Text>
        </View>

        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.heroIcon}>
            <Icon name="business" size={48} color="#0ea5e9" />
          </View>
          <Text style={styles.heroTitle}>Guadagna con SeaBoo</Text>
          <Text style={styles.heroText}>
            Unisciti alla community di proprietari che hanno scelto SeaBoo per noleggiare le loro imbarcazioni
          </Text>
          <TouchableOpacity style={styles.ctaButton} onPress={handleGetStarted}>
            <Text style={styles.ctaButtonText}>Inizia Subito</Text>
            <Icon name="arrow-forward" size={20} color="white" />
          </TouchableOpacity>
        </View>

        {/* Features */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Come Funziona</Text>
          <View style={styles.featuresContainer}>
            {ownerFeatures.map((feature) => (
              <View key={feature.id} style={styles.featureCard}>
                <View style={[styles.featureIcon, { backgroundColor: `${feature.color}15` }]}>
                  <Icon name={feature.icon} size={24} color={feature.color} />
                </View>
                <View style={styles.featureContent}>
                  <Text style={styles.featureTitle}>{feature.title}</Text>
                  <Text style={styles.featureDescription}>{feature.description}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Benefits */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Vantaggi Esclusivi</Text>
          <View style={styles.benefitsContainer}>
            {benefits.map((benefit, index) => (
              <View key={index} style={styles.benefitItem}>
                <Icon name="checkmark-circle" size={20} color="#10b981" />
                <Text style={styles.benefitText}>{benefit}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>I Nostri Numeri</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>500+</Text>
              <Text style={styles.statLabel}>Proprietari</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>2000+</Text>
              <Text style={styles.statLabel}>Barche</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>€2M+</Text>
              <Text style={styles.statLabel}>Fatturato</Text>
            </View>
          </View>
        </View>

        {/* Contact Section */}
        <View style={styles.contactSection}>
          <Text style={styles.sectionTitle}>Hai Domande?</Text>
          <Text style={styles.contactText}>
            Il nostro team è sempre disponibile per aiutarti
          </Text>
          <TouchableOpacity style={styles.contactButton} onPress={handleContactSupport}>
            <Icon name="chatbubbles" size={20} color="#0ea5e9" />
            <Text style={styles.contactButtonText}>Contatta il Team</Text>
          </TouchableOpacity>
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
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
  heroSection: {
    backgroundColor: 'white',
    margin: 20,
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  heroIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#eff6ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  heroText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0ea5e9',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  ctaButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 8,
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
  featuresContainer: {
    marginHorizontal: 20,
  },
  featureCard: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: '#6b7280',
  },
  benefitsContainer: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  benefitText: {
    fontSize: 16,
    color: '#374151',
    marginLeft: 12,
  },
  statsSection: {
    marginBottom: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: 'white',
    flex: 1,
    padding: 20,
    marginHorizontal: 4,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0ea5e9',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  contactSection: {
    backgroundColor: 'white',
    margin: 20,
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  contactText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 20,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eff6ff',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  contactButtonText: {
    color: '#0ea5e9',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});