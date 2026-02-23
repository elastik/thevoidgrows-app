import type {
  DeviceStatus,
  DeviceConfig,
  LightMode,
  ClimateSettings,
  SetModeResponse,
  UpdateSettingsResponse,
  StartSterilizationResponse,
} from '@/types/index.ts';
import type { DeviceAPI } from './device-api.ts';

const UVC_DURATION_MS = 15 * 60 * 1000;

/**
 * MockAdapter — provides fake sensor data with realistic variation.
 *
 * Enables app development and testing without physical VoidCore hardware.
 * Sensor readings vary slightly on each call to simulate real BME280 noise.
 * UV-C sterilization timer counts down and auto-expires after 15 minutes.
 */
export class MockAdapter implements DeviceAPI {
  private lightMode: LightMode = 'void_glow';
  private climateSettings: ClimateSettings = {
    humiditySetpoint: 90,
    humidityDeadband: 3,
    fanBaseSpeed: 50,
  };
  private uvcActive: boolean = false;
  private uvcStartTime: number = 0;
  private baseTemp: number = 22;
  private baseHumidity: number = 88;
  private baseCo2: number = 800;

  /** Add realistic noise around a base value. */
  private vary(base: number, range: number): number {
    return base + (Math.random() - 0.5) * range * 2;
  }

  /** Simulate network latency. */
  private delay(ms: number = 50): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async getStatus(): Promise<DeviceStatus> {
    await this.delay();

    // Auto-expire UV-C after 15 minutes
    if (this.uvcActive && Date.now() - this.uvcStartTime >= UVC_DURATION_MS) {
      this.uvcActive = false;
      this.uvcStartTime = 0;
    }

    const uvcRemainingMs = this.uvcActive
      ? Math.max(0, UVC_DURATION_MS - (Date.now() - this.uvcStartTime))
      : 0;

    return {
      temperature: Math.round(this.vary(this.baseTemp, 0.5) * 10) / 10,
      humidity: Math.round(this.vary(this.baseHumidity, 2) * 10) / 10,
      pressure: Math.round(this.vary(1013, 1) * 10) / 10,
      co2: Math.round(this.vary(this.baseCo2, 30)),
      sensorValid: true,
      lightMode: this.lightMode,
      lightCycleOn: true,
      uvcActive: this.uvcActive,
      uvcRemainingMs,
      domeSeated: true,
      fanSpeed: Math.round(this.climateSettings.fanBaseSpeed * 2.55),
      humidifierActive: this.baseHumidity < this.climateSettings.humiditySetpoint,
      climateAuto: true,
      uptime: Math.round(Date.now() / 1000),
      version: '0.1.0',
    };
  }

  async setMode(mode: LightMode): Promise<SetModeResponse> {
    await this.delay();
    this.lightMode = mode;
    return { success: true, mode };
  }

  async updateSettings(settings: ClimateSettings): Promise<UpdateSettingsResponse> {
    await this.delay();
    this.climateSettings = { ...settings };
    // Simulate FAE: higher fan speed pushes CO2 down
    this.baseCo2 = Math.round(1200 - (settings.fanBaseSpeed / 100) * 600);
    return { success: true, settings: { ...this.climateSettings } };
  }

  async startSterilization(): Promise<StartSterilizationResponse> {
    await this.delay();
    this.uvcActive = true;
    this.uvcStartTime = Date.now();
    return { success: true, durationMinutes: 15 };
  }

  async getConfig(): Promise<DeviceConfig> {
    await this.delay();
    return {
      humiditySetpoint: this.climateSettings.humiditySetpoint,
      humidityDeadband: this.climateSettings.humidityDeadband,
      fanBaseSpeed: this.climateSettings.fanBaseSpeed,
      lightMode: this.lightMode,
      version: '0.1.0',
      uptime: Math.round(Date.now() / 1000),
      ssid: 'VoidCore-Mock',
    };
  }
}
