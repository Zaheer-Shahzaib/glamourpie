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
import Pricing from "./pages/price";
import ErrorPage from "./pages/notFound";

// --- Auth Simulation ---
const useAuth = () => {
  const [isAuthenticated, setAuth] = useState(true);
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
  return isAuthenticated ? <>{children}</> : <Navigate to={PATH_AUTH.signin} />;
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
          <Route
            path={PATH_AUTH.passwordReset}
            element={<ResetPassword />}
          />
        </Route>
        {/* Protected Routes */}
        <Route
          path={PATH_DASHBOARD.root}
          element={
            <ProtectedRoute isAuthenticated={auth.isAuthenticated}>
              <Dashboard />
            </ProtectedRoute>
          }
        >
          <Route path={PATH_DASHBOARD.default} element={<Dashboard />} />
          <Route path={PATH_DASHBOARD.analytics} element={<Pricing />} />
        </Route>
        <Route
          path='*'
          element={<ErrorPage />}
        />
      </Routes>
    </Router>
  );
}
