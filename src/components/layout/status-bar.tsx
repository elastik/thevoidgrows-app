import { useConnection } from '@/hooks/index.ts';

export function StatusBar() {
  const { connectionStatus, error } = useConnection();

  let dotColor: string;
  let label: string;
  let textColor: string;
  let pulse = false;

  switch (connectionStatus) {
    case 'connected':
      dotColor = 'bg-bio-cyan';
      label = 'Connected';
      textColor = 'text-bio-cyan';
      break;
    case 'connecting':
      dotColor = 'bg-harvest-gold';
      label = 'Connecting...';
      textColor = 'text-harvest-gold';
      pulse = true;
      break;
    case 'error':
      dotColor = 'bg-neon-magenta';
      label = error ?? 'Connection error';
      textColor = 'text-neon-magenta';
      break;
    case 'disconnected':
    default:
      dotColor = 'bg-muted-foreground';
      label = 'Disconnected';
      textColor = 'text-muted-foreground';
      break;
  }

  return (
    <div className="flex h-8 shrink-0 items-center gap-2 bg-deep-indigo/50 px-4 text-xs">
      <span
        className={`h-2 w-2 rounded-full ${dotColor} ${pulse ? 'animate-pulse' : ''}`}
      />
      <span className={`${textColor} truncate`}>{label}</span>
    </div>
  );
}
