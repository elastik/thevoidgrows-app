# Codebase Structure

**Analysis Date:** 2026-02-23

## Directory Layout

```
thevoidgrows-app/
├── src/                          # Application source code
│   ├── api/                      # Device communication adapters
│   │   ├── __tests__/            # API unit tests
│   │   ├── device-api.ts         # Abstract interface
│   │   ├── local-adapter.ts      # ESP32 WiFi client (production)
│   │   ├── mock-adapter.ts       # Simulated device (development)
│   │   ├── create-adapter.ts     # Factory function
│   │   └── index.ts              # Barrel exports
│   ├── stores/                   # Zustand state management
│   │   ├── __tests__/            # Store unit tests
│   │   ├── device-store.ts       # Connection + control state machine
│   │   ├── history-store.ts      # Sensor history ring buffer
│   │   ├── toast-store.ts        # Toast notification queue
│   │   └── index.ts              # Barrel exports
│   ├── hooks/                    # Custom React hooks
│   │   ├── use-connection.ts     # Connection state + control
│   │   ├── use-device-status.ts  # Device status subscription
│   │   ├── use-device-actions.ts # Control method aggregator
│   │   ├── use-toast.ts          # Toast notification API
│   │   └── index.ts              # Barrel exports
│   ├── types/                    # TypeScript type definitions
│   │   ├── device.ts             # Device domain types
│   │   └── index.ts              # Type exports
│   ├── pages/                    # Route pages
│   │   ├── dashboard-page.tsx    # Home: sensors + light control
│   │   ├── settings-page.tsx     # Climate settings form
│   │   ├── sterilize-page.tsx    # UV-C sterilization control
│   │   ├── connection-page.tsx   # Device IP configuration
│   │   └── index.ts              # Page exports
│   ├── components/               # Reusable UI components
│   │   ├── layout/               # App shell + navigation
│   │   ├── dashboard/            # Dashboard page components
│   │   ├── settings/             # Settings page components
│   │   ├── sterilize/            # Sterilization page components
│   │   ├── ui/                   # UI primitives (overlay, toast)
│   │   └── __tests__/            # Component tests
│   ├── App.tsx                   # Root routes + AutoConnect
│   ├── main.tsx                  # React entry point
│   ├── pwa-register.ts           # PWA service worker registration
│   └── index.css                 # Global styles (Tailwind)
├── tests/                        # E2E tests
│   └── e2e/                      # Playwright specs
├── android/                      # Capacitor Android project
├── ios/                          # Capacitor iOS project
├── public/                       # Static assets
├── vite.config.ts                # Build configuration
├── capacitor.config.ts           # Capacitor app config
├── vitest.config.ts              # Test runner config
├── playwright.config.ts          # E2E test config
├── tsconfig.json                 # TypeScript config (root)
├── eslint.config.js              # ESLint flat config
└── package.json                  # Project manifest
```

## Directory Purposes

**src/api/**
- Purpose: Device communication abstraction
- Contains: Interface definition, adapter implementations, factory
- Key files: `device-api.ts` (contract), `local-adapter.ts` (production), `mock-adapter.ts` (dev)
- Tests: `__tests__/local-adapter.test.ts`, `__tests__/mock-adapter.test.ts`

**src/stores/**
- Purpose: Centralized app state via Zustand
- Contains: 3 stores (device, history, toast)
- Key files: `device-store.ts` (primary state machine with polling)
- Tests: `__tests__/device-store.test.ts`

**src/hooks/**
- Purpose: Selective store subscriptions for components
- Contains: 4 custom hooks
- Key files: `use-connection.ts`, `use-device-status.ts`, `use-device-actions.ts`

**src/components/**
- Purpose: Reusable UI components organized by feature
- Subdirectories: `layout/`, `dashboard/`, `settings/`, `sterilize/`, `ui/`
- Tests: `__tests__/climate-slider.test.tsx`, `__tests__/confirmation-modal.test.tsx`

**src/pages/**
- Purpose: Top-level route pages
- Contains: 4 page components
- Key files: `dashboard-page.tsx` (home), `connection-page.tsx` (setup)

## Key File Locations

**Entry Points:**
- `src/main.tsx` - React app entry, BrowserRouter, PWA registration
- `src/App.tsx` - Route definitions, AutoConnect effect

**Configuration:**
- `vite.config.ts` - Build, PWA manifest, path aliases
- `tsconfig.app.json` - TypeScript (strict, ES2022)
- `capacitor.config.ts` - Mobile app config (`com.thevoidgrows.app`)
- `eslint.config.js` - Linting rules
- `vitest.config.ts` - Unit test setup (jsdom)

**Core Logic:**
- `src/stores/device-store.ts` - Connection lifecycle, polling, device control
- `src/api/local-adapter.ts` - ESP32 HTTP communication
- `src/api/device-api.ts` - DeviceAPI interface contract

**Testing:**
- `src/*/__tests__/*.test.{ts,tsx}` - Unit/component tests
- `tests/e2e/*.spec.ts` - Playwright E2E tests

## Naming Conventions

**Files:**
- `kebab-case.tsx` for components (`sensor-card.tsx`, `climate-slider.tsx`)
- `kebab-case.ts` for hooks with `use-` prefix (`use-connection.ts`)
- `kebab-case.ts` for stores with `-store.ts` suffix (`device-store.ts`)
- `*.test.ts(x)` for test files

**Directories:**
- kebab-case for all directories
- Feature-based grouping under `components/`
- `__tests__/` for co-located test directories

**Special Patterns:**
- `index.ts` barrel files in every directory for public exports
- `@/` path alias resolves to `./src/`

## Where to Add New Code

**New Page:**
- Implementation: `src/pages/{name}-page.tsx`
- Route: Add to `src/App.tsx`
- Components: `src/components/{name}/`
- Export: Update `src/pages/index.ts`

**New Component:**
- Implementation: `src/components/{feature}/{name}.tsx`
- Tests: `src/components/__tests__/{name}.test.tsx`
- Export: Update `src/components/{feature}/index.ts`

**New Store:**
- Implementation: `src/stores/{name}-store.ts`
- Hook: `src/hooks/use-{name}.ts`
- Tests: `src/stores/__tests__/{name}-store.test.ts`
- Export: Update barrel files

**New API Adapter:**
- Implementation: `src/api/{name}-adapter.ts`
- Must implement `DeviceAPI` interface from `src/api/device-api.ts`
- Register in `src/api/create-adapter.ts` factory

## Special Directories

**android/, ios/**
- Purpose: Capacitor native project files
- Source: Generated by Capacitor CLI
- Committed: Yes

**public/**
- Purpose: Static assets served directly
- Contains: Icons, manifest assets
- Committed: Yes

---

*Structure analysis: 2026-02-23*
*Update when directory structure changes*
