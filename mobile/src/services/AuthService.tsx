import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  id: number;
  username: string;
  email: string;
  role: 'customer' | 'owner' | 'admin';
  profile?: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    verified?: boolean;
  };
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  register: (data: RegisterData) => Promise<boolean>;
  isAuthenticated: boolean;
}

interface RegisterData {
  email: string;
  password: string;
  username: string;
  role: 'customer' | 'owner';
  firstName?: string;
  lastName?: string;
  phone?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      const userData = await AsyncStorage.getItem('user_data');
      
      if (token && userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        
        // Verifica validità token con il server
        await validateToken(token);
      }
    } catch (error) {
      console.error('Errore check auth:', error);
      await logout();
    } finally {
      setIsLoading(false);
    }
  };

  const validateToken = async (token: string) => {
    try {
      const baseUrl = __DEV__ ? 'http://localhost:5000' : 'https://your-production-url.com';
      const response = await fetch(`${baseUrl}/api/auth/validate`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Token non valido');
      }

      const userData = await response.json();
      setUser(userData);
      await AsyncStorage.setItem('user_data', JSON.stringify(userData));
    } catch (error) {
      console.error('Token validation failed:', error);
      await logout();
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const baseUrl = __DEV__ ? 'http://localhost:5000' : 'https://your-production-url.com';
      const response = await fetch(`${baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Errore login');
      }

      const data = await response.json();
      
      // Salva token e dati utente
      await AsyncStorage.setItem('auth_token', data.token);
      await AsyncStorage.setItem('user_data', JSON.stringify(data.user));
      await AsyncStorage.setItem('user_id', data.user.id.toString());
      
      setUser(data.user);
      
      // Salva FCM token se disponibile
      const fcmToken = await AsyncStorage.getItem('fcm_token');
      if (fcmToken) {
        await saveFCMToken(fcmToken);
      }
      
      return true;
    } catch (error) {
      console.error('Errore login:', error);
      return false;
    }
  };

  const register = async (data: RegisterData): Promise<boolean> => {
    try {
      const baseUrl = __DEV__ ? 'http://localhost:5000' : 'https://your-production-url.com';
      const response = await fetch(`${baseUrl}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Errore registrazione');
      }

      const responseData = await response.json();
      
      // Auto-login dopo registrazione
      return await login(data.email, data.password);
    } catch (error) {
      console.error('Errore registrazione:', error);
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      
      if (token) {
        // Notifica server del logout
        const baseUrl = __DEV__ ? 'http://localhost:5000' : 'https://your-production-url.com';
        await fetch(`${baseUrl}/api/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      }
    } catch (error) {
      console.error('Errore logout server:', error);
    } finally {
      // Pulisci storage locale
      await AsyncStorage.multiRemove([
        'auth_token',
        'user_data',
        'user_id',
        'fcm_token'
      ]);
      
      setUser(null);
    }
  };

  const saveFCMToken = async (fcmToken: string) => {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      if (!token || !user) return;

      const baseUrl = __DEV__ ? 'http://localhost:5000' : 'https://your-production-url.com';
      await fetch(`${baseUrl}/api/users/${user.id}/fcm-token`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ fcmToken })
      });
    } catch (error) {
      console.error('Errore salvataggio FCM token:', error);
    }
  };

  const updateProfile = async (updates: Partial<User['profile']>): Promise<boolean> => {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      if (!token || !user) throw new Error('Non autenticato');

      const baseUrl = __DEV__ ? 'http://localhost:5000' : 'https://your-production-url.com';
      const response = await fetch(`${baseUrl}/api/users/${user.id}/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updates)
      });

      if (!response.ok) {
        throw new Error('Errore aggiornamento profilo');
      }

      const updatedUser = await response.json();
      setUser(updatedUser);
      await AsyncStorage.setItem('user_data', JSON.stringify(updatedUser));
      
      return true;
    } catch (error) {
      console.error('Errore aggiornamento profilo:', error);
      return false;
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    logout,
    register,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};