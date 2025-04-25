import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { PATH_AUTH } from "../routes";


interface ProtectedRouteProps {
    isAuthenticated: boolean;
  }
  
  export default function ProtectedRoute({ isAuthenticated }: ProtectedRouteProps) {
    return isAuthenticated ? <Outlet /> : <Navigate to={PATH_AUTH.signin} />;
  }