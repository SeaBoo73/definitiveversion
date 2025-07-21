import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

const experiences = [
  {
    id: 1,
    title: "Gita al Tramonto",
    description: "Navigazione romantica al tramonto con aperitivo",
    duration: "3 ore",
    price: "80",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400",
    rating: 4.9,
    participants: "2-8 persone"
  },
  {
    id: 2,
    title: "Tour delle Isole",
    description: "Esplora le isole pontine con pranzo incluso",
    duration: "8 ore",
    price: "150",
    image: "https://images.unsplash.com/photo-1540946485063-a40da27545f8?w=400",
    rating: 4.8,
    participants: "4-12 persone"
  },
];

export default function EsperienzeScreen() {
  const renderExperienceCard = ({ item }: any) => (
    <TouchableOpacity style={styles.experienceCard}>
      <Image source={{ uri: item.image }} style={styles.experienceImage} />
      <View style={styles.experienceInfo}>
        <Text style={styles.experienceTitle}>{item.title}</Text>
        <Text style={styles.experienceDescription}>{item.description}</Text>
        <View style={styles.experienceDetails}>
          <View style={styles.detailItem}>
            <Icon name="time" size={14} color="#6b7280" />
            <Text style={styles.detailText}>{item.duration}</Text>
          </View>
          <View style={styles.detailItem}>
            <Icon name="people" size={14} color="#6b7280" />
            <Text style={styles.detailText}>{item.participants}</Text>
          </View>
        </View>
        <View style={styles.experienceFooter}>
          <View style={styles.ratingContainer}>
            <Icon name="star" size={14} color="#f59e0b" />
            <Text style={styles.rating}>{item.rating}</Text>
          </View>
          <Text style={styles.price}>€{item.price}/persona</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Esperienze</Text>
          <Text style={styles.headerSubtitle}>Vivi il mare come mai prima</Text>
        </View>

        <FlatList
          data={experiences}
          renderItem={renderExperienceCard}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.experiencesList}
          showsVerticalScrollIndicator={false}
        />
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
  experiencesList: {
    padding: 20,
  },
  experienceCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  experienceImage: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  experienceInfo: {
    padding: 16,
  },
  experienceTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  experienceDescription: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  experienceDetails: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  detailText: {
    fontSize: 12,
    color: '#6b7280',
    marginLeft: 4,
  },
  experienceFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
    color: '#111827',
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0ea5e9',
  },
});