# Contributing to Void Core

Welcome! Void Core is an open-source device control app for **The Void Grows** mushroom cultivation dome. It provides a web-based interface for monitoring sensors, controlling UV-C sterilization, managing grow cycles, and more.

We appreciate contributions of all kinds — bug fixes, new features, documentation improvements, and design feedback.

## Getting Started

1. **Fork and clone the repo**
   ```bash
   git clone https://github.com/your-username/thevoidgrows-app.git
   cd thevoidgrows-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the dev server in mock mode**
   ```bash
   echo "VITE_MOCK_API=true" > .env
   npm run dev
   ```

   Open [http://localhost:5173](http://localhost:5173). The app runs with simulated sensor data — no physical dome needed.

### Mock Mode

You don't need a physical dome to develop. Set `VITE_MOCK_API=true` in a `.env` file at the project root:

```
VITE_MOCK_API=true
```

This activates the `MockAdapter`, which provides:
- Simulated sensor readings with realistic variation
- Light mode persistence
- UV-C sterilization timer that counts down over 15 minutes
- Simulated 50ms network latency

All UI features, store logic, and tests work identically in mock mode.

## Project Structure

```
src/
  api/            DeviceAPI interface + adapters (Local, Mock)
    device-api.ts   Abstract interface (5 methods)
    local-adapter.ts  HTTP fetch to ESP32
    mock-adapter.ts   Simulated responses for dev/test
    create-adapter.ts Factory based on VITE_MOCK_API env var
  components/
    dashboard/    Sensor cards, light mode selector, chart
    settings/     Climate sliders, settings form
    sterilize/    Confirmation modal, countdown timer
    ui/           Toast notifications, connection overlay
    layout/       Bottom nav, app shell
  hooks/          Selector hooks for Zustand stores
  pages/          Route-level page components
  stores/         Zustand stores (device, toast, sensor history)
  types/          TypeScript interfaces matching firmware REST API
```

## Development

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with hot reload |
| `npm run build` | TypeScript check + production build |
| `npm test` | Run all tests once |
| `npm run test:watch` | Run tests in watch mode |
| `npm run lint` | Run ESLint |
| `npx tsc --noEmit` | Type check only |

Ensure both `npm run build` and `npm test` pass before submitting a PR.

## Code Style

### TypeScript
- **Strict mode** — no `any` types unless absolutely necessary.
- Use `type` imports (`import type { ... }`) for type-only imports.
- Include `.ts` / `.tsx` extensions in import paths (required by `verbatimModuleSyntax`).
- Use the `@/` path alias for `src/` imports (e.g., `import { MockAdapter } from '@/api/mock-adapter.ts'`).

### React
- **Functional components** with hooks — no class components.
- Keep components small and focused. Extract shared logic into custom hooks.
- Use selector hooks for Zustand store access to minimize re-renders.

### Tailwind CSS
- **Tailwind v4 CSS-first** — styles use `@theme` tokens, no `tailwind.config.js`.
- Use brand tokens: `void-black`, `deep-indigo`, `uv-purple`, `bio-cyan`, `neon-magenta`, `harvest-gold`, `mycelium-white`.
- Avoid inline styles and CSS modules.

### Component Patterns
- **Adapter pattern** for API layer — all new backends implement `DeviceAPI` interface.
- **Zustand stores** for shared state — device connection, toasts, sensor history.
- **Custom hooks** as selectors — `useDeviceStatus()`, `useDeviceActions()`, `useConnection()`.

## Commit Messages

Follow the conventional commit format:

```
type(scope): description

feat(dashboard): add CO2 sensor card
fix(store): prevent polling after disconnect
test(adapter): add LocalAdapter timeout test
docs(readme): update quick start instructions
```

Types: `feat`, `fix`, `test`, `docs`, `chore`, `refactor`, `style`, `perf`

## Pull Requests

1. Fork the repo and create a feature branch from `main`.
2. Make your changes with clear, descriptive commits.
3. Ensure `npm run build` and `npm test` both pass.
4. Open a PR against `main` with a description of what you changed and why.

### PR Checklist

- [ ] `npm run build` passes (TypeScript + Vite)
- [ ] `npm test` passes (all tests green)
- [ ] No `any` types introduced
- [ ] New components have tests
- [ ] Mock mode still works (`VITE_MOCK_API=true`)

## Native Development

See [BUILD.md](BUILD.md) for Capacitor build instructions covering:
- Android Studio setup and debug APK builds
- Xcode setup and iOS simulator testing
- Live reload on physical devices
- Network permissions for local HTTP to ESP32

## API Reference

See [API-CONTRACT.md](API-CONTRACT.md) for the complete firmware REST API specification. All TypeScript types matching the API are in `src/types/device.ts`.

## License

This project is licensed under the [MIT License](LICENSE).
