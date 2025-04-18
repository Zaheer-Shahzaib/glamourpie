// Base Mantine + TypeScript + Routing + Auth layout
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useState } from "react";
import Home from "./pages/homePage";
import Dashboard from "./pages/dashboardPage";
import SignupPage from "./Components/authentication/signup/page";
import LoginPage from "./Components/authentication/login/page";
import { PATH_AUTH, PATH_DASHBOARD } from "./routes/index"; // Import external routes
import ResetPassword from './Components/authentication/password-reset/page';

// --- Auth Simulation ---
const useAuth = () => {
  const [isAuthenticated, setAuth] = useState(false);
  return {
    isAuthenticated,
    login: () => setAuth(true),
    logout: () => setAuth(false),
  };
};

function ProtectedRoute({
  children,
  isAuthenticated,
}: {
  children: React.ReactNode;
  isAuthenticated: boolean;
}) {
  return isAuthenticated ? <>{children}</> : <Navigate to='/auth/login' />;
}

// --- Main App ---
export default function App() {
  const auth = useAuth();

  return (
    <Router>
      <Routes>
        <Route
          path='/'
          element={<Home />}
        />
        <Route path={PATH_AUTH.root}>
          <Route
            path={PATH_AUTH.signin}
            element={<LoginPage />}
          />
          <Route
            path={PATH_AUTH.signup}
            element={<SignupPage />}         
          />
          <Route path={PATH_AUTH.passwordReset} element={<ResetPassword />} />
        </Route>
        <Route
          path={PATH_DASHBOARD.root}
          element={
            <ProtectedRoute isAuthenticated={auth.isAuthenticated}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}
