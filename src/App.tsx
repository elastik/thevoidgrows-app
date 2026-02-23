import { Routes, Route, Navigate } from 'react-router-dom';
import { DashboardPage, SettingsPage, SterilizePage, ConnectionPage } from '@/pages/index.ts';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="/sterilize" element={<SterilizePage />} />
      <Route path="/connect" element={<ConnectionPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
