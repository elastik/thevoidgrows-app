import { useEffect } from 'react';
import { useDeviceStatus, useConnection, useDeviceActions } from '@/hooks/index.ts';
import { DomeVisual } from '@/components/demo/index.ts';
import { LightModeSelector } from '@/components/dashboard/index.ts';
import { SensorCard } from '@/components/dashboard/index.ts';

function ThermometerIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 14a3 3 0 1 0 0-6v6Z" />
      <path d="M10 2v12" />
      <rect x="7" y="2" width="6" height="12" rx="3" />
      <circle cx="10" cy="14" r="3" />
    </svg>
  );
}

function DropletIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 2s-5 5.5-5 9a5 5 0 0 0 10 0c0-3.5-5-9-5-9Z" />
    </svg>
  );
}

/** Auto-connect using mock adapter on demo page load */
function DemoAutoConnect() {
  const { connectionStatus, connect } = useConnection();

  useEffect(() => {
    if (connectionStatus === 'disconnected') {
      connect();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps -- run once on mount

  return null;
}

export default function DemoPage() {
  const status = useDeviceStatus();
  const { connectionStatus } = useConnection();
  const { startSterilization } = useDeviceActions();

  const isLoading = connectionStatus === 'connecting' || status === null;

  return (
    <div className="min-h-screen bg-void-black text-mycelium-white">
      <DemoAutoConnect />

      {/* Header */}
      <header className="border-b border-deep-indigo/40 px-4 py-3">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <div className="flex items-center gap-3">
            <svg width="28" height="28" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M50 10 Q20 30, 20 60 Q20 85, 50 90 Q80 85, 80 60 Q80 30, 50 10Z" fill="none" stroke="var(--color-uv-purple)" strokeWidth="3" />
              <circle cx="50" cy="55" r="8" fill="var(--color-bio-cyan)" opacity="0.6" />
            </svg>
            <div>
              <h1 className="font-display text-lg uppercase tracking-wider">The Void Grows</h1>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Virtual Dome Demo</p>
            </div>
          </div>
          <a
            href="https://github.com/elastik/void-blueprints"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-uv-purple/20 px-3 py-1.5 text-xs font-display uppercase tracking-wider text-uv-purple ring-1 ring-uv-purple/30 transition-colors hover:bg-uv-purple/30"
          >
            Build Your Own
          </a>
        </div>
      </header>

      {/* Main content */}
      <div className="mx-auto max-w-5xl px-4 py-6">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-uv-purple border-t-transparent" />
            <p className="mt-4 text-sm text-muted-foreground">Initializing virtual dome...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Left: Dome Visual */}
            <div className="flex flex-col items-center">
              <DomeVisual
                lightMode={status.lightMode}
                uvcActive={status.uvcActive}
                temperature={status.temperature}
                humidity={status.humidity}
              />

              {/* CTA below dome */}
              <div className="mt-4 rounded-xl bg-deep-indigo/20 p-4 text-center w-full max-w-[320px]">
                <p className="text-xs text-muted-foreground">
                  This is a simulated Void Dome. The real one grows mushrooms.
                </p>
                <a
                  href="https://github.com/elastik/void-blueprints"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block text-xs text-uv-purple hover:text-bio-cyan transition-colors"
                >
                  View build docs &rarr;
                </a>
              </div>
            </div>

            {/* Right: Controls */}
            <div className="space-y-6">
              {/* Sensor readings */}
              <div>
                <p className="mb-2 text-xs uppercase tracking-wider text-muted-foreground">
                  Live Sensors
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <SensorCard
                    label="Temperature"
                    value={status.sensorValid ? status.temperature.toFixed(1) : '--'}
                    unit={"\u00B0C"}
                    icon={<ThermometerIcon />}
                    accentColor="text-bio-cyan"
                  />
                  <SensorCard
                    label="Humidity"
                    value={status.sensorValid ? status.humidity.toFixed(1) : '--'}
                    unit="%"
                    icon={<DropletIcon />}
                    accentColor="text-uv-purple"
                  />
                </div>
              </div>

              {/* Light mode controls */}
              <div>
                <p className="mb-2 text-xs uppercase tracking-wider text-muted-foreground">
                  Light Mode
                </p>
                <LightModeSelector />
              </div>

              {/* UV-C demo button */}
              <div>
                <p className="mb-2 text-xs uppercase tracking-wider text-muted-foreground">
                  Sterilization
                </p>
                <button
                  type="button"
                  onClick={() => {
                    if (!status.uvcActive) {
                      void startSterilization();
                    }
                  }}
                  disabled={status.uvcActive}
                  className="w-full rounded-xl bg-neon-magenta/10 px-4 py-3 text-sm text-neon-magenta ring-1 ring-neon-magenta/30 transition-colors hover:bg-neon-magenta/20 disabled:opacity-50"
                >
                  {status.uvcActive ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="h-2 w-2 animate-pulse rounded-full bg-neon-magenta" />
                      UV-C Active — {Math.ceil(status.uvcRemainingMs / 60000)}m remaining
                    </span>
                  ) : (
                    'Try UV-C Sterilization'
                  )}
                </button>
              </div>

              {/* Status indicators */}
              <div className="rounded-xl bg-deep-indigo/20 p-4">
                <p className="mb-3 text-xs uppercase tracking-wider text-muted-foreground">
                  System Status
                </p>
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-deep-indigo/40 px-3 py-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-bio-cyan" />
                    <span className="text-bio-cyan">Dome Seated</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-deep-indigo/40 px-3 py-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-bio-cyan" />
                    <span className="text-bio-cyan">Fan {Math.round((status.fanSpeed / 255) * 100)}%</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-deep-indigo/40 px-3 py-1">
                    <span className={`h-1.5 w-1.5 rounded-full ${status.humidifierActive ? 'bg-bio-cyan' : 'bg-muted-foreground'}`} />
                    <span className={status.humidifierActive ? 'text-bio-cyan' : 'text-muted-foreground'}>
                      Humid {status.humidifierActive ? 'On' : 'Off'}
                    </span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-deep-indigo/40 px-3 py-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-harvest-gold" />
                    <span className="text-harvest-gold">v{status.version}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-deep-indigo/40 px-4 py-4 mt-8">
        <div className="mx-auto max-w-5xl text-center text-xs text-muted-foreground">
          <p>
            The Void Grows — Open-source automated grow chamber.{' '}
            <a
              href="https://github.com/elastik/void-blueprints"
              target="_blank"
              rel="noopener noreferrer"
              className="text-uv-purple hover:text-bio-cyan transition-colors"
            >
              Hardware docs
            </a>
            {' · '}
            <a
              href="https://github.com/elastik/thevoidgrows-app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-uv-purple hover:text-bio-cyan transition-colors"
            >
              App source
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
