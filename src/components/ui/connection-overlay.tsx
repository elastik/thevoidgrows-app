import { useState, useEffect, useRef } from 'react';
import { useConnection } from '@/hooks/index.ts';

const COUNTDOWN_SECONDS = 5;

export function ConnectionOverlay() {
  const { connectionStatus, error, connect } = useConnection();
  const [countdown, setCountdown] = useState(COUNTDOWN_SECONDS);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const isVisible = connectionStatus === 'error';

  // Start/reset countdown when overlay becomes visible
  useEffect(() => {
    if (!isVisible) {
      setCountdown(COUNTDOWN_SECONDS);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    setCountdown(COUNTDOWN_SECONDS);
    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          timerRef.current = null;
          connect();
          return COUNTDOWN_SECONDS;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isVisible, connect]);

  if (!isVisible) return null;

  function handleRetry() {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setCountdown(COUNTDOWN_SECONDS);
    connect();
  }

  return (
    <div className="fixed inset-0 top-10 z-40 flex items-center justify-center bg-void-black/70 backdrop-blur-sm">
      <div className="mx-4 w-full max-w-xs rounded-2xl border border-neon-magenta/20 bg-deep-indigo p-6 text-center shadow-2xl">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-neon-magenta/20">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-neon-magenta"
          >
            <path d="M1 1l22 22" />
            <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55" />
            <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39" />
            <path d="M10.71 5.05A16 16 0 0 1 22.56 9" />
            <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88" />
            <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
            <circle cx="12" cy="20" r="1" fill="currentColor" />
          </svg>
        </div>

        <h3 className="font-display text-xl uppercase tracking-wider text-neon-magenta">
          Connection Lost
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          {error ?? 'Unable to reach the device'}
        </p>

        <p className="mt-4 text-xs text-muted-foreground">
          Reconnecting in{' '}
          <span className="font-display text-base tabular-nums text-mycelium-white">
            {countdown}
          </span>
          s
        </p>

        <button
          type="button"
          onClick={handleRetry}
          className="mt-4 w-full rounded-lg bg-bio-cyan/20 py-2.5 text-sm text-bio-cyan ring-1 ring-bio-cyan/40 hover:bg-bio-cyan/30"
        >
          Retry Now
        </button>
      </div>
    </div>
  );
}
