import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Icon from '@expo/vector-icons/MaterialIcons';

// Import screens
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

          if (route.name === 'Esplora') {
            iconName = 'search';
          } else if (route.name === 'Ormeggio') {
            iconName = 'anchor';
          } else if (route.name === 'Esperienze') {
            iconName = 'explore';
          } else if (route.name === 'Servizi') {
            iconName = 'room-service';
          } else if (route.name === 'Profilo') {
            iconName = 'person';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#0ea5e9',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          paddingBottom: 5,
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
