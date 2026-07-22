import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppAuthProvider } from './auth/AuthProvider';
import { RequireAuth } from './auth/RequireAuth';
import { DashboardLayout } from './layouts/DashboardLayout';
import { LoginPage } from './pages/LoginPage';
import { DashboardOverview } from './pages/DashboardOverview';
import { EventsPage } from './pages/EventsPage';
import { EventDetailPage } from './pages/EventDetailPage';
import { TemplatesPage } from './pages/TemplatesPage';
import { ParticipantsPage } from './pages/ParticipantsPage';
import { CredentialsPage } from './pages/CredentialsPage';
import { SettingsPage } from './pages/SettingsPage';
import { PublicCredentialPage } from './pages/PublicCredentialPage';

export function App() {
  return (
    <AppAuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Credential Verification Route */}
          <Route path="/credential/:credentialId" element={<PublicCredentialPage />} />

          {/* Organizer Login Route */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Celestius Dashboard Routes */}
          <Route
            path="/dashboard"
            element={
              <RequireAuth>
                <DashboardLayout />
              </RequireAuth>
            }
          >
            <Route index element={<DashboardOverview />} />
            <Route path="events" element={<EventsPage />} />
            <Route path="events/:id" element={<EventDetailPage />} />
            <Route path="templates" element={<TemplatesPage />} />
            <Route path="participants" element={<ParticipantsPage />} />
            <Route path="credentials" element={<CredentialsPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          {/* Default Fallback Redirect */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AppAuthProvider>
  );
}

export default App;
