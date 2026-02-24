import { useEffect, useState } from 'react';
import { useDeviceStatus, useConnection, useDeviceActions } from '@/hooks/index.ts';
import { LightModeSelector } from '@/components/dashboard/index.ts';
import { DomeVisual } from '@/components/demo/index.ts';
import { ClimateSlider } from '@/components/settings/index.ts';

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

function Co2Icon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 14a4 4 0 1 1 0-8" />
      <circle cx="14" cy="10" r="3" />
      <path d="M16 12.5a1.5 1.5 0 0 1 0 3h-1" />
    </svg>
  );
}

function FanIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="10" cy="10" r="2" />
      <path d="M10 8C10 5 12 3 14 3s2 3 0 5" />
      <path d="M12 10c3 0 5 2 5 4s-3 2-5 0" />
      <path d="M10 12c0 3-2 5-4 5s-2-3 0-5" />
      <path d="M8 10c-3 0-5-2-5-4s3-2 5 0" />
    </svg>
  );
}

/** Auto-connect using mock adapter on demo page load */
function DemoAutoConnect() {
  const { connectionStatus, connect } = useConnection();

  useEffect(() => {
    if (connectionStatus === 'disconnected') {
      connect({ forceMock: true });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps -- run once on mount

  return null;
}

/** Fake iPhone status bar (time, signal, battery) */
function FakeIOSStatusBar() {
  const [time, setTime] = useState(() => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  });

  useEffect(() => {
    const id = setInterval(() => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }));
    }, 30000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex h-11 items-center justify-between px-6 text-mycelium-white">
      <span className="text-[14px] font-semibold">{time}</span>
      <div className="flex items-center gap-1.5">
        {/* Signal bars */}
        <svg width="16" height="12" viewBox="0 0 16 12" fill="currentColor">
          <rect x="0" y="8" width="3" height="4" rx="0.5" />
          <rect x="4.5" y="5" width="3" height="7" rx="0.5" />
          <rect x="9" y="2" width="3" height="10" rx="0.5" />
          <rect x="13.5" y="0" width="2.5" height="12" rx="0.5" opacity="0.3" />
        </svg>
        {/* WiFi */}
        <svg width="14" height="12" viewBox="0 0 14 12" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
          <path d="M1 4a9 9 0 0 1 12 0" />
          <path d="M3.5 7a5.5 5.5 0 0 1 7 0" />
          <circle cx="7" cy="10" r="1" fill="currentColor" stroke="none" />
        </svg>
        {/* Battery */}
        <svg width="24" height="12" viewBox="0 0 24 12" fill="currentColor">
          <rect x="0" y="1" width="20" height="10" rx="2" fill="none" stroke="currentColor" strokeWidth="1" />
          <rect x="20.5" y="3.5" width="2" height="5" rx="1" opacity="0.4" />
          <rect x="1.5" y="2.5" width="14" height="7" rx="1" />
        </svg>
      </div>
    </div>
  );
}

/** Bottom tab bar */
function FakeBottomNav({ activeTab, onTabChange, hasAlert }: { activeTab: string; onTabChange: (tab: string) => void; hasAlert?: boolean }) {
  const tabs = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="7" height="7" rx="1" />
          <rect x="11" y="2" width="7" height="7" rx="1" />
          <rect x="2" y="11" width="7" height="7" rx="1" />
          <rect x="11" y="11" width="7" height="7" rx="1" />
        </svg>
      ),
    },
    {
      id: 'climate',
      label: 'Climate',
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="5" y1="3" x2="5" y2="17" />
          <line x1="10" y1="3" x2="10" y2="17" />
          <line x1="15" y1="3" x2="15" y2="17" />
          <circle cx="5" cy="7" r="2" fill="currentColor" />
          <circle cx="10" cy="13" r="2" fill="currentColor" />
          <circle cx="15" cy="9" r="2" fill="currentColor" />
        </svg>
      ),
    },
    {
      id: 'growlog',
      label: 'Grow Log',
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 4h12v14H4z" />
          <path d="M7 8h6" />
          <path d="M7 11h4" />
          <path d="M7 14h5" />
        </svg>
      ),
    },
  ];

  return (
    <nav className="flex h-14 items-center justify-around border-t border-deep-indigo/50 bg-void-black">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onTabChange(tab.id)}
          className={`relative flex flex-col items-center gap-0.5 text-[9px] uppercase tracking-wider ${
            activeTab === tab.id ? 'text-uv-purple' : 'text-muted-foreground'
          }`}
        >
          {tab.id === 'dashboard' && hasAlert && (
            <span className="absolute -top-0.5 right-0 h-2 w-2 rounded-full bg-neon-magenta" />
          )}
          {tab.icon}
          <span>{tab.label}</span>
        </button>
      ))}
    </nav>
  );
}

