import axiosInstance from "@/apis/axiosInstance";
import { SUBJECTS_QUERY_KEY } from "@/apis/subject/get.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export async function updateSubject({ subjectId, payload }) {
    const res = await axiosInstance.put(`/subjects/${subjectId}`, payload);
    return res?.data?.data?.subject ?? null;
}

export function useUpdateSubject() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateSubject,
        onSuccess: (subject) => {
            queryClient.invalidateQueries({ queryKey: SUBJECTS_QUERY_KEY });

            if (subject?.id) {
                queryClient.setQueryData([...SUBJECTS_QUERY_KEY, subject.id], subject);
            }
        },
    });
}
