import { useNavigate } from 'react-router-dom';

interface ErrorViewProps {
  message: string;
  onRetry: () => void;
}

export function ErrorView({ message, onRetry }: ErrorViewProps) {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <p className="text-lg text-neon-magenta">Connection Error</p>
      <p className="mt-1 text-sm text-muted-foreground">{message}</p>
      <div className="mt-4 flex gap-3">
        <button
          type="button"
          onClick={onRetry}
          className="rounded-lg bg-deep-indigo/40 px-4 py-2 text-sm text-bio-cyan hover:bg-deep-indigo/60"
        >
          Retry
        </button>
        <button
          type="button"
          onClick={() => navigate('/connect')}
          className="rounded-lg bg-deep-indigo/40 px-4 py-2 text-sm text-muted-foreground hover:bg-deep-indigo/60"
        >
          Connection Settings
        </button>
      </div>
    </div>
  );
}
