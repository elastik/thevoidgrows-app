# Void Core — Firmware REST API Contract

> **API Version:** 1.0.0
> **Last Updated:** 2026-02-22

Single source of truth for firmware (C++) and app (TypeScript) communication.

---

## 1. Overview

The Void Core ESP32 runs a WiFi Access Point with a REST API served by ESPAsyncWebServer.

| Property       | Value                  |
|----------------|------------------------|
| WiFi Mode      | AP (Access Point)      |
| SSID           | `VoidCore`             |
| Password       | `voidgrows`            |
| Default IP     | `192.168.4.1`          |
| Port           | `80`                   |
| CORS           | `Access-Control-Allow-Origin: *` |
| Content-Type   | `application/json`     |

The app connects to the VoidCore WiFi network, then communicates with the ESP32 at `http://192.168.4.1`.

## 2. Authentication

None. The API is accessible to any device connected to the VoidCore WiFi AP. Security relies on physical proximity (must be within WiFi range) and the WPA2 password.

## 3. Endpoint Reference

### GET /status

Full device state snapshot. The app polls this every 2 seconds.

**Request:** No body.

**Response (200):**

```json
{
  "temperature": 23.5,
  "humidity": 87.2,
  "pressure": 1013.2,
  "sensorValid": true,
  "lightMode": "void_glow",
  "lightCycleOn": true,
  "uvcActive": false,
  "uvcRemainingMs": 0,
  "domeSeated": true,
  "fanSpeed": 25,
  "humidifierActive": false,
  "climateAuto": true,
  "uptime": 3600,
  "version": "0.1.0"
}
```

| Field              | Type    | Description                                      |
|--------------------|---------|--------------------------------------------------|
| `temperature`      | number  | Degrees Celsius from BME280                      |
| `humidity`         | number  | %RH from BME280                                  |
| `pressure`         | number  | hPa from BME280                                  |
| `sensorValid`      | boolean | `false` if the last sensor read failed           |
| `lightMode`        | string  | One of: `"void_glow"`, `"uv_only"`, `"blue_only"`, `"off"` |
| `lightCycleOn`     | boolean | `true` during the "day" phase of the 12h cycle   |
| `uvcActive`        | boolean | `true` during UV-C sterilization                 |
| `uvcRemainingMs`   | number  | Milliseconds remaining in sterilization (0 when idle) |
| `domeSeated`       | boolean | Reed switch state (`true` = dome is on)          |
| `fanSpeed`         | number  | Current PWM duty cycle (0-255)                   |
| `humidifierActive` | boolean | Whether humidifier is currently on               |
| `climateAuto`      | boolean | `true` = PID climate control is active           |
| `uptime`           | number  | Seconds since boot                               |
| `version`          | string  | Firmware version (e.g. `"0.1.0"`)               |

---

### POST /mode

Set the active light mode.

**Request:**

```json
{
  "mode": "void_glow"
}
```

| Field  | Type   | Required | Values                                           |
|--------|--------|----------|--------------------------------------------------|
| `mode` | string | Yes      | `"void_glow"`, `"uv_only"`, `"blue_only"`, `"off"` |

**Response (200):**

```json
{
  "success": true,
  "mode": "void_glow"
}
```

**Error (400) — invalid mode:**

```json
{
  "error": "Invalid mode"
}
```

---

### POST /settings

Update climate control settings.

**Request:**

```json
{
  "humiditySetpoint": 90.0,
  "humidityDeadband": 3.0,
  "fanBaseSpeed": 30
}
```

| Field               | Type   | Required | Range   | Description                    |
|---------------------|--------|----------|---------|--------------------------------|
| `humiditySetpoint`  | number | Yes      | 80-95   | Target humidity (%RH)          |
| `humidityDeadband`  | number | Yes      | 1-5     | Deadband around setpoint (%RH) |
| `fanBaseSpeed`      | number | Yes      | 0-100   | Base fan speed (percentage)    |

**Response (200):**

```json
{
  "success": true,
  "settings": {
    "humiditySetpoint": 90.0,
    "humidityDeadband": 3.0,
    "fanBaseSpeed": 30
  }
}
```

**Error (400) — out of range:**

```json
{
  "error": "Settings out of range"
}
```

---

### POST /sterilize

Trigger a 15-minute UV-C sterilization cycle. Requires explicit confirmation. Grow lights are disabled during sterilization.

**Request:**

