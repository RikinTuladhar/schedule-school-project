import axiosInstance from "@/apis/axiosInstance";
import { useQuery } from "@tanstack/react-query";

export const MASTER_SCHEDULE_QUERY_KEY = ["master-schedules"];

const getResponseRun = (response) => response?.data?.data?.run ?? null;

export async function getLatestMasterScheduleRun() {
    const res = await axiosInstance.get("/master-schedules/latest");
    return getResponseRun(res);
}

export async function getMasterScheduleRun(runId) {
    const res = await axiosInstance.get(`/master-schedules/${runId}`);
    return getResponseRun(res);
}

export function useGetLatestMasterScheduleRun(options = {}) {
    return useQuery({
        queryKey: [...MASTER_SCHEDULE_QUERY_KEY, "latest"],
        queryFn: getLatestMasterScheduleRun,
        refetchOnWindowFocus: false,
        ...options,
    });
}

export function useGetMasterScheduleRun(runId, options = {}) {
    return useQuery({
        queryKey: [...MASTER_SCHEDULE_QUERY_KEY, runId],
        queryFn: () => getMasterScheduleRun(runId),
        enabled: Boolean(runId),
        refetchOnWindowFocus: false,
        ...options,
    });
}
