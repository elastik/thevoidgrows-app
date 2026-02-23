import { Routes, Route, Navigate } from 'react-router-dom';
import { AppShell } from '@/components/layout/index.ts';
import { DashboardPage, SettingsPage, SterilizePage, ConnectionPage } from '@/pages/index.ts';

export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/sterilize" element={<SterilizePage />} />
        <Route path="/connect" element={<ConnectionPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
