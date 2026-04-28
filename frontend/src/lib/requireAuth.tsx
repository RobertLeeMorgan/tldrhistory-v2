import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router";
import { useAuth } from "../context/AuthContext";
import PageContainer from "../components/ui/PageContainer";

type RequireAuthProps = {
  children: ReactNode;
  requireRole?: Array<"ADMIN" | "MODERATOR" | "USER">;
  requireVerified?: boolean;
};

export default function RequireAuth({
  children,
  requireRole,
  requireVerified = false,
}: RequireAuthProps) {
  const { isAuth, loading } = useAuth();
  const location = useLocation();

  const from = location.pathname + location.search;

  if (loading) {
    return (
      <PageContainer>
        <span className="loading loading-spinner loading-lg mx-auto flex text-gold" />
      </PageContainer>
    );
  }

  if (!isAuth.token) {
    return <Navigate to="/login" replace state={{ from }} />;
  }

  if (requireVerified && !isAuth.emailVerifiedAt) {
    return <Navigate to="/verify" replace state={{ from }} />;
  }

  if (
    requireRole &&
    (!isAuth.role ||
      !requireRole.includes(isAuth.role as "ADMIN" | "MODERATOR" | "USER"))
  ) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}