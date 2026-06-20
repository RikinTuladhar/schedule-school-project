import axiosInstance from "@/apis/axiosInstance";
import { MASTER_SCHEDULE_QUERY_KEY } from "@/apis/master-schedule/get.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export async function generateMasterSchedule() {
    const res = await axiosInstance.post("/master-schedules/generate");
    return res?.data?.data?.run ?? null;
}

export function useGenerateMasterSchedule() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: generateMasterSchedule,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: MASTER_SCHEDULE_QUERY_KEY });
        },
    });
}

export async function assignTeacherToSlot({ grade_section_id, day, time_slot, teacher, subject, is_fixed = false }) {
    const res = await axiosInstance.post("/master-schedules/assign", {
        grade_section_id,
        day,
        time_slot,
        teacher,
        subject,
        is_fixed,
    });
    return res?.data?.data?.entry ?? null;
}

export function useAssignTeacherToSlot() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: assignTeacherToSlot,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: MASTER_SCHEDULE_QUERY_KEY });
        },
    });
}

export async function deleteTeacherFromSlot(entryId) {
    const res = await axiosInstance.delete(`/master-schedules/entries/${entryId}`);
    return res?.data ?? null;
}

export function useDeleteTeacherFromSlot() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteTeacherFromSlot,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: MASTER_SCHEDULE_QUERY_KEY });
        },
    });
}

export async function toggleFixedEntry(entryId) {
    const res = await axiosInstance.patch(`/master-schedules/entries/${entryId}/toggle-fixed`);
    return res?.data?.data?.entry ?? null;
}

export function useToggleFixedEntry() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: toggleFixedEntry,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: MASTER_SCHEDULE_QUERY_KEY });
        },
    });
}