/** App status bar showing connection state */
function DemoStatusBar() {
  const { connectionStatus } = useConnection();
  let dotColor = 'bg-muted-foreground';
  let label = 'Disconnected';
  let textColor = 'text-muted-foreground';
  let pulse = false;

  if (connectionStatus === 'connected') {
    dotColor = 'bg-bio-cyan';
    label = 'Connected';
    textColor = 'text-bio-cyan';
  } else if (connectionStatus === 'connecting') {
    dotColor = 'bg-harvest-gold';
    label = 'Connecting...';
    textColor = 'text-harvest-gold';
    pulse = true;
  }

  return (
    <div className="flex h-7 shrink-0 items-center gap-2 bg-deep-indigo/50 px-3 text-[10px]">
      <span className={`h-1.5 w-1.5 rounded-full ${dotColor} ${pulse ? 'animate-pulse' : ''}`} />
      <span className={`${textColor} truncate`}>{label}</span>
    </div>
  );
}

/** Species profiles with healthy ranges and grow timelines */
const SPECIES = {
  blue_oyster: {
    name: 'Blue Oyster',
    emoji: '\ud83c\udf44',
    temp: { min: 18, max: 24, unit: '\u00B0C' },
    humidity: { min: 85, max: 95, unit: '%' },
    co2: { min: 400, max: 1000, unit: 'ppm' },
    totalDays: 17,
    milestones: [
      { day: 1, event: 'Inoculated substrate', stage: 'Inoculation', icon: '\ud83c\udf31', color: 'text-bio-cyan' },
      { day: 3, event: 'First mycelium visible', stage: 'Colonizing', icon: '\ud83e\udeb6', color: 'text-mycelium-white' },
      { day: 7, event: 'Full colonization', stage: 'Colonized', icon: '\u2728', color: 'text-harvest-gold' },
      { day: 10, event: 'Pinning started', stage: 'Pinning', icon: '\ud83c\udf44', color: 'text-uv-purple' },
      { day: 14, event: 'Fruiting bodies', stage: 'Fruiting', icon: '\ud83c\udf89', color: 'text-bio-cyan' },
      { day: 17, event: 'Harvest ready', stage: 'Harvest', icon: '\ud83e\uddfa', color: 'text-harvest-gold' },
    ],
  },
  lions_mane: {
    name: "Lion's Mane",
    emoji: '\ud83e\udd81',
    temp: { min: 18, max: 22, unit: '\u00B0C' },
    humidity: { min: 90, max: 98, unit: '%' },
    co2: { min: 400, max: 800, unit: 'ppm' },
    totalDays: 24,
    milestones: [
      { day: 1, event: 'Inoculated substrate', stage: 'Inoculation', icon: '\ud83c\udf31', color: 'text-bio-cyan' },
      { day: 5, event: 'First mycelium visible', stage: 'Colonizing', icon: '\ud83e\udeb6', color: 'text-mycelium-white' },
      { day: 12, event: 'Full colonization', stage: 'Colonized', icon: '\u2728', color: 'text-harvest-gold' },
      { day: 16, event: 'Teeth forming', stage: 'Forming', icon: '\ud83e\udd81', color: 'text-uv-purple' },
      { day: 20, event: 'Fruiting bodies', stage: 'Fruiting', icon: '\ud83c\udf89', color: 'text-bio-cyan' },
      { day: 24, event: 'Harvest ready', stage: 'Harvest', icon: '\ud83e\uddfa', color: 'text-harvest-gold' },
    ],
  },
  pink_oyster: {
    name: 'Pink Oyster',
    emoji: '\ud83c\udf38',
    temp: { min: 22, max: 30, unit: '\u00B0C' },
    humidity: { min: 85, max: 95, unit: '%' },
    co2: { min: 400, max: 1200, unit: 'ppm' },
    totalDays: 12,
    milestones: [
      { day: 1, event: 'Inoculated substrate', stage: 'Inoculation', icon: '\ud83c\udf31', color: 'text-bio-cyan' },
      { day: 2, event: 'First mycelium visible', stage: 'Colonizing', icon: '\ud83e\udeb6', color: 'text-mycelium-white' },
      { day: 5, event: 'Full colonization', stage: 'Colonized', icon: '\u2728', color: 'text-harvest-gold' },
      { day: 7, event: 'Pinning started', stage: 'Pinning', icon: '\ud83c\udf38', color: 'text-uv-purple' },
      { day: 10, event: 'Fruiting bodies', stage: 'Fruiting', icon: '\ud83c\udf89', color: 'text-bio-cyan' },
      { day: 12, event: 'Harvest ready', stage: 'Harvest', icon: '\ud83e\uddfa', color: 'text-harvest-gold' },
    ],
  },
};

