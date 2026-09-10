// app/components/PublicRoute.tsx
import React from "react";
import { Navigate, Outlet } from "react-router";
import Loading from "~/components/Loading";
import { useAuth } from "~/contexts/auth";

export const PublicRoute: React.FC = () => {
  const { signed, loadingData } = useAuth();

  if (loadingData) {
    return <Loading />;
  }

  if (signed) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
