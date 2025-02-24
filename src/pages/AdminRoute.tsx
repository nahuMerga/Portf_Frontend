import { Navigate, Outlet } from "react-router-dom";

const AdminRoute = () => {
    const token = localStorage.getItem("accessToken");
    const isAdmin = localStorage.getItem("is_admin") === "true"; // Ensure it's a boolean

    if (!token || !isAdmin) {
        return <Navigate to="/mek-nah-16-log" replace />; // Redirect to login if not admin
    }

    return <Outlet />;
};

export default AdminRoute;