type SpeciesId = keyof typeof SPECIES;
type HealthStatus = 'healthy' | 'warning' | 'danger';

function getHealthStatus(value: number, min: number, max: number): HealthStatus {
  if (value >= min && value <= max) return 'healthy';
  const margin = (max - min) * 0.15;
  if (value >= min - margin && value <= max + margin) return 'warning';
  return 'danger';
}

const HEALTH_STYLES: Record<HealthStatus, { dot: string; text: string; label: string }> = {
  healthy: { dot: 'bg-bio-cyan', text: 'text-bio-cyan', label: 'Healthy' },
  warning: { dot: 'bg-harvest-gold', text: 'text-harvest-gold', label: 'Warning' },
  danger: { dot: 'bg-neon-magenta', text: 'text-neon-magenta', label: 'Out of range' },
};

/** Compact sensor pill with health range indicator */
function SensorPill({ icon, label, value, unit, health, range }: {
  icon: React.ReactNode; label: string; value: string; unit: string;
  health: HealthStatus; range: string;
}) {
  const style = HEALTH_STYLES[health];
  return (
    <div className="rounded-lg bg-deep-indigo/40 px-2.5 py-2">
      <div className="flex items-center gap-1">
        <span className="text-muted-foreground [&_svg]:w-[14px] [&_svg]:h-[14px]">{icon}</span>
        <span className="text-[9px] uppercase tracking-wider text-muted-foreground truncate">{label}</span>
      </div>
      <div className="mt-1 flex items-baseline gap-0.5">
        <span className={`font-display text-xl tabular-nums ${style.text}`}>{value}</span>
        <span className="text-[10px] text-muted-foreground">{unit}</span>
      </div>
      <div className="mt-1 flex items-center gap-1">
        <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
        <span className="text-[8px] text-muted-foreground">{range}</span>
      </div>
    </div>
  );
}

