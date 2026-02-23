# Void Core App

[![License: MIT](https://img.shields.io/badge/License-MIT-bio--cyan.svg)](LICENSE)
[![Build](https://img.shields.io/badge/build-passing-bio--cyan.svg)](#development)
[![Version](https://img.shields.io/badge/version-4.0.0-uv--purple.svg)](package.json)

Open-source device control app for [The Void Grows](https://thevoidgrows.com) mushroom cultivation dome. Connect to your Void Core over local WiFi, monitor real-time sensor data, control light modes and climate settings, and run UV-C sterilization cycles — all from your phone or browser.

---

## Features

- **Real-time dashboard** — Temperature, humidity, and pressure cards updating every 2 seconds
- **Sensor history chart** — 1-hour rolling SVG chart with brand-colored lines
- **Light mode controls** — Void Glow, UV Only, Blue Only, Off with optimistic UI updates
- **Climate settings** — Humidity setpoint (80-95%), deadband (1-5%), fan speed (0-100%) with debounced saves
- **UV-C sterilization** — Two-step safety confirmation, 15-minute countdown timer, dome-seated interlock
- **Toast notifications** — Success, error, and warning feedback with auto-dismiss
- **Connection management** — Auto-connect, auto-reconnect on failure, configurable IP
- **PWA support** — Install to home screen, offline caching via service worker
- **Native ready** — Capacitor wraps for iOS and Android with local network permissions

## Quick Start

```bash
# Clone the repo
git clone https://github.com/elastik/thevoidgrows-app.git
cd thevoidgrows-app

# Install dependencies
npm install

# Start the dev server (mock mode — no hardware needed)
echo "VITE_MOCK_API=true" > .env
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser. The app runs in mock mode with simulated sensor data so you can develop without a physical dome.

### Connecting to a Real Dome

1. Connect your phone/computer to the **VoidCore** WiFi network (password: `voidgrows`)
2. Remove or set `VITE_MOCK_API=false` in `.env`
3. The app connects to `http://192.168.4.1` by default (configurable on the connection screen)

## Architecture

```
┌──────────────────────────────────────────────────┐
│                    React UI                       │
│  pages → components → hooks                      │
├──────────────────────────────────────────────────┤
│              Zustand Device Store                 │
│  connectionStatus, lastStatus, polling, actions   │
├──────────────────────────────────────────────────┤
│            DeviceAPI (interface)                   │
│  getStatus · setMode · updateSettings             │
│  startSterilization · getConfig                   │
├────────────┬─────────────┬───────────────────────┤
│ LocalAdapter│ MockAdapter │ CloudAdapter (future)  │
│ HTTP→ESP32  │ Fake data   │ Remote relay           │
└────────────┴─────────────┴───────────────────────┘
```

The **adapter pattern** decouples UI code from the transport layer. All adapters implement the same `DeviceAPI` interface. The active adapter is selected at startup based on the `VITE_MOCK_API` environment variable.

**Data flow:**

1. `createAdapter()` returns the appropriate adapter (mock or local)
2. `useDeviceStore.connect()` initializes the adapter and starts 2-second polling
3. Components read state via selector hooks (`useDeviceStatus`, `useConnection`)
4. Actions dispatch through the store to the adapter (`setMode`, `updateSettings`, `startSterilization`)
5. Polling updates flow back through the store to all subscribed components

## Project Structure

```
src/
  api/            DeviceAPI interface + adapters (Local, Mock)
  components/
    dashboard/    Sensor cards, light mode selector, status row, chart
    settings/     Climate slider, settings form
    sterilize/    Confirmation modal, countdown timer
    ui/           Toast, connection overlay
    layout/       Bottom nav, app shell
  hooks/          useDeviceStatus, useDeviceActions, useConnection, useToast
  pages/          Route-level page components
  stores/         Zustand stores (device, toast, sensor history)
  types/          TypeScript interfaces matching firmware REST API
```

## Mock Mode

Set `VITE_MOCK_API=true` in a `.env` file to run without hardware:

```
VITE_MOCK_API=true
```

The `MockAdapter` provides:
- Realistic sensor readings with BME280-like noise variation
- Light mode persistence across calls
- Climate settings echo
- UV-C sterilization timer that counts down and auto-expires after 15 minutes
- Simulated network latency (50ms)

This is the recommended way to develop UI features and run tests.

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | React | 19 |
| Build | Vite | 7 |
| Language | TypeScript | 5.9 (strict) |
| Styling | Tailwind CSS | v4 (CSS-first) |
| State | Zustand | 5 |
| Native | Capacitor | 8 |
| PWA | vite-plugin-pwa | 1.2 |
| Testing | Vitest + React Testing Library | - |

## Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `dev` | `vite` | Start dev server with hot reload |
| `build` | `tsc -b && vite build` | TypeScript check + production build |
| `test` | `vitest run` | Run all tests once |
| `test:watch` | `vitest` | Run tests in watch mode |
| `lint` | `eslint .` | Run ESLint |
| `preview` | `vite preview` | Preview production build |
| `cap:sync` | build + cap sync | Build web + sync to native platforms |
| `cap:android` | `npx cap open android` | Open in Android Studio |
| `cap:ios` | `npx cap open ios` | Open in Xcode |

## Native Builds

See [BUILD.md](BUILD.md) for Capacitor build instructions (Android Studio, Xcode, live reload, signing).

See [NETWORK.md](NETWORK.md) for native network permission details (cleartext HTTP to ESP32).

## API Contract

See [API-CONTRACT.md](API-CONTRACT.md) for the complete firmware REST API specification with request/response examples for all 5 endpoints.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for development workflow, mock mode setup, code style guide, and PR process.

## License

MIT — see [LICENSE](LICENSE)
