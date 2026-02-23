import { useState } from 'react';
import { useConnection } from '@/hooks/index.ts';

export default function ConnectionPage() {
  const [ip, setIp] = useState(
    () => localStorage.getItem('voidcore-last-ip') ?? '192.168.4.1',
  );
  const { connectionStatus, error, connect, disconnect } = useConnection();

  function handleConnect() {
    const trimmed = ip.trim();
    if (!trimmed) return;
    localStorage.setItem('voidcore-last-ip', trimmed);
    connect();
  }

  const isConnected = connectionStatus === 'connected';
  const isConnecting = connectionStatus === 'connecting';
  const isError = connectionStatus === 'error';

  return (
    <div className="animate-fade-in p-4 space-y-6">
      {/* Section 1: Connection Status Card */}
      <div
        className={`rounded-xl border p-6 bg-deep-indigo/20 ${
          isConnected
            ? 'border-bio-cyan'
            : isConnecting
              ? 'border-harvest-gold'
              : isError
                ? 'border-neon-magenta'
                : 'border-deep-indigo'
        }`}
      >
        {isConnected && (
          <div className="flex items-center justify-between">
            <div>
              <p className="text-bio-cyan font-display text-lg">Connected</p>
              <p className="text-sm text-muted-foreground mt-1">
                Device at {ip}
              </p>
            </div>
            <button
              type="button"
              onClick={disconnect}
              className="rounded-lg bg-deep-indigo/40 px-4 py-2 text-sm text-muted-foreground hover:bg-deep-indigo/60"
            >
              Disconnect
            </button>
          </div>
        )}

        {isConnecting && (
          <div className="flex items-center gap-3">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-harvest-gold border-t-transparent" />
            <p className="text-harvest-gold font-display text-lg">
              Connecting...
            </p>
          </div>
        )}

        {isError && (
          <div>
            <p className="text-neon-magenta font-display text-lg">
              Connection Error
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {error ?? 'Unable to reach the device'}
            </p>
            <button
              type="button"
              onClick={handleConnect}
              className="mt-3 rounded-lg bg-deep-indigo/40 px-4 py-2 text-sm text-bio-cyan hover:bg-deep-indigo/60"
            >
              Retry
            </button>
          </div>
        )}

        {connectionStatus === 'disconnected' && (
          <p className="text-muted-foreground font-display text-lg">
            Not connected
          </p>
        )}
      </div>

      {/* Section 2: IP Input & Connect (only when not connected) */}
      {!isConnected && !isConnecting && (
        <div className="space-y-3">
          <label className="block text-xs uppercase tracking-wider text-muted-foreground">
            Device IP Address
          </label>
          <input
            type="text"
            value={ip}
            onChange={(e) => setIp(e.target.value)}
            placeholder="192.168.4.1"
            inputMode="decimal"
            className="w-full rounded-lg bg-deep-indigo/40 border border-deep-indigo px-4 py-3 text-lg text-mycelium-white font-mono placeholder:text-muted-foreground focus:border-uv-purple focus:outline-none focus:ring-1 focus:ring-uv-purple"
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleConnect();
            }}
          />
          <button
            type="button"
            onClick={handleConnect}
            disabled={!ip.trim() || isConnecting}
            className="w-full rounded-lg bg-uv-purple py-3 text-center font-display text-lg uppercase tracking-wider text-mycelium-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            Connect
          </button>
        </div>
      )}

      {/* Section 3: WiFi Setup Instructions */}
      <div className="rounded-xl bg-deep-indigo/10 p-4">
        <p className="text-sm font-display uppercase tracking-wider text-muted-foreground mb-3">
          How to Connect
        </p>
        <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
          <li>
            Open your phone&apos;s WiFi settings
          </li>
          <li>
            Connect to network:{' '}
            <span className="text-mycelium-white font-mono">VoidCore</span>
          </li>
          <li>
            Password:{' '}
            <span className="text-mycelium-white font-mono">voidgrows</span>
          </li>
          <li>Return to this app</li>
          <li>Tap Connect</li>
        </ol>
      </div>

      {/* Section 4: Mock Mode Indicator (dev only) */}
      {import.meta.env.VITE_MOCK_API === 'true' && (
        <div className="rounded-lg border border-dashed border-harvest-gold/30 px-3 py-2 text-center text-xs text-harvest-gold">
          Mock Mode — no real device needed
        </div>
      )}
    </div>
  );
}
