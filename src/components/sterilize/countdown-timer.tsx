const TOTAL_MS = 15 * 60 * 1000; // 15 minutes
const CIRCLE_RADIUS = 54;
const CIRCUMFERENCE = 2 * Math.PI * CIRCLE_RADIUS;

interface CountdownTimerProps {
  remainingMs: number;
  totalMs?: number;
}

export function CountdownTimer({
  remainingMs,
  totalMs = TOTAL_MS,
}: CountdownTimerProps) {
  const progress = totalMs > 0 ? remainingMs / totalMs : 0;
  const dashOffset = CIRCUMFERENCE * (1 - progress);

  const totalSeconds = Math.ceil(remainingMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const display = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Active indicator */}
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 animate-pulse rounded-full bg-neon-magenta" />
        <span className="text-xs uppercase tracking-wider text-neon-magenta">
          UV-C Active
        </span>
      </div>

      {/* Circular progress ring */}
      <div className="relative flex items-center justify-center">
        <svg width="140" height="140" viewBox="0 0 140 140" className="-rotate-90">
          {/* Background ring */}
          <circle
            cx="70"
            cy="70"
            r={CIRCLE_RADIUS}
            fill="none"
            stroke="currentColor"
            strokeWidth="6"
            className="text-deep-indigo/50"
          />
          {/* Progress ring */}
          <circle
            cx="70"
            cy="70"
            r={CIRCLE_RADIUS}
            fill="none"
            stroke="currentColor"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={dashOffset}
            className="text-neon-magenta transition-[stroke-dashoffset] duration-1000 ease-linear"
          />
        </svg>

        {/* Time display centered */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display text-4xl tabular-nums text-mycelium-white">
            {display}
          </span>
          <span className="text-[10px] text-muted-foreground">remaining</span>
        </div>
      </div>

      {/* Warning reminder */}
      <p className="text-center text-xs text-muted-foreground max-w-[200px]">
        Do not open the dome while UV-C sterilization is in progress.
      </p>
    </div>
  );
}
