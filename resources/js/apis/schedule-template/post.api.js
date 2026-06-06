import axiosInstance from "@/apis/axiosInstance";
import { SCHEDULE_TEMPLATES_QUERY_KEY } from "@/apis/schedule-template/get.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export async function createScheduleTemplate(payload) {
    const res = await axiosInstance.post("/schedule-templates", payload);
    return res?.data?.data?.schedule_template ?? null;
}

export function useCreateScheduleTemplate() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createScheduleTemplate,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: SCHEDULE_TEMPLATES_QUERY_KEY });
        },
    });
}
