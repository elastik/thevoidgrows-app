import type { ReactNode } from 'react';

interface SensorCardProps {
  label: string;
  value: string;
  unit: string;
  icon: ReactNode;
  accentColor?: string;
}

export function SensorCard({
  label,
  value,
  unit,
  icon,
  accentColor = 'text-bio-cyan',
}: SensorCardProps) {
  const isInvalid = value === '--';
  const valueColor = isInvalid ? 'text-muted-foreground' : accentColor;

  return (
    <div className="rounded-xl bg-deep-indigo/40 p-4">
      <div className="flex items-center gap-2">
        <span className="text-muted-foreground">{icon}</span>
        <span className="text-xs uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
      </div>
      <div className="mt-2 flex items-baseline gap-1">
        <span
          className={`font-display text-4xl tabular-nums transition-colors duration-300 ${valueColor}`}
        >
          {value}
        </span>
        <span className="text-lg text-muted-foreground">{unit}</span>
      </div>
    </div>
  );
}
