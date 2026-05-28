import axiosInstance from "@/apis/axiosInstance";
import { TEACHERS_QUERY_KEY } from "@/apis/teacher/get.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export async function updateTeacher({ teacherId, payload }) {
    const res = await axiosInstance.put(`/teachers/${teacherId}`, payload);
    return res?.data?.data?.teacher ?? null;
}

export function useUpdateTeacher() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateTeacher,
        onSuccess: (teacher) => {
            queryClient.invalidateQueries({ queryKey: TEACHERS_QUERY_KEY });

            if (teacher?.id) {
                queryClient.setQueryData([...TEACHERS_QUERY_KEY, teacher.id], teacher);
            }
        },
    });
}
