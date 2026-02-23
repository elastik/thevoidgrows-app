import { useNavigate } from 'react-router-dom';

interface DisconnectedViewProps {
  message?: string;
}

export function DisconnectedView({ message = 'Connect to your device to view sensor data.' }: DisconnectedViewProps) {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <p className="text-lg text-muted-foreground">Not connected</p>
      <p className="mt-1 text-sm text-muted-foreground">{message}</p>
      <button
        type="button"
        onClick={() => navigate('/connect')}
        className="mt-4 rounded-lg bg-deep-indigo/40 px-4 py-2 text-sm text-bio-cyan hover:bg-deep-indigo/60"
      >
        Connect to Dome
      </button>
    </div>
  );
}
