# The Void Grows — Companion App

## What This Is

A companion app for the Void Dome (ESP32-controlled grow chamber) that monitors sensors, controls lighting modes, adjusts climate settings, and manages UV-C sterilization. Built as a PWA + Capacitor app (iOS/Android/Web). Includes an interactive virtual dome demo at /demo for website embedding — visitors experience the dome controls with an animated visual simulation before buying or building.

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
- ✓ Animated virtual dome component (CSS/SVG) responds to light mode changes — v5.0
- ✓ Demo page (/demo route) with dome visual + app controls — v5.0
- ✓ Dome animation synced to mock adapter state — v5.0
- ✓ Website-embeddable deployment (iframe-ready, /demo-embed, ?embed=1) — v5.0
- ✓ Multi-species selector with health ranges (Blue Oyster, Lion's Mane, Pink Oyster) — v5.0
- ✓ Brand-consistent styling matching voidgrows.com (colors, fonts, feel) — v5.0
- ✓ Clean up tech debt (shared UI components, deleted stale files) — v5.0

### Active

- [ ] Screenshots/assets for the website app page (referenced in side panel but not yet captured)

### Out of Scope

- 3D rendering (Three.js/WebGL) — CSS/SVG animations sufficient for v1, revisit if conversion data demands it
- User accounts or login — public demo, no auth needed
- Real device connection from website — demo is mock-only, actual device control stays in installed app
- Supabase backend integration — no cloud features needed yet
- Multi-device support — single virtual dome for demo
- Grow logging or historical persistence — demo is ephemeral (timeline resets on reload)

## Context

- **Repo structure:** This app repo (`elastik/thevoidgrows-app`) is public. Website is in `elastik/thevoidgrows-web` (Next.js, private).
- **Architecture:** Virtual dome demo built in app repo, deployed standalone. Website iframes or links to /demo-embed.
- **Mock adapter:** Simulates realistic sensor data with noise, light mode persistence, climate echo, UV-C timer.
- **Brand:** Custom Tailwind tokens (`text-bio-cyan`, `bg-deep-indigo`, `border-neon-magenta`), Outfit font.
- **Current state:** 4,216 LOC TypeScript. 53 unit tests + 30 E2E Playwright tests passing.
- **Demo features:** iPhone frame mockup, 3 tabs (Dashboard, Climate, Grow Log), 3 species with health ranges, dynamic grow timeline (1 min = 1 day).

## Constraints

- **Performance**: Must load fast — no heavy assets, lazy-load animations, keep bundle small
- **Mobile-first**: Most website visitors on phones — demo must be touch-friendly and responsive
- **Brand consistency**: Colors, fonts (Outfit), and visual feel must match voidgrows.com
- **Public repo**: No secrets, API keys, or business strategy in code (per CLAUDE.md)
- **Tech stack**: React 19 + TypeScript + Vite + Tailwind CSS 4 (existing stack)

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Build demo in app repo, not website repo | Mock adapter and device logic already here; avoids duplication | ✓ Good |
| CSS/SVG animations over 3D | Fast load, mobile-friendly, sufficient for v1 conversion tool | ✓ Good |
| Standalone deploy + iframe/link | Website can embed without coupling codebases | ✓ Good |
| iPhone frame mockup for demo | Gives visitors the feel of using a real app | ✓ Good |
| Multi-species with health ranges | Shows dome versatility, makes demo more engaging | ✓ Good |

---
*Last updated: 2026-02-24 after v5.0 milestone*
