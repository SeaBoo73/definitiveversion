import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.seaboo.mobile',
  appName: 'SeaBoo',
  webDir: 'dist/public',
  server: {
    androidScheme: 'https'
  },
  ios: {
    contentInset: 'automatic'
  }
};

export default config;
