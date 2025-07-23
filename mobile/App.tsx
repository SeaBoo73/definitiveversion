import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Alert, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-netinfo/netinfo';
import messaging from '@react-native-firebase/messaging';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Screens
import HomeScreen from './src/screens/HomeScreen';
import SearchScreen from './src/screens/SearchScreen';
import BookingsScreen from './src/screens/BookingsScreen';
import MessagesScreen from './src/screens/MessagesScreen';
import ServicesScreen from './src/screens/ServicesScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import BoatDetailsScreen from './src/screens/BoatDetailsScreen';
import BookingScreen from './src/screens/BookingScreen';
import MapScreen from './src/screens/MapScreen';
import DocumentsScreen from './src/screens/DocumentsScreen';
import OfflineScreen from './src/screens/OfflineScreen';

// Services
import { AuthProvider } from './src/services/AuthService';
import { LocationProvider } from './src/services/LocationService';
import { NotificationService } from './src/services/NotificationService';
import { OfflineService } from './src/services/OfflineService';

// Create navigators
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      staleTime: 5 * 60 * 1000, // 5 minuti
    },
  },
});

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          switch (route.name) {
            case 'Home':
              iconName = 'home';
              break;
            case 'Search':
              iconName = 'search';
              break;
            case 'Bookings':
              iconName = 'event';
              break;
            case 'Messages':
              iconName = 'message';
              break;
            case 'Services':
              iconName = 'cloud';
              break;
            case 'Profile':
              iconName = 'person';
              break;
            default:
              iconName = 'help';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#0066CC',
        tabBarInactiveTintColor: 'gray',
        headerStyle: {
          backgroundColor: '#0066CC',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ title: 'SeaGO' }}
      />
      <Tab.Screen 
        name="Search" 
        component={SearchScreen} 
        options={{ title: 'Cerca' }}
      />
      <Tab.Screen 
        name="Bookings" 
        component={BookingsScreen} 
        options={{ title: 'Prenotazioni' }}
      />
      <Tab.Screen 
        name="Messages" 
        component={MessagesScreen} 
        options={{ title: 'Messaggi' }}
      />
      <Tab.Screen 
        name="Services" 
        component={ServicesScreen} 
        options={{ title: 'Servizi' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{ title: 'Profilo' }}
      />
    </Tab.Navigator>
  );
}

function AppNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="MainTabs" 
        component={MainTabs} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="BoatDetails" 
        component={BoatDetailsScreen}
        options={{ title: 'Dettagli Barca' }}
      />
      <Stack.Screen 
        name="Booking" 
        component={BookingScreen}
        options={{ title: 'Prenota' }}
      />
      <Stack.Screen 
        name="Map" 
        component={MapScreen}
        options={{ title: 'Mappa' }}
      />
      <Stack.Screen 
        name="Documents" 
        component={DocumentsScreen}
        options={{ title: 'Documenti' }}
      />
      <Stack.Screen 
        name="Offline" 
        component={OfflineScreen}
        options={{ title: 'Modalità Offline' }}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  const [isConnected, setIsConnected] = useState(true);
  const [hasLocationPermission, setHasLocationPermission] = useState(false);
  const [hasNotificationPermission, setHasNotificationPermission] = useState(false);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    // Richiedi permessi
    await requestLocationPermission();
    await requestNotificationPermission();
    
    // Inizializza servizi
    await NotificationService.initialize();
    await OfflineService.initialize();
    
    // Monitor connessione di rete
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected ?? false);
      
      if (!state.isConnected) {
        // Attiva modalità offline
        OfflineService.setOfflineMode(true);
      } else {
        // Sincronizza dati quando torna online
        OfflineService.setOfflineMode(false);
        OfflineService.syncPendingData();
      }
    });

    return unsubscribe;
  };

  const requestLocationPermission = async () => {
    try {
      const permission = Platform.OS === 'ios' 
        ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE 
        : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;

      const result = await request(permission);
      
      if (result === RESULTS.GRANTED) {
        setHasLocationPermission(true);
      } else {
        Alert.alert(
          'Permesso Geolocalizzazione',
          'SeaGO ha bisogno del permesso di geolocalizzazione per trovare barche vicine a te.',
          [
            { text: 'OK' }
          ]
        );
      }
    } catch (error) {
      console.error('Errore richiesta permesso geolocalizzazione:', error);
    }
  };

  const requestNotificationPermission = async () => {
    try {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        setHasNotificationPermission(true);
        
        // Ottieni token FCM
        const token = await messaging().getToken();
        console.log('FCM Token:', token);
        
        // Salva token nel backend
        await AsyncStorage.setItem('fcm_token', token);
        
        // Gestisci messaggi in foreground
        messaging().onMessage(async remoteMessage => {
          Alert.alert(
            remoteMessage.notification?.title || 'Notifica',
            remoteMessage.notification?.body || 'Hai ricevuto una nuova notifica'
          );
        });

        // Gestisci tap su notifica quando app è in background
        messaging().onNotificationOpenedApp(remoteMessage => {
          console.log('Notifica aperta:', remoteMessage);
          // Naviga alla schermata appropriata
        });

        // Gestisci apertura app da notifica quando app è chiusa
        messaging()
          .getInitialNotification()
          .then(remoteMessage => {
            if (remoteMessage) {
              console.log('App aperta da notifica:', remoteMessage);
              // Naviga alla schermata appropriata
            }
          });
      }
    } catch (error) {
      console.error('Errore richiesta permesso notifiche:', error);
    }
  };

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <LocationProvider hasPermission={hasLocationPermission}>
            <NavigationContainer>
              <AppNavigator />
            </NavigationContainer>
          </LocationProvider>
        </AuthProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}