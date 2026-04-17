import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../Context/useAuth";
import { PATH_AUTH } from "../routes";
import { LoadingOverlay, Box } from "@mantine/core";

interface ProtectedRouteProps {
  requireSeller?: boolean;
}

const ProtectedRoute = ({ requireSeller = true }: ProtectedRouteProps) => {
  const { isAuthenticated, isSellerConnected, loading } = useAuth();

  if (loading) {
    return (
      <Box h="100vh" pos="relative">
        <LoadingOverlay visible={true} />
      </Box>
    );
  }

  // 1. Basic Auth Check
  if (!isAuthenticated) {
    return <Navigate to={PATH_AUTH.signin} />;
  }

  // 2. Seller Connection Check
  // If we require a seller but none is connected -> go to setup
  if (requireSeller && isSellerConnected === false) {
    return <Navigate to="/connect-amazon" />;
  }

  // 3. Prevent landing on Connect Page if already connected
  if (!requireSeller && isSellerConnected === true) {
    return <Navigate to="/dashboard" />;
  }

  return <Outlet />;
};

export default ProtectedRoute;