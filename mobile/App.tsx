import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';

// Import screens
import EsploraScreen from './src/screens/EsploraScreen';
import EsperienzeScreen from './src/screens/EsperienzeScreen';
import CharterScreen from './src/screens/CharterScreen';
import AiutoScreen from './src/screens/AiutoScreen';
import ProfiloScreen from './src/screens/ProfiloScreen';
import BoatDetailsScreen from './src/screens/BoatDetailsScreen';
import BookingScreen from './src/screens/BookingScreen';
import AuthScreen from './src/screens/AuthScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string;

          switch (route.name) {
            case 'Esplora':
              iconName = focused ? 'search' : 'search-outline';
              break;
            case 'Esperienze':
              iconName = focused ? 'star' : 'star-outline';
              break;
            case 'Charter':
              iconName = focused ? 'boat' : 'boat-outline';
              break;
            case 'Aiuto':
              iconName = focused ? 'help-circle' : 'help-circle-outline';
              break;
            case 'Profilo':
              iconName = focused ? 'person' : 'person-outline';
              break;
            default:
              iconName = 'circle';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#0ea5e9',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: 'white',
          borderTopWidth: 1,
          borderTopColor: '#e5e7eb',
          height: 90,
          paddingBottom: 20,
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Esplora" component={EsploraScreen} />
      <Tab.Screen name="Esperienze" component={EsperienzeScreen} />
      <Tab.Screen name="Charter" component={CharterScreen} />
      <Tab.Screen name="Aiuto" component={AiutoScreen} />
      <Tab.Screen name="Profilo" component={ProfiloScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Main" component={TabNavigator} />
          <Stack.Screen name="BoatDetails" component={BoatDetailsScreen} />
          <Stack.Screen name="Booking" component={BookingScreen} />
          <Stack.Screen name="Auth" component={AuthScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}