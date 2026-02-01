import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const AdminRoute = () => {
    const { user, isAuthenticated } = useAuth();

    // Check if user is logged in AND is an admin
    if (!isAuthenticated || !user?.isAdmin) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};

export default AdminRoute;
