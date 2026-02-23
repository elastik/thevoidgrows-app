import { useDeviceStatus } from '@/hooks/index.ts';
import type { LightMode } from '@/types/index.ts';

function formatLightMode(mode: LightMode): { label: string; colorClass: string } {
  switch (mode) {
    case 'void_glow':
      return { label: 'Void Glow', colorClass: 'text-uv-purple' };
    case 'uv_only':
      return { label: 'UV Only', colorClass: 'text-neon-magenta' };
    case 'blue_only':
      return { label: 'Blue', colorClass: 'text-bio-cyan' };
    case 'off':
      return { label: 'Off', colorClass: 'text-muted-foreground' };
  }
}

interface IndicatorProps {
  colorClass: string;
  label: string;
}

function Indicator({ colorClass, label }: IndicatorProps) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-deep-indigo/40 px-3 py-1 text-xs">
      <span className={`h-1.5 w-1.5 rounded-full ${colorClass} bg-current`} />
      <span className={colorClass}>{label}</span>
    </span>
  );
}

export function StatusRow() {
  const status = useDeviceStatus();

  if (status === null) {
    return null;
  }

  const domeColor = status.domeSeated ? 'text-bio-cyan' : 'text-neon-magenta';
  const domeLabel = status.domeSeated ? 'Seated' : 'Open';

  const light = formatLightMode(status.lightMode);

  const fanPercent = Math.round((status.fanSpeed / 255) * 100);
  const fanColor = fanPercent > 0 ? 'text-bio-cyan' : 'text-muted-foreground';
  const fanLabel = fanPercent > 0 ? `Fan ${fanPercent}%` : 'Fan Off';

  const humidColor = status.humidifierActive
    ? 'text-bio-cyan'
    : 'text-muted-foreground';
  const humidLabel = status.humidifierActive ? 'Humid On' : 'Humid Off';

  return (
    <div className="flex flex-wrap gap-2 px-4">
      <Indicator colorClass={domeColor} label={domeLabel} />
      <Indicator colorClass={light.colorClass} label={light.label} />
      <Indicator colorClass={fanColor} label={fanLabel} />
      <Indicator colorClass={humidColor} label={humidLabel} />
    </div>
  );
}
