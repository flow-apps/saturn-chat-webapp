// app/components/ProtectedRoute.tsx
import React from "react";
import { Navigate, Outlet, useLocation } from "react-router";
import { useAuth } from "~/contexts/auth";

export const ProtectedRoute: React.FC = () => {
  const { signed, loadingData } = useAuth();
  const location = useLocation();

  if (loadingData) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        Carregando sessão...
      </div>
    );
  }

  if (!signed) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};
