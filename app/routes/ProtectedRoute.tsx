// app/components/ProtectedRoute.tsx
import React, { useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router";
import Loading from "~/components/Loading";
import { useAuth } from "~/contexts/auth";

export const ProtectedRoute: React.FC = () => {
  const { signed, loadingData, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loadingData && (!signed || !user)) {
      console.log(signed);

      navigate("/login", { state: { from: location }, replace: true });
    }
  }, [signed, loadingData, user, navigate, location]);

  if (loadingData) {
    return <Loading />;
  }

  if (!signed || !user) {
    return <Loading />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
