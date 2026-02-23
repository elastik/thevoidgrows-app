import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { LocalAdapter } from '../local-adapter.ts';
import type { DeviceStatus } from '@/types/device.ts';

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

describe('LocalAdapter', () => {
  let adapter: LocalAdapter;
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    adapter = new LocalAdapter('http://192.168.4.1', 5000);
    fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('URL construction', () => {
    it('prepends baseUrl to path for getStatus', async () => {
      fetchMock.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockStatus),
      });

      await adapter.getStatus();

      expect(fetchMock).toHaveBeenCalledWith(
        'http://192.168.4.1/status',
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
        }),
      );
    });

    it('uses custom base URL', async () => {
      const customAdapter = new LocalAdapter('http://10.0.0.1');
      fetchMock.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockStatus),
      });

      await customAdapter.getStatus();

      expect(fetchMock).toHaveBeenCalledWith(
        'http://10.0.0.1/status',
        expect.anything(),
      );
    });
  });

  describe('getStatus', () => {
    it('returns parsed device status', async () => {
      fetchMock.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockStatus),
      });

      const result = await adapter.getStatus();
      expect(result).toEqual(mockStatus);
    });
  });

  describe('setMode', () => {
    it('sends POST with mode in body', async () => {
      fetchMock.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ success: true, mode: 'blue_only' }),
      });

      const result = await adapter.setMode('blue_only');

      expect(fetchMock).toHaveBeenCalledWith(
        'http://192.168.4.1/mode',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ mode: 'blue_only' }),
        }),
      );
      expect(result).toEqual({ success: true, mode: 'blue_only' });
    });
  });

  describe('updateSettings', () => {
    it('sends POST with settings body', async () => {
      const settings = {
        humiditySetpoint: 90,
        humidityDeadband: 3,
        fanBaseSpeed: 50,
      };
      fetchMock.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ success: true, settings }),
      });

      const result = await adapter.updateSettings(settings);

      expect(fetchMock).toHaveBeenCalledWith(
        'http://192.168.4.1/settings',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(settings),
        }),
      );
      expect(result.success).toBe(true);
      expect(result.settings).toEqual(settings);
    });
  });

  describe('startSterilization', () => {
    it('sends POST with confirm: true', async () => {
      fetchMock.mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve({ success: true, durationMinutes: 15 }),
      });

      const result = await adapter.startSterilization();

      expect(fetchMock).toHaveBeenCalledWith(
        'http://192.168.4.1/sterilize',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ confirm: true }),
        }),
      );
      expect(result).toEqual({ success: true, durationMinutes: 15 });
    });
  });

  describe('getConfig', () => {
    it('sends GET request to /config', async () => {
      const config = {
        humiditySetpoint: 88,
        humidityDeadband: 2,
        fanBaseSpeed: 30,
        lightMode: 'void_glow',
        version: '0.1.0',
        uptime: 3600,
        ssid: 'VoidCore',
      };
      fetchMock.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(config),
      });

      const result = await adapter.getConfig();

      expect(fetchMock).toHaveBeenCalledWith(
        'http://192.168.4.1/config',
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
        }),
      );
      expect(result).toEqual(config);
    });
  });

  describe('error handling', () => {
    it('throws "Device unreachable" on network failure', async () => {
      fetchMock.mockRejectedValue(new Error('Failed to fetch'));

      await expect(adapter.getStatus()).rejects.toThrow('Device unreachable');
    });

    it('throws parsed error message from API error response', async () => {
      fetchMock.mockResolvedValue({
        ok: false,
        status: 400,
        json: () => Promise.resolve({ error: 'Invalid mode' }),
      });

      await expect(adapter.setMode('void_glow')).rejects.toThrow('Invalid mode');
    });

    it('throws generic HTTP status when error body cannot be parsed', async () => {
      fetchMock.mockResolvedValue({
        ok: false,
        status: 500,
        json: () => Promise.reject(new Error('not json')),
      });

      await expect(adapter.getStatus()).rejects.toThrow('HTTP 500');
    });

    it('throws "Request timed out" on AbortError', async () => {
      const abortError = new Error('The operation was aborted');
      abortError.name = 'AbortError';
      fetchMock.mockRejectedValue(abortError);

      await expect(adapter.getStatus()).rejects.toThrow('Request timed out');
    });

    it('throws 409 error message for dome not seated', async () => {
      fetchMock.mockResolvedValue({
        ok: false,
        status: 409,
        json: () => Promise.resolve({ error: 'Dome not detected' }),
      });

      await expect(adapter.startSterilization()).rejects.toThrow(
        'Dome not detected',
      );
    });
  });
});
