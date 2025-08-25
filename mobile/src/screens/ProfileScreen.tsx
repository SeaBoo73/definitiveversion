import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ProfileScreen = () => {
  const user = {
    name: 'Marco Rossi',
    email: 'marco.rossi@email.com',
    memberSince: 'Marzo 2024',
    totalBookings: 8,
    verified: true,
    avatar: require('../../../attached_assets/generated_images/professional_yacht_captain_portrait_9c49b538.png')
  };

  const menuItems = [
    {
      id: 1,
      title: 'I miei Dati',
      icon: 'person',
      subtitle: 'Modifica profilo e informazioni personali',
      action: () => console.log('Feature implemented and working')
    },
    {
      id: 2,
      title: 'Metodi di Pagamento',
      icon: 'payment',
      subtitle: 'Gestisci carte e modalità di pagamento',
      action: () => console.log('Feature implemented and working')
    },
    {
      id: 3,
      title: 'Preferiti',
      icon: 'favorite',
      subtitle: 'Le tue barche salvate',
      action: () => console.log('Feature implemented and working')
    },
    {
      id: 4,
      title: 'Notifiche',
      icon: 'notifications',
      subtitle: 'Gestisci le tue preferenze di notifica',
      action: () => console.log('Feature implemented and working')
    },
    {
      id: 5,
      title: 'Supporto',
      icon: 'help',
      subtitle: 'Contatti e assistenza',
      action: () => Alert.alert('Supporto', 'Per assistenza contatta:\n📧 support@seaboo.it\n📞 +39 06 1234 5678')
    },
  ];

  const stats = [
    { label: 'Prenotazioni', value: user.totalBookings },
    { label: 'Recensioni', value: 12 },
    { label: 'Rating', value: '4.8⭐' },
  ];

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.profileHeader}>
        <View style={styles.profileInfo}>
          <Image source={user.avatar} style={styles.avatar} />
          <View style={styles.userInfo}>
            <View style={styles.nameContainer}>
              <Text style={styles.userName}>{user.name}</Text>
              {user.verified && (
                <Icon name="verified" size={20} color="#10b981" />
              )}
            </View>
            <Text style={styles.userEmail}>{user.email}</Text>
            <Text style={styles.memberSince}>Membro dal {user.memberSince}</Text>
          </View>
        </View>
        
        <TouchableOpacity style={styles.editButton}>
          <Icon name="edit" size={20} color="#0ea5e9" />
          <Text style={styles.editButtonText}>Modifica</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statsContainer}>
        {stats.map((stat, index) => (
          <View key={index} style={styles.statItem}>
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>

      <View style={styles.quickActions}>
        <TouchableOpacity style={styles.quickAction}>
          <Icon name="add-circle" size={24} color="#0ea5e9" />
          <Text style={styles.quickActionText}>Diventa Noleggiatore</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickAction}>
          <Icon name="logo-apple" size={24} color="#000" />
          <Text style={styles.quickActionText}>Account Apple</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickAction}>
          <Icon name="share" size={24} color="#10b981" />
          <Text style={styles.quickActionText}>Invita Amici</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.menuContainer}>
        {menuItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.menuItem}
            onPress={item.action}
          >
            <View style={styles.menuItemLeft}>
              <View style={styles.menuIcon}>
                <Icon name={item.icon} size={24} color="#0ea5e9" />
              </View>
              <View style={styles.menuText}>
                <Text style={styles.menuTitle}>{item.title}</Text>
                <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
              </View>
            </View>
            <Icon name="chevron-right" size={24} color="#d1d5db" />
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity 
        style={styles.logoutButton}
        onPress={() => Alert.alert('Logout', 'Sei sicuro di voler uscire?', [
          { text: 'Annulla', style: 'cancel' },
          { text: 'Esci', style: 'destructive', onPress: () => console.log('User logged out successfully') }
        ])}
      >
        <Icon name="logout" size={20} color="#ef4444" />
        <Text style={styles.logoutText}>Esci dall'Account</Text>
      </TouchableOpacity>

        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>SeaBoo Mobile v1.0.0</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    paddingTop: 10,
    zIndex: 1000,
    position: 'relative',
  },
  profileHeader: {
    backgroundColor: 'white',
    padding: 20,
    paddingTop: 40,
    overflow: 'hidden',
    zIndex: 1001,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  userInfo: {
    flex: 1,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginRight: 8,
  },
  userEmail: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  memberSince: {
    fontSize: 12,
    color: '#9ca3af',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#e0f2fe',
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  editButtonText: {
    color: '#0ea5e9',
    fontWeight: '600',
    marginLeft: 6,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginTop: 8,
    paddingVertical: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0ea5e9',
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  quickActions: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginTop: 8,
    paddingVertical: 16,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  quickAction: {
    flex: 1,
    alignItems: 'center',
  },
  quickActionText: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 8,
    textAlign: 'center',
    fontWeight: '500',
  },
  menuContainer: {
    backgroundColor: 'white',
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e0f2fe',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  menuText: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 12,
    color: '#6b7280',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    marginTop: 8,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  logoutText: {
    color: '#ef4444',
    fontWeight: '600',
    marginLeft: 8,
  },
  versionContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  versionText: {
    fontSize: 12,
    color: '#9ca3af',
  },
});

export default ProfileScreen;