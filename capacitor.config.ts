import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'it.seaboo.app',
  appName: 'SeaBoo',
  webDir: 'dist/public',
  server: {
    androidScheme: 'https',
    // Per development locale - il simulatore iOS raggiungerà il server web
    url: 'https://seaboo-2.replit.app',
    cleartext: true
  },
  ios: {
    contentInset: 'automatic'
  }
};

export default config;
