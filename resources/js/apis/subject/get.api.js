import axiosInstance from "@/apis/axiosInstance";
import { useQuery } from "@tanstack/react-query";

export const SUBJECTS_QUERY_KEY = ["subjects"];

const getResponseSubjects = (response) => response?.data?.data?.subjects ?? [];
const getResponseSubject = (response) => response?.data?.data?.subject ?? null;

export async function getSubjects(filters = {}) {
    const res = await axiosInstance.get("/subjects", {
        params: {
            search: filters.search || undefined,
            status: filters.status === "all" ? undefined : filters.status,
        },
    });

    return getResponseSubjects(res);
}

export async function getSubject(subjectId) {
    const res = await axiosInstance.get(`/subjects/${subjectId}`);
    return getResponseSubject(res);
}

export function useGetSubjects(filters = {}, options = {}) {
    return useQuery({
        queryKey: [...SUBJECTS_QUERY_KEY, filters],
        queryFn: () => getSubjects(filters),
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        refetchOnWindowFocus: false,
        ...options,
    });
}

export function useGetSubject(subjectId, options = {}) {
    return useQuery({
        queryKey: [...SUBJECTS_QUERY_KEY, subjectId],
        queryFn: () => getSubject(subjectId),
        enabled: Boolean(subjectId),
        staleTime: 5 * 60 * 1000,
        ...options,
    });
}
