import { useState, useEffect, useRef } from 'react';
import { useDeviceStatus, useDeviceActions, useConnection } from '@/hooks/index.ts';
import { ClimateSlider } from './climate-slider.tsx';

type SaveState = 'idle' | 'saving' | 'saved' | 'error';

export function ClimateSettingsForm() {
  const status = useDeviceStatus();
  const { updateSettings } = useDeviceActions();
  const { connectionStatus } = useConnection();

  const isDisconnected = connectionStatus !== 'connected';

  // Local slider state — initialized from device status
  const [humiditySetpoint, setHumiditySetpoint] = useState(90);
  const [humidityDeadband, setHumidityDeadband] = useState(3);
  const [fanBaseSpeed, setFanBaseSpeed] = useState(50);
  const [saveState, setSaveState] = useState<SaveState>('idle');
  const [initialized, setInitialized] = useState(false);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const savedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Initialize from device status on first connected status
  useEffect(() => {
    if (status && !initialized) {
      setHumiditySetpoint(status.humidity > 0 ? 90 : 90); // Default setpoint
      setFanBaseSpeed(Math.round((status.fanSpeed / 255) * 100));
      setInitialized(true);
    }
  }, [status, initialized]);

  // Debounced save effect
  useEffect(() => {
    if (!initialized || isDisconnected) return;

    // Clear previous timers
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (savedTimerRef.current) clearTimeout(savedTimerRef.current);

    debounceRef.current = setTimeout(() => {
      setSaveState('saving');
      updateSettings({ humiditySetpoint, humidityDeadband, fanBaseSpeed })
        .then(() => {
          setSaveState('saved');
          savedTimerRef.current = setTimeout(() => setSaveState('idle'), 2000);
        })
        .catch(() => {
          setSaveState('error');
          savedTimerRef.current = setTimeout(() => setSaveState('idle'), 3000);
        });
    }, 500);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [humiditySetpoint, humidityDeadband, fanBaseSpeed, initialized, isDisconnected, updateSettings]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (savedTimerRef.current) clearTimeout(savedTimerRef.current);
    };
  }, []);

  return (
    <div className="space-y-6">
      <ClimateSlider
        label="Humidity Setpoint"
        value={humiditySetpoint}
        onChange={setHumiditySetpoint}
        min={80}
        max={95}
        step={1}
        unit="%"
        disabled={isDisconnected}
      />

      <ClimateSlider
        label="Humidity Deadband"
        value={humidityDeadband}
        onChange={setHumidityDeadband}
        min={1}
        max={5}
        step={0.5}
        unit="%"
        disabled={isDisconnected}
      />

      <ClimateSlider
        label="Fan Base Speed"
        value={fanBaseSpeed}
        onChange={setFanBaseSpeed}
        min={0}
        max={100}
        step={5}
        unit="%"
        disabled={isDisconnected}
      />

      {/* Save state indicator */}
      <div className="h-5 text-center text-xs">
        {saveState === 'saving' && (
          <span className="text-harvest-gold">Saving...</span>
        )}
        {saveState === 'saved' && (
          <span className="text-bio-cyan">Saved</span>
        )}
        {saveState === 'error' && (
          <span className="text-neon-magenta">Save failed</span>
        )}
      </div>
    </div>
  );
}
