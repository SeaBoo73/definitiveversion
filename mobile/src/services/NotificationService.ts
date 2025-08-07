import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-push-notification-ios';
import { Platform } from 'react-native';

export interface NotificationData {
  title: string;
  body: string;
  data?: any;
  type?: 'booking' | 'message' | 'document' | 'system';
  userId?: number;
  bookingId?: number;
  messageId?: number;
}

class NotificationServiceClass {
  private initialized = false;

  async initialize() {
    if (this.initialized) return;

    // Configurazione per Android
    if (Platform.OS === 'android') {
      PushNotification.configure({
        onRegister: (token) => {
          console.log('Token Push Notification:', token);
        },
        
        onNotification: (notification) => {
          console.log('Notifica ricevuta:', notification);
          
          // Gestisci tap su notifica
          if (notification.userInteraction) {
            this.handleNotificationTap(notification);
          }
          
          // Necessario per iOS
          if (Platform.OS === 'ios') {
            notification.finish(PushNotificationIOS.FetchResult.NoData);
          }
        },
        
        senderID: "YOUR_SENDER_ID", // Da Firebase
        permissions: {
          alert: true,
          badge: true,
          sound: true,
        },
        popInitialNotification: true,
        requestPermissions: true,
      });

      // Crea canale di notifica per Android
      PushNotification.createChannel(
        {
          channelId: "seaboo_general",
          channelName: "SeaBoo Notifiche",
          channelDescription: "Notifiche generali di SeaBoo",
          playSound: true,
          soundName: "default",
          importance: 4,
          vibrate: true,
        },
        (created) => console.log(`Canale notifiche creato: ${created}`)
      );
    }

    this.initialized = true;
  }

  async getToken(): Promise<string | null> {
    try {
      const token = await messaging().getToken();
      await AsyncStorage.setItem('fcm_token', token);
      return token;
    } catch (error) {
      console.error('Errore ottenimento token FCM:', error);
      return null;
    }
  }

  async sendLocalNotification(data: NotificationData) {
    if (Platform.OS === 'android') {
      PushNotification.localNotification({
        channelId: "seago_general",
        title: data.title,
        message: data.body,
        playSound: true,
        soundName: 'default',
        userInfo: data.data || {},
        actions: this.getNotificationActions(data.type),
      });
    } else {
      PushNotificationIOS.addNotificationRequest({
        id: Date.now().toString(),
        title: data.title,
        body: data.body,
        userInfo: data.data || {},
        sound: 'default',
      });
    }
  }

  private getNotificationActions(type?: string): string[] {
    switch (type) {
      case 'booking':
        return ['Visualizza', 'Ignora'];
      case 'message':
        return ['Rispondi', 'Segna come letto'];
      case 'document':
        return ['Visualizza', 'Più tardi'];
      default:
        return ['OK'];
    }
  }

  private handleNotificationTap(notification: any) {
    const { type, bookingId, messageId, userId } = notification.data || {};
    
    // Qui puoi implementare la navigazione specifica
    switch (type) {
      case 'booking':
        // Naviga alla schermata prenotazione
        console.log('Navigating to booking:', bookingId);
        break;
      case 'message':
        // Naviga alla schermata messaggi
        console.log('Navigating to message:', messageId);
        break;
      case 'document':
        // Naviga alla schermata documenti
        console.log('Navigating to documents');
        break;
      default:
        // Naviga alla home
        console.log('Navigating to home');
    }
  }

  async scheduleNotification(data: NotificationData, date: Date) {
    if (Platform.OS === 'android') {
      PushNotification.localNotificationSchedule({
        channelId: "seago_general",
        title: data.title,
        message: data.body,
        date: date,
        userInfo: data.data || {},
      });
    } else {
      PushNotificationIOS.addNotificationRequest({
        id: Date.now().toString(),
        title: data.title,
        body: data.body,
        fireDate: date,
        userInfo: data.data || {},
      });
    }
  }

  async cancelAllNotifications() {
    if (Platform.OS === 'android') {
      PushNotification.cancelAllLocalNotifications();
    } else {
      PushNotificationIOS.removeAllPendingNotificationRequests();
    }
  }

  async cancelNotification(notificationId: string) {
    if (Platform.OS === 'android') {
      PushNotification.cancelLocalNotifications({ id: notificationId });
    } else {
      PushNotificationIOS.removePendingNotificationRequests([notificationId]);
    }
  }

  async getBadgeCount(): Promise<number> {
    if (Platform.OS === 'ios') {
      return await PushNotificationIOS.getApplicationIconBadgeNumber();
    }
    return 0;
  }

  async setBadgeCount(count: number) {
    if (Platform.OS === 'ios') {
      PushNotificationIOS.setApplicationIconBadgeNumber(count);
    } else {
      // Per Android, aggiorna il badge attraverso il backend
      try {
        const userId = await AsyncStorage.getItem('user_id');
        if (userId) {
          // Chiama API per aggiornare badge count
          fetch(`/api/users/${userId}/badge`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ count })
          });
        }
      } catch (error) {
        console.error('Errore aggiornamento badge:', error);
      }
    }
  }

  // Notifiche specifiche per SeaBoo
  async notifyBookingConfirmed(bookingId: number, boatName: string) {
    await this.sendLocalNotification({
      title: 'Prenotazione Confermata!',
      body: `La tua prenotazione per ${boatName} è stata confermata.`,
      type: 'booking',
      data: { bookingId, action: 'booking_confirmed' }
    });
  }

  async notifyNewMessage(senderName: string, messagePreview: string, messageId: number) {
    await this.sendLocalNotification({
      title: `Nuovo messaggio da ${senderName}`,
      body: messagePreview,
      type: 'message',
      data: { messageId, action: 'new_message' }
    });
  }

  async notifyDocumentVerified(documentType: string, status: 'approved' | 'rejected') {
    const title = status === 'approved' ? 'Documento Approvato' : 'Documento Respinto';
    const body = status === 'approved' 
      ? `Il tuo ${documentType} è stato approvato.`
      : `Il tuo ${documentType} necessita di revisione.`;

    await this.sendLocalNotification({
      title,
      body,
      type: 'document',
      data: { documentType, status, action: 'document_verified' }
    });
  }

  async notifyBookingReminder(bookingId: number, boatName: string, startDate: Date) {
    const reminderDate = new Date(startDate.getTime() - 24 * 60 * 60 * 1000); // 24 ore prima
    
    await this.scheduleNotification({
      title: 'Promemoria Prenotazione',
      body: `La tua prenotazione per ${boatName} inizia domani!`,
      type: 'booking',
      data: { bookingId, action: 'booking_reminder' }
    }, reminderDate);
  }

  async notifyWeatherAlert(location: string, weatherCondition: string) {
    await this.sendLocalNotification({
      title: 'Allerta Meteo',
      body: `Condizioni meteo sfavorevoli previste per ${location}: ${weatherCondition}`,
      type: 'system',
      data: { location, weatherCondition, action: 'weather_alert' }
    });
  }

  async notifySpecialOffer(title: string, description: string, boatId?: number) {
    await this.sendLocalNotification({
      title: 'Offerta Speciale!',
      body: description,
      type: 'system',
      data: { boatId, action: 'special_offer' }
    });
  }
}

export const NotificationService = new NotificationServiceClass();