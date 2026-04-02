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
import ProfilePersonalPage from "./pages/profile/ProfilePersonalPage";
import ProfileSecurityPage from "./pages/profile/ProfileSecurityPage";
import ProfileCredentialsPage from "./pages/profile/ProfileCredentialsPage";
import ProfileStatisticsPage from "./pages/profile/ProfileStatisticsPage";
import OrdersPage from "./pages/ordersPage";
import SettingsSpApiPage from "./pages/settings/SettingsSpApiPage";
import SettingsMarketplacePage from "./pages/settings/SettingsMarketplacePage";
import SettingsInvoicesPage from "./pages/settings/SettingsInvoicesPage";
import SettingsNotificationsPage from "./pages/settings/SettingsNotificationsPage";
import SettingsBusinessPage from "./pages/settings/SettingsBusinessPage";
import ComingSoonPage from "./pages/ComingSoonPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import SignupPage from "./Components/authentication/signup/page";
import LoginPage from "./Components/authentication/login/page";
import { PATH_AUTH, PATH_DASHBOARD, PATH_PAGES, PATH_APPS } from "./routes/index";
import PrivacyPolicy from "./pages/PrivacyPolicy/PrivacyPolicy";
import TermsService from "./pages/TermsofService/TermsService";
import ADDP from "./pages/AmazonDataProtectionPolicy/ADDP";
import About from "./Components/About/about";
import ErrorPage from "./pages/notFound";
import { ContactUs } from "./pages/contact-us";
import Sitemap from "./pages/services";
import ProtectedRoute from "./hooks/protectedRoute";
import OTPVerify from "./Components/authentication/otpVerify/page";
import Services from "./Components/services";
import ResetPassword from "./Components/authentication/forgetPassword/resetPassword";
import ForgetPassword from "./Components/authentication/forgetPassword/page";



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

  // useEffect(() => {
  //   const handleContextMenu = (e: MouseEvent) => e.preventDefault();
  //   const handleKeyDown = (e: KeyboardEvent) => {
  //     if (
  //       e.key === 'F12' ||
  //       (e.ctrlKey && e.shiftKey && ['I', 'J', 'C'].includes(e.key)) ||
  //       (e.ctrlKey && e.key === 'U')
  //     ) {
  //       e.preventDefault();
  //     }
  //   };

  //   document.addEventListener('contextmenu', handleContextMenu);
  //   document.addEventListener('keydown', handleKeyDown);

  //   return () => {
  //     document.removeEventListener('contextmenu', handleContextMenu);
  //     document.removeEventListener('keydown', handleKeyDown);
  //   };
  // }, []);

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
      <Route path={PATH_PAGES.services} element={<Services />} />
      <Route path={PATH_PAGES.privacy} element={<PrivacyPolicy />} />
      <Route path={PATH_PAGES.terms} element={<TermsService />} />
      <Route path={PATH_PAGES.about} element={<About />} />
      <Route path={PATH_PAGES.addp} element={<ADDP />} />
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
        <Route
          path={PATH_AUTH.forgetPassword}
          element={<ForgetPassword />}
        />

        <Route
          path={PATH_AUTH.otpVerify}
          element={<OTPVerify />}
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
        path={PATH_APPS.profile.root}
        element={<ProtectedRoute />}
      >
        <Route
          path={PATH_APPS.profile.personal}
          element={<ProfilePersonalPage />}
        />
        <Route
          path={PATH_APPS.profile.security}
          element={<ProfileSecurityPage />}
        />
        <Route
          path={PATH_APPS.profile.credentials}
          element={<ProfileCredentialsPage />}
        />
        <Route
          path={PATH_APPS.profile.statistics}
          element={<ProfileStatisticsPage />}
        />
      </Route>
      <Route
        path={PATH_APPS.orders}
        element={<ProtectedRoute />}
      >
        <Route
          index
          element={<OrdersPage />}
        />
      </Route>
      {/* Settings Child Routes */}
      <Route
        path={PATH_APPS.settings.root}
        element={<ProtectedRoute />}
      >
        <Route
          path={PATH_APPS.settings.spApi}
          element={<SettingsSpApiPage />}
        />
        <Route
          path={PATH_APPS.settings.marketplace}
          element={<SettingsMarketplacePage />}
        />
        <Route
          path={PATH_APPS.settings.invoices}
          element={<SettingsInvoicesPage />}
        />
        <Route
          path={PATH_APPS.settings.notifications}
          element={<SettingsNotificationsPage />}
        />
        <Route
          path={PATH_APPS.settings.business}
          element={<SettingsBusinessPage />}
        />
      </Route>
      {/* Placeholder Routes */}
      <Route
        path={PATH_APPS.tasks}
        element={<ProtectedRoute />}
      >
        <Route
          index
          element={<ComingSoonPage title="Tasks" description="Task management feature is coming soon." />}
        />
      </Route>
      <Route
        path={PATH_APPS.calendar}
        element={<ProtectedRoute />}
      >
        <Route
          index
          element={<ComingSoonPage title="Calendar" description="Calendar feature is coming soon." />}
        />
      </Route>
      <Route
        path={PATH_APPS.fileManager}
        element={<ProtectedRoute />}
      >
        <Route
          index
          element={<ComingSoonPage title="File Manager" description="File management feature is coming soon." />}
        />
      </Route>
      <Route
        path={PATH_APPS.analytics}
        element={<ProtectedRoute />}
      >
        <Route
          index
          element={<AnalyticsPage />}
        />
      </Route>
      <Route
        path='*'
        element={<ErrorPage />}
      />
    </Routes>
  );
}
