# Testing Patterns

**Analysis Date:** 2026-02-23

## Test Framework

**Runner:**
- Vitest 4.0.18
- Config: `vitest.config.ts` in project root
- Environment: jsdom (virtual DOM for React testing)
- Globals: enabled (no need to import `describe`, `it`, `expect`)

**Setup:**
- Setup file: `vitest.setup.ts`
- Imports `@testing-library/jest-dom/vitest` for DOM matchers

**Assertion Library:**
- Vitest built-in expect
- Extended with jest-dom matchers (`toBeVisible`, `toBeInTheDocument`)

**Run Commands:**
```bash
npm test                              # Run all tests once (CI)
npm run test:watch                    # Watch mode (development)
```

## Test File Organization

**Location:**
- Co-located `__tests__/` directories within feature folders
- E2E tests in separate `tests/e2e/` directory

**Naming:**
- Unit/component: `{name}.test.ts` or `{name}.test.tsx`
- E2E: `verify-{id}.spec.ts`

**Structure:**
```
src/
  api/
    __tests__/
      local-adapter.test.ts
      mock-adapter.test.ts
  components/
    __tests__/
      climate-slider.test.tsx
      confirmation-modal.test.tsx
  stores/
    __tests__/
      device-store.test.ts
tests/
  e2e/
    verify-27-02.spec.ts
    verify-27-03.spec.ts
```

## Test Structure

**Suite Organization:**
```typescript
import { render, screen, fireEvent } from '@testing-library/react'

describe('ComponentName', () => {
  describe('feature area', () => {
    it('should handle success case', () => {
      // arrange
      const props = { ... }

      // act
      render(<Component {...props} />)

      // assert
      expect(screen.getByText('...')).toBeVisible()
    })
  })
})
```

**Patterns:**
- `beforeEach` for per-test setup and state reset
- `vi.restoreAllMocks()` in afterEach
- Arrange/act/assert structure
- One assertion focus per test (multiple expects OK)

## Mocking

**Framework:**
- Vitest built-in mocking (`vi`)
- Module mocking via `vi.mock()` at top of file

**Patterns:**
```typescript
// Mock module
vi.mock('@/api/create-adapter.ts', () => ({
  createAdapter: vi.fn()
}))

// Stub global fetch
const fetchMock = vi.fn()
vi.stubGlobal('fetch', fetchMock)

// Mock return values
fetchMock.mockResolvedValue({
  ok: true,
  json: () => Promise.resolve(mockData)
})
```

**What to Mock:**
- `fetch` (global stub for API tests)
- `createAdapter` (factory in store tests)
- Timer functions (`vi.useFakeTimers()` for polling tests)

**What NOT to Mock:**
- Internal pure functions
- Type definitions
- Simple utilities

## Fixtures and Factories

**Test Data:**
```typescript
// Inline mock data at top of test file
const mockStatus: DeviceStatus = {
  temperature: 23.5,
  humidity: 87.2,
  lightMode: 'void_glow',
  uvcActive: false,
  // ...
}
```

**Location:**
- Inline in test file (most common)
- No shared fixtures directory

## Coverage

**Requirements:**
- No enforced coverage target
- PR checklist requires `npm test` passes
- New components must have tests (`CONTRIBUTING.md`)

**View Coverage:**
```bash
npm test -- --coverage
```

## Test Types

**Unit Tests:**
- Scope: Individual adapters, stores, utility functions
- Location: `src/*/__tests__/*.test.ts`
- Examples: `local-adapter.test.ts` (14 cases), `device-store.test.ts` (10 cases)

**Component Tests:**
- Scope: React component rendering and interactions
- Location: `src/components/__tests__/*.test.tsx`
- Examples: `climate-slider.test.tsx` (7 cases), `confirmation-modal.test.tsx`
- Uses: `render()`, `screen`, `fireEvent` from React Testing Library

**E2E Tests:**
- Framework: Playwright 1.58
- Location: `tests/e2e/*.spec.ts`
- Config: `playwright.config.ts`
- Scope: Full app workflows, connection states, visual regression
- Includes screenshots for state verification

## Common Patterns

**Async Testing:**
```typescript
it('handles async operation', async () => {
  const result = await adapter.getStatus()
  expect(result.temperature).toBe(23.5)
})
```

**Error Testing:**
```typescript
it('throws on network failure', async () => {
  fetchMock.mockRejectedValue(new TypeError('Failed to fetch'))
  await expect(adapter.getStatus()).rejects.toThrow('Device unreachable')
})
```

**Store Testing:**
```typescript
describe('useDeviceStore', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    useDeviceStore.getState().disconnect()
  })

  it('transitions to connected on success', async () => {
    useDeviceStore.getState().connect()
    await vi.waitFor(() => {
      expect(useDeviceStore.getState().connectionStatus).toBe('connected')
    })
  })
})
```

**Component Testing:**
```typescript
it('calls onChange when slider changes', () => {
  const onChange = vi.fn()
  render(<ClimateSlider {...props} onChange={onChange} />)
  fireEvent.change(screen.getByRole('slider'), { target: { value: '85' } })
  expect(onChange).toHaveBeenCalledWith(85)
})
```

**Snapshot Testing:**
- Not used (prefer explicit assertions)

---

*Testing analysis: 2026-02-23*
*Update when test patterns change*
