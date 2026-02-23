# Capacitor Setup Guide

Step-by-step instructions for adding iOS and Android native platforms to the Void Core app.

## Prerequisites

| Tool | Version | Notes |
|------|---------|-------|
| Node.js | 20+ | Required for Capacitor CLI |
| npm | 10+ | Ships with Node.js 20 |
| Android Studio | Hedgehog+ | For Android builds |
| Xcode | 15+ | For iOS builds (macOS only) |
| CocoaPods | 1.14+ | iOS dependency manager (`sudo gem install cocoapods`) |

## Already Done

These steps are already complete in this repo:

1. **Dependencies installed** — `@capacitor/core` and `@capacitor/cli` are in `package.json`
2. **Config created** — `capacitor.config.ts` defines appId, appName, webDir, and plugin settings
3. **Resource files** — `resources/icon.svg` and `resources/splash.svg` exist for asset generation

## Step 1: Add Platforms

Run from the project root:

```bash
# Build the web app first (Capacitor needs the dist/ directory)
npm run build

# Add Android platform
npx cap add android

# Add iOS platform (macOS only)
npx cap add ios
```

This creates `android/` and `ios/` directories with native project files.

## Step 2: Generate App Icons & Splash Screen

Use the Capacitor assets plugin to generate all required icon sizes from the SVG sources:

```bash
# Install the assets tool
npm install -D @capacitor/assets

# Generate icons and splash screens for both platforms
npx capacitor-assets generate \
  --iconBackgroundColor '#0A0A0F' \
  --splashBackgroundColor '#0A0A0F' \
  --iconBackgroundColorDark '#0A0A0F' \
  --splashBackgroundColorDark '#0A0A0F'
```

This reads from `resources/icon.svg` and `resources/splash.svg` and generates:
- Android: `android/app/src/main/res/mipmap-*/` (mdpi through xxxhdpi)
- iOS: `ios/App/App/Assets.xcassets/AppIcon.appiconset/`
- Splash screens for all device sizes

## Step 3: Sync Web Assets to Native Projects

After any web build, sync to native platforms:

```bash
npm run build && npx cap sync
```

This copies `dist/` into the native projects and updates native dependencies.

## Step 4: Verify Setup

```bash
# Check that everything is properly configured
npx cap doctor

# Open in Android Studio
npx cap open android

# Open in Xcode (macOS only)
npx cap open ios
```

## Project Structure After Setup

```
thevoidgrows-app/
├── android/                    # Android native project
│   ├── app/
│   │   ├── src/main/
│   │   │   ├── AndroidManifest.xml
│   │   │   ├── java/com/thevoidgrows/app/
│   │   │   └── res/
│   │   │       ├── xml/network_security_config.xml  ← See NETWORK.md
│   │   │       └── mipmap-*/                        ← Generated icons
│   │   └── build.gradle
│   └── build.gradle
├── ios/                        # iOS native project (macOS only)
│   ├── App/
│   │   ├── App/
│   │   │   ├── Info.plist     ← See NETWORK.md
│   │   │   └── Assets.xcassets/
│   │   ├── App.xcodeproj/
│   │   └── Podfile
│   └── ...
├── capacitor.config.ts         # Capacitor configuration
├── resources/
│   ├── icon.svg                # App icon source (1024x1024)
│   └── splash.svg              # Splash screen source (2732x2732)
├── dist/                       # Built web app (synced to native)
└── ...
```

## Live Reload During Development

For faster native development, point Capacitor at the Vite dev server:

1. Find your machine's local IP (e.g., `192.168.1.100`)
2. Edit `capacitor.config.ts` — uncomment the `server.url` line:
   ```ts
   server: {
     url: 'http://192.168.1.100:5173',
     cleartext: true,
     androidScheme: 'https',
   },
   ```
3. Start the dev server: `npm run dev -- --host`
4. Sync and run: `npx cap sync && npx cap run android` (or `ios`)

> **Important:** Remove or comment out the `url` property before building for release.

## Troubleshooting

### `dist/` directory not found
Run `npm run build` before `npx cap add` or `npx cap sync`.

### CocoaPods not installed (iOS)
```bash
sudo gem install cocoapods
# or with Homebrew:
brew install cocoapods
```

### Android SDK not found
Open Android Studio > Settings > SDK Manager and install:
- Android SDK Platform 34 (or latest)
- Android SDK Build-Tools
- Android SDK Command-line Tools

### Capacitor doctor shows warnings
Run `npx cap doctor` and follow its recommendations. Common fixes:
- Update Capacitor packages: `npm update @capacitor/core @capacitor/cli`
- Re-sync: `npx cap sync`
