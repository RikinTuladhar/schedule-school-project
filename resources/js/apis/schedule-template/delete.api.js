import axiosInstance from "@/apis/axiosInstance";
import { SCHEDULE_TEMPLATES_QUERY_KEY } from "@/apis/schedule-template/get.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export async function deleteScheduleTemplate(templateId) {
    await axiosInstance.delete(`/schedule-templates/${templateId}`);
    return templateId;
}

export function useDeleteScheduleTemplate() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteScheduleTemplate,
        onSuccess: (templateId) => {
            queryClient.invalidateQueries({ queryKey: SCHEDULE_TEMPLATES_QUERY_KEY });
            queryClient.removeQueries({ queryKey: [...SCHEDULE_TEMPLATES_QUERY_KEY, templateId] });
        },
    });
}
