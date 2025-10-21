import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'it.seaboo.app',
  appName: 'SeaBoo',
  webDir: 'client',
  server: {
    androidScheme: 'https'
  },
  ios: {
    scheme: 'SeaBoo'
  }
};

export default config;