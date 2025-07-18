import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import BoatDetailsScreen from './src/screens/BoatDetailsScreen';
import OwnerDashboardScreen from './src/screens/OwnerDashboardScreen';
import { AuthProvider } from './src/services/AuthContext';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Home"
            screenOptions={{
              headerStyle: {
                backgroundColor: '#0ea5e9',
              },
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
            }}
          >
            <Stack.Screen 
              name="Home" 
              component={HomeScreen} 
              options={{ 
                title: 'SeaGO',
                headerShown: false
              }}
            />
            <Stack.Screen 
              name="Login" 
              component={LoginScreen} 
              options={{ title: 'Accedi' }}
            />
            <Stack.Screen 
              name="BoatDetails" 
              component={BoatDetailsScreen} 
              options={{ title: 'Dettagli Barca' }}
            />
            <Stack.Screen 
              name="OwnerDashboard" 
              component={OwnerDashboardScreen} 
              options={{ title: 'Dashboard Proprietario' }}
            />
          </Stack.Navigator>
        </NavigationContainer>
        <StatusBar style="auto" />
      </AuthProvider>
    </SafeAreaProvider>
  );
}