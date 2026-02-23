import { Link } from 'react-router-dom';
import { useDeviceStatus } from '@/hooks/index.ts';
import { useConnection } from '@/hooks/index.ts';
import { SensorCard, StatusRow } from '@/components/dashboard/index.ts';

function ThermometerIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10 14a3 3 0 1 0 0-6v6Z" />
      <path d="M10 2v12" />
      <rect x="7" y="2" width="6" height="12" rx="3" />
      <circle cx="10" cy="14" r="3" />
    </svg>
  );
}

function DropletIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10 2s-5 5.5-5 9a5 5 0 0 0 10 0c0-3.5-5-9-5-9Z" />
    </svg>
  );
}

function GaugeIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10 17a7 7 0 1 1 0-14 7 7 0 0 1 0 14Z" />
      <path d="M10 10l3-3" />
      <circle cx="10" cy="10" r="1" fill="currentColor" />
    </svg>
  );
}

export default function DashboardPage() {
  const status = useDeviceStatus();
  const { connectionStatus } = useConnection();

  const isConnected = connectionStatus === 'connected' && status !== null;

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <p className="text-lg text-muted-foreground">Not connected</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Connect to your device to view sensor data.
        </p>
        <Link
          to="/connect"
          className="mt-4 rounded-lg bg-deep-indigo/40 px-4 py-2 text-sm text-bio-cyan hover:bg-deep-indigo/60"
        >
          Go to Connect
        </Link>
      </div>
    );
  }

  const temp = status.sensorValid
    ? status.temperature.toFixed(1)
    : '--';
  const humidity = status.sensorValid
    ? status.humidity.toFixed(1)
    : '--';
  const pressure = status.sensorValid
    ? status.pressure.toFixed(0)
    : '--';

  return (
    <div>
      <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-3">
        <SensorCard
          label="Temperature"
          value={temp}
          unit="\u00B0C"
          icon={<ThermometerIcon />}
          accentColor="text-bio-cyan"
        />
        <SensorCard
          label="Humidity"
          value={humidity}
          unit="%"
          icon={<DropletIcon />}
          accentColor="text-uv-purple"
        />
        <SensorCard
          label="Pressure"
          value={pressure}
          unit="hPa"
          icon={<GaugeIcon />}
          accentColor="text-harvest-gold"
        />
      </div>

      <p className="mt-6 mb-2 px-4 text-xs uppercase tracking-wider text-muted-foreground">
        Status
      </p>
      <StatusRow />
    </div>
  );
}
