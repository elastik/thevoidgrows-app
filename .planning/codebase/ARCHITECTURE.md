# Architecture

**Analysis Date:** 2026-02-23

## Pattern Overview

**Overall:** Layered Client Application with Adapter Pattern

**Key Characteristics:**
- Frontend-only codebase (no backend server)
- Local-first device communication via WiFi REST API
- Real-time polling architecture (2-second intervals)
- Progressive Web App with native mobile via Capacitor
- Adapter pattern for swappable device backends

## Layers

**Presentation Layer (Pages & Components):**
- Purpose: Render UI, handle user interactions
- Contains: Route pages (`src/pages/`), feature components (`src/components/`)
- Depends on: Hooks layer for state access
- Used by: React Router

**State Management Layer (Zustand Stores):**
- Purpose: Centralized app state, connection lifecycle, device control
- Contains: `device-store.ts` (connection state machine), `history-store.ts` (sensor ring buffer), `toast-store.ts` (notifications)
- Location: `src/stores/`
- Depends on: API adapter layer
- Used by: Hooks layer

**Hooks Layer (Custom React Hooks):**
- Purpose: Selective store subscriptions, minimize re-renders
- Contains: `use-connection.ts`, `use-device-status.ts`, `use-device-actions.ts`, `use-toast.ts`
- Location: `src/hooks/`
- Depends on: Stores only
- Used by: Pages and components

**API Adapter Layer (Device Communication):**
- Purpose: Abstract device communication behind interface
- Contains: `DeviceAPI` interface, `LocalAdapter`, `MockAdapter`, `createAdapter` factory
- Location: `src/api/`
- Depends on: Types only
- Used by: Device store

**Type Layer (Domain Types):**
- Purpose: TypeScript type definitions for device domain
- Contains: `DeviceStatus`, `ClimateSettings`, `DeviceConfig`, `LightMode`
- Location: `src/types/device.ts`
- Depends on: Nothing
- Used by: All layers

## Data Flow

**Connection & Polling Flow:**

1. App mounts, `<AutoConnect/>` fires (`src/App.tsx`)
2. `deviceStore.connect()` creates adapter via `createAdapter()` (`src/api/create-adapter.ts`)
3. Initial `adapter.getStatus()` fetch
4. On success: `connectionStatus = 'connected'`, start 2s polling
5. Each poll: `adapter.getStatus()` -> update `lastStatus` + add to history
6. On failure: increment `consecutiveFailures` (3 = error state, 5 = disconnect + auto-reconnect after 5s)

**Device Control Flow (e.g., setMode):**

1. Component calls `useDeviceActions().setMode(mode)`
2. Store calls `adapter.setMode(mode)` (POST /mode)
3. Optimistic update: `lastStatus.lightMode = mode` immediately
4. Response confirms or errors

**State Management:**
- Zustand stores for reactive state
- Module-level variables for timers (outside Zustand to avoid serialization)
- Browser localStorage for device IP persistence
- In-memory ring buffer for sensor history (1800 points = 1 hour)

## Key Abstractions

**DeviceAPI Interface:**
- Purpose: Contract for device communication
- Location: `src/api/device-api.ts`
- Implementations: `LocalAdapter` (production), `MockAdapter` (development)
- Pattern: Adapter / Strategy

**Device Store (State Machine):**
- Purpose: Connection lifecycle and device control
- Location: `src/stores/device-store.ts`
- States: `disconnected -> connecting -> connected -> error`
- Pattern: State machine with automatic recovery

**Sensor History (Ring Buffer):**
- Purpose: Fixed-size time-series data for charting
- Location: `src/stores/history-store.ts`
- Capacity: 1800 points, auto-trims oldest
- Pattern: Circular buffer

## Entry Points

**React App Entry:**
- Location: `src/main.tsx`
- Triggers: Browser page load
- Responsibilities: Create React root, wrap in BrowserRouter, register PWA service worker

**App Root:**
- Location: `src/App.tsx`
- Triggers: React render
- Responsibilities: Define routes (4 pages), auto-connect to device via `<AutoConnect/>`

**PWA Registration:**
- Location: `src/pwa-register.ts`
- Triggers: App initialization
- Responsibilities: Register service worker for offline caching

## Error Handling

**Strategy:** Errors bubble to store, displayed via toast notifications and connection overlay

**Patterns:**
- API adapter throws on network failure or non-OK response (`src/api/local-adapter.ts`)
- Device store catches errors, updates `connectionStatus` and `error` state
- Consecutive failures tracked for auto-reconnect logic
- Toast notifications for user-facing errors
- `ConnectionOverlay` component covers UI when disconnected (`src/components/ui/connection-overlay.tsx`)

## Cross-Cutting Concerns

**Logging:**
- Console only (no structured logging framework)

**Validation:**
- TypeScript compile-time type checking (strict mode)
- No runtime validation of API responses

**Authentication:**
- Not applicable (local WiFi only, no auth)

---

*Architecture analysis: 2026-02-23*
*Update when major patterns change*
