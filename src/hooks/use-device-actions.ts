import { useDeviceStore } from '@/stores/index.ts';

/** Get device control actions (setMode, updateSettings, startSterilization) */
export function useDeviceActions() {
  const setMode = useDeviceStore((s) => s.setMode);
  const updateSettings = useDeviceStore((s) => s.updateSettings);
  const startSterilization = useDeviceStore((s) => s.startSterilization);
  return { setMode, updateSettings, startSterilization };
}
