// app/components/ProtectedRoute.tsx
import React from "react";
import { Navigate, Outlet, useLocation } from "react-router";
import Loading from "~/components/Loading";
import { useAuth } from "~/contexts/auth";

export const ProtectedRoute: React.FC = () => {
  const { signed, loadingData } = useAuth();
  const location = useLocation();

  if (loadingData) {
    return <Loading />;
  }

  if (!signed) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};
