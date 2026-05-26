import { Lock, User } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminLogin } from "../../apis/auth/adminApi";

const AdminLoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        // Mock authentication
        if (email === "" || password === "") {
            alert("Please fill all fields");
            return;
        }
        const credentials = {
            email: email,
            password: password,
        };

        try {
            const res = await adminLogin(credentials);
            console.log(res);
            if (res.success) {
                localStorage.setItem("admin_token", res.data.token);
                navigate("/admin/dashboard");
            } else {
                alert(res.message);
            }
        } catch (error) {
            alert(error.response.data.message);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md border-t-4 border-[#1e91cf]">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-700">
                        Administration
                    </h1>
                </div>
                <form onSubmit={handleLogin}>
                    <div className="mb-6">
                        <label
                            className="block text-gray-600 text-sm font-medium mb-2"
                            htmlFor="text"
                        >
                            Username / Email
                        </label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <User size={16} className="text-gray-400" />
                            </span>
                            <input
                                id="text"
                                type="text"
                                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#1e91cf] focus:ring-1 focus:ring-[#1e91cf]"
                                placeholder="admin@lekali.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div className="mb-6">
                        <label
                            className="block text-gray-600 text-sm font-medium mb-2"
                            htmlFor="password"
                        >
                            Password
                        </label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock size={16} className="text-gray-400" />
                            </span>
                            <input
                                id="password"
                                type="password"
                                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#1e91cf] focus:ring-1 focus:ring-[#1e91cf]"
                                placeholder="admin"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mt-2 text-right">
                            <a
                                href="#"
                                className="text-sm text-[#1e91cf] hover:underline"
                            >
                                Forgotten Password?
                            </a>
                        </div>
                    </div>
                    <button
                        onClick={handleLogin}
                        type="submit"
                        className="w-full bg-[#1e91cf] hover:bg-[#1978ab] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors"
                    >
                        Login
                    </button>
                </form>
                <div className="mt-8 text-center text-xs text-gray-500">
                    <p>OpenCart © 2009-2026 All Rights Reserved.</p>
                </div>
            </div>
        </div>
    );
};

export default AdminLoginPage;
