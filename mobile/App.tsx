import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Screens per le 5 sezioni richieste
import EsploraScreen from './src/screens/EsploraScreen';
import OrmeggioScreen from './src/screens/OrmeggioScreen';
import EsperienzeScreen from './src/screens/EsperienzeScreen';
import ServiziScreen from './src/screens/ServiziScreen';
import ProfileScreen from './src/screens/ProfileScreen';

const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          switch (route.name) {
            case 'Esplora':
              iconName = 'explore';
              break;
            case 'Ormeggio':
              iconName = 'anchor';
              break;
            case 'Esperienze':
              iconName = 'sailing';
              break;
            case 'Servizi':
              iconName = 'room-service';
              break;
            case 'Profilo':
              iconName = 'person';
              break;
            default:
              iconName = 'help';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#0ea5e9',
        tabBarInactiveTintColor: '#6b7280',
        tabBarStyle: {
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
          backgroundColor: 'white',
        },
        headerShown: true,
        headerStyle: {
          backgroundColor: '#0ea5e9',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      })}
    >
      <Tab.Screen 
        name="Esplora" 
        component={EsploraScreen} 
        options={{ title: 'Esplora' }}
      />
      <Tab.Screen 
        name="Ormeggio" 
        component={OrmeggioScreen} 
        options={{ title: 'Ormeggio' }}
      />
      <Tab.Screen 
        name="Esperienze" 
        component={EsperienzeScreen} 
        options={{ title: 'Esperienze' }}
      />
      <Tab.Screen 
        name="Servizi" 
        component={ServiziScreen} 
        options={{ title: 'Servizi' }}
      />
      <Tab.Screen 
        name="Profilo" 
        component={ProfileScreen} 
        options={{ title: 'Profilo' }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <MainTabs />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}