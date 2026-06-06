import axiosInstance from "@/apis/axiosInstance";
import { useQuery } from "@tanstack/react-query";

export const SCHEDULE_TEMPLATES_QUERY_KEY = ["schedule-templates"];

const getResponseTemplates = (response) => response?.data?.data?.schedule_templates ?? [];
const getResponseTemplate = (response) => response?.data?.data?.schedule_template ?? null;

export async function getScheduleTemplates(filters = {}) {
    const res = await axiosInstance.get("/schedule-templates", {
        params: {
            level: filters.level === "all" ? undefined : filters.level,
        },
    });

    return getResponseTemplates(res);
}

export async function getScheduleTemplate(templateId) {
    const res = await axiosInstance.get(`/schedule-templates/${templateId}`);
    return getResponseTemplate(res);
}

export function useGetScheduleTemplates(filters = {}, options = {}) {
    return useQuery({
        queryKey: [...SCHEDULE_TEMPLATES_QUERY_KEY, filters],
        queryFn: () => getScheduleTemplates(filters),
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        refetchOnWindowFocus: false,
        ...options,
    });
}

export function useGetScheduleTemplate(templateId, options = {}) {
    return useQuery({
        queryKey: [...SCHEDULE_TEMPLATES_QUERY_KEY, templateId],
        queryFn: () => getScheduleTemplate(templateId),
        enabled: Boolean(templateId),
        staleTime: 5 * 60 * 1000,
        ...options,
    });
}
