import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl
} from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../services/AuthService';
import { OfflineService } from '../services/OfflineService';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface Booking {
  id: number;
  boatId: number;
  boatName: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  location: string;
  ownerName: string;
}

export default function BookingsScreen({ navigation }: any) {
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'active' | 'past'>('active');
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: bookings = [], isLoading, refetch } = useQuery({
    queryKey: ['bookings', user?.id, activeTab],
    queryFn: async () => {
      if (OfflineService.isOfflineMode()) {
        return await OfflineService.getCachedBookings();
      }
      
      const baseUrl = __DEV__ ? 'http://localhost:5000' : 'https://your-production-url.com';
      const response = await fetch(`${baseUrl}/api/bookings/user/${user?.id}?status=${activeTab}`);
      if (!response.ok) throw new Error('Network error');
      const data = await response.json();
      
      // Cache per uso offline
      await OfflineService.cacheBookings(data);
      return data;
    },
    enabled: !!user
  });

  const cancelBookingMutation = useMutation({
    mutationFn: async (bookingId: number) => {
      if (OfflineService.isOfflineMode()) {
        await OfflineService.addPendingAction('booking', {
          action: 'cancel',
          bookingId,
          userId: user?.id
        });
        return;
      }
      
      const baseUrl = __DEV__ ? 'http://localhost:5000' : 'https://your-production-url.com';
      const response = await fetch(`${baseUrl}/api/bookings/${bookingId}/cancel`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
      });
      if (!response.ok) throw new Error('Errore cancellazione');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      Alert.alert('Successo', 'Prenotazione cancellata con successo');
    },
    onError: (error) => {
      Alert.alert('Errore', 'Impossibile cancellare la prenotazione');
    }
  });

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
      if (!OfflineService.isOfflineMode()) {
        await OfflineService.syncOfflineData();
      }
    } finally {
      setRefreshing(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return '#4CAF50';
      case 'pending': return '#FF9800';
      case 'cancelled': return '#F44336';
      case 'completed': return '#2196F3';
      default: return '#666';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed': return 'Confermata';
      case 'pending': return 'In attesa';
      case 'cancelled': return 'Cancellata';
      case 'completed': return 'Completata';
      default: return status;
    }
  };

  const canCancelBooking = (booking: Booking) => {
    const startDate = new Date(booking.startDate);
    const now = new Date();
    const hoursDiff = (startDate.getTime() - now.getTime()) / (1000 * 3600);
    
    return booking.status === 'confirmed' && hoursDiff > 24;
  };

  const handleCancelBooking = (booking: Booking) => {
    Alert.alert(
      'Conferma Cancellazione',
      `Sei sicuro di voler cancellare la prenotazione per ${booking.boatName}?`,
      [
        { text: 'Annulla', style: 'cancel' },
        { 
          text: 'Conferma', 
          style: 'destructive',
          onPress: () => cancelBookingMutation.mutate(booking.id)
        }
      ]
    );
  };

  const BookingCard = ({ booking }: { booking: Booking }) => (
    <TouchableOpacity
      style={styles.bookingCard}
      onPress={() => navigation.navigate('BookingDetails', { bookingId: booking.id })}
    >
      <View style={styles.bookingHeader}>
        <Text style={styles.boatName}>{booking.boatName}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(booking.status) }]}>
          <Text style={styles.statusText}>{getStatusText(booking.status)}</Text>
        </View>
      </View>
      
      <Text style={styles.location}>📍 {booking.location}</Text>
      <Text style={styles.owner}>Proprietario: {booking.ownerName}</Text>
      
      <View style={styles.dateContainer}>
        <Text style={styles.dates}>
          📅 {new Date(booking.startDate).toLocaleDateString('it-IT')} - {new Date(booking.endDate).toLocaleDateString('it-IT')}
        </Text>
      </View>
      
      <View style={styles.bookingFooter}>
        <Text style={styles.price}>€{booking.totalPrice}</Text>
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('Messages', { bookingId: booking.id })}
          >
            <Icon name="message" size={16} color="#0066CC" />
            <Text style={styles.actionText}>Messaggi</Text>
          </TouchableOpacity>
          
          {canCancelBooking(booking) && (
            <TouchableOpacity
              style={[styles.actionButton, styles.cancelButton]}
              onPress={() => handleCancelBooking(booking)}
            >
              <Icon name="cancel" size={16} color="#F44336" />
              <Text style={[styles.actionText, styles.cancelText]}>Cancella</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const EmptyState = () => (
    <View style={styles.emptyContainer}>
      <Icon name="event-busy" size={64} color="#ccc" />
      <Text style={styles.emptyTitle}>
        {activeTab === 'active' ? 'Nessuna prenotazione attiva' : 'Nessuna prenotazione passata'}
      </Text>
      <Text style={styles.emptySubtitle}>
        {activeTab === 'active' 
          ? 'Inizia a esplorare le barche disponibili'
          : 'Le tue prenotazioni completate appariranno qui'
        }
      </Text>
      {activeTab === 'active' && (
        <TouchableOpacity
          style={styles.exploreButton}
          onPress={() => navigation.navigate('Search')}
        >
          <Text style={styles.exploreButtonText}>Esplora Barche</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Tab Navigator */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'active' && styles.activeTab]}
          onPress={() => setActiveTab('active')}
        >
          <Text style={[styles.tabText, activeTab === 'active' && styles.activeTabText]}>
            Attive
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

      {/* Offline Indicator */}
      {OfflineService.isOfflineMode() && (
        <View style={styles.offlineIndicator}>
          <Icon name="cloud-off" size={16} color="#FFF" />
          <Text style={styles.offlineText}>Dati offline - potrebbero non essere aggiornati</Text>
        </View>
      )}

      {/* Bookings List */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <Text>Caricamento prenotazioni...</Text>
        </View>
      ) : bookings.length > 0 ? (
        <FlatList
          data={bookings}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <BookingCard booking={item} />}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <EmptyState />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#0066CC',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
  },
  activeTabText: {
    color: '#0066CC',
    fontWeight: 'bold',
  },
  offlineIndicator: {
    backgroundColor: '#FF6B35',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    gap: 8,
  },
  offlineText: {
    color: '#FFF',
    fontSize: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    padding: 15,
  },
  bookingCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  boatName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 15,
  },
  statusText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  location: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  owner: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  dateContainer: {
    marginBottom: 15,
  },
  dates: {
    fontSize: 14,
    color: '#333',
  },
  bookingFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0066CC',
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    backgroundColor: '#E3F2FD',
    gap: 4,
  },
  cancelButton: {
    backgroundColor: '#FFEBEE',
  },
  actionText: {
    fontSize: 12,
    color: '#0066CC',
    fontWeight: '600',
  },
  cancelText: {
    color: '#F44336',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  exploreButton: {
    backgroundColor: '#0066CC',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  exploreButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});