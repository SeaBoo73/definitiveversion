import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Screens semplificati per mobile
import HomeScreen from './src/screens/HomeScreen';
import SearchScreen from './src/screens/SearchScreen'; 
import BookingsScreen from './src/screens/BookingsScreen';
import ProfileScreen from './src/screens/ProfileScreen';

const Tab = createBottomTabNavigator();

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
            case 'Cerca':
              iconName = 'search';
              break;
            case 'Prenotazioni':
              iconName = 'event';
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
        name="Home" 
        component={HomeScreen} 
        options={{ title: 'SeaGO' }}
      />
      <Tab.Screen 
        name="Cerca" 
        component={SearchScreen} 
        options={{ title: 'Cerca Barche' }}
      />
      <Tab.Screen 
        name="Prenotazioni" 
        component={BookingsScreen} 
        options={{ title: 'Le mie Prenotazioni' }}
      />
      <Tab.Screen 
        name="Profilo" 
        component={ProfileScreen} 
        options={{ title: 'Il mio Profilo' }}
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