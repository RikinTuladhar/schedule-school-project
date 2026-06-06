import axiosInstance from "@/apis/axiosInstance";
import { SCHEDULE_TEMPLATES_QUERY_KEY } from "@/apis/schedule-template/get.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export async function updateScheduleTemplate({ templateId, payload }) {
    const res = await axiosInstance.put(`/schedule-templates/${templateId}`, payload);
    return res?.data?.data?.schedule_template ?? null;
}

export function useUpdateScheduleTemplate() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateScheduleTemplate,
        onSuccess: (template) => {
            queryClient.invalidateQueries({ queryKey: SCHEDULE_TEMPLATES_QUERY_KEY });

            if (template?.id) {
                queryClient.setQueryData([...SCHEDULE_TEMPLATES_QUERY_KEY, template.id], template);
            }
        },
    });
}
