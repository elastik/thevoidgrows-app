# Codebase Concerns

**Analysis Date:** 2026-02-23

## Tech Debt

**Duplicate ErrorView components across pages:**
- Issue: Nearly identical `ErrorView` component defined in 3 separate pages
- Files: `src/pages/dashboard-page.tsx`, `src/pages/settings-page.tsx`, `src/pages/sterilize-page.tsx`
- Impact: Changes to error display must be replicated in 3 places
- Fix approach: Extract shared `ErrorView` to `src/components/ui/error-view.tsx`

**Duplicate skeleton/loading patterns:**
- Issue: Near-identical loading skeleton defined in 3 pages
- Files: `src/pages/dashboard-page.tsx`, `src/pages/settings-page.tsx`, `src/pages/sterilize-page.tsx`
- Impact: Inconsistent loading states if one page is updated
- Fix approach: Extract shared skeleton component to `src/components/ui/`

**Module-level mutable state for polling:**
- Issue: `pollingTimer`, `consecutiveFailures`, `reconnectTimer` managed as module-level variables outside Zustand
- File: `src/stores/device-store.ts` (lines 29-41)
- Why: Avoid serialization issues in Zustand state
- Impact: Timer leaks possible if adapter changes unexpectedly; pattern requires careful synchronization
- Fix approach: Acceptable trade-off, but add comments documenting the pattern

## Known Bugs

**Stale `_write.js` file in project root:**
- Symptoms: Causes ESLint parse errors, clutters root directory
- File: `_write.js`
- Workaround: File is gitignored (untracked)
- Root cause: Appears to be unfinished build script with unterminated string
- Fix: Delete or complete the file

## Security Considerations

**No IP address validation on connection page:**
- Risk: User can enter any string (not just valid IPs) as device address
- File: `src/pages/connection-page.tsx` (lines 10-14)
- Current mitigation: Only checks for non-empty string
- Recommendations: Add IP format validation before storing in localStorage

**Hard-coded WiFi credentials in UI:**
- Risk: WiFi SSID (`VoidCore`) and password (`voidgrows`) visible in app UI and binary
- File: `src/pages/connection-page.tsx` (lines 125-130)
- Current mitigation: Expected behavior for device setup flow
- Recommendations: Document as known exposure; consider making configurable

**No runtime validation of API responses:**
- Risk: Malformed ESP32 responses silently accepted, could cause UI errors
- Files: `src/api/local-adapter.ts` (response casting)
- Current mitigation: TypeScript compile-time checks only
- Recommendations: Add lightweight runtime validation (e.g., check required fields exist)

## Performance Bottlenecks

- No significant performance concerns detected
- Polling at 2s intervals is appropriate for sensor data
- Ring buffer (1800 points) prevents unbounded memory growth

## Fragile Areas

**Polling/reconnection state machine:**
- File: `src/stores/device-store.ts`
- Why fragile: Complex interaction between module-level timers, consecutive failure counts, and adapter identity guards
- Common failures: Stale closure capturing old adapter reference
- Safe modification: Always check adapter identity after async operations; test with `vi.useFakeTimers()`
- Test coverage: Good (10 test cases in `device-store.test.ts`)

## Dependencies at Risk

**npm audit vulnerabilities:**
- Risk: 10 high severity vulnerabilities in `minimatch` (ReDoS)
- Impact: Affects ESLint toolchain (dev dependency only, not production)
- Migration plan: `npm audit fix --force` (may require breaking changes)

## Test Coverage Gaps

**Pages not directly tested:**
- What's not tested: Page components (`dashboard-page.tsx`, `settings-page.tsx`, `sterilize-page.tsx`, `connection-page.tsx`)
- Risk: UI regressions in page-level logic
- Priority: Medium (E2E tests cover some workflows)
- Difficulty: Requires mocking stores and adapters

**Toast store:**
- What's not tested: `toast-store.ts` has no unit tests
- Risk: Low (simple state management)
- Priority: Low

---

*Concerns audit: 2026-02-23*
*Update as issues are fixed or new ones discovered*
