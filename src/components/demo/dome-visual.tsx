import type { LightMode } from '@/types/index.ts';

interface DomeVisualProps {
  lightMode: LightMode;
  uvcActive: boolean;
  temperature: number;
  humidity: number;
}

const MODE_COLORS: Record<LightMode, { glow: string; inner: string; label: string }> = {
  void_glow: {
    glow: 'rgba(123, 47, 190, 0.6)',
    inner: 'rgba(123, 47, 190, 0.25)',
    label: 'Void Glow',
  },
  uv_only: {
    glow: 'rgba(255, 45, 123, 0.6)',
    inner: 'rgba(255, 45, 123, 0.25)',
    label: 'UV Only',
  },
  blue_only: {
    glow: 'rgba(0, 229, 204, 0.6)',
    inner: 'rgba(0, 229, 204, 0.25)',
    label: 'Blue',
  },
  off: {
    glow: 'rgba(155, 143, 187, 0.15)',
    inner: 'rgba(26, 10, 62, 0.5)',
    label: 'Off',
  },
};

export function DomeVisual({ lightMode, uvcActive, temperature, humidity }: DomeVisualProps) {
  const mode = uvcActive ? 'uv_only' : lightMode;
  const colors = MODE_COLORS[mode];

  return (
    <div className="relative flex items-center justify-center">
      <svg
        viewBox="0 0 300 320"
        className="w-full max-w-[320px]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Glow filter */}
          <filter id="dome-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="12" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Inner radial glow */}
          <radialGradient id="inner-glow" cx="50%" cy="60%" r="50%">
            <stop offset="0%" stopColor={colors.glow} />
            <stop offset="70%" stopColor={colors.inner} />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>

          {/* Base gradient for dome shell */}
          <linearGradient id="dome-shell" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(232, 224, 240, 0.12)" />
            <stop offset="100%" stopColor="rgba(232, 224, 240, 0.04)" />
          </linearGradient>

          {/* Clip for interior content */}
          <clipPath id="dome-clip">
            <path d="M 50 230 Q 50 80, 150 50 Q 250 80, 250 230 Z" />
          </clipPath>
        </defs>

        {/* Ambient glow behind dome */}
        <ellipse
          cx="150"
          cy="240"
          rx="120"
          ry="60"
          fill={colors.glow}
          opacity="0.3"
          filter="url(#dome-glow)"
          className="transition-all duration-700"
        />

        {/* Dome shell */}
        <path
          d="M 50 230 Q 50 80, 150 50 Q 250 80, 250 230 Z"
          fill="url(#dome-shell)"
          stroke="rgba(232, 224, 240, 0.2)"
          strokeWidth="1.5"
          className="transition-all duration-500"
        />

        {/* Interior glow */}
        <path
          d="M 50 230 Q 50 80, 150 50 Q 250 80, 250 230 Z"
          fill="url(#inner-glow)"
          className="transition-all duration-700"
        />

        {/* Plant silhouettes inside dome */}
        <g clipPath="url(#dome-clip)" opacity="0.7">
          {/* Main plant */}
          <line x1="150" y1="230" x2="150" y2="150" stroke="rgba(0, 229, 204, 0.4)" strokeWidth="2" />
          <ellipse cx="135" cy="160" rx="12" ry="8" fill="rgba(0, 229, 204, 0.2)" transform="rotate(-30 135 160)" />
          <ellipse cx="165" cy="155" rx="12" ry="8" fill="rgba(0, 229, 204, 0.2)" transform="rotate(25 165 155)" />
          <ellipse cx="145" cy="145" rx="10" ry="7" fill="rgba(0, 229, 204, 0.15)" transform="rotate(-15 145 145)" />

          {/* Small plant left */}
          <line x1="100" y1="230" x2="105" y2="190" stroke="rgba(0, 229, 204, 0.3)" strokeWidth="1.5" />
          <ellipse cx="95" cy="195" rx="8" ry="5" fill="rgba(0, 229, 204, 0.15)" transform="rotate(-20 95 195)" />
          <ellipse cx="112" cy="192" rx="8" ry="5" fill="rgba(0, 229, 204, 0.15)" transform="rotate(15 112 192)" />

          {/* Small plant right */}
          <line x1="200" y1="230" x2="195" y2="185" stroke="rgba(0, 229, 204, 0.3)" strokeWidth="1.5" />
          <ellipse cx="185" cy="190" rx="9" ry="5" fill="rgba(0, 229, 204, 0.15)" transform="rotate(-25 185 190)" />
          <ellipse cx="205" cy="188" rx="9" ry="5" fill="rgba(0, 229, 204, 0.15)" transform="rotate(20 205 188)" />
        </g>

        {/* Light rays from top of dome */}
        {mode !== 'off' && (
          <g opacity="0.4" className="transition-opacity duration-700">
            <line x1="150" y1="60" x2="100" y2="200" stroke={colors.glow} strokeWidth="0.5" />
            <line x1="150" y1="60" x2="130" y2="210" stroke={colors.glow} strokeWidth="0.5" />
            <line x1="150" y1="60" x2="170" y2="210" stroke={colors.glow} strokeWidth="0.5" />
            <line x1="150" y1="60" x2="200" y2="200" stroke={colors.glow} strokeWidth="0.5" />
          </g>
        )}

        {/* UVC active pulsing ring */}
        {uvcActive && (
          <path
            d="M 55 230 Q 55 85, 150 55 Q 245 85, 245 230"
            fill="none"
            stroke="rgba(255, 45, 123, 0.5)"
            strokeWidth="2"
            className="animate-pulse-ring"
          />
        )}

        {/* Base platform */}
        <rect x="40" y="228" width="220" height="12" rx="3" fill="rgba(232, 224, 240, 0.08)" stroke="rgba(232, 224, 240, 0.15)" strokeWidth="1" />

        {/* Sensor readouts */}
        <text x="150" y="270" textAnchor="middle" fill="rgba(232, 224, 240, 0.6)" fontSize="11" fontFamily="Inter, sans-serif">
          {temperature.toFixed(1)}°C · {humidity.toFixed(0)}% RH
        </text>

        {/* Mode label */}
        <text x="150" y="290" textAnchor="middle" fill={colors.glow} fontSize="10" fontFamily="Outfit, sans-serif" letterSpacing="0.15em">
          {uvcActive ? '⚠ UV-C ACTIVE' : colors.label.toUpperCase()}
        </text>
      </svg>
    </div>
  );
}
