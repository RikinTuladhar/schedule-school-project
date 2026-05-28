import axiosInstance from "@/apis/axiosInstance";
import { SUBJECTS_QUERY_KEY } from "@/apis/subject/get.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export async function deleteSubject(subjectId) {
    await axiosInstance.delete(`/subjects/${subjectId}`);
    return subjectId;
}

export function useDeleteSubject() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteSubject,
        onSuccess: (subjectId) => {
            queryClient.invalidateQueries({ queryKey: SUBJECTS_QUERY_KEY });
            queryClient.removeQueries({ queryKey: [...SUBJECTS_QUERY_KEY, subjectId] });
        },
    });
}
