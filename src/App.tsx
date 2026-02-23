import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppShell } from '@/components/layout/index.ts';
import { DashboardPage, SettingsPage, SterilizePage, ConnectionPage, DemoPage } from '@/pages/index.ts';
import { useConnection } from '@/hooks/index.ts';

/** Attempts to connect to the device automatically on app load. */
function AutoConnect() {
  const { connectionStatus, connect } = useConnection();

  useEffect(() => {
    if (connectionStatus === 'disconnected') {
      connect();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps -- intentionally run only on mount

  return null;
}

export default function App() {
  return (
    <>
      <AutoConnect />
      <Routes>
        <Route path="/demo" element={<DemoPage />} />
        <Route element={<AppShell />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/sterilize" element={<SterilizePage />} />
          <Route path="/connect" element={<ConnectionPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </>
  );
}
