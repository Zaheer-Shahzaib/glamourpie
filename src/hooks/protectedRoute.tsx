import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../Context/useAuth";
import { PATH_AUTH } from "../routes";

const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Outlet /> : <Navigate to={PATH_AUTH.signin} />;
};

export default ProtectedRoute;