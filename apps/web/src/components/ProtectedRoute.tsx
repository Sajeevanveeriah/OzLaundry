import { Navigate } from "react-router-dom";
import type { User } from "../hooks/useAuth";

export function ProtectedRoute({ user, adminOnly, children }: { user: User | null; adminOnly?: boolean; children: JSX.Element }) {
  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && user.role !== "ADMIN") return <Navigate to="/dashboard" replace />;
  return children;
}
