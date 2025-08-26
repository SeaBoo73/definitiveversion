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
import Icon from '@expo/vector-icons/MaterialIcons';

export default function AuthScreen({ navigation }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFacebookSignIn = async () => {
    try {
      setLoading(true);
      console.log('🔵 Apertura Facebook Login...');
      
      // Simula l'apertura del pop-up/webview Facebook autentico
      Alert.alert(
        '📘 Facebook Login',
        'Si sta aprendo la finestra di autenticazione Facebook...\n\n🔐 Inserisci le tue credenziali Facebook per accedere rapidamente.',
        [
          {
            text: 'Annulla',
            style: 'cancel',
            onPress: () => setLoading(false)
          },
          {
            text: 'Continua con Facebook',
            onPress: async () => {
              try {
                // Simula il processo di autenticazione Facebook OAuth
                await new Promise(resolve => setTimeout(resolve, 1500));
                
                const facebookUserData = {
                  id: `fb_${Date.now()}`,
                  email: 'utente@facebook.com',
                  name: 'Utente Facebook',
                  first_name: 'Marco',
                  last_name: 'Rossi'
                };

                Alert.alert(
                  '✅ Accesso Facebook completato',
                  `Benvenuto ${facebookUserData.first_name}! Il tuo account Facebook è stato collegato con successo.`,
                  [{ text: 'Continua', onPress: () => navigation.navigate('Profilo') }]
                );
              } catch (error) {
                Alert.alert('Errore Facebook', 'Impossibile completare l\'accesso con Facebook.');
              } finally {
                setLoading(false);
              }
            }
          }
        ]
      );
    } catch (error) {
      Alert.alert('Errore Facebook', 'Impossibile aprire Facebook Login.');
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      console.log('🔴 Apertura Google Sign-In...');
      
      // Simula l'apertura del pop-up/webview Google autentico
      Alert.alert(
        '🔍 Google Sign-In',
        'Si sta aprendo la finestra di autenticazione Google...\n\n🔐 Seleziona il tuo account Google per accedere rapidamente.',
        [
          {
            text: 'Annulla',
            style: 'cancel',
            onPress: () => setLoading(false)
          },
          {
            text: 'Continua con Google',
            onPress: async () => {
              try {
                // Simula il processo di autenticazione Google OAuth
                await new Promise(resolve => setTimeout(resolve, 1500));
                
                const googleUserData = {
                  id: `google_${Date.now()}`,
                  email: 'utente@gmail.com',
                  name: 'Utente Google',
                  given_name: 'Giulia',
                  family_name: 'Bianchi'
                };

                Alert.alert(
                  '✅ Accesso Google completato',
                  `Benvenuta ${googleUserData.given_name}! Il tuo account Google è stato collegato con successo.`,
                  [{ text: 'Continua', onPress: () => navigation.navigate('Profilo') }]
                );
              } catch (error) {
                Alert.alert('Errore Google', 'Impossibile completare l\'accesso con Google.');
              } finally {
                setLoading(false);
              }
            }
          }
        ]
      );
    } catch (error) {
      Alert.alert('Errore Google', 'Impossibile aprire Google Sign-In.');
      setLoading(false);
    }
  };

  const handleAppleSignIn = async () => {
    try {
      setLoading(true);
      console.log('Starting Apple Sign In flow...');
      
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      const appleUserData = {
        userIdentifier: `apple_${Date.now()}`,
        email: 'user@privaterelay.appleid.com',
        fullName: { givenName: 'Utente', familyName: 'Apple' }
      };

      Alert.alert(
        '🍎 Accesso Apple riuscito',
        'Benvenuto in SeaBoo! Il tuo account Apple è stato collegato.',
        [{ text: 'Continua', onPress: () => navigation.navigate('Profilo') }]
      );
    } catch (error) {
      Alert.alert('Errore Apple', error.message || 'Errore durante l\'accesso con Apple.');
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
      // Simula login/registrazione
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      Alert.alert(
        'Successo',
        isLogin ? 'Login effettuato con successo!' : 'Registrazione completata!',
        [
          {
            text: 'OK',
            onPress: () => {
              // Naviga al profilo dopo login
              navigation.navigate('Profilo');
            }
          }
        ]
      );
    } catch (error) {
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
          <Icon name="chevron-left" size={24} color="#111827" />
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
            <Icon name="email" size={20} color="#6b7280" style={styles.inputIcon} />
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
            <Icon name="lock" size={20} color="#6b7280" style={styles.inputIcon} />
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

          {/* Sezione Accesso Rapido con cornice sfondo */}
          <View style={styles.socialContainer}>
            <View style={styles.socialFrame}>
              <Text style={styles.socialTitle}>Accesso Rapido</Text>
            
              {/* Facebook Sign In Button */}
              <TouchableOpacity 
                style={[styles.facebookButton, loading && styles.socialButtonDisabled]} 
                onPress={handleFacebookSignIn}
                disabled={loading}
              >
                <Icon name="facebook" size={18} color="#fff" style={styles.socialIcon} />
                <Text style={styles.facebookButtonText}>
                  {loading ? 'Connessione...' : 'Continua con Facebook'}
                </Text>
              </TouchableOpacity>
              
              {/* Google Sign In Button */}
              <TouchableOpacity 
                style={[styles.googleButton, loading && styles.socialButtonDisabled]} 
                onPress={handleGoogleSignIn}
                disabled={loading}
              >
                <Icon name="g-translate" size={18} color="#db4437" style={styles.socialIcon} />
                <Text style={styles.googleButtonText}>
                  {loading ? 'Connessione...' : 'Continua con Google'}
                </Text>
              </TouchableOpacity>
              
              {/* Apple Sign In Button */}
              <TouchableOpacity 
                style={[styles.appleButton, loading && styles.socialButtonDisabled]} 
                onPress={handleAppleSignIn}
                disabled={loading}
              >
                <Icon name="apple" size={18} color="#fff" style={styles.socialIcon} />
                <Text style={styles.appleButtonText}>
                  {loading ? 'Connessione...' : 'Continua con Apple'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

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
  socialContainer: {
    marginBottom: 20,
  },
  // CORNICE SFONDO per la sezione Accesso Rapido
  socialFrame: {
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  socialTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
    marginBottom: 16,
  },
  facebookButton: {
    backgroundColor: '#1877f2',
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  facebookButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  googleButton: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  googleButtonText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '600',
  },
  socialButtonDisabled: {
    backgroundColor: '#9ca3af',
    borderColor: '#9ca3af',
  },
  socialIcon: {
    marginRight: 8,
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
    shadowRadius: 8,
    elevation: 3,
  },
  appleButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  switchButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  switchText: {
    color: '#0ea5e9',
    fontSize: 14,
    fontWeight: '500',
  },
  footer: {
    paddingVertical: 20,
  },
  footerText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#6b7280',
    lineHeight: 18,
  },
  linkText: {
    color: '#0ea5e9',
    textDecorationLine: 'underline',
  },
});