import { useDeviceStore } from '@/stores/index.ts';

/** Get connection state and connect/disconnect actions */
export function useConnection() {
  const connectionStatus = useDeviceStore((s) => s.connectionStatus);
  const error = useDeviceStore((s) => s.error);
  const connect = useDeviceStore((s) => s.connect);
  const disconnect = useDeviceStore((s) => s.disconnect);
  return { connectionStatus, error, connect, disconnect } as const;
}
