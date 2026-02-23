# Technology Stack

**Analysis Date:** 2026-02-23

## Languages

**Primary:**
- TypeScript 5.9 (strict mode) - All application code (`tsconfig.app.json`)

**Secondary:**
- JavaScript - Config files (`eslint.config.js`, `vite.config.ts`)
- CSS - Tailwind CSS utility classes (`src/index.css`)

## Runtime

**Environment:**
- Node.js (development only, no version constraint)
- Browser ES2022 (production target) - `tsconfig.app.json`
- Capacitor 8.1 native runtime for iOS/Android - `capacitor.config.ts`

**Package Manager:**
- npm
- Lockfile: `package-lock.json` present

## Frameworks

**Core:**
- React 19.2 - UI framework (`package.json`)
- React Router DOM 7.13 - Client-side routing (`src/App.tsx`)
- Zustand 5.0 - State management (`src/stores/`)
- Capacitor 8.1 - Native mobile wrapper (`capacitor.config.ts`)

**Testing:**
- Vitest 4.0 - Unit/component tests (`vitest.config.ts`)
- React Testing Library 16.3 - Component testing
- Playwright 1.58 - E2E tests (`playwright.config.ts`)

**Build/Dev:**
- Vite 7.3 - Bundler and dev server (`vite.config.ts`)
- TypeScript 5.9 - Type checking
- vite-plugin-pwa 1.2 - PWA support with offline caching

## Key Dependencies

**Critical:**
- `zustand` 5.0 - All app state (device, history, toasts) (`src/stores/`)
- `react-router-dom` 7.13 - Page routing (`src/App.tsx`)
- `@capacitor/core` 8.1 - Native device APIs (`capacitor.config.ts`)

**Infrastructure:**
- `@vitejs/plugin-react` 5.1 - React JSX fast refresh
- `@tailwindcss/vite` 4.2 - Tailwind CSS integration
- `vite-plugin-pwa` 1.2 - Service worker and offline support

## Configuration

**Environment:**
- `VITE_MOCK_API` - Controls adapter selection (mock vs real device) (`src/api/create-adapter.ts`)
- No `.env` file committed; users create locally

**Build:**
- `vite.config.ts` - Build config, PWA manifest, path aliases (`@/` = `./src/`)
- `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json` - TypeScript
- `eslint.config.js` - ESLint 9 flat config
- `vitest.config.ts` - Test runner (jsdom environment)

## Platform Requirements

**Development:**
- Any platform with Node.js
- No external dependencies (no Docker, no DB)

**Production:**
- Web: PWA (standalone mode, installable)
- Mobile: iOS/Android via Capacitor (`com.thevoidgrows.app`)
- Local WiFi access to ESP32 device

---

*Stack analysis: 2026-02-23*
*Update after major dependency changes*
