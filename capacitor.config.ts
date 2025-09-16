import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'it.seaboo.app',
  appName: 'SeaBoo',
  webDir: 'dist/public',
  server: {
    androidScheme: 'https',
    // Per development locale - usa server locale per testing immediato
    url: 'http://127.0.0.1:5000',
    cleartext: true
  },
  ios: {
    contentInset: 'automatic'
  }
};

export default config;
