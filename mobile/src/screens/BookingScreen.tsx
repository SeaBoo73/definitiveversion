import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAuth } from '../services/AuthContext';

export default function BookingScreen({ navigation, route }: any) {
  const { boat } = route.params;
  const [selectedDates, setSelectedDates] = useState('15-17 Luglio 2025');
  const [guests, setGuests] = useState(4);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [extras, setExtras] = useState({
    skipper: false,
    fuel: true,
    insurance: true,
  });
  const { user, isAuthenticated } = useAuth();

  const calculateTotal = () => {
    let total = parseInt(boat.pricePerDay) * 2; // 2 giorni
    if (extras.skipper) total += 200;
    if (extras.fuel) total += 80;
    if (extras.insurance) total += 50;
    return total;
  };

  const handleBooking = async () => {
    // Verifica autenticazione
    if (!isAuthenticated) {
      Alert.alert(
        'Login Richiesto',
        'Devi effettuare il login per completare la prenotazione.',
        [
          {
            text: 'Annulla',
            style: 'cancel',
          },
          {
            text: 'Login',
            onPress: () => navigation.navigate('Auth'),
          },
        ]
      );
      return;
    }

    setPaymentLoading(true);
    
    try {
      // Crea i dati della prenotazione
      const bookingData = {
        boatId: boat.id,
        userId: user?.id,
        dates: selectedDates,
        guests,
        extras,
        totalAmount: calculateTotal(),
        timestamp: new Date().toISOString()
      };

      console.log('Processing payment for booking:', bookingData);
      
      // Simula processo di pagamento più realistico e iPad-compatibile
      await new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
          // Processo di pagamento completato con successo
          resolve(true);
        }, 1500); // Ridotto da 2000ms per migliore UX
        
        // Cleanup timer se il componente viene smontato
        return () => clearTimeout(timer);
      });

      // Salva la prenotazione localmente per testing
      console.log('Payment successful! Booking saved:', bookingData);
      
      // Mostra schermata di successo con migliore UX
      Alert.alert(
        '✅ Pagamento Riuscito',
        `Il pagamento di €${calculateTotal()} è stato elaborato con successo!\n\n📧 Conferma inviata a: ${user?.email || email}\n📱 ID Prenotazione: ${bookingData.boatId}${Date.now().toString().slice(-4)}`,
        [
          {
            text: '📋 Le Mie Prenotazioni',
            onPress: () => navigation.navigate('Main', { screen: 'Bookings' }),
          },
          {
            text: '🏠 Home',
            onPress: () => navigation.navigate('Main', { screen: 'Home' }),
            style: 'default',
          },
        ],
        { cancelable: false } // Previene chiusura accidentale su iPad
      );
    } catch (error: any) {
      console.error('Payment error:', error);
      Alert.alert(
        '❌ Errore Pagamento',
        `Si è verificato un errore durante il pagamento:\n\n${error.message || 'Errore di connessione'}\n\nRiprova più tardi o contatta il supporto.`,
        [
          {
            text: '🔄 Riprova',
            onPress: () => {
              // Reset dello stato per nuovo tentativo
              setPaymentLoading(false);
            },
            style: 'default',
          },
          {
            text: '📞 Supporto',
            onPress: () => {
              Alert.alert('Supporto', '📧 support@seaboo.it\n📞 +39 06 1234 5678');
            },
          },
        ],
        { cancelable: true } // Permette chiusura su iPad
      );
    } finally {
      setPaymentLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="chevron-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Prenotazione</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        {/* Boat Summary */}
        <View style={styles.boatSummary}>
          <Text style={styles.boatName}>{boat.name}</Text>
          <Text style={styles.boatDetails}>{boat.type} • {boat.port}</Text>
        </View>

        {/* Date Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Date selezionate</Text>
          <TouchableOpacity style={styles.dateCard}>
            <Icon name="calendar" size={20} color="#0ea5e9" />
            <Text style={styles.dateText}>{selectedDates}</Text>
            <Icon name="chevron-forward" size={20} color="#9ca3af" />
          </TouchableOpacity>
        </View>

        {/* Guests */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Numero ospiti</Text>
          <View style={styles.guestsCard}>
            <TouchableOpacity 
              style={styles.guestButton}
              onPress={() => guests > 1 && setGuests(guests - 1)}
            >
              <Icon name="remove" size={20} color="#0ea5e9" />
            </TouchableOpacity>
            <Text style={styles.guestsText}>{guests} persone</Text>
            <TouchableOpacity 
              style={styles.guestButton}
              onPress={() => guests < boat.maxPersons && setGuests(guests + 1)}
            >
              <Icon name="add" size={20} color="#0ea5e9" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Extras */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Servizi aggiuntivi</Text>
          
          <TouchableOpacity 
            style={styles.extraItem}
            onPress={() => setExtras({...extras, skipper: !extras.skipper})}
          >
            <View style={styles.extraInfo}>
              <Text style={styles.extraTitle}>Skipper professionale</Text>
              <Text style={styles.extraPrice}>+€200</Text>
            </View>
            <View style={[styles.checkbox, extras.skipper && styles.checkboxActive]}>
              {extras.skipper && <Icon name="checkmark" size={16} color="white" />}
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.extraItem}
            onPress={() => setExtras({...extras, fuel: !extras.fuel})}
          >
            <View style={styles.extraInfo}>
              <Text style={styles.extraTitle}>Carburante incluso</Text>
              <Text style={styles.extraPrice}>+€80</Text>
            </View>
            <View style={[styles.checkbox, extras.fuel && styles.checkboxActive]}>
              {extras.fuel && <Icon name="checkmark" size={16} color="white" />}
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.extraItem}
            onPress={() => setExtras({...extras, insurance: !extras.insurance})}
          >
            <View style={styles.extraInfo}>
              <Text style={styles.extraTitle}>Assicurazione extra</Text>
              <Text style={styles.extraPrice}>+€50</Text>
            </View>
            <View style={[styles.checkbox, extras.insurance && styles.checkboxActive]}>
              {extras.insurance && <Icon name="checkmark" size={16} color="white" />}
            </View>
          </TouchableOpacity>
        </View>

        {/* Price Summary */}
        <View style={styles.priceSection}>
          <Text style={styles.sectionTitle}>Riepilogo prezzi</Text>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>€{boat.pricePerDay} x 2 giorni</Text>
            <Text style={styles.priceValue}>€{parseInt(boat.pricePerDay) * 2}</Text>
          </View>
          {extras.skipper && (
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Skipper</Text>
              <Text style={styles.priceValue}>€200</Text>
            </View>
          )}
          {extras.fuel && (
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Carburante</Text>
              <Text style={styles.priceValue}>€80</Text>
            </View>
          )}
          {extras.insurance && (
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Assicurazione</Text>
              <Text style={styles.priceValue}>€50</Text>
            </View>
          )}
          <View style={[styles.priceRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Totale</Text>
            <Text style={styles.totalValue}>€{calculateTotal()}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.bookButton, paymentLoading && styles.bookButtonDisabled]} 
          onPress={handleBooking}
          disabled={paymentLoading}
        >
          {paymentLoading ? (
            <View style={styles.loadingRow}>
              <ActivityIndicator size="small" color="#fff" />
              <Text style={[styles.bookButtonText, { marginLeft: 10 }]}>
                Elaborando pagamento...
              </Text>
            </View>
          ) : (
            <Text style={styles.bookButtonText}>Conferma Prenotazione</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 10,
    backgroundColor: 'white',
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  boatSummary: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  boatName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  boatDetails: {
    fontSize: 14,
    color: '#6b7280',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
  },
  dateCard: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
  },
  dateText: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
    marginLeft: 12,
  },
  guestsCard: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
  },
  guestButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  guestsText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  extraItem: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  extraInfo: {
    flex: 1,
  },
  extraTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 2,
  },
  extraPrice: {
    fontSize: 14,
    color: '#0ea5e9',
    fontWeight: '600',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#d1d5db',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxActive: {
    backgroundColor: '#0ea5e9',
    borderColor: '#0ea5e9',
  },
  priceSection: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  priceLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  priceValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 12,
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0ea5e9',
  },
  footer: {
    padding: 20,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  bookButton: {
    backgroundColor: '#0ea5e9',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookButtonDisabled: {
    backgroundColor: '#94a3b8',
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});