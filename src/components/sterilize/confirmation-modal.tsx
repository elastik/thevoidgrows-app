import { useState } from 'react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading: boolean;
}

function WarningIcon() {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-neon-magenta"
    >
      <path d="M24 6L4 42h40L24 6Z" />
      <path d="M24 18v10" />
      <circle cx="24" cy="34" r="1.5" fill="currentColor" />
    </svg>
  );
}

export function ConfirmationModal({
  isOpen,
  onConfirm,
  onCancel,
  isLoading,
}: ConfirmationModalProps) {
  const [step, setStep] = useState<1 | 2>(1);

  // Reset step when modal opens/closes
  if (!isOpen && step !== 1) {
    setStep(1);
  }

  if (!isOpen) return null;

  function handleCancel() {
    setStep(1);
    onCancel();
  }

  function handleContinue() {
    if (step === 1) {
      setStep(2);
    } else {
      onConfirm();
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-void-black/80"
        onClick={handleCancel}
        onKeyDown={(e) => {
          if (e.key === 'Escape') handleCancel();
        }}
        role="button"
        tabIndex={-1}
        aria-label="Close modal"
      />

      {/* Modal card */}
      <div className="relative z-10 w-full max-w-sm rounded-2xl border border-neon-magenta/30 bg-deep-indigo p-6 shadow-2xl">
        {step === 1 ? (
          <>
            <div className="flex flex-col items-center text-center">
              <WarningIcon />
              <h3 className="mt-4 font-display text-xl uppercase tracking-wider text-neon-magenta">
                UV-C Warning
              </h3>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                UV-C light is <span className="text-neon-magenta font-medium">harmful to eyes and skin</span>.
                Ensure no one is exposed during the 15-minute sterilization cycle.
              </p>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 rounded-lg bg-deep-indigo/60 py-2.5 text-sm text-muted-foreground hover:bg-deep-indigo/80"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleContinue}
                className="flex-1 rounded-lg bg-neon-magenta/20 py-2.5 text-sm text-neon-magenta ring-1 ring-neon-magenta/50 hover:bg-neon-magenta/30"
              >
                I Understand
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-col items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-harvest-gold/20">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-harvest-gold"
                >
                  <path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z" />
                  <path d="M9 12l2 2 4-4" />
                </svg>
              </div>
              <h3 className="mt-4 font-display text-xl uppercase tracking-wider text-harvest-gold">
                Confirm Dome Sealed
              </h3>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                Confirm the dome is <span className="text-mycelium-white font-medium">properly seated and locked</span>.
                The reed switch must detect a closed dome before UV-C can activate.
              </p>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={handleCancel}
                disabled={isLoading}
                className="flex-1 rounded-lg bg-deep-indigo/60 py-2.5 text-sm text-muted-foreground hover:bg-deep-indigo/80 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleContinue}
                disabled={isLoading}
                className="flex-1 rounded-lg bg-harvest-gold/20 py-2.5 text-sm text-harvest-gold ring-1 ring-harvest-gold/50 hover:bg-harvest-gold/30 disabled:opacity-50"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="h-3 w-3 animate-spin rounded-full border border-harvest-gold border-t-transparent" />
                    Starting...
                  </span>
                ) : (
                  'Start UV-C'
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
