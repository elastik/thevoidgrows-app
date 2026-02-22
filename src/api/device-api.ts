import type {
  DeviceStatus,
  DeviceConfig,
  LightMode,
  ClimateSettings,
  SetModeResponse,
  UpdateSettingsResponse,
  StartSterilizationResponse,
} from '@/types/index.ts';

/** Connection states for the device manager */
export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

/**
 * Abstract device API interface.
 * Implementations: LocalAdapter (WiFi), MockAdapter (dev), CloudAdapter (future)
 */
export interface DeviceAPI {
  /** Fetch current device status — called every polling interval */
  getStatus(): Promise<DeviceStatus>;

  /** Set the active light mode */
  setMode(mode: LightMode): Promise<SetModeResponse>;

  /** Update climate control settings */
  updateSettings(settings: ClimateSettings): Promise<UpdateSettingsResponse>;

  /** Trigger UV-C sterilization cycle (15 min). Throws on 409 (dome not seated). */
  startSterilization(): Promise<StartSterilizationResponse>;

  /** Read device configuration */
  getConfig(): Promise<DeviceConfig>;
}
