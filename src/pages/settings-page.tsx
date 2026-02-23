import { useDeviceStatus, useConnection } from '@/hooks/index.ts';
import { ClimateSettingsForm } from '@/components/settings/index.ts';
import { ErrorView, DisconnectedView, ConnectingSkeleton } from '@/components/ui/index.ts';

export default function SettingsPage() {
  const status = useDeviceStatus();
  const { connectionStatus, error, connect } = useConnection();

  if (connectionStatus === 'connecting') {
    return <ConnectingSkeleton variant="form" />;
  }

  if (connectionStatus === 'error') {
    return (
      <ErrorView
        message={error ?? 'Unable to reach the device'}
        onRetry={() => connect()}
      />
    );
  }

  if (connectionStatus === 'disconnected' || status === null) {
    return <DisconnectedView message="Connect to your device to adjust climate settings." />;
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
