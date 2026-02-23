import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { useDeviceStore } from '../device-store.ts';
import type { DeviceStatus, ClimateSettings } from '@/types/device.ts';

// Mock the create-adapter module to inject a controllable mock
vi.mock('@/api/index.ts', () => {
  return {
    createAdapter: vi.fn(),
  };
});

// Mock the history store to prevent side effects
vi.mock('../history-store.ts', () => ({
  useSensorHistoryStore: {
    getState: () => ({
      addSnapshot: vi.fn(),
    }),
  },
}));

import { createAdapter } from '@/api/index.ts';

const mockStatus: DeviceStatus = {
  temperature: 23.5,
  humidity: 87.2,
  pressure: 1013.2,
  sensorValid: true,
  lightMode: 'void_glow',
  lightCycleOn: true,
  uvcActive: false,
  uvcRemainingMs: 0,
  domeSeated: true,
  fanSpeed: 25,
  humidifierActive: false,
  climateAuto: true,
  uptime: 3600,
  version: '0.1.0',
};

function createMockAdapter() {
  return {
    getStatus: vi.fn().mockResolvedValue(mockStatus),
    setMode: vi.fn().mockResolvedValue({ success: true, mode: 'blue_only' }),
    updateSettings: vi.fn().mockResolvedValue({
      success: true,
      settings: { humiditySetpoint: 90, humidityDeadband: 3, fanBaseSpeed: 50 },
    }),
    startSterilization: vi.fn().mockResolvedValue({
      success: true,
      durationMinutes: 15,
    }),
    getConfig: vi.fn().mockResolvedValue({
      humiditySetpoint: 90,
      humidityDeadband: 3,
      fanBaseSpeed: 50,
      lightMode: 'void_glow',
      version: '0.1.0',
      uptime: 3600,
      ssid: 'VoidCore',
    }),
  };
}

describe('useDeviceStore', () => {
  let mockAdapter: ReturnType<typeof createMockAdapter>;

  beforeEach(() => {
    vi.useFakeTimers();
    mockAdapter = createMockAdapter();
    vi.mocked(createAdapter).mockReturnValue(mockAdapter);

    // Reset store to initial state
    useDeviceStore.getState().disconnect();
  });

  afterEach(() => {
    useDeviceStore.getState().disconnect();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  describe('initial state', () => {
    it('starts disconnected with no status', () => {
      const state = useDeviceStore.getState();
      expect(state.connectionStatus).toBe('disconnected');
      expect(state.lastStatus).toBeNull();
      expect(state.error).toBeNull();
      expect(state.adapter).toBeNull();
    });
  });

  describe('connect', () => {
    it('transitions to connecting then connected on success', async () => {
      useDeviceStore.getState().connect();

      // Immediately after connect(), should be 'connecting'
      expect(useDeviceStore.getState().connectionStatus).toBe('connecting');

      // Let the initial getStatus promise resolve
      await vi.waitFor(() => {
        expect(useDeviceStore.getState().connectionStatus).toBe('connected');
      });

      expect(useDeviceStore.getState().lastStatus).toEqual(mockStatus);
      expect(useDeviceStore.getState().adapter).not.toBeNull();
    });

    it('transitions to error when initial getStatus fails', async () => {
      mockAdapter.getStatus.mockRejectedValueOnce(new Error('Device unreachable'));

      useDeviceStore.getState().connect();

      await vi.waitFor(() => {
        expect(useDeviceStore.getState().connectionStatus).toBe('error');
      });

      expect(useDeviceStore.getState().error).toBe('Device unreachable');
    });
  });

  describe('disconnect', () => {
    it('resets state to disconnected', async () => {
      useDeviceStore.getState().connect();

      await vi.waitFor(() => {
        expect(useDeviceStore.getState().connectionStatus).toBe('connected');
      });

      useDeviceStore.getState().disconnect();

      const state = useDeviceStore.getState();
      expect(state.connectionStatus).toBe('disconnected');
      expect(state.lastStatus).toBeNull();
      expect(state.adapter).toBeNull();
      expect(state.error).toBeNull();
    });
  });

  describe('setMode', () => {
    it('calls adapter setMode and updates lastStatus optimistically', async () => {
      useDeviceStore.getState().connect();
      await vi.waitFor(() => {
        expect(useDeviceStore.getState().connectionStatus).toBe('connected');
      });

      const result = await useDeviceStore.getState().setMode('blue_only');

      expect(mockAdapter.setMode).toHaveBeenCalledWith('blue_only');
      expect(result).toEqual({ success: true, mode: 'blue_only' });
      expect(useDeviceStore.getState().lastStatus?.lightMode).toBe('blue_only');
    });

    it('throws when not connected', async () => {
      await expect(useDeviceStore.getState().setMode('off')).rejects.toThrow(
        'Not connected to device',
      );
    });
  });

  describe('updateSettings', () => {
    it('calls adapter updateSettings', async () => {
      useDeviceStore.getState().connect();
      await vi.waitFor(() => {
        expect(useDeviceStore.getState().connectionStatus).toBe('connected');
      });

      const settings: ClimateSettings = {
        humiditySetpoint: 90,
        humidityDeadband: 3,
        fanBaseSpeed: 50,
      };
      const result = await useDeviceStore.getState().updateSettings(settings);

      expect(mockAdapter.updateSettings).toHaveBeenCalledWith(settings);
      expect(result.success).toBe(true);
    });

    it('throws when not connected', async () => {
      const settings: ClimateSettings = {
        humiditySetpoint: 90,
        humidityDeadband: 3,
        fanBaseSpeed: 50,
      };
      await expect(
        useDeviceStore.getState().updateSettings(settings),
      ).rejects.toThrow('Not connected to device');
    });
  });

  describe('startSterilization', () => {
    it('calls adapter startSterilization', async () => {
      useDeviceStore.getState().connect();
      await vi.waitFor(() => {
        expect(useDeviceStore.getState().connectionStatus).toBe('connected');
      });

      const result = await useDeviceStore.getState().startSterilization();

      expect(mockAdapter.startSterilization).toHaveBeenCalled();
      expect(result).toEqual({ success: true, durationMinutes: 15 });
    });

    it('throws when not connected', async () => {
      await expect(
        useDeviceStore.getState().startSterilization(),
      ).rejects.toThrow('Not connected to device');
    });
  });
});
