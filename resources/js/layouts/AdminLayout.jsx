import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { adminProfile } from "../apis/auth/adminApi";
import AdminNavbar from "../components/admin/AdminNavbar";
import Sidebar from "../components/admin/Sidebar";

const AdminLayout = () => {
    const [admin, setAdmin] = useState(null);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem("admin_token");
    console.log(admin);

    useEffect(() => {
        const fetchProfile = async () => {
            if (!token) {
                setLoading(false);
                return;
            }
            try {
                const res = await adminProfile(token);
                if (res.success) {
                    setAdmin(res.data);
                } else {
                    localStorage.removeItem("admin_token");
                }
            } catch (error) {
                console.error("Failed to fetch admin profile:", error);
                localStorage.removeItem("admin_token");
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [token]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#f3f3f3]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1e91cf]"></div>
            </div>
        );
    }

    if (!token) {
        return <Navigate to="/admin/login" />;
    }

    return (
        <div className="min-h-screen bg-[#f3f3f3] flex flex-col font-sans">
            <AdminNavbar admin={admin} />
            <div className="flex flex-1 pt-12">
                <Sidebar />
                <main className="flex-1 p-6 overflow-x-hidden min-w-0">
                    <Outlet context={{ admin, setAdmin }} />
                </main>
            </div>
            {/* <footer className="text-center text-xs text-gray-500 py-4 border-t border-gray-200">
        <a href="#" className="text-[#1e91cf]">
          OpenCart
        </a>{" "}
        © 2009-2026 All Rights Reserved.
        <br />
        Version 3.0.3.8
      </footer> */}
        </div>
    );
};

export default AdminLayout;
