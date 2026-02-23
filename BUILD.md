# Build Guide — Void Core Native Apps

Build the Void Core app for iOS and Android using Capacitor.

## Prerequisites

### All Platforms

| Tool | Version | Install |
|------|---------|---------|
| Node.js | 20+ | [nodejs.org](https://nodejs.org) |
| npm | 10+ | Ships with Node.js |

### Android

| Tool | Version | Install |
|------|---------|---------|
| Android Studio | Hedgehog (2023.1.1)+ | [developer.android.com](https://developer.android.com/studio) |
| Android SDK Platform | 34+ | Via Android Studio SDK Manager |
| Java JDK | 17+ | Bundled with Android Studio |

### iOS (macOS Only)

| Tool | Version | Install |
|------|---------|---------|
| macOS | Ventura 13+ | Required for Xcode 15+ |
| Xcode | 15+ | Mac App Store |
| CocoaPods | 1.14+ | `sudo gem install cocoapods` or `brew install cocoapods` |

## Quick Start

```bash
# Install dependencies
npm install

# Build web app and sync to native projects
npm run build
npx cap sync

# Open in IDE
npx cap open android   # Opens Android Studio
npx cap open ios       # Opens Xcode (macOS only)
```
## Development Workflow

### Web Development (Fastest Iteration)

```bash
npm run dev
```

Open `http://localhost:5173` in a browser. Use mock mode (`VITE_MOCK_API=true`) for development without hardware.

### Native Development with Live Reload

For testing native features while iterating on the UI:

1. Start the dev server on your network:
   ```bash
   npm run dev -- --host
   ```

2. Edit `capacitor.config.ts` — uncomment and set your IP:
   ```ts
   server: {
     url: 'http://YOUR_IP:5173',
     cleartext: true,
   },
   ```

3. Sync and run:
   ```bash
   npx cap sync
   npx cap run android   # or: npx cap run ios
   ```

4. **Important:** Comment out the `url` line before building for release.

### Standard Build + Test

```bash
# Build web, sync to native, open IDE
npm run build && npx cap sync
npx cap open android   # or ios
```

Then build and run from the IDE.

## Android Build

### Debug Build (Testing)

1. Open Android Studio: `npx cap open android`
2. Select a device or emulator from the toolbar
3. Click the Run button (green triangle) or press `Shift+F10`
4. The APK installs and launches automatically

#### Command-Line Debug Build

```bash
cd android
./gradlew assembleDebug
# Output: android/app/build/outputs/apk/debug/app-debug.apk
```

### Release Build (Distribution)

#### Generate a Signing Key (First Time Only)

```bash
keytool -genkey -v \\
  -keystore void-core-release.keystore \\
  -alias void-core \\
  -keyalg RSA -keysize 2048 \\
  -validity 10000
```

Store this keystore securely. You will need it for all future updates.

#### Build Signed APK

1. Open Android Studio: `npx cap open android`
2. Menu: **Build > Generate Signed Bundle / APK**
3. Select **APK** (or **Android App Bundle** for Play Store)
4. Choose your keystore and enter credentials
5. Select **release** build variant
6. Output: `android/app/build/outputs/apk/release/app-release.apk`

#### Command-Line Release Build

Create `android/keystore.properties` (do NOT commit this file):

```properties
storeFile=../void-core-release.keystore
storePassword=YOUR_STORE_PASSWORD
keyAlias=void-core
keyPassword=YOUR_KEY_PASSWORD
```

```bash
cd android
./gradlew assembleRelease
```

### Install on Device

```bash
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

## iOS Build

> **Requires macOS with Xcode installed.**

### Simulator Build (Testing)

1. Open Xcode: `npx cap open ios`
2. Select a simulator from the scheme dropdown (e.g., iPhone 16)
3. Press `Cmd+R` to build and run
4. The app launches in the simulator

### Device Build (Testing)

1. Open Xcode: `npx cap open ios`
2. Select your connected device from the scheme dropdown
3. Set the signing team:
   - Select the **App** target in the project navigator
   - Go to **Signing & Capabilities**
   - Select your **Team** (requires Apple Developer account, free tier works for testing)
4. Press `Cmd+R` to build and install

### Release Build (Distribution)

1. Ensure your Apple Developer Program membership is active ($99/year)
2. Open Xcode: `npx cap open ios`
3. Set the **Release** scheme: **Product > Scheme > Edit Scheme > Run > Build Configuration > Release**
4. Select **Any iOS Device** as the destination
5. **Product > Archive**
6. In the Organizer window, click **Distribute App**

## TestFlight (iOS Beta Testing)

TestFlight lets you distribute beta builds to up to 10,000 testers.

### Setup

1. Archive the app in Xcode (see Release Build above)
2. In the Organizer, click **Distribute App > App Store Connect**
3. Follow the prompts to upload

### In App Store Connect

1. Go to [appstoreconnect.apple.com](https://appstoreconnect.apple.com)
2. Select your app > **TestFlight** tab
3. The uploaded build appears after processing (5-30 minutes)
4. Add internal testers (up to 25, no review required)
5. For external testers, submit for Beta App Review first

### Inviting Testers

- **Internal:** Add Apple IDs in App Store Connect > Users and Access
- **External:** Create a public link or add emails in the TestFlight tab

## Google Play Internal Testing

### Setup

1. Create a developer account at [play.google.com/console](https://play.google.com/console) ($25 one-time fee)
2. Create a new app with package name `com.thevoidgrows.app`
3. Build a signed AAB (Android App Bundle) via Android Studio

### Upload

1. Go to **Testing > Internal testing** in Play Console
2. Click **Create new release**
3. Upload the signed `.aab` file
4. Add release notes and roll out

### Inviting Testers

1. Go to **Internal testing > Testers**
2. Create an email list with tester emails
3. Share the opt-in link with testers
4. Testers install via Play Store (after accepting the invite)

## CI/CD Notes

The existing `.github/workflows/ci.yml` handles web build verification (TypeScript check + Vite build). Native builds are **not** included in CI because:

- Android builds require the Android SDK (~8GB) and signing keys
- iOS builds require macOS runners (expensive) and provisioning profiles
- For a small open-source project, IDE-based builds are sufficient

### Future CI Extension (When Needed)

If automated native builds become necessary, see the reference snippets in CAPACITOR-SETUP.md. Do not add them to CI until signing keys and secrets are configured.

## Environment Variables

| Variable | Purpose | Default |
|----------|---------|---------|
| `VITE_MOCK_API` | Use mock adapter (no hardware) | `false` |

Set in `.env.local` for development:

```bash
VITE_MOCK_API=true
```

## Troubleshooting

### Android: "SDK location not found"

Set the `ANDROID_HOME` environment variable or create `android/local.properties`:
```properties
sdk.dir=/Users/YOUR_USER/Library/Android/sdk
```

### iOS: "No signing certificate"

1. Open Xcode preferences > Accounts
2. Add your Apple ID
3. Select the team in Signing & Capabilities

### "capacitor.config.ts not found"

Run commands from the project root directory, not from `android/` or `ios/`.

### Build fails after dependency update

```bash
npx cap sync
# If that does not fix it:
rm -rf android/app/build ios/App/build
npx cap sync
```

### Clearing web cache in native app

The Capacitor WebView caches aggressively. To force a fresh load:
- Android: Clear app data in device settings
- iOS: Delete and reinstall the app
