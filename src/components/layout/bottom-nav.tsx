import { NavLink } from 'react-router-dom';

const tabs = [
  {
    to: '/',
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
    to: '/settings',
    label: 'Settings',
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
    to: '/sterilize',
    label: 'UV-C',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 2L10 4" />
        <path d="M10 16L10 18" />
        <path d="M4.22 4.22L5.64 5.64" />
        <path d="M14.36 14.36L15.78 15.78" />
        <path d="M2 10L4 10" />
        <path d="M16 10L18 10" />
        <path d="M4.22 15.78L5.64 14.36" />
        <path d="M14.36 5.64L15.78 4.22" />
        <circle cx="10" cy="10" r="3" />
      </svg>
    ),
  },
  {
    to: '/connect',
    label: 'Connect',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3.5 13a7 7 0 0 1 13 0" />
        <path d="M6.5 15a4 4 0 0 1 7 0" />
        <circle cx="10" cy="17" r="1" fill="currentColor" />
      </svg>
    ),
  },
];

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 flex h-16 items-center justify-around border-t border-deep-indigo/50 bg-void-black pb-[env(safe-area-inset-bottom)]">
      {tabs.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          end={tab.to === '/'}
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 text-[10px] uppercase tracking-wider ${
              isActive ? 'text-uv-purple' : 'text-muted-foreground'
            }`
          }
        >
          {tab.icon}
          <span>{tab.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
