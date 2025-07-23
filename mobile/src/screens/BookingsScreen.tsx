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

const BookingsScreen = () => {
  const [activeTab, setActiveTab] = useState('current');

  const currentBookings = [
    {
      id: 1,
      boatName: 'Azimut 55 Luxury',
      location: 'Civitavecchia',
      startDate: '15 Jul 2025',
      endDate: '17 Jul 2025',
      price: '€1,700',
      status: 'confirmed',
      image: 'https://via.placeholder.com/100x80?text=Yacht'
    },
    {
      id: 2,
      boatName: 'Bavaria 46 Cruiser',
      location: 'Gaeta',
      startDate: '25 Jul 2025',
      endDate: '27 Jul 2025',
      price: '€640',
      status: 'pending',
      image: 'https://via.placeholder.com/100x80?text=Sailboat'
    },
  ];

  const pastBookings = [
    {
      id: 3,
      boatName: 'Zodiac Pro 650',
      location: 'Anzio',
      startDate: '5 Jun 2025',
      endDate: '6 Jun 2025',
      price: '€180',
      status: 'completed',
      image: 'https://via.placeholder.com/100x80?text=Dinghy'
    },
    {
      id: 4,
      boatName: 'Princess V58',
      location: 'Formia',
      startDate: '20 May 2025',
      endDate: '22 May 2025',
      price: '€1,900',
      status: 'completed',
      image: 'https://via.placeholder.com/100x80?text=Princess'
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return '#10b981';
      case 'pending': return '#f59e0b';
      case 'completed': return '#6b7280';
      default: return '#ef4444';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed': return 'Confermato';
      case 'pending': return 'In attesa';
      case 'completed': return 'Completato';
      default: return 'Annullato';
    }
  };

  const bookings = activeTab === 'current' ? currentBookings : pastBookings;

  return (
    <View style={styles.container}>
      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'current' && styles.activeTab]}
          onPress={() => setActiveTab('current')}
        >
          <Text style={[styles.tabText, activeTab === 'current' && styles.activeTabText]}>
            Attuali
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'past' && styles.activeTab]}
          onPress={() => setActiveTab('past')}
        >
          <Text style={[styles.tabText, activeTab === 'past' && styles.activeTabText]}>
            Passate
          </Text>
        </TouchableOpacity>
      </View>

      {/* Bookings List */}
      <ScrollView style={styles.bookingsList} showsVerticalScrollIndicator={false}>
        {bookings.length > 0 ? (
          bookings.map((booking) => (
            <View key={booking.id} style={styles.bookingCard}>
              <Image source={{ uri: booking.image }} style={styles.bookingImage} />
              <View style={styles.bookingInfo}>
                <View style={styles.bookingHeader}>
                  <Text style={styles.boatName}>{booking.boatName}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(booking.status) }]}>
                    <Text style={styles.statusText}>{getStatusText(booking.status)}</Text>
                  </View>
                </View>
                
                <Text style={styles.location}>📍 {booking.location}</Text>
                
                <View style={styles.dateContainer}>
                  <Text style={styles.dateText}>
                    📅 {booking.startDate} - {booking.endDate}
                  </Text>
                </View>

                <View style={styles.bookingFooter}>
                  <Text style={styles.price}>{booking.price}</Text>
                  <View style={styles.actionButtons}>
                    {booking.status === 'confirmed' && (
                      <TouchableOpacity style={styles.contactButton}>
                        <Icon name="message" size={16} color="#0ea5e9" />
                        <Text style={styles.contactButtonText}>Contatta</Text>
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity style={styles.detailsButton}>
                      <Text style={styles.detailsButtonText}>Dettagli</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Icon name="event-note" size={64} color="#d1d5db" />
            <Text style={styles.emptyTitle}>
              {activeTab === 'current' ? 'Nessuna prenotazione attuale' : 'Nessuna prenotazione passata'}
            </Text>
            <Text style={styles.emptySubtitle}>
              {activeTab === 'current' 
                ? 'Inizia a esplorare e prenota la tua prima barca!'
                : 'Le tue prenotazioni completate appariranno qui'
              }
            </Text>
            {activeTab === 'current' && (
              <TouchableOpacity style={styles.exploreButton}>
                <Text style={styles.exploreButtonText}>Esplora Barche</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </ScrollView>

      {/* Quick Stats */}
      {bookings.length > 0 && (
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{currentBookings.length}</Text>
            <Text style={styles.statLabel}>Prenotazioni Attive</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{pastBookings.length}</Text>
            <Text style={styles.statLabel}>Viaggi Completati</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>€4,420</Text>
            <Text style={styles.statLabel}>Totale Speso</Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#0ea5e9',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6b7280',
  },
  activeTabText: {
    color: '#0ea5e9',
    fontWeight: 'bold',
  },
  bookingsList: {
    flex: 1,
    padding: 16,
  },
  bookingCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    flexDirection: 'row',
    padding: 16,
  },
  bookingImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
  },
  bookingInfo: {
    flex: 1,
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  boatName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '600',
  },
  location: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  dateContainer: {
    marginBottom: 12,
  },
  dateText: {
    fontSize: 14,
    color: '#6b7280',
  },
  bookingFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0ea5e9',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#e0f2fe',
    borderRadius: 6,
  },
  contactButtonText: {
    fontSize: 12,
    color: '#0ea5e9',
    marginLeft: 4,
    fontWeight: '500',
  },
  detailsButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#f3f4f6',
    borderRadius: 6,
  },
  detailsButtonText: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6b7280',
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
  exploreButton: {
    backgroundColor: '#0ea5e9',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  exploreButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingVertical: 20,
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0ea5e9',
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
    textAlign: 'center',
  },
});

export default BookingsScreen;