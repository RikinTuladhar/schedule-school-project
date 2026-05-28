import axiosInstance from "@/apis/axiosInstance";
import { CLIENT_QUERY_KEY } from "@/apis/client/get.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";

export const CLIENT_TOKEN_COOKIE = "client_token";

export function getClientToken() {
    return Cookies.get(CLIENT_TOKEN_COOKIE);
}

export function setClientAuthToken(token, remember = true) {
    if (!token) {
        return;
    }

    const options = remember ? { expires: 30, sameSite: "lax" } : { sameSite: "lax" };
    Cookies.set(CLIENT_TOKEN_COOKIE, token, options);
    axiosInstance.defaults.headers.common.Authorization = `Bearer ${token}`;
}

export function clearClientAuthToken() {
    Cookies.remove(CLIENT_TOKEN_COOKIE);
    delete axiosInstance.defaults.headers.common.Authorization;
}

export function getApiErrorMessage(error, fallback = "Something went wrong.") {
    const response = error?.response?.data;
    const validationErrors = response?.errors;

    if (validationErrors && typeof validationErrors === "object") {
        const firstError = Object.values(validationErrors).flat().find(Boolean);

        if (firstError) {
            return firstError;
        }
    }

    return response?.message || error?.message || fallback;
}

export async function signInClient(values) {
    try {
        const payload = {
            email: values.email,
            password: values.password,
        };
        const res = await axiosInstance.post("/client/login", payload);
        const token = res?.data?.data?.token;
        const client = res?.data?.data?.client ?? null;

        if (!token) {
            throw new Error("Login response did not include an access token.");
        }

        setClientAuthToken(token, values.remember);

        return {
            ...res.data,
            token,
            client,
            remember: Boolean(values.remember),
        };
    } catch (error) {
        throw error;
    }
}

export const useSignInClient = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (values) => signInClient(values),
        onSuccess: (authResult) => {
            queryClient.setQueryData(CLIENT_QUERY_KEY, authResult.client ?? null);
            queryClient.invalidateQueries({ queryKey: CLIENT_QUERY_KEY });
        },
    });
};
