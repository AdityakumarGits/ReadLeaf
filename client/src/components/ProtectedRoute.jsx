import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import LoadingScreen from "./LoadingScreen.jsx";

const ProtectedRoute = ({ role }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return <LoadingScreen />;
  if (!user)
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  if (role && user.role !== role)
    return (
      <Navigate to={user.role === "admin" ? "/admin" : "/dashboard"} replace />
    );
  return <Outlet />;
};
export default ProtectedRoute;
