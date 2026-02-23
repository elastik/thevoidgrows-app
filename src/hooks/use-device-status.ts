import { useDeviceStore } from '@/stores/index.ts';

/** Subscribe to real-time device status (updates every 2s while connected) */
export function useDeviceStatus() {
  const lastStatus = useDeviceStore((s) => s.lastStatus);
  return lastStatus;
}
