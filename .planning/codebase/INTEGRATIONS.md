# External Integrations

**Analysis Date:** 2026-02-23

## APIs & External Services

**Device Communication (ESP32 REST API):**
- Local WiFi HTTP API to ESP32 microcontroller
  - Client: Custom `LocalAdapter` class (`src/api/local-adapter.ts`)
  - Auth: None (local network only)
  - Default endpoint: `http://192.168.4.1`
  - Endpoints: `/status` (GET), `/mode` (POST), `/settings` (POST), `/sterilize` (POST), `/config` (GET)
  - Timeout: 5000ms per request

**Mock Adapter (Development):**
- `src/api/mock-adapter.ts` - Simulates ESP32 responses
  - Realistic sensor noise and variation
  - Light mode persistence, climate settings echo
  - Enabled via `VITE_MOCK_API=true` env var

**Payment Processing:**
- Not applicable (no payments)

**Email/SMS:**
- Not applicable

**External APIs:**
- None (local-first architecture)

## Data Storage

**Databases:**
- None (no server-side database in this repo)

**File Storage:**
- None

**Caching:**
- Browser `localStorage` - Stores last device IP (`voidcore-last-ip`) (`src/pages/connection-page.tsx`)
- PWA service worker cache - Google Fonts cached 1 year (`vite.config.ts`)
- In-memory ring buffer - 1800 sensor snapshots (`src/stores/history-store.ts`)

## Authentication & Identity

**Auth Provider:**
- Not applicable (no user accounts in companion app)

**Device Auth:**
- No authentication for ESP32 API (relies on local WiFi isolation)

## Monitoring & Observability

**Error Tracking:**
- Not detected (no Sentry, Rollbar, etc.)

**Analytics:**
- Not detected (no GA, Mixpanel, etc.)

**Logs:**
- Console only (browser dev tools)

## CI/CD & Deployment

**Hosting:**
- PWA: Self-hosted or static hosting (no specific platform configured)
- Mobile: Capacitor build for iOS/Android app stores

**CI Pipeline:**
- Not detected (no `.github/workflows/` or similar)

## Environment Configuration

**Development:**
- Required env vars: `VITE_MOCK_API=true` (for mock mode)
- No secrets needed (local-only communication)

**Production:**
- No secrets management needed
- Device communicates over local WiFi only

## Webhooks & Callbacks

**Incoming:**
- None

**Outgoing:**
- None

---

*Integration audit: 2026-02-23*
*Update when adding/removing external services*
