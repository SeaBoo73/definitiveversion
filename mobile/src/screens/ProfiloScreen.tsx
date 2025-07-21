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

const menuItems = [
  { id: 1, title: 'Le mie prenotazioni', icon: 'calendar', color: '#0ea5e9' },
  { id: 2, title: 'Barche preferite', icon: 'heart', color: '#ef4444' },
  { id: 3, title: 'Recensioni', icon: 'star', color: '#f59e0b' },
  { id: 4, title: 'Diventa proprietario', icon: 'boat', color: '#10b981' },
  { id: 5, title: 'Metodi di pagamento', icon: 'card', color: '#8b5cf6' },
  { id: 6, title: 'Notifiche', icon: 'notifications', color: '#06b6d4' },
  { id: 7, title: 'Impostazioni', icon: 'settings', color: '#6b7280' },
  { id: 8, title: 'Assistenza', icon: 'help-circle', color: '#f97316' },
];

export default function ProfiloScreen({ navigation }: any) {
  const handleLogin = () => {
    navigation.navigate('Auth');
  };

  const handleMenuPress = (item: any) => {
    switch (item.id) {
      case 1:
        // Navigate to bookings
        break;
      case 2:
        // Navigate to favorites
        break;
      case 4:
        Alert.alert(
          'Diventa Proprietario',
          'Vuoi noleggiare le tue barche su SeaGO? Contattaci per maggiori informazioni.',
          [
            { text: 'Annulla', style: 'cancel' },
            { text: 'Contatta', onPress: () => console.log('Contact pressed') },
          ]
        );
        break;
      case 8:
        navigation.navigate('Aiuto');
        break;
      default:
        Alert.alert('Funzionalità', `${item.title} sarà disponibile presto!`);
    }
  };

  const renderMenuItem = (item: any) => (
    <TouchableOpacity
      key={item.id}
      style={styles.menuItem}
      onPress={() => handleMenuPress(item)}
    >
      <View style={[styles.menuIcon, { backgroundColor: `${item.color}15` }]}>
        <Icon name={item.icon} size={24} color={item.color} />
      </View>
      <Text style={styles.menuTitle}>{item.title}</Text>
      <Icon name="chevron-forward" size={20} color="#9ca3af" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profilo</Text>
        </View>

        {/* User Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.profileInfo}>
            <View style={styles.avatarContainer}>
              <Icon name="person" size={40} color="#6b7280" />
            </View>
            <View style={styles.profileText}>
              <Text style={styles.welcomeText}>Benvenuto su SeaGO!</Text>
              <Text style={styles.loginText}>Accedi per gestire le tue prenotazioni</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Accedi</Text>
          </TouchableOpacity>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Icon name="boat" size={24} color="#0ea5e9" />
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Prenotazioni</Text>
          </View>
          <View style={styles.statCard}>
            <Icon name="heart" size={24} color="#ef4444" />
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Preferiti</Text>
          </View>
          <View style={styles.statCard}>
            <Icon name="star" size={24} color="#f59e0b" />
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Recensioni</Text>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          {menuItems.map(renderMenuItem)}
        </View>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appVersion}>SeaGO v1.0.0</Text>
          <Text style={styles.appDescription}>
            La piattaforma leader per il noleggio barche in Italia
          </Text>
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
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
  },
  profileSection: {
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
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  profileText: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  loginText: {
    fontSize: 14,
    color: '#6b7280',
  },
  loginButton: {
    backgroundColor: '#0ea5e9',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 20,
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: 'white',
    flex: 1,
    padding: 16,
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  menuContainer: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
  appInfo: {
    alignItems: 'center',
    padding: 20,
    marginTop: 20,
  },
  appVersion: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 4,
  },
  appDescription: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'center',
  },
});