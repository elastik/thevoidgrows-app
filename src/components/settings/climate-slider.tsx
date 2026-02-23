interface ClimateSliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  unit: string;
  disabled?: boolean;
}

export function ClimateSlider({
  label,
  value,
  onChange,
  min,
  max,
  step,
  unit,
  disabled = false,
}: ClimateSliderProps) {
  return (
    <div className={`space-y-2 ${disabled ? 'opacity-50' : ''}`}>
      <div className="flex items-baseline justify-between">
        <label className="text-xs uppercase tracking-wider text-muted-foreground">
          {label}
        </label>
        <span className="font-display text-2xl tabular-nums text-bio-cyan">
          {value}
          <span className="ml-0.5 text-sm text-muted-foreground">{unit}</span>
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full cursor-pointer accent-uv-purple disabled:cursor-not-allowed"
      />
      <div className="flex justify-between text-[10px] text-muted-foreground">
        <span>
          {min}
          {unit}
        </span>
        <span>
          {max}
          {unit}
        </span>
      </div>
    </div>
  );
}
