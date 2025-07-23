import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch
} from 'react-native';
import { useAuth } from '../services/AuthService';
import { OfflineService } from '../services/OfflineService';
import { NotificationService } from '../services/NotificationService';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function ProfileScreen({ navigation }: any) {
  const { user, logout } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleLogout = () => {
    Alert.alert(
      'Conferma Logout',
      'Sei sicuro di voler uscire?',
      [
        { text: 'Annulla', style: 'cancel' },
        { 
          text: 'Esci', 
          style: 'destructive',
          onPress: async () => {
            await logout();
            navigation.reset({
              index: 0,
              routes: [{ name: 'Auth' }],
            });
          }
        }
      ]
    );
  };

  const toggleNotifications = async (enabled: boolean) => {
    setNotificationsEnabled(enabled);
    if (enabled) {
      await NotificationService.initialize();
    } else {
      await NotificationService.cancelAllNotifications();
    }
  };

  const clearOfflineData = () => {
    Alert.alert(
      'Pulisci Dati Offline',
      'Questo rimuoverà tutti i dati memorizzati offline. Continuare?',
      [
        { text: 'Annulla', style: 'cancel' },
        { 
          text: 'Pulisci', 
          style: 'destructive',
          onPress: async () => {
            await OfflineService.clearCache();
            await OfflineService.clearPendingActions();
            Alert.alert('Successo', 'Dati offline rimossi');
          }
        }
      ]
    );
  };

  const MenuSection = ({ title, children }: any) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );

  const MenuItem = ({ icon, title, subtitle, onPress, rightComponent, danger = false }: any) => (
    <TouchableOpacity
      style={styles.menuItem}
      onPress={onPress}
      disabled={!onPress}
    >
      <Icon name={icon} size={24} color={danger ? '#F44336' : '#666'} style={styles.menuIcon} />
      <View style={styles.menuText}>
        <Text style={[styles.menuTitle, danger && styles.dangerText]}>{title}</Text>
        {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
      </View>
      {rightComponent || <Icon name="chevron-right" size={20} color="#ccc" />}
    </TouchableOpacity>
  );

  if (!user) {
    return (
      <View style={styles.container}>
        <View style={styles.authPrompt}>
          <Icon name="person-outline" size={64} color="#ccc" />
          <Text style={styles.authTitle}>Accesso Richiesto</Text>
          <Text style={styles.authSubtitle}>
            Effettua l'accesso per vedere il tuo profilo
          </Text>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => navigation.navigate('Auth')}
          >
            <Text style={styles.loginButtonText}>Accedi</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <View style={styles.profileInfo}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user.username?.charAt(0).toUpperCase() || 'U'}
            </Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user.username}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
            <View style={styles.roleBadge}>
              <Text style={styles.roleText}>
                {user.role === 'owner' ? 'Proprietario' : 'Cliente'}
              </Text>
            </View>
          </View>
        </View>
        {user.profile?.verified && (
          <View style={styles.verifiedBadge}>
            <Icon name="verified" size={24} color="#4CAF50" />
          </View>
        )}
      </View>

      {/* Account Management */}
      <MenuSection title="Account">
        <MenuItem
          icon="edit"
          title="Modifica Profilo"
          subtitle="Aggiorna le tue informazioni"
          onPress={() => navigation.navigate('EditProfile')}
        />
        <MenuItem
          icon="security"
          title="Sicurezza"
          subtitle="Password e autenticazione"
          onPress={() => navigation.navigate('Security')}
        />
        <MenuItem
          icon="folder"
          title="Documenti"
          subtitle="Gestisci i tuoi documenti"
          onPress={() => navigation.navigate('Documents')}
        />
      </MenuSection>

      {/* Bookings & Activity */}
      <MenuSection title="Attività">
        <MenuItem
          icon="event"
          title="Le Mie Prenotazioni"
          subtitle="Gestisci le tue prenotazioni"
          onPress={() => navigation.navigate('Bookings')}
        />
        <MenuItem
          icon="favorite"
          title="Barche Preferite"
          subtitle="Le tue barche salvate"
          onPress={() => navigation.navigate('Favorites')}
        />
        <MenuItem
          icon="star"
          title="Le Mie Recensioni"
          subtitle="Recensioni date e ricevute"
          onPress={() => navigation.navigate('Reviews')}
        />
      </MenuSection>

      {/* Settings */}
      <MenuSection title="Impostazioni">
        <MenuItem
          icon="notifications"
          title="Notifiche"
          subtitle="Gestisci le notifiche push"
          rightComponent={
            <Switch
              value={notificationsEnabled}
              onValueChange={toggleNotifications}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={notificationsEnabled ? '#0066CC' : '#f4f3f4'}
            />
          }
        />
        <MenuItem
          icon="language"
          title="Lingua"
          subtitle="Italiano"
          onPress={() => navigation.navigate('Language')}
        />
        <MenuItem
          icon="help"
          title="Aiuto e Supporto"
          subtitle="FAQ e contatti"
          onPress={() => navigation.navigate('Help')}
        />
      </MenuSection>

      {/* Offline & Data */}
      <MenuSection title="Dati">
        <MenuItem
          icon="cloud-off"
          title="Modalità Offline"
          subtitle={`${OfflineService.isOfflineMode() ? 'Attiva' : 'Disattiva'}`}
          onPress={() => navigation.navigate('Offline')}
        />
        <MenuItem
          icon="storage"
          title="Gestione Dati"
          subtitle="Cache e sincronizzazione"
          onPress={() => navigation.navigate('DataManagement')}
        />
        <MenuItem
          icon="delete"
          title="Pulisci Cache"
          subtitle="Rimuovi dati offline"
          onPress={clearOfflineData}
        />
      </MenuSection>

      {/* Legal & About */}
      <MenuSection title="Informazioni">
        <MenuItem
          icon="info"
          title="Informazioni su SeaGO"
          subtitle="Versione 1.0.0"
          onPress={() => navigation.navigate('About')}
        />
        <MenuItem
          icon="policy"
          title="Privacy Policy"
          subtitle="Come trattiamo i tuoi dati"
          onPress={() => navigation.navigate('Privacy')}
        />
        <MenuItem
          icon="description"
          title="Termini di Servizio"
          subtitle="Condizioni d'uso"
          onPress={() => navigation.navigate('Terms')}
        />
      </MenuSection>

      {/* Logout */}
      <View style={styles.section}>
        <MenuItem
          icon="logout"
          title="Esci"
          subtitle="Disconnettiti dall'account"
          onPress={handleLogout}
          danger={true}
        />
      </View>

      <View style={styles.footer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  profileHeader: {
    backgroundColor: '#0066CC',
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#E3F2FD',
    marginBottom: 8,
  },
  roleBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  roleText: {
    fontSize: 12,
    color: '#FFF',
    fontWeight: 'bold',
  },
  verifiedBadge: {
    marginLeft: 10,
  },
  section: {
    backgroundColor: '#FFF',
    marginTop: 20,
    paddingVertical: 5,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#f5f5f5',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuIcon: {
    marginRight: 15,
    width: 24,
  },
  menuText: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    color: '#333',
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  dangerText: {
    color: '#F44336',
  },
  authPrompt: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  authTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 10,
  },
  authSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  loginButton: {
    backgroundColor: '#0066CC',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  loginButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    height: 40,
  },
});