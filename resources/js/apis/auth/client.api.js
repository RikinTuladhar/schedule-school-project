import axiosInstance from "@/apis/axiosInstance";
import Cookies from "js-cookie";

const CLIENT_TOKEN_KEY = "client_auth_token";
const CLIENT_PROFILE_KEY = "client_profile";
const COOKIE_OPTIONS = {
    expires: 30,
    sameSite: "lax",
};

export const getClientToken = () => Cookies.get(CLIENT_TOKEN_KEY);

export const setClientToken = (token) => {
    Cookies.set(CLIENT_TOKEN_KEY, token, COOKIE_OPTIONS);
    axiosInstance.defaults.headers.common.Authorization = `Bearer ${token}`;
};

export const getClientProfile = () => {
    const profile = Cookies.get(CLIENT_PROFILE_KEY);

    if (!profile) {
        return null;
    }

    try {
        return JSON.parse(profile);
    } catch {
        Cookies.remove(CLIENT_PROFILE_KEY);

        return null;
    }
};

export const setClientProfile = (client) => {
    Cookies.set(CLIENT_PROFILE_KEY, JSON.stringify(client), COOKIE_OPTIONS);
};

export const clearClientSession = () => {
    Cookies.remove(CLIENT_TOKEN_KEY);
    Cookies.remove(CLIENT_PROFILE_KEY);
    delete axiosInstance.defaults.headers.common.Authorization;
};

const existingToken = getClientToken();

if (existingToken) {
    axiosInstance.defaults.headers.common.Authorization = `Bearer ${existingToken}`;
}

export const signInClient = async ({ email, username, login, password }) => {
    const response = await axiosInstance.post("/client/login", {
        email,
        username,
        login,
        password,
    });

    const { token, client } = response.data.data;

    setClientToken(token);
    setClientProfile(client);

    return response.data;
};

export const fetchClientProfile = async () => {
    const response = await axiosInstance.get("/client/profile");

    return response.data;
};

export const signOutClient = async () => {
    try {
        await axiosInstance.post("/client/logout");
    } finally {
        clearClientSession();
    }
};

export const getApiErrorMessage = (error, fallback = "Something went wrong. Please try again.") => {
    return error?.response?.data?.message ?? fallback;
};
