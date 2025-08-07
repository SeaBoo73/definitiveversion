import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
} from 'react-native';
import Icon from '@expo/vector-icons/MaterialIcons';

const { width } = Dimensions.get('window');

const EsperienzeScreen = () => {
  const [selectedCategory, setSelectedCategory] = useState('tutti');

  const categories = [
    { id: 'tutti', name: 'Tutti', icon: 'explore' },
    { id: 'tour', name: 'Tour', icon: 'tour' },
    { id: 'charter', name: 'Charter', icon: 'sailing' },
    { id: 'gourmet', name: 'Gourmet', icon: 'restaurant' },
    { id: 'sunset', name: 'Sunset', icon: 'wb-sunny' },
  ];

  const esperienze = [
    {
      id: 1,
      title: 'Tour delle Isole Pontine',
      subtitle: 'Ponza, Palmarola, Zannone',
      price: '€450',
      duration: '8 ore',
      category: 'tour',
      rating: 4.9,
      participants: '2-12 persone',
      image: 'https://seaboorentalboat.com/api/images/WhatsApp%20Image%202025-06-12%20at%2018.53.09_1752873223407.jpeg',
      highlights: ['Skipper incluso', 'Pranzo a bordo', 'Snorkeling'],
      description: 'Scopri le meraviglie delle Isole Pontine con questo tour completo.',
    },
    {
      id: 2,
      title: 'Charter di Lusso Amalfi',
      subtitle: 'Costiera Amalfitana VIP',
      price: '€1200',
      duration: '6 ore',
      category: 'charter',
      rating: 4.8,
      participants: '2-8 persone',
      image: 'https://seaboorentalboat.com/api/images/gulet-romance-3-cabin-luxury-gulet-for-charter-3-1024x683_1752919948842.jpg',
      highlights: ['Yacht di lusso', 'Capitano professionale', 'Open bar'],
      description: 'Esperienza esclusiva lungo la Costiera Amalfitana.',
    },
    {
      id: 3,
      title: 'Aperitivo al Tramonto',
      subtitle: 'Gaeta e Montagna Spaccata',
      price: '€180',
      duration: '3 ore',
      category: 'sunset',
      rating: 4.7,
      participants: '2-6 persone',
      image: 'https://seaboorentalboat.com/api/images/barca%20a%20vela%20ludovica_1752876195081.jpg',
      highlights: ['Aperitivo incluso', 'Musica ambient', 'Fotografo'],
      description: 'Tramonto magico con aperitivo gourmet a bordo.',
    },
    {
      id: 4,
      title: 'Esperienza Gourmet Marina',
      subtitle: 'Degustazione prodotti locali',
      price: '€320',
      duration: '4 ore',
      category: 'gourmet',
      rating: 4.6,
      participants: '2-10 persone',
      image: 'https://seaboorentalboat.com/api/images/catamarano%20ludovica_1752876117442.jpg',
      highlights: ['Chef a bordo', 'Vini DOC', 'Pescato fresco'],
      description: 'Viaggio culinario tra i sapori autentici del mare.',
    },
  ];

  const filteredEsperienze = selectedCategory === 'tutti' 
    ? esperienze 
    : esperienze.filter(exp => exp.category === selectedCategory);

  const renderEsperienzaCard = (esperienza) => (
    <TouchableOpacity key={esperienza.id} style={styles.esperienzaCard}>
      <Image source={{ uri: esperienza.image }} style={styles.esperienzaImage} />
      
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <View style={styles.cardInfo}>
            <Text style={styles.esperienzaTitle}>{esperienza.title}</Text>
            <Text style={styles.esperienzaSubtitle}>{esperienza.subtitle}</Text>
          </View>
          <View style={styles.priceContainer}>
            <Text style={styles.priceText}>{esperienza.price}</Text>
            <Text style={styles.priceUnit}>a persona</Text>
          </View>
        </View>

        <View style={styles.cardMeta}>
          <View style={styles.metaItem}>
            <Icon name="schedule" size={16} color="#6b7280" />
            <Text style={styles.metaText}>{esperienza.duration}</Text>
          </View>
          <View style={styles.metaItem}>
            <Icon name="people" size={16} color="#6b7280" />
            <Text style={styles.metaText}>{esperienza.participants}</Text>
          </View>
          <View style={styles.metaItem}>
            <Icon name="star" size={16} color="#FFD700" />
            <Text style={styles.metaText}>{esperienza.rating}</Text>
          </View>
        </View>

        <Text style={styles.description}>{esperienza.description}</Text>

        <View style={styles.highlightsContainer}>
          {esperienza.highlights.map((highlight, index) => (
            <View key={index} style={styles.highlightTag}>
              <Text style={styles.highlightText}>✓ {highlight}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.bookButton}>
          <Text style={styles.bookButtonText}>Prenota Esperienza</Text>
          <Icon name="arrow-forward" size={18} color="white" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Esperienze Uniche</Text>
        <Text style={styles.headerSubtitle}>
          Vivi il mare con tour guidati e charter esclusivi
        </Text>
      </View>

      {/* Categories */}
      <View style={styles.categoriesContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryChip,
                selectedCategory === category.id && styles.categoryChipActive
              ]}
              onPress={() => setSelectedCategory(category.id)}
            >
              <Icon 
                name={category.icon} 
                size={20} 
                color={selectedCategory === category.id ? '#fff' : '#0ea5e9'} 
              />
              <Text style={[
                styles.categoryChipText,
                selectedCategory === category.id && styles.categoryChipTextActive
              ]}>
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Results */}
      <View style={styles.resultsContainer}>
        <Text style={styles.resultsText}>
          {filteredEsperienze.length} esperienze disponibili
        </Text>
        
        {filteredEsperienze.map(renderEsperienzaCard)}
      </View>

      {/* Features Section */}
      <View style={styles.featuresSection}>
        <Text style={styles.featuresTitle}>Perché scegliere le nostre esperienze?</Text>
        
        <View style={styles.featuresList}>
          <View style={styles.featureItem}>
            <Icon name="verified-user" size={24} color="#059669" />
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Sicurezza Garantita</Text>
              <Text style={styles.featureDescription}>
                Skipper certificati e equipaggiamenti di sicurezza completi
              </Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <Icon name="stars" size={24} color="#f59e0b" />
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Esperienza Premium</Text>
              <Text style={styles.featureDescription}>
                Servizi di alta qualità e attenzione ai dettagli
              </Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <Icon name="support-agent" size={24} color="#0ea5e9" />
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Assistenza H24</Text>
              <Text style={styles.featureDescription}>
                Supporto dedicato prima, durante e dopo l'esperienza
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
    padding: 20,
    paddingTop: 0,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#e2e8f0',
    lineHeight: 22,
  },
  categoriesContainer: {
    backgroundColor: 'white',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 4,
    gap: 6,
  },
  categoryChipActive: {
    backgroundColor: '#0ea5e9',
    borderColor: '#0ea5e9',
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0ea5e9',
  },
  categoryChipTextActive: {
    color: 'white',
  },
  resultsContainer: {
    padding: 16,
  },
  resultsText: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 16,
    fontWeight: '500',
  },
  esperienzaCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 20,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  esperienzaImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  cardContent: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  cardInfo: {
    flex: 1,
    marginRight: 12,
  },
  esperienzaTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  esperienzaSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  priceText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0ea5e9',
  },
  priceUnit: {
    fontSize: 12,
    color: '#6b7280',
  },
  cardMeta: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 13,
    color: '#6b7280',
  },
  description: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
    marginBottom: 12,
  },
  highlightsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  highlightTag: {
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  highlightText: {
    fontSize: 12,
    color: '#059669',
    fontWeight: '500',
  },
  bookButton: {
    backgroundColor: '#0ea5e9',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 10,
    gap: 8,
  },
  bookButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  featuresSection: {
    backgroundColor: 'white',
    padding: 20,
    marginTop: 8,
    marginBottom: 20,
  },
  featuresTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 20,
    textAlign: 'center',
  },
  featuresList: {
    gap: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
});

export default EsperienzeScreen;