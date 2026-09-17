import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth();

  // Wait until /auth/me finishes checking
  // whether the user has a valid session.
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white" />

          <p className="mt-5 text-xs uppercase tracking-[0.2em] text-white/40">
            Checking session
          </p>
        </div>
      </div>
    );
  }

  // No valid login → go to login page.
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  // Valid login → render the requested admin page.
  return <Outlet />;
}

export default ProtectedRoute;