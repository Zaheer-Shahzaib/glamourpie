// Base Mantine + TypeScript + Routing + Auth layout
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { MantineProvider, AppShell, Button, Text, AppShellNavbar, AppShellHeader } from '@mantine/core';
import { useState } from 'react';
import Home from './pages/homePage';
import Dashboard from './pages/dashboardPage';
import { theme } from './theme/theme';
import CollapseDesktop from './pages/dashboardPage';

// --- Auth Simulation ---
const useAuth = () => {
  const [isAuthenticated, setAuth] = useState(true);
  return { isAuthenticated, login: () => setAuth(true), logout: () => setAuth(false) };
};
function Login({ login }: { login: () => void }) {
  return (
    <div>
      <Text size="xl">Login Page</Text>
      <Button onClick={login} mt="md">Log In</Button>
    </div>
  );
}

function ProtectedRoute({ children, isAuthenticated }: { children: React.ReactNode; isAuthenticated: boolean }) {
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
}

// --- Main App ---
export default function App() {
  const auth = useAuth();

  return (
      <Router>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/login" element={<Login login={auth.login} />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute isAuthenticated={auth.isAuthenticated}>
               <CollapseDesktop/>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
  );
}