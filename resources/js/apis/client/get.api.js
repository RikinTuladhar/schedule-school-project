import axiosInstance from "../axiosInstance";
import { useQuery } from "@tanstack/react-query";

export const CLIENT_QUERY_KEY = ["client"];

export async function getClientProfile() {
    try {
        const res = await axiosInstance.get("/client/profile");
        return res?.data?.data?.client ?? null;
    } catch (error) {
        console.error("Error fetching client profile:", error);
        throw error;
    }
}

export const useGetClientProfile = (enabled = true) => {
    return useQuery({
        queryKey: CLIENT_QUERY_KEY,
        queryFn: getClientProfile,
        enabled,
        refetchOnMount: true,
        staleTime: 5 * 60 * 1000,
        gcTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
    });
};
