import type { CapacitorConfig } from '@capacitor/cli';

const configuration: CapacitorConfig = {
  appId: 'com.serene.app',
  appName: 'Serene',
  webDir: 'dist',
  server: {
    cleartext: true,
    androidScheme: 'http',
  },
};

export default configuration;
