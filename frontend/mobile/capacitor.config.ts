import type { CapacitorConfig } from '@capacitor/cli';

const configuration: CapacitorConfig = {
  appId: 'com.serene.app',
  appName: 'Mental Health',
  webDir: 'dist',
  server: {
    cleartext: true,
    androidScheme: 'https',
  },
  plugins: {
    CapacitorHttp: {
      enabled: true,
    },
  },
};

export default configuration;
