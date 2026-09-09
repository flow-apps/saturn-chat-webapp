// app/components/PublicRoute.tsx
import React from "react";
import { Navigate, Outlet } from "react-router";
import { useAuth } from "~/contexts/auth";

export const PublicRoute: React.FC = () => {
  const { signed, loadingData } = useAuth();

  if (loadingData) {
    return null;
  }

  if (signed) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
