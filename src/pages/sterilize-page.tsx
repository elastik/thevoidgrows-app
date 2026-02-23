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

function UvcIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2L12 4" />
      <path d="M12 20L12 22" />
      <path d="M4.93 4.93L6.34 6.34" />
      <path d="M17.66 17.66L19.07 19.07" />
      <path d="M2 12L4 12" />
      <path d="M20 12L22 12" />
      <path d="M4.93 19.07L6.34 17.66" />
      <path d="M17.66 6.34L19.07 4.93" />
      <circle cx="12" cy="12" r="4" />
    </svg>
  );
}

export default function SterilizePage() {
  const status = useDeviceStatus();
  const { startSterilization } = useDeviceActions();
  const { connectionStatus, error: connectionError, connect } = useConnection();

  const [showModal, setShowModal] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [startError, setStartError] = useState<string | null>(null);

  // Connecting state
  if (connectionStatus === 'connecting') {
    return <ConnectingSkeleton />;
  }

  // Error state
  if (connectionStatus === 'error') {
    return (
      <ErrorView
        message={connectionError ?? 'Unable to reach the device'}
        onRetry={() => connect()}
      />
    );
  }

  // Disconnected state
  if (connectionStatus === 'disconnected' || status === null) {
    return <DisconnectedView />;
  }

  const isUvcActive = status.uvcActive;
  const isDomeSeated = status.domeSeated;

  async function handleConfirm() {
    setIsStarting(true);
    setStartError(null);
    try {
      await startSterilization();
      setShowModal(false);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to start sterilization';
      if (message.includes('409') || message.toLowerCase().includes('dome')) {
        setStartError('Dome is not properly seated. Check the reed switch and ensure the dome is locked.');
      } else {
        setStartError(message);
      }
      setShowModal(false);
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
        15-minute UV-C cycle to sterilize the grow chamber.
      </p>

      {/* Safety warning banner */}
      <div className="mb-6 rounded-xl border border-neon-magenta/30 bg-neon-magenta/5 p-4">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 shrink-0 text-neon-magenta">
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
              <path d="M10 3L2 17h16L10 3Z" />
              <path d="M10 8v4" />
              <circle cx="10" cy="14" r="0.5" fill="currentColor" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-neon-magenta">Safety Warning</p>
            <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
              UV-C light causes severe eye and skin damage. Never look directly at UV-C LEDs.
              The dome must be fully sealed during sterilization.
            </p>
          </div>
        </div>
      </div>

      {/* Dome status indicator */}
      <div className="mb-6 flex items-center gap-3 rounded-xl bg-deep-indigo/20 p-4">
        <span
          className={`h-3 w-3 rounded-full ${
            isDomeSeated ? 'bg-bio-cyan' : 'bg-neon-magenta animate-pulse'
          }`}
        />
        <div>
          <p className={`text-sm font-medium ${isDomeSeated ? 'text-bio-cyan' : 'text-neon-magenta'}`}>
            Dome {isDomeSeated ? 'Seated' : 'Not Seated'}
          </p>
          <p className="text-xs text-muted-foreground">
            {isDomeSeated
              ? 'Reed switch detected \u2014 dome is locked'
              : 'Dome must be seated before sterilization can start'}
          </p>
        </div>
      </div>

      {/* UV-C active state: countdown */}
      {isUvcActive ? (
        <div className="flex flex-col items-center py-4">
          <CountdownTimer remainingMs={status.uvcRemainingMs} />
        </div>
      ) : (
        /* Start button */
        <div className="flex flex-col items-center py-4">
          <button
            type="button"
            disabled={!isDomeSeated || isStarting}
            onClick={() => {
              setStartError(null);
              setShowModal(true);
            }}
            className="flex items-center gap-3 rounded-xl bg-neon-magenta/20 px-8 py-4 text-neon-magenta ring-1 ring-neon-magenta/50 transition-all hover:bg-neon-magenta/30 disabled:cursor-not-allowed disabled:opacity-40 disabled:ring-0"
          >
            <UvcIcon />
            <span className="font-display text-lg uppercase tracking-wider">
              Start Sterilization
            </span>
          </button>

          {!isDomeSeated && (
            <p className="mt-3 text-xs text-muted-foreground">
              Seat the dome to enable sterilization
            </p>
          )}
        </div>
      )}

      {/* Error display */}
      {startError && (
        <div className="mt-4 rounded-xl border border-neon-magenta/30 bg-neon-magenta/5 p-4 text-center">
          <p className="text-sm text-neon-magenta">{startError}</p>
          <button
            type="button"
            onClick={() => setStartError(null)}
            className="mt-2 text-xs text-muted-foreground hover:text-mycelium-white"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Confirmation modal */}
      <ConfirmationModal
        isOpen={showModal}
        onConfirm={() => void handleConfirm()}
        onCancel={() => setShowModal(false)}
        isLoading={isStarting}
      />
    </div>
  );
}
