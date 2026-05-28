import axiosInstance from "@/apis/axiosInstance";
import { GRADE_DATA_QUERY_KEY } from "@/apis/grade/get.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export async function deleteGrade(gradeId) {
    await axiosInstance.delete(`/grades/${gradeId}`);
    return gradeId;
}

export async function deleteSection(sectionId) {
    await axiosInstance.delete(`/sections/${sectionId}`);
    return sectionId;
}

export async function deleteGradeSection(gradeSectionId) {
    await axiosInstance.delete(`/grade-sections/${gradeSectionId}`);
    return gradeSectionId;
}

export function useDeleteGrade() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteGrade,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: GRADE_DATA_QUERY_KEY });
        },
    });
}

export function useDeleteSection() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteSection,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: GRADE_DATA_QUERY_KEY });
        },
    });
}

export function useDeleteGradeSection() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteGradeSection,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: GRADE_DATA_QUERY_KEY });
        },
    });
}
