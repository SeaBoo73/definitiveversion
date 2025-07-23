import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl
} from 'react-native';
import { OfflineService } from '../services/OfflineService';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function OfflineScreen() {
  const [isOffline, setIsOffline] = useState(false);
  const [offlineStats, setOfflineStats] = useState<any>({});
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadOfflineData();
  }, []);

  const loadOfflineData = async () => {
    setIsOffline(OfflineService.isOfflineMode());
    const stats = await OfflineService.getOfflineStats();
    setOfflineStats(stats);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadOfflineData();
    setRefreshing(false);
  };

  const syncNow = async () => {
    if (isOffline) {
      Alert.alert('Offline', 'Impossibile sincronizzare in modalità offline');
      return;
    }

    Alert.alert(
      'Sincronizzazione',
      'Vuoi sincronizzare tutti i dati ora?',
      [
        { text: 'Annulla', style: 'cancel' },
        {
          text: 'Sincronizza',
          onPress: async () => {
            try {
              await OfflineService.syncOfflineData();
              await OfflineService.syncPendingData();
              Alert.alert('Successo', 'Dati sincronizzati con successo');
              loadOfflineData();
            } catch (error) {
              Alert.alert('Errore', 'Errore durante la sincronizzazione');
            }
          }
        }
      ]
    );
  };

  const clearCache = () => {
    Alert.alert(
      'Pulisci Cache',
      'Questo rimuoverà tutti i dati offline. Continuare?',
      [
        { text: 'Annulla', style: 'cancel' },
        {
          text: 'Pulisci',
          style: 'destructive',
          onPress: async () => {
            await OfflineService.clearCache();
            Alert.alert('Successo', 'Cache pulita con successo');
            loadOfflineData();
          }
        }
      ]
    );
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (timestamp: string) => {
    if (!timestamp) return 'Mai';
    return new Date(parseInt(timestamp)).toLocaleString('it-IT');
  };

  const StatCard = ({ icon, title, value, subtitle, color = '#0066CC' }: any) => (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <Icon name={icon} size={24} color={color} style={styles.statIcon} />
      <View style={styles.statContent}>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statTitle}>{title}</Text>
        {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
      </View>
    </View>
  );

  const ActionCard = ({ icon, title, subtitle, onPress, color = '#0066CC', danger = false }: any) => (
    <TouchableOpacity
      style={[styles.actionCard, danger && styles.dangerCard]}
      onPress={onPress}
    >
      <Icon name={icon} size={24} color={danger ? '#F44336' : color} />
      <View style={styles.actionContent}>
        <Text style={[styles.actionTitle, danger && styles.dangerText]}>{title}</Text>
        <Text style={[styles.actionSubtitle, danger && styles.dangerSubtext]}>{subtitle}</Text>
      </View>
      <Icon name="chevron-right" size={20} color="#ccc" />
    </TouchableOpacity>
  );

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {/* Status Header */}
      <View style={[styles.statusHeader, { backgroundColor: isOffline ? '#FF6B35' : '#4CAF50' }]}>
        <Icon 
          name={isOffline ? 'cloud-off' : 'cloud-done'} 
          size={32} 
          color="#FFF" 
        />
        <View style={styles.statusInfo}>
          <Text style={styles.statusTitle}>
            {isOffline ? 'Modalità Offline' : 'Online'}
          </Text>
          <Text style={styles.statusSubtitle}>
            {isOffline 
              ? 'Stai utilizzando dati memorizzati localmente'
              : 'Connesso ai server SeaGO'
            }
          </Text>
        </View>
      </View>

      {/* Statistics */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Statistiche Offline</Text>
        
        <StatCard
          icon="directions-boat"
          title="Barche in Cache"
          value={offlineStats.cachedBoats || 0}
          color="#2196F3"
        />
        
        <StatCard
          icon="event"
          title="Prenotazioni in Cache"
          value={offlineStats.cachedBookings || 0}
          color="#FF9800"
        />
        
        <StatCard
          icon="message"
          title="Messaggi in Cache"
          value={offlineStats.cachedMessages || 0}
          color="#9C27B0"
        />
        
        <StatCard
          icon="pending"
          title="Azioni in Attesa"
          value={offlineStats.pendingActions || 0}
          subtitle={offlineStats.pendingActions > 0 ? 'Saranno sincronizzate quando torni online' : ''}
          color="#FF5722"
        />
      </View>

      {/* Storage Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Utilizzo Storage</Text>
        
        <View style={styles.storageCard}>
          <View style={styles.storageHeader}>
            <Icon name="storage" size={24} color="#666" />
            <Text style={styles.storageTitle}>Spazio Utilizzato</Text>
          </View>
          <Text style={styles.storageValue}>
            {formatBytes(offlineStats.storageUsed || 0)}
          </Text>
          <Text style={styles.storageSubtitle}>
            Ultima sincronizzazione: {formatDate(offlineStats.lastSync)}
          </Text>
        </View>
      </View>

      {/* Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Azioni</Text>
        
        <ActionCard
          icon="sync"
          title="Sincronizza Ora"
          subtitle={isOffline ? 'Non disponibile offline' : 'Aggiorna tutti i dati'}
          onPress={syncNow}
          color="#4CAF50"
        />
        
        <ActionCard
          icon="refresh"
          title="Aggiorna Statistiche"
          subtitle="Ricarica informazioni offline"
          onPress={loadOfflineData}
          color="#2196F3"
        />
        
        <ActionCard
          icon="delete-sweep"
          title="Pulisci Cache"
          subtitle="Rimuovi tutti i dati offline"
          onPress={clearCache}
          danger={true}
        />
      </View>

      {/* Info Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Informazioni</Text>
        
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Come funziona la modalità offline?</Text>
          <Text style={styles.infoText}>
            • Le barche, prenotazioni e messaggi vengono salvati automaticamente sul dispositivo{'\n'}
            • Puoi navigare nell'app anche senza connessione{'\n'}
            • Le azioni (prenotazioni, messaggi) vengono sincronizzate quando torni online{'\n'}
            • I dati offline vengono aggiornati automaticamente ogni volta che sei connesso
          </Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Limitazioni Offline</Text>
          <Text style={styles.infoText}>
            • Non puoi completare nuove prenotazioni{'\n'}
            • I messaggi non vengono inviati immediatamente{'\n'}
            • Le ricerche utilizzano solo dati memorizzati{'\n'}
            • Le mappe potrebbero non funzionare correttamente
          </Text>
        </View>
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
  statusHeader: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusInfo: {
    marginLeft: 15,
    flex: 1,
  },
  statusTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 4,
  },
  statusSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  statCard: {
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    marginBottom: 10,
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statIcon: {
    marginRight: 15,
  },
  statContent: {
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  statTitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 2,
  },
  statSubtitle: {
    fontSize: 12,
    color: '#999',
  },
  storageCard: {
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  storageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  storageTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 10,
  },
  storageValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0066CC',
    marginBottom: 5,
  },
  storageSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  actionCard: {
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    marginBottom: 10,
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dangerCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#F44336',
  },
  actionContent: {
    flex: 1,
    marginLeft: 15,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  actionSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  dangerText: {
    color: '#F44336',
  },
  dangerSubtext: {
    color: '#FF7043',
  },
  infoCard: {
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    marginBottom: 15,
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
  },
  footer: {
    height: 40,
  },
});