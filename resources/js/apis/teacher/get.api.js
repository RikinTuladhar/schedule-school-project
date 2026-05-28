import axiosInstance from "@/apis/axiosInstance";
import { useQuery } from "@tanstack/react-query";

export const TEACHERS_QUERY_KEY = ["teachers"];

const getResponseTeachers = (response) => response?.data?.data?.teachers ?? [];
const getResponseTeacher = (response) => response?.data?.data?.teacher ?? null;

export async function getTeachers(filters = {}) {
    const res = await axiosInstance.get("/teachers", {
        params: {
            search: filters.search || undefined,
            employment_type: filters.employment_type === "all" ? undefined : filters.employment_type,
        },
    });

    return getResponseTeachers(res);
}

export async function getTeacher(teacherId) {
    const res = await axiosInstance.get(`/teachers/${teacherId}`);
    return getResponseTeacher(res);
}

export function useGetTeachers(filters = {}, options = {}) {
    return useQuery({
        queryKey: [...TEACHERS_QUERY_KEY, filters],
        queryFn: () => getTeachers(filters),
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        refetchOnWindowFocus: false,
        ...options,
    });
}

export function useGetTeacher(teacherId, options = {}) {
    return useQuery({
        queryKey: [...TEACHERS_QUERY_KEY, teacherId],
        queryFn: () => getTeacher(teacherId),
        enabled: Boolean(teacherId),
        staleTime: 5 * 60 * 1000,
        ...options,
    });
}
