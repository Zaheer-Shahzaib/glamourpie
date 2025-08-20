// Base Mantine + TypeScript + Routing + Auth layout
import {
  Routes,
  Route,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useEffect } from "react";
import Home from "./pages/homePage";
import Dashboard from "./pages/dashboardPage";
import SignupPage from "./Components/authentication/signup/page";
import LoginPage from "./Components/authentication/login/page";
import { PATH_AUTH, PATH_DASHBOARD, PATH_PAGES } from "./routes/index"; // Import external routes
import ResetPassword from "./Components/authentication/password-reset/page";
import PrivacyPolicy from "./pages/PrivacyPolicy/PrivacyPolicy"; // ✅ Import the new page
import TermsService from "./pages/TermsofService/TermsService";  // import termserivce page
import About from "./Components/About/about";
import ErrorPage from "./pages/notFound";
import { ContactUs } from "./pages/contact-us";
import ProtectedRoute from "./hooks/protectedRoute";

// --- Auth Simulation ---
// export const useAuth = () => {
//   const [isAuthenticated, setAuth] = useState(true);
//   return {
//     isAuthenticated,
//     login: () => setAuth(true),
//     logout: () => setAuth(false),
//   };
// };

// function ProtectedRoute({
//   isAuthenticated,
// }: {
//   isAuthenticated: boolean;
// }) {
//   return isAuthenticated ? <Outlet /> : <Navigate to={PATH_AUTH.signin} />;
// }
// --- Main App ---
export default function App() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if there's a scroll target in the navigation state
    const state = location.state as { scrollToId?: string };
    if (state?.scrollToId) {
      const section = document.getElementById(state.scrollToId);
      if (section) {
        console.log("Scrolling to section after navigation:", state.scrollToId);
        section.scrollIntoView({ behavior: "smooth", block: "start" });
      }

      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);
  return (
    <Routes>
      <Route
        path={PATH_PAGES.root}
        element={<Home />}
      />
      <Route
        path={PATH_PAGES.contact}
        element={<ContactUs />}
      />
      <Route path={PATH_PAGES.privacy} element={<PrivacyPolicy />} />
      <Route path={PATH_PAGES.terms} element={<TermsService />} />
      <Route path={PATH_PAGES.about} element={<About />} />
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
        element={<ProtectedRoute />}
      >
        <Route
          path={PATH_DASHBOARD.default}
          element={<Dashboard />}
        />
      </Route>
      <Route
        path='*'
        element={<ErrorPage />}
      />
    </Routes>
  );
}
