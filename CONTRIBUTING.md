# Contributing to Void Core

Welcome! Void Core is an open-source device control app for **The Void Grows** mushroom cultivation dome. It provides a web-based interface for monitoring sensors, controlling UV-C sterilization, managing grow cycles, and more.

We appreciate contributions of all kinds — bug fixes, new features, documentation improvements, and design feedback.

## Getting Started

1. **Clone the repo**
   ```bash
   git clone https://github.com/your-org/thevoidgrows-app.git
   cd thevoidgrows-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the dev server**
   ```bash
   npm run dev
   ```

### Mock Mode

You don't need a physical dome to develop! Set `VITE_MOCK_API=true` in a `.env` file at the project root to use mock data for all API calls:

```
VITE_MOCK_API=true
```

This enables simulated sensor readings, device state, and grow cycle data so you can work on UI and logic without hardware.

## Project Structure

```
src/
  api/        — API client and endpoint definitions
  components/ — Reusable UI components
  hooks/      — Custom React hooks
  pages/      — Route-level page components
  stores/     — State management (Zustand)
  types/      — TypeScript type definitions
```

## Development

- **Dev server:** `npm run dev`
- **Production build:** `npm run build`
- **Type check:** `npx tsc --noEmit`

Ensure both `npm run build` and `npx tsc --noEmit` pass before submitting a PR.

## Pull Requests

1. Fork the repo and create a feature branch from `main`.
2. Make your changes with clear, descriptive commits.
3. Ensure the build and typecheck pass.
4. Open a PR against `main` with a description of what you changed and why.

## Code Style

- **TypeScript strict mode** — no `any` types unless absolutely necessary.
- **Tailwind CSS** for all styling — avoid inline styles and CSS modules.
- **Functional React components** with hooks — no class components.
- Keep components small and focused. Extract shared logic into custom hooks.

## License

This project is licensed under the [MIT License](LICENSE).
