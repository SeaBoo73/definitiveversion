import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  Switch,
  Alert,
} from 'react-native';
import Icon from '@expo/vector-icons/MaterialIcons';

const ProfileScreen = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(true);

  const userProfile = {
    name: 'Marco Rossi',
    email: 'marco.rossi@email.com',
    phone: '+39 335 123 4567',
    joinDate: 'Giugno 2024',
    totalBookings: 8,
    rating: 4.9,
    level: 'Gold',
    avatar: 'https://seaboorentalboat.com/api/images/WhatsApp%20Image%202025-06-12%20at%2018.53.09_1752873223407.jpeg'
  };

  const menuItems = [
    {
      section: 'Account',
      items: [
        { icon: 'person', title: 'Modifica Profilo', subtitle: 'Aggiorna le tue informazioni', action: 'profile' },
        { icon: 'history', title: 'Le Mie Prenotazioni', subtitle: 'Visualizza cronologia', action: 'bookings' },
        { icon: 'favorite', title: 'Barche Preferite', subtitle: 'Le tue imbarcazioni salvate', action: 'favorites' },
        { icon: 'payment', title: 'Metodi di Pagamento', subtitle: 'Gestisci carte e pagamenti', action: 'payment' },
      ]
    },
    {
      section: 'Impostazioni',
      items: [
        { icon: 'notifications', title: 'Notifiche', subtitle: 'Gestisci le notifiche', action: 'notifications', toggle: true },
        { icon: 'location-on', title: 'Posizione', subtitle: 'Servizi di geolocalizzazione', action: 'location', toggle: true },
        { icon: 'language', title: 'Lingua', subtitle: 'Italiano', action: 'language' },
        { icon: 'privacy-tip', title: 'Privacy', subtitle: 'Gestisci i tuoi dati', action: 'privacy' },
      ]
    },
    {
      section: 'Supporto',
      items: [
        { icon: 'help', title: 'Centro Assistenza', subtitle: 'FAQ e guide', action: 'help' },
        { icon: 'chat', title: 'Contatta il Supporto', subtitle: 'Chat dal vivo', action: 'support' },
        { icon: 'star-rate', title: 'Valuta l\'App', subtitle: 'Lascia una recensione', action: 'rate' },
        { icon: 'info', title: 'Informazioni', subtitle: 'Versione 1.0.0', action: 'about' },
      ]
    }
  ];

  const handleMenuPress = (action) => {
    switch (action) {
      case 'profile':
        Alert.alert('Modifica Profilo', 'Funzione in arrivo');
        break;
      case 'bookings':
        Alert.alert('Le Mie Prenotazioni', 'Funzione in arrivo');
        break;
      case 'help':
        Alert.alert('Centro Assistenza', 'Per supporto contatta: supporto@seaboo.it');
        break;
      case 'support':
        Alert.alert('Supporto', 'Chat in arrivo - Contatta: +39 123 456 789');
        break;
      default:
        Alert.alert('Funzione', 'Prossimamente disponibile');
    }
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    Alert.alert('Accesso Effettuato', 'Benvenuto in SeaBoo!');
  };

  const handleLogout = () => {
    Alert.alert(
      'Conferma Logout',
      'Sei sicuro di voler uscire?',
      [
        { text: 'Annulla', style: 'cancel' },
        { text: 'Esci', style: 'destructive', onPress: () => setIsLoggedIn(false) }
      ]
    );
  };

  const renderLoginSection = () => (
    <View style={styles.loginSection}>
      <Icon name="account-circle" size={80} color="#e2e8f0" />
      <Text style={styles.loginTitle}>Accedi a SeaBoo</Text>
      <Text style={styles.loginSubtitle}>
        Accedi per gestire le tue prenotazioni e scoprire offerte esclusive
      </Text>
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Accedi / Registrati</Text>
      </TouchableOpacity>
    </View>
  );

  const renderProfileSection = () => (
    <View style={styles.profileSection}>
      <View style={styles.profileHeader}>
        <Image source={{ uri: userProfile.avatar }} style={styles.avatar} />
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{userProfile.name}</Text>
          <Text style={styles.profileEmail}>{userProfile.email}</Text>
          <View style={styles.profileMeta}>
            <View style={styles.levelBadge}>
              <Icon name="stars" size={16} color="#f59e0b" />
              <Text style={styles.levelText}>{userProfile.level}</Text>
            </View>
            <Text style={styles.profileJoinDate}>Da {userProfile.joinDate}</Text>
          </View>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{userProfile.totalBookings}</Text>
          <Text style={styles.statLabel}>Prenotazioni</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <View style={styles.ratingContainer}>
            <Text style={styles.statNumber}>{userProfile.rating}</Text>
            <Icon name="star" size={16} color="#FFD700" />
          </View>
          <Text style={styles.statLabel}>Valutazione</Text>
        </View>
      </View>
    </View>
  );

  const renderMenuItem = (item, sectionIndex, itemIndex) => (
    <TouchableOpacity 
      key={`${sectionIndex}-${itemIndex}`}
      style={styles.menuItem}
      onPress={() => handleMenuPress(item.action)}
    >
      <Icon name={item.icon} size={24} color="#6b7280" />
      <View style={styles.menuItemContent}>
        <Text style={styles.menuItemTitle}>{item.title}</Text>
        <Text style={styles.menuItemSubtitle}>{item.subtitle}</Text>
      </View>
      {item.toggle ? (
        <Switch
          value={item.action === 'notifications' ? notificationsEnabled : locationEnabled}
          onValueChange={(value) => {
            if (item.action === 'notifications') {
              setNotificationsEnabled(value);
            } else {
              setLocationEnabled(value);
            }
          }}
          trackColor={{ false: '#e5e7eb', true: '#0ea5e9' }}
          thumbColor={item.action === 'notifications' ? 
            (notificationsEnabled ? '#ffffff' : '#f4f3f4') : 
            (locationEnabled ? '#ffffff' : '#f4f3f4')
          }
        />
      ) : (
        <Icon name="chevron-right" size={20} color="#d1d5db" />
      )}
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {isLoggedIn ? renderProfileSection() : renderLoginSection()}

      {/* Menu Sections */}
      {menuItems.map((section, sectionIndex) => (
        <View key={sectionIndex} style={styles.menuSection}>
          <Text style={styles.sectionTitle}>{section.section}</Text>
          <View style={styles.menuContainer}>
            {section.items.map((item, itemIndex) => renderMenuItem(item, sectionIndex, itemIndex))}
          </View>
        </View>
      ))}

      {/* Logout Button */}
      {isLoggedIn && (
        <View style={styles.logoutSection}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Icon name="logout" size={20} color="#ef4444" />
            <Text style={styles.logoutText}>Esci</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* App Info */}
      <View style={styles.appInfo}>
        <Text style={styles.appInfoText}>SeaBoo v1.0.0</Text>
        <Text style={styles.appInfoText}>© 2025 SeaBoo. Tutti i diritti riservati.</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  loginSection: {
    backgroundColor: 'white',
    padding: 32,
    alignItems: 'center',
    marginBottom: 16,
  },
  loginTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginTop: 16,
    marginBottom: 8,
  },
  loginSubtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  loginButton: {
    backgroundColor: '#0ea5e9',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 24,
    minWidth: 200,
    alignItems: 'center',
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  profileSection: {
    backgroundColor: 'white',
    padding: 20,
    marginBottom: 16,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  profileMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef3c7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    gap: 4,
  },
  levelText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#d97706',
  },
  profileJoinDate: {
    fontSize: 12,
    color: '#6b7280',
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#e5e7eb',
    marginHorizontal: 16,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0ea5e9',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  menuSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginLeft: 16,
    marginBottom: 8,
  },
  menuContainer: {
    backgroundColor: 'white',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
    gap: 12,
  },
  menuItemContent: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1f2937',
    marginBottom: 2,
  },
  menuItemSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  logoutSection: {
    padding: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ef4444',
  },
  appInfo: {
    padding: 20,
    alignItems: 'center',
  },
  appInfoText: {
    fontSize: 12,
    color: '#9ca3af',
    marginBottom: 4,
  },
});

export default ProfileScreen;