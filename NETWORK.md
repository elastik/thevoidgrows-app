# Network Configuration — Native Platforms

The Void Core app communicates with the ESP32 mushroom cultivation dome over **HTTP on the local network** (192.168.x.x). Both Android and iOS block cleartext HTTP by default, so native builds require explicit permission configuration.

## Why Cleartext HTTP?

The ESP32 runs a lightweight HTTP server on its local WiFi access point (default IP: `192.168.4.1`). It does not support HTTPS because:

- **No DNS** — The ESP32 AP has no domain name, only a raw IP address
- **No TLS certificates** — The ESP32 lacks the memory and compute to serve TLS
- **No internet** — Communication is local-only; the phone connects to the ESP32's WiFi network directly
- **All data is local** — Sensor readings and settings never leave the local network

This is standard for IoT device control (similar to router admin pages, smart home devices, 3D printer interfaces).

## Android: Network Security Config

After running `npx cap add android`, create the network security config file and reference it in the manifest.

### 1. Create `android/app/src/main/res/xml/network_security_config.xml`

```xml
<?xml version="1.0" encoding="utf-8"?>
<network-security-config>
    <!--
        Allow cleartext HTTP to local network IPs only.
        The ESP32 dome controller runs an HTTP server on 192.168.x.x.
        All other traffic uses HTTPS (the default).
    -->
    <domain-config cleartextTrafficPermitted="true">
        <!-- ESP32 default AP address -->
        <domain includeSubdomains="false">192.168.4.1</domain>
    </domain-config>

    <!--
        Allow cleartext to the entire local subnet for flexibility.
        Covers cases where the ESP32 joins an existing WiFi network
        instead of running its own AP.
    -->
    <domain-config cleartextTrafficPermitted="true">
        <domain includeSubdomains="true">192.168.</domain>
    </domain-config>

    <!-- Default: HTTPS required for everything else -->
    <base-config cleartextTrafficPermitted="false">
        <trust-anchors>
            <certificates src="system" />
        </trust-anchors>
    </base-config>
</network-security-config>
```

> **Note:** `<domain>` matching with IP addresses has limitations on some Android versions. If the granular config does not work, use the fallback approach below.

#### Fallback: Blanket Cleartext (Less Secure)

If the domain-based config causes issues, modify `AndroidManifest.xml` directly:

```xml
<application
    android:usesCleartextTraffic="true"
    ...>
```

This allows HTTP to all hosts. Acceptable for a local-only IoT control app, but the network security config approach is preferred.

### 2. Reference in `AndroidManifest.xml`

Add the `networkSecurityConfig` attribute to the `<application>` tag:

```xml
<application
    android:networkSecurityConfig="@xml/network_security_config"
    android:allowBackup="true"
    android:icon="@mipmap/ic_launcher"
    android:label="@string/app_name"
    ...>
```

### 3. WiFi Permissions (Optional — Future)

If WiFi SSID detection is needed later (to auto-detect when connected to the dome's AP):

```xml
<!-- In AndroidManifest.xml -->
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_WIFI_STATE" />
<uses-permission android:name="android.permission.CHANGE_WIFI_STATE" />
```

> **Not required for v4.0.** The app uses manual IP input (see Connection Screen). WiFi SSID detection is a future enhancement.

## iOS: App Transport Security Exception

After running `npx cap add ios`, modify the Info.plist to allow local network HTTP.

### 1. Edit `ios/App/App/Info.plist`

Add the `NSAppTransportSecurity` dictionary:

```xml
<key>NSAppTransportSecurity</key>
<dict>
    <!--
        Allow HTTP connections to local network addresses.
        Required for ESP32 communication over 192.168.x.x.
        Does NOT disable ATS for internet connections.
    -->
    <key>NSAllowsLocalNetworking</key>
    <true/>
</dict>
```

This is the most targeted ATS exception available. It allows HTTP only to addresses on the local network (link-local and private IP ranges), while maintaining HTTPS requirements for all internet traffic.

### 2. Local Network Privacy (iOS 14+)

iOS 14+ shows a permission prompt when the app first accesses the local network. Add a usage description to explain why:

```xml
<key>NSLocalNetworkUsageDescription</key>
<string>Void Core needs local network access to communicate with your mushroom dome's ESP32 controller.</string>
```

### 3. Bonjour Services (Optional — Future)

If mDNS/Bonjour discovery is added later to auto-find the ESP32:

```xml
<key>NSBonjourServices</key>
<array>
    <string>_http._tcp</string>
</array>
```

> **Not required for v4.0.** The app uses manual IP input.

## Verification

### Android
1. Build and install on a device or emulator
2. Connect the device to the ESP32's WiFi AP
3. Open the app and enter `192.168.4.1` as the device IP
4. Verify sensor data loads — if you see connection errors, check logcat for cleartext-related messages:
   ```
   adb logcat | grep -i "cleartext\|network.*security"
   ```

### iOS
1. Build and install on a device or simulator
2. Connect to the ESP32's WiFi AP
3. Accept the "Local Network" permission prompt when it appears
4. Enter `192.168.4.1` and verify sensor data loads
5. If connections fail, check the Xcode console for ATS errors

## Security Rationale Summary

| Concern | Mitigation |
|---------|-----------|
| Cleartext HTTP | Only to local 192.168.x.x — no internet traffic |
| No authentication | ESP32 AP is password-protected; only paired devices connect |
| Data sensitivity | Sensor readings (temp/humidity) — not personally identifiable |
| Man-in-the-middle | Attacker would need to be on the same local WiFi network |
| Future improvement | ESP32-S3 may support TLS; upgrade path documented |
