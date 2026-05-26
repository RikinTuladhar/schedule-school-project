import axios from "axios";
const Base_URL = "http://127.0.0.1:8000/api";
const axiosInstance = axios.create({
    baseURL: Base_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

export default axiosInstance;
