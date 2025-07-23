import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-netinfo/netinfo';

export interface OfflineData {
  boats: any[];
  bookings: any[];
  messages: any[];
  lastSync: number;
}

export interface PendingAction {
  id: string;
  type: 'booking' | 'message' | 'favorite' | 'review';
  data: any;
  timestamp: number;
  retryCount: number;
}

class OfflineServiceClass {
  private isOffline = false;
  private syncInterval: NodeJS.Timeout | null = null;
  private pendingActions: PendingAction[] = [];

  async initialize() {
    // Carica azioni pendenti
    await this.loadPendingActions();
    
    // Avvia sincronizzazione periodica
    this.startPeriodicSync();
    
    // Monitor connessione
    NetInfo.addEventListener(state => {
      const wasOffline = this.isOffline;
      this.setOfflineMode(!state.isConnected);
      
      // Se torna online, sincronizza
      if (wasOffline && state.isConnected) {
        this.syncPendingData();
      }
    });
  }

  setOfflineMode(offline: boolean) {
    this.isOffline = offline;
    
    if (!offline) {
      // Riprendi sincronizzazione quando torna online
      this.startPeriodicSync();
    } else {
      // Ferma sincronizzazione in modalità offline
      this.stopPeriodicSync();
    }
  }

  isOfflineMode(): boolean {
    return this.isOffline;
  }

  private startPeriodicSync() {
    if (this.syncInterval) return;
    
    // Sincronizza ogni 5 minuti quando online
    this.syncInterval = setInterval(() => {
      if (!this.isOffline) {
        this.syncOfflineData();
      }
    }, 5 * 60 * 1000);
  }

