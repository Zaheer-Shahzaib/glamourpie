import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../Context/useAuth";
import { PATH_AUTH } from "../routes";
import { LoadingOverlay, Box } from "@mantine/core";
import MainLayout from "../layout/Main";

interface ProtectedRouteProps {
  requireSeller?: boolean;
  /** When true, wrap matched child routes in the main app shell (sidebar). */
  withAppLayout?: boolean;
}

const AUTH_PATH_PREFIX = `${PATH_AUTH.root}/`;

function isPublicAuthPath(pathname: string) {
  return (
    pathname === PATH_AUTH.root ||
    pathname.startsWith(AUTH_PATH_PREFIX)
  );
}

const ProtectedRoute = ({
  requireSeller = true,
  withAppLayout = false,
}: ProtectedRouteProps) => {
  const { isAuthenticated, isSellerConnected, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <Box h="100vh" pos="relative">
        <LoadingOverlay visible={true} />
      </Box>
    );
  }

  // Pathless layout routes can still mount on /authentication/* — never redirect in a loop.
  if (!isAuthenticated) {
    if (isPublicAuthPath(location.pathname)) {
      return null;
    }
    return <Navigate to={PATH_AUTH.signin} replace />;
  }

  if (requireSeller && isSellerConnected === false) {
    return <Navigate to="/connect-amazon" replace />;
  }

  if (!requireSeller && isSellerConnected === true) {
    return <Navigate to="/dashboard/default" replace />;
  }

  if (withAppLayout) {
    return (
      <MainLayout>
        <Outlet />
      </MainLayout>
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;
