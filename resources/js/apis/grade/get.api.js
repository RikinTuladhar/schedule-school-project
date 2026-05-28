import axiosInstance from "@/apis/axiosInstance";
import { useQuery } from "@tanstack/react-query";

export const GRADE_DATA_QUERY_KEY = ["grade-data"];

export async function getGradeData() {
    const res = await axiosInstance.get("/grade-data");
    const data = res?.data?.data ?? {};

    return {
        grades: data.grades ?? [],
        sections: data.sections ?? [],
        gradeSections: data.grade_sections ?? [],
    };
}

export function useGetGradeData(options = {}) {
    return useQuery({
        queryKey: GRADE_DATA_QUERY_KEY,
        queryFn: getGradeData,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        refetchOnWindowFocus: false,
        ...options,
    });
}
