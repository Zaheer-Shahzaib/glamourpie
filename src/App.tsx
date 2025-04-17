// Base Mantine + TypeScript + Routing + Auth layout
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  BrowserRouter,
} from "react-router-dom";
import { useState } from "react";
import Home from "./pages/homePage";
import Dashboard from "./pages/dashboardPage";
import SignupPage from "./Components/authentication/signup/page";
import LoginPage from "./Components/authentication/login/page";

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
  return isAuthenticated ? <>{children}</> : <Navigate to='/login' />;
}

// --- Main App ---
export default function App() {
  const auth = useAuth();

  return (
    <BrowserRouter>

      <Routes>
        <Route
          path='/'
          element={<Home />}
        />
        <Route
          path='/signup'
          element={<SignupPage />}
        />
        <Route
          path='/login'
          element={<LoginPage />}
        />
        <Route
          path='/dashboard'
          element={
            <ProtectedRoute isAuthenticated={auth.isAuthenticated}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
  
    </BrowserRouter>
   
  );
}
