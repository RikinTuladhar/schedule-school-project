import axiosInstance from "@/apis/axiosInstance";
import { GRADE_DATA_QUERY_KEY } from "@/apis/grade/get.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export async function createGrade(payload) {
    const res = await axiosInstance.post("/grades", payload);
    return res?.data?.data?.grade ?? null;
}

export async function createSection(payload) {
    const res = await axiosInstance.post("/sections", payload);
    return res?.data?.data?.section ?? null;
}

export async function createGradeSection(payload) {
    const res = await axiosInstance.post("/grade-sections", payload);
    return res?.data?.data?.grade_section ?? null;
}

export function useCreateGrade() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createGrade,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: GRADE_DATA_QUERY_KEY });
        },
    });
}

export function useCreateSection() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createSection,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: GRADE_DATA_QUERY_KEY });
        },
    });
}

export function useCreateGradeSection() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createGradeSection,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: GRADE_DATA_QUERY_KEY });
        },
    });
}
