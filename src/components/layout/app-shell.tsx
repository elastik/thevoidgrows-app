import { Outlet } from 'react-router-dom';
import { StatusBar } from './status-bar.tsx';
import { BottomNav } from './bottom-nav.tsx';
import { ToastContainer, ConnectionOverlay } from '@/components/ui/index.ts';

export function AppShell() {
  return (
    <div className="flex min-h-screen flex-col bg-void-black pt-[env(safe-area-inset-top)]">
      <StatusBar />
      <main className="flex-1 overflow-y-auto pb-16">
        <Outlet />
      </main>
      <BottomNav />
      <ToastContainer />
      <ConnectionOverlay />
    </div>
  );
}
