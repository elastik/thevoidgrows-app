import type {
  DeviceStatus,
  DeviceConfig,
  LightMode,
  ClimateSettings,
  SetModeResponse,
  UpdateSettingsResponse,
  StartSterilizationResponse,
  ApiError,
} from '@/types/index.ts';
import type { DeviceAPI } from './device-api.ts';

/**
 * LocalAdapter — communicates with the ESP32 REST API over local WiFi.
 *
 * This is the production adapter used when the phone is connected
 * to the VoidCore WiFi AP (SSID: VoidCore, default IP: 192.168.4.1).
 */
export class LocalAdapter implements DeviceAPI {
  private readonly baseUrl: string;
  private readonly timeoutMs: number;

  constructor(baseUrl: string = 'http://192.168.4.1', timeoutMs: number = 5000) {
    this.baseUrl = baseUrl;
    this.timeoutMs = timeoutMs;
  }

  /**
   * Send an HTTP request to the ESP32 with timeout and error handling.
   * Prepends baseUrl, applies AbortController timeout, parses JSON response.
   */
  private async request<T>(path: string, options?: RequestInit): Promise<T> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const response = await fetch(`${this.baseUrl}${path}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        signal: controller.signal,
      });

      if (!response.ok) {
        let message = `HTTP ${response.status}`;
        try {
          const body = (await response.json()) as ApiError;
          if (body.error) {
            message = body.error;
          }
        } catch {
          // Could not parse error body — use generic HTTP status message
        }
        throw new Error(message);
      }

      return (await response.json()) as T;
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Request timed out');
        }
        // Re-throw errors we already created (HTTP errors from above)
        if (error.message !== 'Failed to fetch') {
          throw error;
        }
      }
      throw new Error('Device unreachable');
    } finally {
      clearTimeout(timeout);
    }
  }

  /** Fetch current device status — called every polling interval */
  async getStatus(): Promise<DeviceStatus> {
    return this.request<DeviceStatus>('/status');
  }

  /** Set the active light mode */
  async setMode(mode: LightMode): Promise<SetModeResponse> {
    return this.request<SetModeResponse>('/mode', {
      method: 'POST',
      body: JSON.stringify({ mode }),
    });
  }

  /** Update climate control settings */
  async updateSettings(settings: ClimateSettings): Promise<UpdateSettingsResponse> {
    return this.request<UpdateSettingsResponse>('/settings', {
      method: 'POST',
      body: JSON.stringify(settings),
    });
  }

  /** Trigger UV-C sterilization cycle (15 min). Throws on 409 (dome not seated). */
  async startSterilization(): Promise<StartSterilizationResponse> {
    return this.request<StartSterilizationResponse>('/sterilize', {
      method: 'POST',
      body: JSON.stringify({ confirm: true }),
    });
  }

  /** Read device configuration */
  async getConfig(): Promise<DeviceConfig> {
    return this.request<DeviceConfig>('/config');
  }
}
