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

const EsperienzeScreen = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'Tutte', icon: '🌊' },
    { id: 'tour', name: 'Tour', icon: '🗺️' },
    { id: 'charter', name: 'Charter', icon: '🚢' },
    { id: 'eventi', name: 'Eventi', icon: '🎉' },
    { id: 'corso', name: 'Corsi', icon: '🎓' },
  ];

  const experiences = [
    {
      id: 1,
      title: 'Tour delle Isole Pontine',
      location: 'Ponza, Palmarola, Ventotene',
      duration: '8 ore',
      price: '€120',
      category: 'tour',
      rating: 4.9,
      participants: 'Max 12 persone',
      includes: ['Pranzo a bordo', 'Attrezzatura snorkeling', 'Guida esperta'],
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop&crop=center'
    },
    {
      id: 2,
      title: 'Charter Lusso con Skipper',
      location: 'Costa del Lazio',
      duration: 'Giornata intera',
      price: '€890',
      category: 'charter',
      rating: 4.8,
      participants: 'Max 8 persone',
      includes: ['Skipper professionale', 'Aperitivo', 'Carburante'],
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=300&h=200&fit=crop&crop=center'
    },
    {
      id: 3,
      title: 'Corso Patente Nautica',
      location: 'Civitavecchia',
      duration: '5 giorni',
      price: '€450',
      category: 'corso',
      rating: 4.7,
      participants: 'Max 6 persone',
      includes: ['Teoria', 'Pratica in mare', 'Materiale didattico'],
      image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=300&h=200&fit=crop&crop=center'
    },
    {
      id: 4,
      title: 'Festa di Compleanno in Barca',
      location: 'Gaeta',
      duration: '4 ore',
      price: '€350',
      category: 'eventi',
      rating: 4.9,
      participants: 'Max 15 persone',
      includes: ['Decorazioni', 'Catering', 'Musica'],
      image: 'https://images.unsplash.com/photo-1569263979104-865ab7cd8b25?w=300&h=200&fit=crop&crop=center'
    },
    {
      id: 5,
      title: 'Escursione Tramonto',
      location: 'Sperlonga',
      duration: '3 ore',
      price: '€85',
      category: 'tour',
      rating: 4.8,
      participants: 'Max 10 persone',
      includes: ['Aperitivo al tramonto', 'Foto ricordo'],
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop&crop=center'
    },
    {
      id: 6,
      title: 'Weekend Charter Privato',
      location: 'Isola d\'Elba',
      duration: '2 giorni',
      price: '€1,200',
      category: 'charter',
      rating: 4.9,
      participants: 'Max 6 persone',
      includes: ['Cabine private', 'Tutti i pasti', 'Skipper'],
      image: 'https://images.unsplash.com/photo-1540946485063-a40da27545f8?w=300&h=200&fit=crop&crop=center'
    },
  ];

  const filteredExperiences = experiences.filter(exp => 
    selectedCategory === 'all' || exp.category === selectedCategory
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Esperienze Marine</Text>
        <Text style={styles.headerSubtitle}>
          Vivi il mare con i nostri tour ed esperienze uniche
        </Text>
      </View>

      {/* Quick Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>25+</Text>
          <Text style={styles.statLabel}>Esperienze</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>500+</Text>
          <Text style={styles.statLabel}>Clienti Felici</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>4.8</Text>
          <Text style={styles.statLabel}>Rating Medio</Text>
        </View>
      </View>

      {/* Categories Filter */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.filterContainer}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.filterButton,
              selectedCategory === category.id && styles.filterButtonActive
            ]}
            onPress={() => setSelectedCategory(category.id)}
          >
            <Text style={styles.filterIcon}>{category.icon}</Text>
            <Text style={[
              styles.filterText,
              selectedCategory === category.id && styles.filterTextActive
            ]}>
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Experiences List */}
      <View style={styles.experiencesSection}>
        <Text style={styles.sectionTitle}>
          {filteredExperiences.length} Esperienze Disponibili
        </Text>

        {filteredExperiences.map((experience) => (
          <View key={experience.id} style={styles.experienceCard}>
            <Image source={{ uri: experience.image }} style={styles.experienceImage} />
            
            <View style={styles.experienceInfo}>
              <View style={styles.experienceHeader}>
                <Text style={styles.experienceTitle}>{experience.title}</Text>
                <View style={styles.rating}>
                  <Icon name="star" size={16} color="#FFD700" />
                  <Text style={styles.ratingText}>{experience.rating}</Text>
                </View>
              </View>

              <Text style={styles.experienceLocation}>📍 {experience.location}</Text>
              
              <View style={styles.experienceDetails}>
                <View style={styles.detailItem}>
                  <Icon name="schedule" size={16} color="#6b7280" />
                  <Text style={styles.detailText}>{experience.duration}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Icon name="group" size={16} color="#6b7280" />
                  <Text style={styles.detailText}>{experience.participants}</Text>
                </View>
              </View>

              <View style={styles.includesContainer}>
                <Text style={styles.includesTitle}>Cosa include:</Text>
                <View style={styles.includesList}>
                  {experience.includes.map((item, index) => (
                    <Text key={index} style={styles.includeItem}>• {item}</Text>
                  ))}
                </View>
              </View>

              <View style={styles.experienceFooter}>
                <View style={styles.priceSection}>
                  <Text style={styles.price}>{experience.price}</Text>
                  <Text style={styles.priceLabel}>/persona</Text>
                </View>

                <TouchableOpacity style={styles.bookButton}>
                  <Text style={styles.bookButtonText}>Prenota</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </View>

      {/* Why Choose Section */}
      <View style={styles.whyChooseSection}>
        <Text style={styles.whyChooseTitle}>Perché scegliere le nostre esperienze?</Text>
        
        <View style={styles.benefitsList}>
          <View style={styles.benefitItem}>
            <Icon name="verified-user" size={24} color="#0ea5e9" />
            <View style={styles.benefitContent}>
              <Text style={styles.benefitTitle}>Guide Certificate</Text>
              <Text style={styles.benefitDescription}>
                Tutti i nostri skipper sono certificati e esperti
              </Text>
            </View>
          </View>

          <View style={styles.benefitItem}>
            <Icon name="safety-check" size={24} color="#10b981" />
            <View style={styles.benefitContent}>
              <Text style={styles.benefitTitle}>Sicurezza Garantita</Text>
              <Text style={styles.benefitDescription}>
                Attrezzature di sicurezza certificate e controlli regolari
              </Text>
            </View>
          </View>

          <View style={styles.benefitItem}>
            <Icon name="camera-alt" size={24} color="#f59e0b" />
            <View style={styles.benefitContent}>
              <Text style={styles.benefitTitle}>Ricordi Indimenticabili</Text>
              <Text style={styles.benefitDescription}>
                Servizio fotografico incluso per immortalare i momenti
              </Text>
            </View>
          </View>

          <View style={styles.benefitItem}>
            <Icon name="cancel" size={24} color="#ef4444" />
            <View style={styles.benefitContent}>
              <Text style={styles.benefitTitle}>Cancellazione Gratuita</Text>
              <Text style={styles.benefitDescription}>
                Cancellazione gratuita fino a 24h prima
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
  experiencesSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  experienceCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  experienceImage: {
    width: '100%',
    height: 180,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  experienceInfo: {
    padding: 16,
  },
  experienceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  experienceTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    flex: 1,
    marginRight: 12,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 4,
  },
  experienceLocation: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 12,
  },
  experienceDetails: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  detailText: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 6,
  },
  includesContainer: {
    marginBottom: 16,
  },
  includesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 6,
  },
  includesList: {
    flexDirection: 'column',
  },
  includeItem: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 2,
  },
  experienceFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceSection: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0ea5e9',
  },
  priceLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginLeft: 2,
  },
  bookButton: {
    backgroundColor: '#0ea5e9',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  bookButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  whyChooseSection: {
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
  whyChooseTitle: {
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

export default EsperienzeScreen;