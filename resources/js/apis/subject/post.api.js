import axiosInstance from "@/apis/axiosInstance";
import { SUBJECTS_QUERY_KEY } from "@/apis/subject/get.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export async function createSubject(payload) {
    const res = await axiosInstance.post("/subjects", payload);
    return res?.data?.data?.subject ?? null;
}

export function useCreateSubject() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createSubject,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: SUBJECTS_QUERY_KEY });
        },
    });
}
