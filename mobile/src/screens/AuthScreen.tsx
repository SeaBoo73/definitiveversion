import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAuth } from '../services/AuthContext';

export default function AuthScreen({ navigation }: any) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();

  const handleAppleSignIn = async () => {
    try {
      setLoading(true);
      
      // Simula la richiesta di autorizzazione Apple ID
      console.log('Starting Apple Sign In flow...');
      
      // Simula il processo di autenticazione Apple
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simula i dati utente ricevuti da Apple
      const appleUserData = {
        userIdentifier: `apple_${Date.now()}`,
        email: 'user@privaterelay.appleid.com', // Apple private relay
        fullName: {
          givenName: 'Utente',
          familyName: 'Apple'
        },
        authorizationCode: 'mock_auth_code',
        identityToken: 'mock_identity_token'
      };

      console.log('Apple Sign In successful:', appleUserData);

      // Registra/autentica l'utente nel sistema
      const success = await register({
        email: appleUserData.email,
        password: appleUserData.userIdentifier, // Password generata automaticamente
        username: `apple_user_${Date.now()}`,
        role: 'customer',
        firstName: appleUserData.fullName.givenName,
        lastName: appleUserData.fullName.familyName,
        appleId: appleUserData.userIdentifier
      });

      if (success) {
        Alert.alert(
          '🍎 Accesso con Apple riuscito',
          'Benvenuto in SeaBoo! Il tuo account è stato creato con successo.',
          [
            {
              text: 'Continua',
              onPress: () => navigation.navigate('Main', { screen: 'Profile' })
            }
          ]
        );
      } else {
        throw new Error('Impossibile creare l\'account');
      }
      
    } catch (error: any) {
      console.error('Apple Sign In error:', error);
      Alert.alert(
        'Errore Apple Sign In', 
        error.message || 'Si è verificato un errore durante l\'accesso con Apple. Riprova più tardi.',
        [
          {
            text: 'OK',
            style: 'default'
          }
        ]
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAuth = async () => {
    if (!email || !password || (!isLogin && !name)) {
      Alert.alert('Errore', 'Compila tutti i campi');
      return;
    }

    setLoading(true);
    try {
      let success = false;
      
      if (isLogin) {
        success = await login(email, password);
      } else {
        success = await register({
          email,
          password,
          username: name.toLowerCase().replace(/\s/g, ''),
          role: 'customer',
          firstName: name.split(' ')[0],
          lastName: name.split(' ').slice(1).join(' ') || undefined
        });
      }

      if (success) {
        Alert.alert(
          'Successo',
          isLogin ? 'Login effettuato con successo!' : 'Registrazione completata!',
          [
            {
              text: 'OK',
              onPress: () => {
                // Naviga alla dashboard/profilo dopo login
                navigation.navigate('Main', { screen: 'Profile' });
              }
            }
          ]
        );
      } else {
        Alert.alert(
          'Errore',
          isLogin ? 'Email o password non validi' : 'Errore durante la registrazione'
        );
      }
    } catch (error: any) {
      Alert.alert('Errore', error.message || 'Si è verificato un errore');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="chevron-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>SeaBoo</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>
            {isLogin ? 'Bentornato!' : 'Crea Account'}
          </Text>
          <Text style={styles.subtitle}>
            {isLogin 
              ? 'Accedi per gestire le tue prenotazioni' 
              : 'Registrati per iniziare a navigare'
            }
          </Text>

          {!isLogin && (
            <View style={styles.inputContainer}>
              <Icon name="person" size={20} color="#6b7280" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Nome completo"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
            </View>
          )}

          <View style={styles.inputContainer}>
            <Icon name="mail" size={20} color="#6b7280" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <Icon name="lock-closed" size={20} color="#6b7280" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity 
            style={[styles.authButton, loading && styles.authButtonDisabled]} 
            onPress={handleAuth}
            disabled={loading}
          >
            <Text style={styles.authButtonText}>
              {loading ? 'Attendere...' : isLogin ? 'Accedi' : 'Registrati'}
            </Text>
          </TouchableOpacity>

          {/* Separatore */}
          <View style={styles.separator}>
            <View style={styles.separatorLine} />
            <Text style={styles.separatorText}>oppure</Text>
            <View style={styles.separatorLine} />
          </View>

          {/* Apple Sign In Button */}
          <TouchableOpacity 
            style={[styles.appleButton, loading && styles.appleButtonDisabled]} 
            onPress={handleAppleSignIn}
            disabled={loading}
          >
            <Icon name="logo-apple" size={18} color="#fff" style={styles.appleIcon} />
            <Text style={styles.appleButtonText}>
              {loading ? 'Connessione...' : 'Continua con Apple'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.switchButton}
            onPress={() => setIsLogin(!isLogin)}
          >
            <Text style={styles.switchText}>
              {isLogin 
                ? 'Non hai un account? Registrati' 
                : 'Hai già un account? Accedi'
              }
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Continuando accetti i nostri{'\n'}
            <Text style={styles.linkText}>Termini di Servizio</Text> e la{' '}
            <Text style={styles.linkText}>Privacy Policy</Text>
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 10,
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0ea5e9',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 20,
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 32,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
  },
  authButton: {
    backgroundColor: '#0ea5e9',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  authButtonDisabled: {
    backgroundColor: '#94a3b8',
  },
  authButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  separator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e5e7eb',
  },
  separatorText: {
    marginHorizontal: 16,
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  appleButton: {
    backgroundColor: '#000',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  appleButtonDisabled: {
    backgroundColor: '#666',
    opacity: 0.6,
  },
  appleIcon: {
    marginRight: 8,
  },
  appleButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  switchButton: {
    alignItems: 'center',
  },
  switchText: {
    fontSize: 14,
    color: '#0ea5e9',
    fontWeight: '500',
  },
  footer: {
    alignItems: 'center',
    paddingTop: 20,
  },
  footerText: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'center',
    lineHeight: 18,
  },
  linkText: {
    color: '#0ea5e9',
    fontWeight: '500',
  },
});