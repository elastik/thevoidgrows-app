# Coding Conventions

**Analysis Date:** 2026-02-23

## Naming Patterns

**Files:**
- kebab-case for all files (`sensor-card.tsx`, `device-store.ts`, `use-connection.ts`)
- `*.test.ts(x)` for test files in `__tests__/` directories
- `index.ts` for barrel exports

**Functions:**
- camelCase for all functions (`startPolling`, `clearTimers`, `addToast`)
- PascalCase for React components (`DashboardPage`, `SensorCard`, `ClimateSlider`)
- `use` prefix for hooks (`useConnection`, `useDeviceStatus`)

**Variables:**
- camelCase for variables (`connectionStatus`, `humiditySetpoint`, `fanBaseSpeed`)
- UPPER_SNAKE_CASE for module constants (`POLL_INTERVAL_MS`, `ERROR_THRESHOLD`, `MAX_HISTORY_POINTS`)
- Underscore prefix for private methods (`_request()`, `_vary()`)

**Types:**
- PascalCase for interfaces and types (`DeviceStatus`, `ClimateSettings`, `LightMode`)
- `Props` suffix for component props (`SensorCardProps`, `ClimateSettingsFormProps`)
- No `I` prefix on interfaces

## Code Style

**Formatting:**
- No Prettier config (formatting via ESLint/editor)
- 2-space indentation
- Single quotes for strings
- Semicolons required
- ~80-100 character line length

**Linting:**
- ESLint 9 flat config (`eslint.config.js`)
- Extends: `@eslint/js` recommended, `typescript-eslint` recommended
- Plugins: `react-hooks`, `react-refresh`
- Run: `npm run lint`

## Import Organization

**Order:**
1. React/external packages (`react`, `react-router-dom`, `zustand`)
2. Internal modules via `@/` alias (`@/hooks/index.ts`, `@/stores/device-store.ts`)
3. Relative imports (`./local-adapter.ts`)
4. Type imports (`import type { DeviceStatus }`)

**Path Aliases:**
- `@/` maps to `./src/` (configured in `vite.config.ts` and `tsconfig.app.json`)

**File Extensions:**
- Required in import paths (`.ts`, `.tsx`) due to `verbatimModuleSyntax: true`
- Example: `from '@/hooks/index.ts'` (not `from '@/hooks'`)

## Error Handling

**Patterns:**
- API adapter throws on network failure or non-OK response
- Store catches errors, updates state, triggers toast notification
- Consecutive failure counting for auto-reconnect logic
- ConnectionOverlay covers UI when device unreachable

**Error Types:**
- Standard `Error` objects with descriptive messages
- No custom error classes

## Logging

**Framework:**
- Console only (no structured logging library)

**Patterns:**
- Console for development debugging
- No console in committed production code

## Comments

**When to Comment:**
- Explain why, not what
- Document guards and race condition prevention
- Section headers with dashes: `// -- AutoConnect ----`

**Section Headers:**
```typescript
// -- AutoConnect ----------------------------------------------------------
// -- Light Mode Selector rendering ----------------------------------------
```

**ESLint Disable:**
- Include justification: `// eslint-disable-line react-hooks/exhaustive-deps -- intentionally run only on mount`

**JSDoc:**
- Used for public functions and interfaces (`src/api/device-api.ts`)
- Optional for internal functions

## Function Design

**Size:**
- Keep functions focused, extract helpers for complex logic

**Parameters:**
- Destructure objects in parameter lists
- Options objects for complex configurations

**Return Values:**
- Explicit returns
- Early return for guard clauses

## Module Design

**Exports:**
- Named exports preferred
- Default exports for page components
- Barrel files (`index.ts`) re-export public API per directory

**Store Access:**
- Never import stores directly in components
- Access via custom hook selectors (`useDeviceStatus()` not `useDeviceStore(s => s.lastStatus)`)
- Minimizes component re-renders

---

*Convention analysis: 2026-02-23*
*Update when patterns change*
