import { Outlet } from 'react-router-dom';
import { StatusBar } from './status-bar.tsx';
import { BottomNav } from './bottom-nav.tsx';

export function AppShell() {
  return (
    <div className="flex min-h-screen flex-col bg-void-black">
      <StatusBar />
      <main className="flex-1 overflow-y-auto pb-16">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
