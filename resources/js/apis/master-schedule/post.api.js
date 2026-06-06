import axiosInstance from "@/apis/axiosInstance";
import { MASTER_SCHEDULE_QUERY_KEY } from "@/apis/master-schedule/get.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export async function generateMasterSchedule() {
    const res = await axiosInstance.post("/master-schedules/generate");
    return res?.data?.data?.run ?? null;
}

export function useGenerateMasterSchedule() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: generateMasterSchedule,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: MASTER_SCHEDULE_QUERY_KEY });
        },
    });
}
