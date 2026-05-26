import { LogOut, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AdminNavbar = ({ admin }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("admin_token");
        navigate("/admin/login");
    };

    return (
        <header className="bg-[#1e91cf] text-white h-12 flex items-center justify-between px-4 shadow-md fixed w-full z-10 top-0 left-0">
            <div className="flex items-center gap-4">
                <div className="font-bold text-lg tracking-wide flex items-center gap-2">
                    <img
                        src="https://www.lekalifood.com/newsite/image/catalog/logo-main.png"
                        alt="Logo"
                        className="h-8 "
                    />
                </div>
            </div>
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm">
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                        <User size={16} />
                    </div>
                    <span className="hidden md:inline">
                        {admin?.name || "Admin"}
                    </span>
                </div>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-1 text-sm bg-black/10 hover:bg-black/20 px-3 py-1.5 rounded transition-colors"
                >
                    <LogOut size={14} />
                    <span className="hidden md:inline">Logout</span>
                </button>
            </div>
        </header>
    );
};

export default AdminNavbar;
