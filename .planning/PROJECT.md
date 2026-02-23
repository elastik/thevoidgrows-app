# The Void Grows — Companion App

## What This Is

A companion app for the Void Dome (ESP32-controlled grow chamber) that monitors sensors, controls lighting modes, adjusts climate settings, and manages UV-C sterilization. Built as a PWA + Capacitor app (iOS/Android/Web). The next milestone adds an interactive virtual dome demo to the website at voidgrows.com/app — a conversion tool that lets visitors experience the dome controls with an animated visual simulation.

## Core Value

The virtual dome demo on voidgrows.com/app must sell the product — visitors interact with real controls, see an animated dome respond, and understand what owning a Void Dome feels like before they buy or build one.

## Requirements

### Validated

- ✓ Device connection via WiFi to ESP32 with auto-reconnect — existing
- ✓ Real-time sensor dashboard (temperature, humidity, time-series charts) — existing
- ✓ Light mode control (void_glow, uv_only, blue_only, off) — existing
- ✓ Climate settings (humidity setpoint, fan speed) — existing
- ✓ UV-C sterilization with safety confirmation and countdown — existing
- ✓ Mock adapter for development without hardware — existing
- ✓ PWA with offline caching and installable — existing
- ✓ Capacitor native builds (iOS/Android) — existing
- ✓ Test suite (Vitest unit/component + Playwright E2E) — existing

### Active

- [ ] Animated virtual dome component (CSS/SVG) that responds to light mode changes
- [ ] Demo page (`/demo` route) with dome visual + app controls side-by-side
- [ ] Dome animation synced to mock adapter state (lights change color, sensors fluctuate)
- [ ] Website-embeddable deployment (iframe-ready or direct link from voidgrows.com/app)
- [ ] Mobile-responsive demo layout (most visitors on phones)
- [ ] Brand-consistent styling matching voidgrows.com (colors, fonts, feel)
- [ ] Screenshots/assets for the website app page
- [ ] Clean up tech debt (duplicate ErrorView, duplicate skeletons, stale _write.js)

### Out of Scope

- 3D rendering (Three.js/WebGL) — CSS/SVG animations sufficient for v1, revisit if conversion data demands it
- User accounts or login — public demo, no auth needed
- Real device connection from website — demo is mock-only, actual device control stays in installed app
- Supabase backend integration — no cloud features this milestone
- Multi-device support — single virtual dome for demo
- Grow logging or historical persistence — demo is ephemeral

## Context

- **Repo structure:** This app repo (`elastik/thevoidgrows-app`) is public. Website is in `elastik/thevoidgrows-web` (Next.js, private).
- **Architecture decision:** Build the virtual dome demo in this repo, deploy standalone. Website links to or iframes the deployed demo. Avoids code duplication.
- **Mock adapter:** Already simulates realistic sensor data with noise, light mode persistence, climate echo, UV-C timer. Foundation for the virtual dome experience.
- **Brand:** The app already uses custom Tailwind tokens (`text-bio-cyan`, `bg-deep-indigo`, `border-neon-magenta`). Need to ensure demo page matches voidgrows.com brand identity.
- **Previous attempt:** An embedded app approach was tried before — this time we're building a purpose-built demo experience, not just dropping the raw app into the site.

## Constraints

- **Performance**: Must load fast — no heavy assets, lazy-load animations, keep bundle small
- **Mobile-first**: Most website visitors on phones — demo must be touch-friendly and responsive
- **Brand consistency**: Colors, fonts (Outfit), and visual feel must match voidgrows.com
- **Public repo**: No secrets, API keys, or business strategy in code (per CLAUDE.md)
- **Tech stack**: React 19 + TypeScript + Vite + Tailwind CSS 4 (existing stack)

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Build demo in app repo, not website repo | Mock adapter and device logic already here; avoids duplication | — Pending |
| CSS/SVG animations over 3D | Fast load, mobile-friendly, sufficient for v1 conversion tool | — Pending |
| Standalone deploy + iframe/link | Website can embed without coupling codebases | — Pending |

---
*Last updated: 2026-02-23 after initialization*
