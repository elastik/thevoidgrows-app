import type { DeviceAPI } from './device-api.ts';
import { LocalAdapter } from './local-adapter.ts';
import { MockAdapter } from './mock-adapter.ts';

/**
 * Factory that returns the appropriate DeviceAPI adapter based on environment.
 *
 * - `VITE_MOCK_API=true` → MockAdapter (no hardware required)
 * - Otherwise → LocalAdapter (connects to ESP32 over WiFi)
 */
export function createAdapter(forceMock?: boolean): DeviceAPI {
  if (forceMock || import.meta.env.VITE_MOCK_API === 'true') {
    return new MockAdapter();
  }
  return new LocalAdapter();
}
