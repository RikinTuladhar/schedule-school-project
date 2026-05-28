import axiosInstance from "@/apis/axiosInstance";
import { GRADE_DATA_QUERY_KEY } from "@/apis/grade/get.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export async function updateGrade({ gradeId, payload }) {
    const res = await axiosInstance.put(`/grades/${gradeId}`, payload);
    return res?.data?.data?.grade ?? null;
}

export async function updateSection({ sectionId, payload }) {
    const res = await axiosInstance.put(`/sections/${sectionId}`, payload);
    return res?.data?.data?.section ?? null;
}

export async function updateGradeSection({ gradeSectionId, payload }) {
    const res = await axiosInstance.put(`/grade-sections/${gradeSectionId}`, payload);
    return res?.data?.data?.grade_section ?? null;
}

export function useUpdateGrade() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateGrade,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: GRADE_DATA_QUERY_KEY });
        },
    });
}

export function useUpdateSection() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateSection,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: GRADE_DATA_QUERY_KEY });
        },
    });
}

export function useUpdateGradeSection() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateGradeSection,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: GRADE_DATA_QUERY_KEY });
        },
    });
}
