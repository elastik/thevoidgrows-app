import { useState } from 'react';
import { useDeviceStatus, useDeviceActions, useConnection } from '@/hooks/index.ts';
import type { LightMode } from '@/types/index.ts';

interface ModeConfig {
  mode: LightMode;
  label: string;
  description: string;
  colorClass: string;
  bgClass: string;
  icon: React.ReactNode;
}

const LIGHT_MODES: ModeConfig[] = [
  {
    mode: 'void_glow',
    label: 'Void Glow',
    description: 'UV + Blue cycle',
    colorClass: 'text-uv-purple',
    bgClass: 'bg-uv-purple/10',
    icon: (
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
        <circle cx="10" cy="10" r="4" />
        <path d="M10 2v2M10 16v2M2 10h2M16 10h2M4.93 4.93l1.41 1.41M13.66 13.66l1.41 1.41M4.93 15.07l1.41-1.41M13.66 6.34l1.41-1.41" />
      </svg>
    ),
  },
  {
    mode: 'uv_only',
    label: 'UV Only',
    description: 'Ultraviolet light',
    colorClass: 'text-neon-magenta',
    bgClass: 'bg-neon-magenta/10',
    icon: (
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
        <path d="M10 2v4M10 14v4M2 10h4M14 10h4" />
        <circle cx="10" cy="10" r="3" />
      </svg>
    ),
  },
  {
    mode: 'blue_only',
    label: 'Blue',
    description: 'Blue spectrum',
    colorClass: 'text-bio-cyan',
    bgClass: 'bg-bio-cyan/10',
    icon: (
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
        <path d="M10 2a8 8 0 0 1 0 16" />
        <path d="M10 2a5 5 0 0 0 0 16" />
        <path d="M10 2v16" />
      </svg>
    ),
  },
  {
    mode: 'off',
    label: 'Off',
    description: 'Lights off',
    colorClass: 'text-muted-foreground',
    bgClass: 'bg-muted-foreground/10',
    icon: (
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
        <circle cx="10" cy="10" r="6" />
        <path d="M4 16L16 4" />
      </svg>
    ),
  },
];

export function LightModeSelector() {
  const status = useDeviceStatus();
  const { setMode } = useDeviceActions();
  const { connectionStatus } = useConnection();
  const [pendingMode, setPendingMode] = useState<LightMode | null>(null);

  const isDisconnected = connectionStatus !== 'connected';
  const currentMode = status?.lightMode ?? null;

  async function handleSetMode(mode: LightMode) {
    if (isDisconnected || mode === currentMode) return;
    setPendingMode(mode);
    try {
      await setMode(mode);
    } finally {
      setPendingMode(null);
    }
  }

  return (
    <div className="grid grid-cols-2 gap-3 px-4">
      {LIGHT_MODES.map(({ mode, label, description, colorClass, bgClass, icon }) => {
        const isActive = currentMode === mode;
        const isPending = pendingMode === mode;

        return (
          <button
            key={mode}
            type="button"
            disabled={isDisconnected}
            onClick={() => void handleSetMode(mode)}
            className={[
              'flex flex-col items-start gap-1.5 rounded-xl p-3 text-left transition-colors',
              isDisconnected && 'cursor-not-allowed opacity-50',
              isPending && 'animate-pulse',
              isActive
                ? `${bgClass} ${colorClass} ring-1 ring-current`
                : 'bg-deep-indigo/40 text-mycelium-white hover:bg-deep-indigo/60',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            <div className={`flex items-center gap-2 ${isActive ? colorClass : 'text-muted-foreground'}`}>
              {icon}
              <span className="text-sm font-medium">{label}</span>
            </div>
            <span className="text-xs text-muted-foreground">{description}</span>
          </button>
        );
      })}
    </div>
  );
}
