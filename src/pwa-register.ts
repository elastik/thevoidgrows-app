/// <reference types="vite-plugin-pwa/vanillajs" />

import { registerSW } from 'virtual:pwa-register';

/**
 * Register the service worker with auto-update.
 * When a new version is detected, it updates automatically.
 */
export function setupPWA(): void {
  registerSW({
    immediate: true,
    onRegisteredSW(_swUrl: string, registration?: ServiceWorkerRegistration) {
      if (registration) {
        // Check for updates every hour
        setInterval(() => {
          void registration.update();
        }, 60 * 60 * 1000);
      }
    },
  });
}
