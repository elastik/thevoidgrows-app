import { create } from 'zustand';
import { createAdapter } from '@/api/index.ts';
import type { DeviceAPI, ConnectionStatus } from '@/api/index.ts';
import type {
  DeviceStatus,
  LightMode,
  ClimateSettings,
  SetModeResponse,
  UpdateSettingsResponse,
  StartSterilizationResponse,
} from '@/types/index.ts';
import { useSensorHistoryStore } from './history-store.ts';

interface DeviceStore {
  // State
  connectionStatus: ConnectionStatus;
  lastStatus: DeviceStatus | null;
  error: string | null;
  adapter: DeviceAPI | null;

  // Actions
  connect: (options?: { baseUrl?: string; forceMock?: boolean }) => void;
  disconnect: () => void;
  setMode: (mode: LightMode) => Promise<SetModeResponse>;
  updateSettings: (settings: ClimateSettings) => Promise<UpdateSettingsResponse>;
  startSterilization: () => Promise<StartSterilizationResponse>;
}

/** Module-level polling timer — not part of Zustand state to avoid serialization issues */
let pollingTimer: ReturnType<typeof setInterval> | null = null;

/** Module-level consecutive failure counter for auto-reconnect logic */
let consecutiveFailures = 0;

/** Module-level reconnect timer for delayed reconnection */
let reconnectTimer: ReturnType<typeof setTimeout> | null = null;

/** Remember if mock was forced so reconnects use the same adapter type */
let useForceMock = false;

const POLL_INTERVAL_MS = 2000;
const ERROR_THRESHOLD = 3;
const DISCONNECT_THRESHOLD = 5;
const RECONNECT_DELAY_MS = 5000;

function clearTimers(): void {
  if (pollingTimer !== null) {
    clearInterval(pollingTimer);
    pollingTimer = null;
  }
  if (reconnectTimer !== null) {
    clearTimeout(reconnectTimer);
    reconnectTimer = null;
  }
}

export const useDeviceStore = create<DeviceStore>((set, get) => ({
  // Initial state
  connectionStatus: 'disconnected',
  lastStatus: null,
  error: null,
  adapter: null,

  connect(options?: { baseUrl?: string; forceMock?: boolean }): void {
    // Clear any pending reconnect
    if (reconnectTimer !== null) {
      clearTimeout(reconnectTimer);
      reconnectTimer = null;
    }

    set({ connectionStatus: 'connecting', error: null });

    if (options?.forceMock) useForceMock = true;
    const adapter = createAdapter(useForceMock);
    set({ adapter });
    consecutiveFailures = 0;

    // Initial status fetch
    adapter.getStatus().then(
      (status) => {
        // Guard: adapter may have been cleared by disconnect() during the fetch
        if (get().adapter !== adapter) return;

        set({ connectionStatus: 'connected', lastStatus: status });
        startPolling(adapter);
      },
      (err: unknown) => {
        if (get().adapter !== adapter) return;

        const message = err instanceof Error ? err.message : 'Connection failed';
        set({ connectionStatus: 'error', error: message });
      },
    );
  },

  disconnect(): void {
    clearTimers();
    consecutiveFailures = 0;
    set({
      adapter: null,
      lastStatus: null,
      connectionStatus: 'disconnected',
      error: null,
    });
  },

  async setMode(mode: LightMode): Promise<SetModeResponse> {
    const { adapter } = get();
    if (!adapter) throw new Error('Not connected to device');

    const response = await adapter.setMode(mode);

    // Optimistic update: reflect new mode in lastStatus immediately
    const { lastStatus } = get();
    if (lastStatus) {
      set({ lastStatus: { ...lastStatus, lightMode: mode } });
    }

    return response;
  },

  async updateSettings(settings: ClimateSettings): Promise<UpdateSettingsResponse> {
    const { adapter } = get();
    if (!adapter) throw new Error('Not connected to device');

    return adapter.updateSettings(settings);
  },

  async startSterilization(): Promise<StartSterilizationResponse> {
    const { adapter } = get();
    if (!adapter) throw new Error('Not connected to device');

    return adapter.startSterilization();
  },
}));

/**
 * Start polling for device status at POLL_INTERVAL_MS.
 * Handles consecutive failures with auto-reconnect logic:
 * - After ERROR_THRESHOLD failures → set connectionStatus to 'error'
 * - After DISCONNECT_THRESHOLD failures → disconnect and attempt reconnect after delay
 */
function startPolling(adapter: DeviceAPI): void {
  // Clear any existing polling timer
  if (pollingTimer !== null) {
    clearInterval(pollingTimer);
  }

  pollingTimer = setInterval(() => {
    void poll(adapter);
  }, POLL_INTERVAL_MS);
}

async function poll(expectedAdapter: DeviceAPI): Promise<void> {
  const { adapter } = useDeviceStore.getState();

  // Guard: adapter changed or was cleared (disconnect called)
  if (adapter !== expectedAdapter) return;

  try {
    const status = await adapter.getStatus();

    // Guard again after async operation
    if (useDeviceStore.getState().adapter !== expectedAdapter) return;

    consecutiveFailures = 0;
    useDeviceStore.setState({
      lastStatus: status,
      connectionStatus: 'connected',
      error: null,
    });

    // Record sensor snapshot for history chart
    if (status.sensorValid) {
      useSensorHistoryStore.getState().addSnapshot({
        timestamp: Date.now(),
        temperature: status.temperature,
        humidity: status.humidity,
        pressure: status.pressure,
      });
    }
  } catch (err: unknown) {
    // Guard after async operation
    if (useDeviceStore.getState().adapter !== expectedAdapter) return;

    consecutiveFailures++;
    const message = err instanceof Error ? err.message : 'Polling failed';

    if (consecutiveFailures >= DISCONNECT_THRESHOLD) {
      // Too many failures — disconnect and schedule reconnect
      useDeviceStore.getState().disconnect();

      reconnectTimer = setTimeout(() => {
        reconnectTimer = null;
        useDeviceStore.getState().connect();
      }, RECONNECT_DELAY_MS);
    } else if (consecutiveFailures >= ERROR_THRESHOLD) {
      // Multiple failures — signal error state
      useDeviceStore.setState({
        connectionStatus: 'error',
        error: message,
      });
    }
  }
}
