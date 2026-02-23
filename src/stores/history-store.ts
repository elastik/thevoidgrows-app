import { create } from 'zustand';

/** Single snapshot of sensor data at a point in time */
export interface SensorSnapshot {
  timestamp: number;
  temperature: number;
  humidity: number;
  pressure: number;
}

interface HistoryStore {
  /** Ring buffer of sensor snapshots, oldest first */
  history: SensorSnapshot[];
  /** Append a snapshot, dropping oldest if over capacity */
  addSnapshot: (snapshot: SensorSnapshot) => void;
}

/** Max data points: 1 hour at 2s intervals = 1800 points */
export const MAX_HISTORY_POINTS = 1800;

export const useSensorHistoryStore = create<HistoryStore>((set) => ({
  history: [],

  addSnapshot(snapshot: SensorSnapshot): void {
    set((state) => {
      const updated = [...state.history, snapshot];
      // Trim oldest entries if over capacity
      if (updated.length > MAX_HISTORY_POINTS) {
        return { history: updated.slice(updated.length - MAX_HISTORY_POINTS) };
      }
      return { history: updated };
    });
  },
}));

/** Hook: subscribe to the sensor history array */
export function useSensorHistory(): SensorSnapshot[] {
  return useSensorHistoryStore((s) => s.history);
}
