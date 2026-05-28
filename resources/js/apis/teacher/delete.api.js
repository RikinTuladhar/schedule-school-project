import axiosInstance from "@/apis/axiosInstance";
import { TEACHERS_QUERY_KEY } from "@/apis/teacher/get.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export async function deleteTeacher(teacherId) {
    await axiosInstance.delete(`/teachers/${teacherId}`);
    return teacherId;
}

export function useDeleteTeacher() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteTeacher,
        onSuccess: (teacherId) => {
            queryClient.invalidateQueries({ queryKey: TEACHERS_QUERY_KEY });
            queryClient.removeQueries({ queryKey: [...TEACHERS_QUERY_KEY, teacherId] });
        },
    });
}
