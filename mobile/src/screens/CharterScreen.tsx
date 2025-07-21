import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';

const charterOptions = [
  {
    id: 1,
    title: "Charter con Skipper",
    description: "Lascia che un capitano esperto guidi la tua avventura",
    icon: "person",
    color: "#0ea5e9"
  },
  {
    id: 2,
    title: "Charter Bareboat",
    description: "Naviga in autonomia se hai la patente nautica",
    icon: "boat",
    color: "#10b981"
  },
  {
    id: 3,
    title: "Charter con Equipaggio",
    description: "Servizio completo con chef e hostess",
    icon: "restaurant",
    color: "#f59e0b"
  },
];

export default function CharterScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Charter</Text>
          <Text style={styles.headerSubtitle}>Scegli il tuo tipo di charter ideale</Text>
        </View>

        <View style={styles.heroSection}>
          <Image 
            source={{ uri: "https://images.unsplash.com/photo-1540946485063-a40da27545f8?w=600" }}
            style={styles.heroImage}
          />
          <View style={styles.heroOverlay}>
            <Text style={styles.heroTitle}>Charter di Lusso</Text>
            <Text style={styles.heroSubtitle}>Vivi un'esperienza indimenticabile</Text>
          </View>
        </View>

        <View style={styles.optionsContainer}>
          {charterOptions.map((option) => (
            <TouchableOpacity key={option.id} style={styles.optionCard}>
              <View style={[styles.optionIcon, { backgroundColor: `${option.color}15` }]}>
                <Icon name={option.icon} size={28} color={option.color} />
              </View>
              <View style={styles.optionContent}>
                <Text style={styles.optionTitle}>{option.title}</Text>
                <Text style={styles.optionDescription}>{option.description}</Text>
              </View>
              <Icon name="chevron-forward" size={20} color="#9ca3af" />
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>Perché scegliere un charter?</Text>
          <View style={styles.infoList}>
            <View style={styles.infoItem}>
              <Icon name="checkmark-circle" size={20} color="#10b981" />
              <Text style={styles.infoText}>Flessibilità totale nell'itinerario</Text>
            </View>
            <View style={styles.infoItem}>
              <Icon name="checkmark-circle" size={20} color="#10b981" />
              <Text style={styles.infoText}>Privacy e comfort esclusivi</Text>
            </View>
            <View style={styles.infoItem}>
              <Icon name="checkmark-circle" size={20} color="#10b981" />
              <Text style={styles.infoText}>Servizi personalizzati</Text>
            </View>
            <View style={styles.infoItem}>
              <Icon name="checkmark-circle" size={20} color="#10b981" />
              <Text style={styles.infoText}>Destinazioni esclusive</Text>
            </View>
          </View>
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
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#6b7280',
  },
  heroSection: {
    position: 'relative',
    margin: 20,
    borderRadius: 16,
    overflow: 'hidden',
  },
  heroImage: {
    width: '100%',
    height: 200,
  },
  heroOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
    padding: 20,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  heroSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
  },
  optionsContainer: {
    margin: 20,
  },
  optionCard: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    marginBottom: 12,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  optionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  infoSection: {
    backgroundColor: 'white',
    margin: 20,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  infoList: {
    gap: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    fontSize: 16,
    color: '#374151',
    marginLeft: 12,
    flex: 1,
  },
});