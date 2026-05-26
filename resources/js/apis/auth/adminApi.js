import axiosInstance from "../axiosInstance";

export async function adminLogin(values) {
    try {
        const res = await axiosInstance.post("/admin/login", values);
        const data = await res.data;
        return data;
    } catch (error) {
        throw error;
    }
}

export async function adminLogout() {
    try {
        const res = await axiosInstance.post("/admin/logout");
        const data = await res.data;
        return data;
    } catch (error) {
        throw error;
    }
}

export async function adminProfile(token) {
    try {
        const res = await axiosInstance.get("/admin/profile", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const data = await res.data;
        return data;
    } catch (error) {
        throw error;
    }
}
