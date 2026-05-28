import axios from "axios";
import Cookies from "js-cookie";

const Base_URL = import.meta.env.VITE_API_BASE_URL ?? "/api";

const axiosInstance = axios.create({
    baseURL: Base_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

axiosInstance.interceptors.request.use((config) => {
    const token = Cookies.get("client_token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    } else {
        delete config.headers.Authorization;
    }

    return config;
});

export default axiosInstance;
