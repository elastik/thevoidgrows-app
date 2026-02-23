import { describe, it, expect, beforeEach } from 'vitest';
import { MockAdapter } from '../mock-adapter.ts';

describe('MockAdapter', () => {
  let adapter: MockAdapter;

  beforeEach(() => {
    adapter = new MockAdapter();
  });

  describe('getStatus', () => {
    it('returns a valid DeviceStatus shape', async () => {
      const status = await adapter.getStatus();

      expect(status).toHaveProperty('temperature');
      expect(status).toHaveProperty('humidity');
      expect(status).toHaveProperty('pressure');
      expect(status).toHaveProperty('sensorValid', true);
      expect(status).toHaveProperty('lightMode', 'void_glow');
      expect(status).toHaveProperty('lightCycleOn', true);
      expect(status).toHaveProperty('uvcActive', false);
      expect(status).toHaveProperty('uvcRemainingMs', 0);
      expect(status).toHaveProperty('domeSeated', true);
      expect(status).toHaveProperty('fanSpeed');
      expect(status).toHaveProperty('humidifierActive');
      expect(status).toHaveProperty('climateAuto', true);
      expect(status).toHaveProperty('uptime');
      expect(status).toHaveProperty('version', '0.1.0');
    });

    it('returns temperature near 22C', async () => {
      const status = await adapter.getStatus();
      expect(status.temperature).toBeGreaterThan(20);
      expect(status.temperature).toBeLessThan(24);
    });

    it('returns humidity near 88%', async () => {
      const status = await adapter.getStatus();
      expect(status.humidity).toBeGreaterThan(84);
      expect(status.humidity).toBeLessThan(92);
    });

    it('returns pressure near 1013 hPa', async () => {
      const status = await adapter.getStatus();
      expect(status.pressure).toBeGreaterThan(1011);
      expect(status.pressure).toBeLessThan(1015);
    });

    it('shows uvcActive after sterilization is started', async () => {
      await adapter.startSterilization();
      const status = await adapter.getStatus();
      expect(status.uvcActive).toBe(true);
      expect(status.uvcRemainingMs).toBeGreaterThan(0);
    });
  });

  describe('setMode', () => {
    it('returns success and echoes the mode', async () => {
      const result = await adapter.setMode('blue_only');
      expect(result).toEqual({ success: true, mode: 'blue_only' });
    });

    it('persists mode across getStatus calls', async () => {
      await adapter.setMode('uv_only');
      const status = await adapter.getStatus();
      expect(status.lightMode).toBe('uv_only');
    });

    it('accepts all valid light modes', async () => {
      const modes = ['void_glow', 'uv_only', 'blue_only', 'off'] as const;
      for (const mode of modes) {
        const result = await adapter.setMode(mode);
        expect(result.success).toBe(true);
        expect(result.mode).toBe(mode);
      }
    });
  });

  describe('updateSettings', () => {
    it('returns success and echoes settings', async () => {
      const settings = {
        humiditySetpoint: 85,
        humidityDeadband: 2,
        fanBaseSpeed: 60,
      };
      const result = await adapter.updateSettings(settings);
      expect(result.success).toBe(true);
      expect(result.settings).toEqual(settings);
    });

    it('persists settings (affects fan speed in status)', async () => {
      await adapter.updateSettings({
        humiditySetpoint: 90,
        humidityDeadband: 3,
        fanBaseSpeed: 80,
      });
      const status = await adapter.getStatus();
      // fanSpeed = fanBaseSpeed * 2.55 rounded
      expect(status.fanSpeed).toBe(Math.round(80 * 2.55));
    });
  });

  describe('startSterilization', () => {
    it('returns success with 15-minute duration', async () => {
      const result = await adapter.startSterilization();
      expect(result).toEqual({ success: true, durationMinutes: 15 });
    });

    it('activates UV-C in subsequent status calls', async () => {
      await adapter.startSterilization();
      const status = await adapter.getStatus();
      expect(status.uvcActive).toBe(true);
      expect(status.uvcRemainingMs).toBeGreaterThan(0);
      expect(status.uvcRemainingMs).toBeLessThanOrEqual(15 * 60 * 1000);
    });
  });

  describe('getConfig', () => {
    it('returns a valid DeviceConfig shape', async () => {
      const config = await adapter.getConfig();

      expect(config).toHaveProperty('humiditySetpoint');
      expect(config).toHaveProperty('humidityDeadband');
      expect(config).toHaveProperty('fanBaseSpeed');
      expect(config).toHaveProperty('lightMode', 'void_glow');
      expect(config).toHaveProperty('version', '0.1.0');
      expect(config).toHaveProperty('uptime');
      expect(config).toHaveProperty('ssid', 'VoidCore-Mock');
    });

    it('reflects updated settings', async () => {
      await adapter.updateSettings({
        humiditySetpoint: 92,
        humidityDeadband: 4,
        fanBaseSpeed: 70,
      });
      const config = await adapter.getConfig();
      expect(config.humiditySetpoint).toBe(92);
      expect(config.humidityDeadband).toBe(4);
      expect(config.fanBaseSpeed).toBe(70);
    });

    it('reflects updated light mode', async () => {
      await adapter.setMode('off');
      const config = await adapter.getConfig();
      expect(config.lightMode).toBe('off');
    });
  });
});
