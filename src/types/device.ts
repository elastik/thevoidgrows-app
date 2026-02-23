/** Light modes matching firmware LedController enum */
export type LightMode = 'void_glow' | 'uv_only' | 'blue_only' | 'off';

/** GET /status response — full device state snapshot */
export interface DeviceStatus {
  temperature: number;       // °C from BME280
  humidity: number;          // %RH from BME280
  pressure: number;          // hPa from BME280
  co2: number;               // ppm from SCD-40 (0 if no sensor)
  sensorValid: boolean;      // false if sensor read failed
  lightMode: LightMode;
  lightCycleOn: boolean;     // true during "day" phase of 12h cycle
  uvcActive: boolean;        // true during sterilization
  uvcRemainingMs: number;    // countdown in ms (0 when idle)
  domeSeated: boolean;       // reed switch state
  fanSpeed: number;          // current PWM duty (0-255)
  humidifierActive: boolean;
  climateAuto: boolean;      // true = PID control active
  uptime: number;            // seconds since boot
  version: string;           // firmware version e.g. "0.1.0"
}

/** POST /settings request body */
export interface ClimateSettings {
  humiditySetpoint: number;  // 80-95 %RH
  humidityDeadband: number;  // 1-5 %RH
  fanBaseSpeed: number;      // 0-100 (percentage, mapped to PWM)
}

/** GET /config response */
export interface DeviceConfig {
  humiditySetpoint: number;
  humidityDeadband: number;
  fanBaseSpeed: number;
  lightMode: LightMode;
  version: string;
  uptime: number;
  ssid: string;
}

/** POST /mode request body */
export interface SetModeRequest {
  mode: LightMode;
}

/** POST /mode response */
export interface SetModeResponse {
  success: boolean;
  mode: LightMode;
}

/** POST /settings response */
export interface UpdateSettingsResponse {
  success: boolean;
  settings: ClimateSettings;
}

/** POST /sterilize request body */
export interface StartSterilizationRequest {
  confirm: true;  // literal true required
}

/** POST /sterilize response */
export interface StartSterilizationResponse {
  success: boolean;
  durationMinutes: number;  // always 15
}

/** API error response shape */
export interface ApiError {
  error: string;
}