```json
{
  "confirm": true
}
```

| Field     | Type    | Required | Description                        |
|-----------|---------|----------|------------------------------------|
| `confirm` | boolean | Yes      | Must be literal `true` to proceed  |

**Response (200):**

```json
{
  "success": true,
  "durationMinutes": 15
}
```

**Error (400) — missing or false confirmation:**

```json
{
  "error": "Must confirm sterilization"
}
```

**Error (409) — dome not seated:**

```json
{
  "error": "Dome not detected"
}
```

**Behavior notes:**
- Grow lights (UV-A + blue) are automatically disabled when sterilization starts
- Grow lights are automatically restored when sterilization completes
- The dome must remain seated for the full 15-minute cycle; removing it triggers the interlock and aborts sterilization
- `uvcRemainingMs` in `/status` tracks the countdown

---

### GET /config

Read current device configuration.

**Request:** No body.

**Response (200):**

```json
{
  "humiditySetpoint": 88.0,
  "humidityDeadband": 2.0,
  "fanBaseSpeed": 30,
  "lightMode": "void_glow",
  "version": "0.1.0",
  "uptime": 3600,
  "ssid": "VoidCore"
}
```

| Field               | Type   | Description                    |
|---------------------|--------|--------------------------------|
| `humiditySetpoint`  | number | Current humidity target (%RH)  |
| `humidityDeadband`  | number | Current deadband (%RH)         |
| `fanBaseSpeed`      | number | Current base fan speed (%)     |
| `lightMode`         | string | Current light mode             |
| `version`           | string | Firmware version               |
| `uptime`            | number | Seconds since boot             |
| `ssid`              | string | WiFi AP SSID                   |

---

## 4. Error Codes

| Status | Meaning                | When                                           |
|--------|------------------------|-------------------------------------------------|
| 200    | Success                | Request processed successfully                  |
| 400    | Bad Request            | Invalid mode name, settings out of range, or missing confirmation |
| 409    | Conflict               | Sterilization requested but dome not seated     |

All error responses follow the shape:

```json
{
  "error": "Human-readable error message"
}
```

## 5. Polling Guidance

- Poll `GET /status` every **2 seconds** for real-time dashboard updates
- Use `GET /config` on initial connection only (settings rarely change)
- POST endpoints are fire-and-forget; poll `/status` to confirm state changes

## 6. Type Reference

All TypeScript types matching these JSON shapes are defined in:

- **`src/types/device.ts`** — All request/response interfaces and the `LightMode` union type
- **`src/types/index.ts`** — Re-exports for clean imports via `@/types`

Key types: `DeviceStatus`, `ClimateSettings`, `DeviceConfig`, `SetModeRequest`, `SetModeResponse`, `UpdateSettingsResponse`, `StartSterilizationRequest`, `StartSterilizationResponse`, `ApiError`, `LightMode`

## 7. Adapter Pattern

The app uses an abstract `DeviceAPI` interface (`src/api/device-api.ts`) that decouples UI code from the transport layer:

```
DeviceAPI (interface)
  ├── LocalAdapter   — HTTP to ESP32 at 192.168.4.1 (production)
  ├── MockAdapter    — Simulated responses for development (phase 25-02)
  └── CloudAdapter   — Future v5.0 cloud relay for remote access
```

All adapters implement the same 5 methods:

| Method                | Maps to            | Returns                       |
|-----------------------|--------------------|-------------------------------|
| `getStatus()`         | `GET /status`      | `Promise<DeviceStatus>`       |
| `setMode(mode)`       | `POST /mode`       | `Promise<SetModeResponse>`    |
| `updateSettings(s)`   | `POST /settings`   | `Promise<UpdateSettingsResponse>` |
| `startSterilization()`| `POST /sterilize`  | `Promise<StartSterilizationResponse>` |
| `getConfig()`         | `GET /config`      | `Promise<DeviceConfig>`       |

Consumer code imports `DeviceAPI` and never knows which adapter is active. The adapter is selected at app initialization based on environment (dev vs. production).

## 8. Firmware Cross-Reference

The ESP32 firmware implementing this API lives in the hardware repo:

- **Web server:** `firmware/src/web_server.cpp` — ESPAsyncWebServer route handlers
- **Wiring:** `firmware/WIRING.md` — GPIO pin assignments and circuit diagram

## 9. Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-02-22 | Initial versioned contract — all 5 endpoints documented |
