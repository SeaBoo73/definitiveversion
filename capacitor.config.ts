import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'it.seaboo.app',
  appName: 'SeaBoo',
  webDir: 'dist/public',
  server: {
    androidScheme: 'https',
    // Per development locale - usa localhost invece di 127.0.0.1
    url: 'http://localhost:5000',
    cleartext: true,
    // Aggiungi configurazioni per WebKit
    allowNavigation: ['*'],
    iosScheme: 'capacitor'
  },
  ios: {
    contentInset: 'automatic',
    // Configurazioni per risolvere problemi WebKit
    allowsLinkPreview: false,
    scrollEnabled: true
  },
  // Configurazioni aggiuntive per networking
  plugins: {
    CapacitorHttp: {
      enabled: true
    }
  }
};

export default config;
