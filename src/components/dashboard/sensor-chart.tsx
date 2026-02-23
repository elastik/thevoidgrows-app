import { useSensorHistory } from '@/stores/index.ts';
import type { SensorSnapshot } from '@/stores/index.ts';

const VIEW_W = 360;
const VIEW_H = 120;
const PADDING_Y = 0.05; // 5% vertical padding

/** Map a value from [min, max] to SVG Y coordinate (inverted: top = max) */
function mapY(value: number, min: number, max: number): number {
  const range = max - min;
  if (range === 0) return VIEW_H / 2;
  const normalized = (value - min) / range;
  return VIEW_H - normalized * VIEW_H;
}

/** Map a timestamp to SVG X coordinate */
function mapX(ts: number, minTs: number, maxTs: number): number {
  const range = maxTs - minTs;
  if (range === 0) return VIEW_W / 2;
  return ((ts - minTs) / range) * VIEW_W;
}

/** Build an SVG polyline points string for a metric */
function buildPolyline(
  data: SensorSnapshot[],
  accessor: (s: SensorSnapshot) => number,
  minTs: number,
  maxTs: number,
): string {
  const values = data.map(accessor);
  const rawMin = Math.min(...values);
  const rawMax = Math.max(...values);
  const padding = (rawMax - rawMin) * PADDING_Y || 1;
  const min = rawMin - padding;
  const max = rawMax + padding;

  return data
    .map((s) => {
      const x = mapX(s.timestamp, minTs, maxTs).toFixed(1);
      const y = mapY(accessor(s), min, max).toFixed(1);
      return `${x},${y}`;
    })
    .join(' ');
}

interface LegendItemProps {
  color: string;
  label: string;
  value: string;
  unit: string;
}

function LegendItem({ color, label, value, unit }: LegendItemProps) {
  return (
    <div className="flex items-center gap-1.5">
      <span className={`h-2 w-2 rounded-full ${color}`} />
      <span className="text-[10px] text-muted-foreground">{label}</span>
      <span className={`text-xs font-medium tabular-nums ${color.replace('bg-', 'text-')}`}>
        {value}
        <span className="text-muted-foreground">{unit}</span>
      </span>
    </div>
  );
}

export function SensorChart() {
  const history = useSensorHistory();

  if (history.length < 2) {
    return (
      <div className="mx-4 rounded-xl bg-deep-indigo/20 p-4 text-center">
        <p className="text-xs text-muted-foreground">
          Collecting data...
        </p>
        <p className="mt-1 text-[10px] text-muted-foreground">
          Chart will appear after a few readings
        </p>
      </div>
    );
  }

  const minTs = history[0].timestamp;
  const maxTs = history[history.length - 1].timestamp;
  const latest = history[history.length - 1];

  const tempPoints = buildPolyline(history, (s) => s.temperature, minTs, maxTs);
  const humidPoints = buildPolyline(history, (s) => s.humidity, minTs, maxTs);
  const pressPoints = buildPolyline(history, (s) => s.pressure, minTs, maxTs);

  return (
    <div className="mx-4 rounded-xl bg-deep-indigo/20 p-4">
      {/* Chart */}
      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        className="w-full"
        preserveAspectRatio="none"
        style={{ height: '120px' }}
      >
        {/* Grid lines */}
        {[0.25, 0.5, 0.75].map((frac) => (
          <line
            key={frac}
            x1="0"
            y1={VIEW_H * frac}
            x2={VIEW_W}
            y2={VIEW_H * frac}
            stroke="currentColor"
            strokeWidth="0.5"
            strokeDasharray="4 4"
            className="text-deep-indigo"
          />
        ))}

        {/* Pressure line (behind others) */}
        <polyline
          points={pressPoints}
          fill="none"
          stroke="var(--color-harvest-gold)"
          strokeWidth="1.5"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />

        {/* Humidity line */}
        <polyline
          points={humidPoints}
          fill="none"
          stroke="var(--color-uv-purple)"
          strokeWidth="1.5"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />

        {/* Temperature line (on top) */}
        <polyline
          points={tempPoints}
          fill="none"
          stroke="var(--color-bio-cyan)"
          strokeWidth="1.5"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      {/* Legend */}
      <div className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-1">
        <LegendItem
          color="bg-bio-cyan"
          label="Temp"
          value={latest.temperature.toFixed(1)}
          unit={'\u00B0C'}
        />
        <LegendItem
          color="bg-uv-purple"
          label="Humid"
          value={latest.humidity.toFixed(1)}
          unit="%"
        />
        <LegendItem
          color="bg-harvest-gold"
          label="Press"
          value={latest.pressure.toFixed(0)}
          unit="hPa"
        />
      </div>
    </div>
  );
}