/** Species selector pill bar */
function SpeciesSelector({ activeId, onChange }: { activeId: SpeciesId; onChange: (id: SpeciesId) => void }) {
  return (
    <div className="flex gap-2 overflow-x-auto px-3 pt-2">
      {(Object.keys(SPECIES) as SpeciesId[]).map((id) => {
        const sp = SPECIES[id];
        const active = id === activeId;
        return (
          <button
            key={id}
            type="button"
            onClick={() => onChange(id)}
            className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-medium transition-colors ${
              active
                ? 'bg-uv-purple/30 text-uv-purple ring-1 ring-uv-purple/40'
                : 'bg-deep-indigo/30 text-muted-foreground hover:bg-deep-indigo/50'
            }`}
          >
            <span>{sp.emoji}</span>
            <span>{sp.name}</span>
          </button>
        );
      })}
    </div>
  );
}

/** Tracks elapsed ms since a start time, updating every second */
function useDemoElapsed(startTime: number) {
  const [elapsed, setElapsed] = useState(() => Date.now() - startTime);
  useEffect(() => {
    const id = setInterval(() => setElapsed(Date.now() - startTime), 1000);
    return () => clearInterval(id);
  }, [startTime]);
  return elapsed;
}

/** Dashboard tab content */
function DashboardTab({ species, speciesId, onSpeciesChange }: {
  species: (typeof SPECIES)[SpeciesId];
  speciesId: SpeciesId;
  onSpeciesChange: (id: SpeciesId) => void;
}) {
  const status = useDeviceStatus();

  if (!status) return null;

  const temp = status.sensorValid ? status.temperature : 0;
  const humidity = status.sensorValid ? status.humidity : 0;
  const co2 = status.sensorValid ? status.co2 : 0;
  const fanPct = Math.round((status.fanSpeed / 255) * 100);
  const tempHealth = status.sensorValid ? getHealthStatus(temp, species.temp.min, species.temp.max) : 'healthy' as HealthStatus;
  const humidHealth = status.sensorValid ? getHealthStatus(humidity, species.humidity.min, species.humidity.max) : 'healthy' as HealthStatus;
  const co2Health = status.sensorValid ? getHealthStatus(co2, species.co2.min, species.co2.max) : 'healthy' as HealthStatus;
  const allHealthy = tempHealth === 'healthy' && humidHealth === 'healthy' && co2Health === 'healthy';
  const anyDanger = tempHealth === 'danger' || humidHealth === 'danger' || co2Health === 'danger';

  return (
    <div className="animate-fade-in">
      {/* Species selector */}
      <SpeciesSelector activeId={speciesId} onChange={onSpeciesChange} />

      {/* Species banner */}
      <div className="mx-3 mt-2 flex items-center gap-2 rounded-lg bg-deep-indigo/30 px-3 py-2">
        <span className="text-base">{species.emoji}</span>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-medium text-mycelium-white">Growing: {species.name}</p>
          <p className="text-[8px] text-muted-foreground">
            {species.temp.min}-{species.temp.max}{species.temp.unit} · {species.humidity.min}-{species.humidity.max}{species.humidity.unit} · &lt;{species.co2.max}ppm
          </p>
        </div>
        <span className={`text-[9px] font-medium ${allHealthy ? 'text-bio-cyan' : anyDanger ? 'text-neon-magenta' : 'text-harvest-gold'}`}>
          {allHealthy ? 'All Good' : anyDanger ? 'Check Now' : 'Attention'}
        </span>
      </div>

      {/* Dome visual */}
      <div className="flex justify-center px-3 pt-1">
        <DomeVisual
          lightMode={status.lightMode}
          uvcActive={status.uvcActive}
          temperature={status.temperature}
          humidity={status.humidity}
        />
      </div>

      {/* Compact sensor cards — 2x2 grid */}
      <div className="grid grid-cols-2 gap-2 px-3 pt-2">
        <SensorPill
          icon={<ThermometerIcon />}
          label="Temp"
          value={status.sensorValid ? temp.toFixed(1) : '--'}
          unit={"\u00B0C"}
          health={tempHealth}
          range={`${species.temp.min}-${species.temp.max}${species.temp.unit}`}
        />
        <SensorPill
          icon={<DropletIcon />}
          label="Humidity"
          value={status.sensorValid ? humidity.toFixed(1) : '--'}
          unit="%"
          health={humidHealth}
          range={`${species.humidity.min}-${species.humidity.max}${species.humidity.unit}`}
        />
        <SensorPill
          icon={<Co2Icon />}
          label="CO&#x2082;"
          value={status.sensorValid ? co2.toString() : '--'}
          unit="ppm"
          health={co2Health}
          range={`<${species.co2.max}ppm`}
        />
        <SensorPill
          icon={<FanIcon />}
          label="FAE"
          value={fanPct.toString()}
          unit="%"
          health="healthy"
          range="Fan speed"
        />
      </div>

      <p className="mt-3 mb-1 px-3 text-[9px] uppercase tracking-wider text-muted-foreground">Light Mode</p>
      {/* LightModeSelector has its own px-4; nudge to px-3 to match phone frame */}
      <div className="-mx-1">
        <LightModeSelector />
      </div>
    </div>
  );
}

/** Climate tab with fan slider and UV-C */
function ClimateTab({ species }: { species: (typeof SPECIES)[SpeciesId] }) {
  const status = useDeviceStatus();
  const { updateSettings, startSterilization } = useDeviceActions();
  const [fanSpeed, setFanSpeed] = useState(50);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (status && !initialized) {
      setFanSpeed(Math.round((status.fanSpeed / 255) * 100));
      setInitialized(true);
    }
  }, [status, initialized]);

  if (!status) return null;

  function handleFanChange(value: number) {
    setFanSpeed(value);
    void updateSettings({ humiditySetpoint: 90, humidityDeadband: 3, fanBaseSpeed: value });
  }

  const co2Health = getHealthStatus(status.co2, species.co2.min, species.co2.max);
  const co2Style = HEALTH_STYLES[co2Health];

  return (
    <div className="animate-fade-in p-3">
      <p className="font-display text-base uppercase tracking-wider">Climate Control</p>
      <p className="mt-1 mb-4 text-[10px] text-muted-foreground">Adjust FAE and airflow for optimal growing.</p>

      {/* Fan / FAE slider */}
      <div className="mb-4">
        <ClimateSlider
          label="Fan Speed (FAE)"
          value={fanSpeed}
          onChange={handleFanChange}
          min={0}
          max={100}
          step={5}
          unit="%"
        />
        <p className="mt-1 text-[8px] text-muted-foreground px-1">
          Higher fan speed = more fresh air exchange = lower CO&#x2082;
        </p>
      </div>

      {/* CO2 readout */}
      <div className="mb-4 flex items-center gap-3 rounded-lg bg-deep-indigo/20 p-3">
        <span className="text-muted-foreground"><Co2Icon /></span>
        <div className="flex-1">
          <p className="text-[9px] uppercase tracking-wider text-muted-foreground">Current CO&#x2082;</p>
          <p className={`font-display text-lg tabular-nums ${co2Style.text}`}>{status.co2} <span className="text-[10px] text-muted-foreground">ppm</span></p>
        </div>
        <span className={`text-[9px] font-medium ${co2Style.text}`}>
          {co2Style.label}
        </span>
      </div>

      {/* UV-C section */}
      <div className="rounded-lg border border-neon-magenta/20 bg-neon-magenta/5 p-3">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[11px] font-medium text-neon-magenta">UV-C Sterilization</p>
          <span className={`flex items-center gap-1 text-[9px] ${status.domeSeated ? 'text-bio-cyan' : 'text-neon-magenta'}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${status.domeSeated ? 'bg-bio-cyan' : 'bg-neon-magenta animate-pulse'}`} />
            Dome {status.domeSeated ? 'Sealed' : 'Open'}
          </span>
        </div>
        <button
          type="button"
          disabled={!status.domeSeated || status.uvcActive}
          onClick={() => { if (!status.uvcActive) void startSterilization(); }}
          className="w-full rounded-lg bg-neon-magenta/20 py-2 text-[11px] text-neon-magenta ring-1 ring-neon-magenta/40 transition-all hover:bg-neon-magenta/30 disabled:cursor-not-allowed disabled:opacity-40 disabled:ring-0"
        >
          {status.uvcActive ? (
            <span className="flex items-center justify-center gap-1.5">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-neon-magenta" />
              Active — {Math.ceil(status.uvcRemainingMs / 60000)}m left
            </span>
          ) : 'Start 15min Cycle'}
        </button>
      </div>
    </div>
  );
}

/** Grow Log tab — dynamic grow timeline */
function GrowLogTab({ species, demoStartTime }: {
  species: (typeof SPECIES)[SpeciesId];
  demoStartTime: number;
}) {
  const status = useDeviceStatus();
  const elapsedMs = useDemoElapsed(demoStartTime);

  if (!status) return null;

  const growDays = Math.floor(elapsedMs / 60000); // 1 real minute = 1 grow day
  const milestones = species.milestones;
  const reached = milestones.filter(m => growDays >= m.day);
  const currentStage = reached.length > 0 ? reached[reached.length - 1] : null;
  const nextMilestone = milestones.find(m => growDays < m.day);
  const daysToHarvest = Math.max(0, species.totalDays - growDays);

  return (
    <div className="animate-fade-in p-3">
      <p className="font-display text-base uppercase tracking-wider">Grow Log</p>
      <p className="mt-1 mb-4 text-[10px] text-muted-foreground">Track your grow from inoculation to harvest. 1 min = 1 day.</p>

      {/* Current grow stats */}
      <div className="mb-4 grid grid-cols-3 gap-2">
        <div className="rounded-lg bg-deep-indigo/30 p-2 text-center">
          <p className="font-display text-lg text-bio-cyan">{growDays}</p>
          <p className="text-[8px] text-muted-foreground">Days</p>
        </div>
        <div className="rounded-lg bg-deep-indigo/30 p-2 text-center">
          <p className={`font-display text-lg truncate ${currentStage?.color ?? 'text-muted-foreground'}`}>
            {currentStage?.stage ?? 'Starting'}
          </p>
          <p className="text-[8px] text-muted-foreground">Stage</p>
        </div>
        <div className="rounded-lg bg-deep-indigo/30 p-2 text-center">
          <p className="font-display text-lg text-harvest-gold">
            {daysToHarvest > 0 ? `~${daysToHarvest}d` : 'Ready!'}
          </p>
          <p className="text-[8px] text-muted-foreground">To Harvest</p>
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-0">
        {milestones.map((entry, i) => {
          const isReached = growDays >= entry.day;
          return (
            <div key={entry.day} className={`flex gap-3 ${isReached ? '' : 'opacity-40'}`}>
              {/* Timeline line */}
              <div className="flex flex-col items-center">
                <span className="text-sm">{isReached ? '\u2705' : entry.icon}</span>
                {i < milestones.length - 1 && <div className="w-px flex-1 bg-deep-indigo/50 my-1" />}
              </div>
              {/* Content */}
              <div className="pb-3">
                <p className={`text-[11px] font-medium ${entry.color}`}>{entry.event}</p>
                <p className="text-[9px] text-muted-foreground">Day {entry.day}{isReached && nextMilestone ? '' : ''}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Alerts section */}
      <div className="mt-3">
        <p className="text-[9px] uppercase tracking-wider text-muted-foreground mb-2">Recent Alerts</p>
        <div className="space-y-1.5">
          <div className="flex items-start gap-2 rounded-lg bg-bio-cyan/5 border border-bio-cyan/20 px-2.5 py-2">
            <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-bio-cyan" />
            <div>
              <p className="text-[10px] text-bio-cyan">Humidity stable at 88%</p>
              <p className="text-[8px] text-muted-foreground">2 min ago</p>
            </div>
          </div>
          <div className="flex items-start gap-2 rounded-lg bg-harvest-gold/5 border border-harvest-gold/20 px-2.5 py-2">
            <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-harvest-gold" />
            <div>
              <p className="text-[10px] text-harvest-gold">CO&#x2082; briefly exceeded 1000ppm</p>
              <p className="text-[8px] text-muted-foreground">18 min ago — auto-resolved</p>
            </div>
          </div>
          <div className="flex items-start gap-2 rounded-lg bg-bio-cyan/5 border border-bio-cyan/20 px-2.5 py-2">
            <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-bio-cyan" />
            <div>
              <p className="text-[10px] text-bio-cyan">UV-C sterilization completed</p>
              <p className="text-[8px] text-muted-foreground">3 hrs ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** iPhone frame shell */
function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative shrink-0">
      <div
        className="relative overflow-hidden rounded-[3rem] border-[3px] border-[#2a2a35] bg-void-black shadow-[0_0_60px_rgba(123,47,190,0.15),0_0_120px_rgba(123,47,190,0.05)]"
        style={{ width: 375, height: 812 }}
      >
        <div className="absolute left-1/2 top-2 z-20 -translate-x-1/2">
          <div className="h-[34px] w-[126px] rounded-full bg-black" />
        </div>
        {children}
      </div>
    </div>
  );
}

function isInIframe(): boolean {
  try { return window.self !== window.top; } catch { return true; }
}

export default function DemoPage({ embed: embedProp }: { embed?: boolean }) {
  const { connectionStatus } = useConnection();
  const status = useDeviceStatus();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [speciesId, setSpeciesId] = useState<SpeciesId>('blue_oyster');
  const [demoStartTime, setDemoStartTime] = useState(() => Date.now());

  const isEmbed = embedProp || isInIframe() || new URLSearchParams(window.location.search).get('embed') === '1';
  const species = SPECIES[speciesId];
  const isLoading = connectionStatus === 'connecting' || status === null;

  function handleSpeciesChange(id: SpeciesId) {
    setSpeciesId(id);
    setDemoStartTime(Date.now());
  }

  const phoneContent = (
    <div className="flex h-full flex-col">
      <FakeIOSStatusBar />
      <DemoStatusBar />
      <main className="flex-1 overflow-y-auto overscroll-contain pb-2">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-uv-purple border-t-transparent" />
            <p className="mt-3 text-[10px] text-muted-foreground">Connecting...</p>
          </div>
        ) : (
          <>
            {activeTab === 'dashboard' && <DashboardTab species={species} speciesId={speciesId} onSpeciesChange={handleSpeciesChange} />}
            {activeTab === 'climate' && <ClimateTab species={species} />}
            {activeTab === 'growlog' && <GrowLogTab species={species} demoStartTime={demoStartTime} />}
          </>
        )}
      </main>
      <FakeBottomNav activeTab={activeTab} onTabChange={setActiveTab} hasAlert={false} />
      <div className="flex h-5 items-center justify-center bg-void-black">
        <div className="h-1 w-28 rounded-full bg-mycelium-white/20" />
      </div>
    </div>
  );

  if (isEmbed) {
    return (
      <div className="bg-transparent text-mycelium-white">
        <DemoAutoConnect />
        <PhoneFrame>{phoneContent}</PhoneFrame>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-mycelium-white">
      <DemoAutoConnect />

      {/* Header */}
      <header className="border-b border-deep-indigo/20 px-4 py-4">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <div className="flex items-center gap-3">
            <svg width="28" height="28" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M50 10 Q20 30, 20 60 Q20 85, 50 90 Q80 85, 80 60 Q80 30, 50 10Z" fill="none" stroke="var(--color-uv-purple)" strokeWidth="3" />
              <circle cx="50" cy="55" r="8" fill="var(--color-bio-cyan)" opacity="0.6" />
            </svg>
            <div>
              <h1 className="font-display text-lg uppercase tracking-wider">The Void Grows</h1>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Companion App</p>
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

      {/* Main: iPhone frame */}
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="flex flex-col items-center gap-6 lg:flex-row lg:items-start lg:justify-center lg:gap-12">
          <PhoneFrame>{phoneContent}</PhoneFrame>

          {/* Side content */}
          <div className="max-w-sm text-center lg:pt-16 lg:text-left">
            <p className="text-xs uppercase tracking-widest text-uv-purple">Interactive Demo</p>
            <h2 className="mt-2 font-display text-2xl uppercase tracking-wider">
              Control Your Dome
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              This is a live simulation of the Void Core companion app. Change light modes and watch the dome respond. Trigger UV-C sterilization. Explore every screen — just like the real thing.
            </p>

            <div className="mt-6 space-y-4 text-left">
              <div className="overflow-hidden rounded-xl bg-deep-indigo/10">
                <img src="/screenshots/demo-dashboard.png" alt="Dashboard tab showing dome visual, species selector, and sensor readings" className="w-full" loading="lazy" />
                <div className="p-3">
                  <p className="text-xs font-medium text-bio-cyan">Dashboard</p>
                  <p className="text-[11px] text-muted-foreground">Live dome, species health ranges, CO&#x2082; + FAE</p>
                </div>
              </div>
              <div className="overflow-hidden rounded-xl bg-deep-indigo/10">
                <img src="/screenshots/demo-climate.png" alt="Climate tab showing fan speed slider, CO2 monitor, and UV-C sterilization" className="w-full" loading="lazy" />
                <div className="p-3">
                  <p className="text-xs font-medium text-uv-purple">Climate</p>
                  <p className="text-[11px] text-muted-foreground">Fan speed slider, CO&#x2082; monitor, UV-C sterilization</p>
                </div>
              </div>
              <div className="overflow-hidden rounded-xl bg-deep-indigo/10">
                <img src="/screenshots/demo-growlog.png" alt="Grow Log tab showing timeline, grow stage, and alert notifications" className="w-full" loading="lazy" />
                <div className="p-3">
                  <p className="text-xs font-medium text-harvest-gold">Grow Log</p>
                  <p className="text-[11px] text-muted-foreground">Timeline, grow stage, alerts and notifications</p>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <a
                href="https://github.com/elastik/void-blueprints"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block rounded-xl bg-uv-purple/20 px-6 py-3 font-display text-sm uppercase tracking-wider text-uv-purple ring-1 ring-uv-purple/30 transition-colors hover:bg-uv-purple/30"
              >
                Build Your Own Dome &rarr;
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-deep-indigo/20 px-4 py-4 mt-4">
        <div className="mx-auto max-w-4xl text-center text-xs text-muted-foreground">
          The Void Grows — Open-source automated grow chamber.{' '}
          <a href="https://github.com/elastik/void-blueprints" target="_blank" rel="noopener noreferrer" className="text-uv-purple hover:text-bio-cyan transition-colors">Hardware docs</a>
          {' · '}
          <a href="https://github.com/elastik/thevoidgrows-app" target="_blank" rel="noopener noreferrer" className="text-uv-purple hover:text-bio-cyan transition-colors">App source</a>
        </div>
      </footer>
    </div>
  );
}
