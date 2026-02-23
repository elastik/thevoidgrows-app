# Build Guide — Void Core

Step-by-step instructions for building the Void Core app as a native Android or iOS application using Capacitor.

## Prerequisites

| Tool | Version | Platform | Notes |
|------|---------|----------|-------|
| Node.js | 20+ | All | Required for Capacitor CLI |
| npm | 10+ | All | Ships with Node.js 20 |
| Android Studio | Hedgehog+ | Windows/macOS/Linux | For Android builds |
| Xcode | 15+ | macOS only | For iOS builds |

## Development Workflow

### Web Development (fastest iteration)

```bash
npm run dev
```

Opens `http://localhost:5173` with hot reload. Use browser DevTools mobile emulation for phone-like testing.

### Native Preview

```bash
# Build web + sync to native platforms
npm run cap:sync

# Open in Android Studio
npm run cap:android

# Open in Xcode (macOS only)
npm run cap:ios
```

### Live Reload on Device

For faster native development without rebuilding:

1. Find your dev machine's local IP (e.g., `192.168.1.100`)
2. Edit `capacitor.config.ts` — uncomment the `server.url` line:
   ```ts
   server: {
     url: 'http://192.168.1.100:5173',
     cleartext: true,
     androidScheme: 'https',
   },
   ```
3. Start the dev server on all interfaces: `npm run dev -- --host`
4. Sync and run: `npm run cap:sync && npx cap run android`

> Remove or comment out the `url` property before building for release.

## Android Build

### Debug APK

1. `npm run cap:sync`
2. `npm run cap:android` (opens Android Studio)
3. In Android Studio: Build > Build Bundle(s) / APK(s) > Build APK(s)
4. Output: `android/app/build/outputs/apk/debug/app-debug.apk`

### Signed Release Bundle

1. `npm run cap:sync`
2. `npm run cap:android`
3. In Android Studio: Build > Generate Signed Bundle / APK
4. Choose "Android App Bundle" for Play Store, or "APK" for direct install
5. Create or select a signing key
6. Build the release variant

### Testing on Android

- **Emulator:** Android Studio > Device Manager > Create Virtual Device
- **Physical device:** Enable Developer Options > USB Debugging, connect via USB
- **Wireless:** `adb pair <ip>:<port>` then `adb connect <ip>:<port>`

## iOS Build (macOS Only)

### Debug Build

1. `npm run cap:sync`
2. `npm run cap:ios` (opens Xcode)
3. Select a simulator or connected device
4. Press Play (Cmd+R)

### Archive for Distribution

1. `npm run cap:sync`
2. `npm run cap:ios`
3. In Xcode: set the signing team in Signing & Capabilities
4. Select "Any iOS Device" as the build target
5. Product > Archive
6. In the Organizer: Distribute App > App Store Connect (or Ad Hoc)

### Testing on iOS

- **Simulator:** Xcode > Window > Devices and Simulators
- **Physical device:** Connect via USB, trust the computer, select device in Xcode
- **TestFlight:** Archive > Distribute > App Store Connect > Upload

> TestFlight and App Store submission are out of scope for v4.0.

## npm Scripts Reference

| Script | Command | Description |
|--------|---------|-------------|
| `dev` | `vite` | Start web dev server with hot reload |
| `build` | `tsc -b && vite build` | TypeScript check + production build |
| `cap:sync` | `npm run build && npx cap sync` | Build web + sync to native platforms |
| `cap:android` | `npx cap open android` | Open Android project in Android Studio |
| `cap:ios` | `npx cap open ios` | Open iOS project in Xcode |
| `cap:build` | build + sync + echo | Full build pipeline with next-step hint |
| `lint` | `eslint .` | Run ESLint |
| `preview` | `vite preview` | Preview production build locally |

## Network Configuration

The app communicates with the ESP32 over local HTTP (not HTTPS). Native platform permissions are pre-configured:

- **Android:** `network_security_config.xml` allows cleartext to 192.168.x.x
- **iOS:** `NSAllowsLocalNetworking` in Info.plist allows local HTTP

See [NETWORK.md](NETWORK.md) for details.

## Troubleshooting

### `dist/` directory not found
Run `npm run build` before any `cap` commands.

### Android SDK not found
Open Android Studio > Settings > SDK Manager and install:
- Android SDK Platform 34 (or latest)
- Android SDK Build-Tools
- Android SDK Command-line Tools

### CocoaPods not installed (iOS)
```bash
sudo gem install cocoapods
# or with Homebrew:
brew install cocoapods
```

### Capacitor doctor
Run `npx cap doctor` to diagnose issues. Common fixes:
- Update packages: `npm update @capacitor/core @capacitor/cli @capacitor/android @capacitor/ios`
- Re-sync: `npx cap sync`

### White screen on device
Check that `dist/` was synced: `ls android/app/src/main/assets/public/index.html`
If missing, run `npm run cap:sync`.
