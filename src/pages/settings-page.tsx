import { useNavigate } from 'react-router-dom';
import { useDeviceStatus, useConnection } from '@/hooks/index.ts';
import { ClimateSettingsForm } from '@/components/settings/index.ts';

/** Loading skeleton shown while connecting to the device */
function ConnectingSkeleton() {
  return (
    <div className="p-4 space-y-6">
      <div className="h-6 w-48 animate-shimmer rounded" />
      <div className="space-y-4">
        <div className="h-16 animate-shimmer rounded-xl" />
        <div className="h-16 animate-shimmer rounded-xl" />
        <div className="h-16 animate-shimmer rounded-xl" />
      </div>
    </div>
  );
}

/** Disconnected state with navigation to the connection page */
function DisconnectedView() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <p className="text-lg text-muted-foreground">Not connected</p>
      <p className="mt-1 text-sm text-muted-foreground">
        Connect to your device to adjust climate settings.
      </p>
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

/** Error state with retry + navigation to connection settings */
function ErrorView({ message, onRetry }: { message: string; onRetry: () => void }) {
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

export default function SettingsPage() {
  const status = useDeviceStatus();
  const { connectionStatus, error, connect } = useConnection();

  // Connecting state — show skeleton
  if (connectionStatus === 'connecting') {
    return <ConnectingSkeleton />;
  }

  // Error state — show error message + retry
  if (connectionStatus === 'error') {
    return (
      <ErrorView
        message={error ?? 'Unable to reach the device'}
        onRetry={() => connect()}
      />
    );
  }

  // Disconnected state — prompt to connect
  if (connectionStatus === 'disconnected' || status === null) {
    return <DisconnectedView />;
  }

  return (
    <div className="animate-fade-in p-4">
      <h2 className="font-display text-2xl uppercase tracking-wider">
        Climate Settings
      </h2>
      <p className="mt-1 mb-6 text-sm text-muted-foreground">
        Adjust humidity and airflow for optimal growing conditions.
      </p>

      <ClimateSettingsForm />

      {/* Current readings reference */}
      <div className="mt-8 rounded-xl bg-deep-indigo/20 p-4">
        <p className="text-xs uppercase tracking-wider text-muted-foreground mb-3">
          Current Readings
        </p>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <p className="font-display text-lg tabular-nums text-bio-cyan">
              {status.sensorValid ? `${status.humidity.toFixed(1)}%` : '--'}
            </p>
            <p className="text-[10px] text-muted-foreground">Humidity</p>
          </div>
          <div>
            <p className="font-display text-lg tabular-nums text-bio-cyan">
              {status.sensorValid ? `${status.temperature.toFixed(1)}\u00B0C` : '--'}
            </p>
            <p className="text-[10px] text-muted-foreground">Temperature</p>
          </div>
          <div>
            <p className="font-display text-lg tabular-nums text-bio-cyan">
              {Math.round((status.fanSpeed / 255) * 100)}%
            </p>
            <p className="text-[10px] text-muted-foreground">Fan Speed</p>
          </div>
        </div>
      </div>
    </div>
  );
}
