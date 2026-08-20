import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'tn.campermap.app',
  appName: 'CamperMap TN',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    cleartext: true
  },
  plugins: {
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#0c0a09',
      overlaysWebView: false
    },
    SplashScreen: {
      launchAutoHide: true,
      launchShowDuration: 2000,
      backgroundColor: '#0c0a09',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP'
    },
    Geolocation: {
      // High accuracy GPS enabled for wild spots tracking
    }
  }
};

export default config;
