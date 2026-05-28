import axiosInstance from "@/apis/axiosInstance";
import { TEACHERS_QUERY_KEY } from "@/apis/teacher/get.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export async function createTeacher(payload) {
    const res = await axiosInstance.post("/teachers", payload);
    return res?.data?.data?.teacher ?? null;
}

export function useCreateTeacher() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createTeacher,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: TEACHERS_QUERY_KEY });
        },
    });
}