  private stopPeriodicSync() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
  }

  // Gestione dati offline
  async cacheBoats(boats: any[]) {
    try {
      const data = {
        boats,
        timestamp: Date.now()
      };
      await AsyncStorage.setItem('cached_boats', JSON.stringify(data));
    } catch (error) {
      console.error('Errore cache barche:', error);
    }
  }

  async getCachedBoats(): Promise<any[]> {
    try {
      const cached = await AsyncStorage.getItem('cached_boats');
      if (cached) {
        const data = JSON.parse(cached);
        // Cache valida per 24 ore
        if (Date.now() - data.timestamp < 24 * 60 * 60 * 1000) {
          return data.boats || [];
        }
      }
    } catch (error) {
      console.error('Errore lettura cache barche:', error);
    }
    return [];
  }

  async cacheBookings(bookings: any[]) {
    try {
      const data = {
        bookings,
        timestamp: Date.now()
      };
      await AsyncStorage.setItem('cached_bookings', JSON.stringify(data));
    } catch (error) {
      console.error('Errore cache prenotazioni:', error);
    }
  }

  async getCachedBookings(): Promise<any[]> {
    try {
      const cached = await AsyncStorage.getItem('cached_bookings');
      if (cached) {
        const data = JSON.parse(cached);
        // Cache valida per 1 ora
        if (Date.now() - data.timestamp < 60 * 60 * 1000) {
          return data.bookings || [];
        }
      }
    } catch (error) {
      console.error('Errore lettura cache prenotazioni:', error);
    }
    return [];
  }

  async cacheMessages(messages: any[]) {
    try {
      const data = {
        messages,
        timestamp: Date.now()
      };
      await AsyncStorage.setItem('cached_messages', JSON.stringify(data));
    } catch (error) {
      console.error('Errore cache messaggi:', error);
    }
  }

  async getCachedMessages(): Promise<any[]> {
    try {
      const cached = await AsyncStorage.getItem('cached_messages');
      if (cached) {
        const data = JSON.parse(cached);
        return data.messages || [];
      }
    } catch (error) {
      console.error('Errore lettura cache messaggi:', error);
    }
    return [];
  }

  // Gestione azioni pendenti
  async addPendingAction(type: PendingAction['type'], data: any) {
    const action: PendingAction = {
      id: Date.now().toString(),
      type,
      data,
      timestamp: Date.now(),
      retryCount: 0
    };

    this.pendingActions.push(action);
    await this.savePendingActions();
    
    // Se online, prova subito a sincronizzare
    if (!this.isOffline) {
      this.syncPendingData();
    }
  }

  private async loadPendingActions() {
    try {
      const cached = await AsyncStorage.getItem('pending_actions');
      if (cached) {
        this.pendingActions = JSON.parse(cached);
      }
    } catch (error) {
      console.error('Errore caricamento azioni pendenti:', error);
    }
  }

  private async savePendingActions() {
    try {
      await AsyncStorage.setItem('pending_actions', JSON.stringify(this.pendingActions));
    } catch (error) {
      console.error('Errore salvataggio azioni pendenti:', error);
    }
  }

  async syncPendingData() {
    if (this.isOffline || this.pendingActions.length === 0) {
      return;
    }

    const actionsToRetry = [...this.pendingActions];
    
    for (const action of actionsToRetry) {
      try {
        await this.executePendingAction(action);
        
        // Rimuovi azione completata
        this.pendingActions = this.pendingActions.filter(a => a.id !== action.id);
        
      } catch (error) {
        console.error('Errore esecuzione azione pendente:', error);
        
        // Incrementa contatore retry
        action.retryCount++;
        
        // Rimuovi azioni con troppi tentativi falliti
        if (action.retryCount >= 3) {
          this.pendingActions = this.pendingActions.filter(a => a.id !== action.id);
        }
      }
    }

    await this.savePendingActions();
  }

  private async executePendingAction(action: PendingAction) {
    const baseUrl = __DEV__ ? 'http://localhost:5000' : 'https://your-production-url.com';
    
    switch (action.type) {
      case 'booking':
        await fetch(`${baseUrl}/api/bookings`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(action.data)
        });
        break;
        
      case 'message':
        await fetch(`${baseUrl}/api/messages`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(action.data)
        });
        break;
        
      case 'favorite':
        await fetch(`${baseUrl}/api/favorites`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(action.data)
        });
        break;
        
      case 'review':
        await fetch(`${baseUrl}/api/reviews`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(action.data)
        });
        break;
    }
  }

  // Sincronizzazione dati essenziali
  async syncOfflineData() {
    if (this.isOffline) return;

    try {
      const baseUrl = __DEV__ ? 'http://localhost:5000' : 'https://your-production-url.com';
      
      // Sincronizza barche
      const boatsResponse = await fetch(`${baseUrl}/api/boats`);
      if (boatsResponse.ok) {
        const boats = await boatsResponse.json();
        await this.cacheBoats(boats);
      }

      // Sincronizza prenotazioni utente (se autenticato)
      const userId = await AsyncStorage.getItem('user_id');
      if (userId) {
        const bookingsResponse = await fetch(`${baseUrl}/api/bookings/user/${userId}`);
        if (bookingsResponse.ok) {
          const bookings = await bookingsResponse.json();
          await this.cacheBookings(bookings);
        }

        // Sincronizza messaggi
        const messagesResponse = await fetch(`${baseUrl}/api/messages/user/${userId}`);
        if (messagesResponse.ok) {
          const messages = await messagesResponse.json();
          await this.cacheMessages(messages);
        }
      }

      // Aggiorna timestamp ultimo sync
      await AsyncStorage.setItem('last_sync', Date.now().toString());
      
    } catch (error) {
      console.error('Errore sincronizzazione:', error);
    }
  }

  // Informazioni essenziali offline
  async getEssentialInfo(): Promise<any> {
    return {
      boats: await this.getCachedBoats(),
      bookings: await this.getCachedBookings(),
      messages: await this.getCachedMessages(),
      pendingActionsCount: this.pendingActions.length,
      lastSync: await AsyncStorage.getItem('last_sync'),
      isOffline: this.isOffline
    };
  }

  // Ricerca offline
  async searchBoatsOffline(query: string): Promise<any[]> {
    const boats = await this.getCachedBoats();
    
    return boats.filter(boat => 
      boat.name?.toLowerCase().includes(query.toLowerCase()) ||
      boat.location?.toLowerCase().includes(query.toLowerCase()) ||
      boat.type?.toLowerCase().includes(query.toLowerCase())
    );
  }

  // Statistiche offline
  async getOfflineStats() {
    const boats = await this.getCachedBoats();
    const bookings = await this.getCachedBookings();
    const messages = await this.getCachedMessages();
    
    return {
      cachedBoats: boats.length,
      cachedBookings: bookings.length,
      cachedMessages: messages.length,
      pendingActions: this.pendingActions.length,
      lastSync: await AsyncStorage.getItem('last_sync'),
      storageUsed: await this.calculateStorageUsage()
    };
  }

  private async calculateStorageUsage(): Promise<number> {
    try {
      const keys = ['cached_boats', 'cached_bookings', 'cached_messages', 'pending_actions'];
      let totalSize = 0;
      
      for (const key of keys) {
        const data = await AsyncStorage.getItem(key);
        if (data) {
          totalSize += new Blob([data]).size;
        }
      }
      
      return totalSize;
    } catch (error) {
      console.error('Errore calcolo storage:', error);
      return 0;
    }
  }

  // Pulizia cache
  async clearCache() {
    try {
      const keysToRemove = [
        'cached_boats',
        'cached_bookings', 
        'cached_messages',
        'last_sync'
      ];
      
      await AsyncStorage.multiRemove(keysToRemove);
    } catch (error) {
      console.error('Errore pulizia cache:', error);
    }
  }

  async clearPendingActions() {
    this.pendingActions = [];
    await AsyncStorage.removeItem('pending_actions');
  }
}

export const OfflineService = new OfflineServiceClass();