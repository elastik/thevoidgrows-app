import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.thevoidgrows.app',
  appName: 'Void Core',
  webDir: 'dist',
  server: {
    // During development, use live reload from Vite dev server.
    // Uncomment and set to your dev machine's local IP:
    // url: 'http://192.168.1.100:5173',
    // cleartext: true,
    androidScheme: 'https',
  },
  plugins: {
    SplashScreen: {
      launchAutoHide: true,
      launchShowDuration: 2000,
      backgroundColor: '#0A0A0F',
      showSpinner: false,
    },
  },
  android: {
    buildOptions: {
      signingType: 'apksigner',
    },
  },
  ios: {
    scheme: 'Void Core',
  },
};

export default config;
