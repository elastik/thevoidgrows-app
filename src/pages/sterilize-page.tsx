import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDeviceStatus, useDeviceActions, useConnection } from '@/hooks/index.ts';
import { ConfirmationModal, CountdownTimer } from '@/components/sterilize/index.ts';

/** Loading skeleton shown while connecting to the device */
function ConnectingSkeleton() {
  return (
    <div className="p-4 space-y-6">
      <div className="h-6 w-48 animate-pulse rounded bg-deep-indigo/30" />
      <div className="h-24 animate-pulse rounded-xl bg-deep-indigo/30" />
      <div className="h-40 animate-pulse rounded-xl bg-deep-indigo/30" />
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
        Connect to your device to control UV-C sterilization.
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

export default function SterilizePage() {
  const status = useDeviceStatus();
  const { startSterilization } = useDeviceActions();
  const { connectionStatus, error, connect } = useConnection();

  const [showModal, setShowModal] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [startError, setStartError] = useState<string | null>(null);

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

  const isDomeNotSeated = !status.domeSeated;
  const isUvcActive = status.uvcActive;
  const canStart = !isDomeNotSeated && !isUvcActive && !isStarting;

  async function handleConfirm() {
    setIsStarting(true);
    setStartError(null);
    try {
      await startSterilization();
      setShowModal(false);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to start sterilization';
      // Check for 409 / dome-related error
      if (message.includes('409') || message.toLowerCase().includes('dome')) {
        setStartError('Dome is not properly seated. Please secure the dome and try again.');
      } else {
        setStartError(message);
      }
    } finally {
      setIsStarting(false);
    }
  }

  return (
    <div className="p-4">
      <h2 className="font-display text-2xl uppercase tracking-wider">
        UV-C Sterilization
      </h2>
      <p className="mt-1 mb-6 text-sm text-muted-foreground">
        15-minute sterilization cycle using UV-C light.
      </p>

      {/* Safety warning banner */}
      <div className="rounded-xl border border-neon-magenta/30 bg-neon-magenta/5 p-4 mb-6">
        <div className="flex items-start gap-3">
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mt-0.5 shrink-0 text-neon-magenta"
          >
            <path d="M10 2L1 18h18L10 2Z" />
            <path d="M10 8v4" />
            <circle cx="10" cy="14.5" r="0.5" fill="currentColor" />
          </svg>
          <div>
            <p className="text-sm font-medium text-neon-magenta">UV-C Hazard Warning</p>
            <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
              UV-C light is harmful to eyes and skin. Never open the dome during an
              active sterilization cycle. Ensure the dome is properly sealed before starting.
            </p>
          </div>
        </div>
      </div>

      {/* Dome status indicator */}
      <div className="rounded-xl bg-deep-indigo/20 p-4 mb-6">
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase tracking-wider text-muted-foreground">
            Dome Status
          </span>
          <span className={`flex items-center gap-2 text-sm ${isDomeNotSeated ? 'text-neon-magenta' : 'text-bio-cyan'}`}>
            <span className={`h-2 w-2 rounded-full ${isDomeNotSeated ? 'bg-neon-magenta' : 'bg-bio-cyan'}`} />
            {isDomeNotSeated ? 'Not Seated' : 'Sealed'}
          </span>
        </div>
      </div>

      {/* Active cycle — countdown timer */}
      {isUvcActive && (
        <div className="mb-6 flex justify-center">
          <CountdownTimer remainingMs={status.uvcRemainingMs} />
        </div>
      )}

      {/* Start error message */}
      {startError && (
        <div className="rounded-xl border border-neon-magenta/30 bg-neon-magenta/5 p-3 mb-6">
          <p className="text-sm text-neon-magenta text-center">{startError}</p>
        </div>
      )}

      {/* Start button (hidden when UV-C is already active) */}
      {!isUvcActive && (
        <button
          type="button"
          onClick={() => {
            setStartError(null);
            setShowModal(true);
          }}
          disabled={!canStart}
          className="w-full rounded-xl bg-neon-magenta/20 py-3 text-sm font-medium text-neon-magenta ring-1 ring-neon-magenta/40 hover:bg-neon-magenta/30 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isDomeNotSeated ? 'Dome Must Be Sealed' : 'Start Sterilization'}
        </button>
      )}

      {/* Two-step confirmation modal */}
      <ConfirmationModal
        isOpen={showModal}
        onConfirm={handleConfirm}
        onCancel={() => setShowModal(false)}
        isLoading={isStarting}
      />
    </div>
  );
}
