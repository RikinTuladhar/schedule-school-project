import { getApiErrorMessage } from "@/apis/auth/client.api";
import { useGetLatestMasterScheduleRun } from "@/apis/master-schedule/get.api";
import { useGetScheduleTemplates } from "@/apis/schedule-template/get.api";
import { useGetTeachers } from "@/apis/teacher/get.api";
import { useGetSubjects } from "@/apis/subject/get.api";
import { useGetGradeData } from "@/apis/grade/get.api";
import { 
    AlertTriangle, 
    BookOpen, 
    Calendar, 
    CalendarDays, 
    Clock3, 
    GraduationCap, 
    Info, 
    Printer, 
    Search, 
    Sparkles, 
    UserCheck, 
    UserRound, 
    Users 
} from "lucide-react";
import { useMemo, useState } from "react";

const defaultDayOrder = ["M", "T", "W", "Th", "F", "Sa", "Su"];

const dayLabels = {
    M: "Monday",
    T: "Tuesday",
    W: "Wednesday",
    Th: "Thursday",
    F: "Friday",
    Sa: "Saturday",
    Su: "Sunday",
};

const formatPeriodType = (type) => {
    const normalized = String(type || "academic").toLowerCase();
    return normalized.charAt(0).toUpperCase() + normalized.slice(1);
};

const formatClockTime = (time) => {
    const value = String(time || "").trim();
    const match = value.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);

    if (!match) {
        return value;
    }

    const hours = Number(match[1]);
    const minutes = match[2];

    if (Number.isNaN(hours) || hours < 0 || hours > 23) {
        return value;
    }

    const period = hours >= 12 ? "PM" : "AM";
    const displayHour = hours % 12 || 12;

    return `${displayHour}:${minutes} ${period}`;
};

const formatTimeRange = (start, end) => `${formatClockTime(start)} - ${formatClockTime(end)}`;

const buildDays = (template) => {
    let days = Array.isArray(template?.days) && template.days.length > 0 ? template.days : ["M", "T", "W", "Th", "F"];

    // Explicitly sort days to always start from Monday
    days = [...days].sort((a, b) => {
        const indexA = defaultDayOrder.indexOf(a);
        const indexB = defaultDayOrder.indexOf(b);
        return (indexA === -1 ? 99 : indexA) - (indexB === -1 ? 99 : indexB);
    });

    return days.map((day) => ({
        id: day,
        label: dayLabels[day] ?? day,
    }));
};

const buildTimeSlots = (template) => {
    if (!Array.isArray(template?.periods) || template.periods.length === 0) {
        return [];
    }

    return template.periods.map((period) => {
        const type = String(period.type || "academic").toLowerCase();
        const id = `${period.start}-${period.end}`;

        return {
            id,
            label: formatTimeRange(period.start, period.end),
            templateType: type,
            title: type === "academic" ? "" : formatPeriodType(type),
        };
    });
};

const getDisplayName = (teacher) => teacher?.full_name || "Teacher Profile";

const getInitials = (name) =>
    name
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join("") || "TR";

const ClientTeacherRoutinePage = () => {
    const teachersQuery = useGetTeachers();
    const templatesQuery = useGetScheduleTemplates();
    const latestRunQuery = useGetLatestMasterScheduleRun();
    const subjectsQuery = useGetSubjects({ status: "active" });
    const gradeDataQuery = useGetGradeData();

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedTeacherId, setSelectedTeacherId] = useState("");
    const [selectedTemplateId, setSelectedTemplateId] = useState("");

    // Build lookup table for subjects
    const subjectMap = useMemo(() => {
        return (subjectsQuery.data ?? []).reduce((acc, sub) => {
            acc[String(sub.id)] = sub.name;
            return acc;
        }, {});
    }, [subjectsQuery.data]);

    // Build list of teachers
    const teachersList = useMemo(() => {
        return teachersQuery.data ?? [];
    }, [teachersQuery.data]);

    // Filter teachers
    const filteredTeachers = useMemo(() => {
        if (!searchQuery.trim()) return teachersList;
        const normalized = searchQuery.toLowerCase();
        return teachersList.filter((t) => 
            t.full_name?.toLowerCase().includes(normalized) ||
            t.employment_type?.toLowerCase().includes(normalized)
        );
    }, [teachersList, searchQuery]);

    // Find currently selected teacher
    const selectedTeacher = useMemo(() => {
        return teachersList.find((t) => String(t.id) === String(selectedTeacherId)) || null;
    }, [teachersList, selectedTeacherId]);

    // Templates lookup
    const templates = useMemo(() => {
        return templatesQuery.data ?? [];
    }, [templatesQuery.data]);

    // Active Template selection
    const activeTemplate = useMemo(() => {
        if (templates.length === 0) return null;
        if (selectedTemplateId) {
            return templates.find((t) => String(t.id) === String(selectedTemplateId)) || templates[0];
        }
        return templates[0];
    }, [templates, selectedTemplateId]);

    // Build Days and Slots
    const days = buildDays(activeTemplate);
    const timeSlots = buildTimeSlots(activeTemplate);
    const gridTemplateColumns = `140px repeat(${Math.max(days.length, 1)}, minmax(160px, 1fr))`;

    // Map scheduled classes for the selected teacher from the latest master schedule run
    const latestRun = latestRunQuery.data;

    const teacherSchedule = useMemo(() => {
        const schedule = {};
        if (!selectedTeacher || !latestRun?.schedules) return schedule;

        const teacherName = selectedTeacher.full_name;

        latestRun.schedules.forEach((gradeSchedule) => {
            const sectionName = gradeSchedule.grade_section;
            const sectionId = gradeSchedule.grade_section_id;

            (gradeSchedule.entries ?? []).forEach((entry) => {
                if (entry.teacher === teacherName) {
                    if (!schedule[entry.time_slot]) {
                        schedule[entry.time_slot] = {};
                    }
                    schedule[entry.time_slot][entry.day] = {
                        id: entry.id,
                        subject: entry.subject,
                        gradeSection: sectionName,
                        gradeSectionId: sectionId,
                    };
                }
            });
        });

        return schedule;
    }, [selectedTeacher, latestRun]);

    // Calculate daily counts for max_daily_classes warning
    const dailyAllocationCounts = useMemo(() => {
        const counts = { M: 0, T: 0, W: 0, Th: 0, F: 0 };
        if (!selectedTeacher || !latestRun?.schedules) return counts;

        const teacherName = selectedTeacher.full_name;

        latestRun.schedules.forEach((gradeSchedule) => {
            (gradeSchedule.entries ?? []).forEach((entry) => {
                if (entry.teacher === teacherName && counts[entry.day] !== undefined) {
                    counts[entry.day] += 1;
                }
            });
        });

        return counts;
    }, [selectedTeacher, latestRun]);

    // Determine if any day exceeds the teacher's max daily limit
    const exceededDays = useMemo(() => {
        if (!selectedTeacher) return [];
        const limit = selectedTeacher.max_daily_classes || 6;
        
        return Object.entries(dailyAllocationCounts)
            .filter(([day, count]) => count > limit)
            .map(([day]) => dayLabels[day] ?? day);
    }, [selectedTeacher, dailyAllocationCounts]);

    // Total weekly assigned classes
    const totalWeeklyClasses = useMemo(() => {
        return Object.values(dailyAllocationCounts).reduce((sum, val) => sum + val, 0);
    }, [dailyAllocationCounts]);

    // Count how many sessions each teacher has assigned overall
    const teacherAssignedCountMap = useMemo(() => {
        const counts = {};
        if (!latestRun?.schedules) return counts;

        latestRun.schedules.forEach((gradeSchedule) => {
            (gradeSchedule.entries ?? []).forEach((entry) => {
                const name = entry.teacher;
                if (name) {
                    counts[name] = (counts[name] || 0) + 1;
                }
            });
        });
        return counts;
    }, [latestRun]);

    const handlePrint = () => {
        window.print();
    };

    const isLoading = 
        teachersQuery.isLoading || 
        templatesQuery.isLoading || 
        latestRunQuery.isLoading || 
        subjectsQuery.isLoading ||
        gradeDataQuery.isLoading;

    const isError = 
        teachersQuery.isError || 
        templatesQuery.isError || 
        latestRunQuery.isError || 
        subjectsQuery.isError ||
        gradeDataQuery.isError;

    const error = 
        teachersQuery.error || 
        templatesQuery.error || 
        latestRunQuery.error || 
        subjectsQuery.error ||
        gradeDataQuery.error;

    return (
        <div className="min-h-screen rounded-xl bg-background p-1 text-on-surface w-full max-w-full overflow-hidden">
            <div className="mx-auto max-w-[1440px] w-full space-y-6">
                {/* Page Title */}
                <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center print:hidden">
                    <div>
                        <p className="font-label text-xs uppercase tracking-wider text-primary">Timetable Views</p>
                        <h1 className="mt-2 text-3xl font-semibold text-on-surface">Teacher Routines</h1>
                        <p className="mt-2 max-w-2xl text-sm leading-6 text-primary">
                            View a consolidated weekly schedule for individual teachers. Monitor daily loading, free slots, and break sessions.
                        </p>
                    </div>
                </header>

                {/* Error Banner */}
                {isError && (
                    <div className="rounded-xl border border-error/20 bg-error-container/20 p-4 text-sm text-error print:hidden">
                        {getApiErrorMessage(error, "Failed to load teacher routines data.")}
                    </div>
                )}

                {isLoading ? (
                    <div className="flex h-96 items-center justify-center print:hidden">
                        <div className="flex flex-col items-center gap-3">
                            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                            <p className="text-sm font-medium text-primary">Loading teacher routines module...</p>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col gap-6 lg:flex-row min-h-[600px] w-full max-w-full overflow-hidden">
                        {/* LEFT COLUMN: Teacher Directory */}
                        <aside className="w-full lg:w-80 shrink-0 flex flex-col gap-4 rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-4 shadow-sm print:hidden">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-on-surface-variant flex items-center gap-2">
                                <Users className="h-4 w-4 text-primary" />
                                Teachers Directory
                            </h3>

                            {/* Search bar */}
                            <div className="relative">
                                <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-primary" />
                                <input
                                    type="text"
                                    placeholder="Search teacher..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full rounded-xl border border-primary/20 bg-surface-container-low py-2.5 pl-10 pr-4 text-sm text-on-surface outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                                />
                            </div>

                            {/* List of teachers */}
                            {filteredTeachers.length === 0 ? (
                                <div className="text-center py-8 text-sm text-on-surface-variant">
                                    No teachers found.
                                </div>
                            ) : (
                                <nav className="flex-1 overflow-y-auto space-y-2 max-h-[500px] lg:max-h-[600px] pr-1" aria-label="Teachers list">
                                    {filteredTeachers.map((teacher) => {
                                        const isSelected = String(teacher.id) === String(selectedTeacherId);
                                        const totalClasses = teacherAssignedCountMap[teacher.full_name] || 0;

                                        return (
                                            <button
                                                key={teacher.id}
                                                type="button"
                                                onClick={() => setSelectedTeacherId(String(teacher.id))}
                                                className={`w-full flex items-center justify-between gap-3 p-3 rounded-xl transition text-left active:scale-[0.98] ${
                                                    isSelected
                                                        ? "bg-primary text-on-primary shadow-sm"
                                                        : "bg-surface-container-low hover:bg-surface-container-high text-on-surface"
                                                }`}
                                            >
                                                <div className="flex items-center gap-3 min-w-0">
                                                    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold border ${
                                                        isSelected 
                                                            ? "bg-white/20 border-white/30 text-white" 
                                                            : "bg-primary/10 border-primary/20 text-primary"
                                                    }`}>
                                                        {getInitials(teacher.full_name)}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="font-semibold text-sm truncate leading-tight">
                                                            {teacher.full_name}
                                                        </p>
                                                        <span className={`text-[10px] uppercase font-bold tracking-wider ${
                                                            isSelected ? "text-white/80" : "text-on-surface-variant"
                                                        }`}>
                                                            {teacher.employment_type}
                                                        </span>
                                                    </div>
                                                </div>

                                                <span className={`text-[11px] font-bold rounded-full px-2 py-0.5 shrink-0 ${
                                                    isSelected 
                                                        ? "bg-white/25 text-white" 
                                                        : totalClasses > 0
                                                            ? "bg-primary-container/30 text-primary font-semibold"
                                                            : "bg-outline-variant/30 text-on-surface-variant"
                                                }`}>
                                                    {totalClasses} cls
                                                </span>
                                            </button>
                                        );
                                    })}
                                </nav>
                            )}
                        </aside>

                        {/* RIGHT COLUMN: Routine timetable */}
                        <section className="flex-1 w-full max-w-full overflow-hidden bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-6 shadow-sm min-w-0 print:border-none print:shadow-none print:p-0">
                            {!selectedTeacher ? (
                                <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center p-8">
                                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-container/30 text-primary mb-4 animate-bounce">
                                        <CalendarDays className="h-8 w-8" />
                                    </div>
                                    <h3 className="text-xl font-bold text-on-surface">No Teacher Selected</h3>
                                    <p className="mt-2 text-sm text-on-surface-variant max-w-sm mx-auto">
                                        Choose a teacher from the left directory to view their weekly teaching assignments and scheduling analytics.
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {/* Selected Teacher Header */}
                                    <div className="flex flex-col justify-between gap-4 border-b border-outline-variant/20 pb-6 sm:flex-row sm:items-center">
                                        <div className="flex items-center gap-4">
                                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-container text-on-primary-container text-lg font-bold border border-primary/20">
                                                {getInitials(selectedTeacher.full_name)}
                                            </div>
                                            <div>
                                                <h2 className="text-2xl font-bold text-on-surface">
                                                    {selectedTeacher.full_name}
                                                </h2>
                                                <p className="text-xs text-on-surface-variant capitalize">
                                                    {selectedTeacher.employment_type} &bull; Max Limit: {selectedTeacher.max_daily_classes} classes/day
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-3 print:hidden">
                                            {/* Template Selection if multiple exist */}
                                            {templates.length > 1 && (
                                                <div className="flex items-center gap-2">
                                                    <label htmlFor="template-selector" className="text-xs font-semibold text-on-surface-variant">
                                                        Template Schema:
                                                    </label>
                                                    <select
                                                        id="template-selector"
                                                        value={selectedTemplateId}
                                                        onChange={(e) => setSelectedTemplateId(e.target.value)}
                                                        className="rounded-lg border border-primary/20 bg-surface-container-low px-3 py-1.5 text-xs text-on-surface outline-none"
                                                    >
                                                        {templates.map((tpl) => (
                                                            <option key={tpl.id} value={tpl.id}>
                                                                {tpl.name} ({formatPeriodType(tpl.level)})
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            )}

                                            {/* Print Button */}
                                            <button
                                                type="button"
                                                onClick={handlePrint}
                                                className="flex items-center gap-2 rounded-xl border border-primary/20 bg-surface-container-high px-4 py-2 font-label text-sm text-primary transition-colors hover:bg-primary/10 active:scale-[0.98]"
                                            >
                                                <Printer className="h-4 w-4" />
                                                Print Routine
                                            </button>
                                        </div>
                                    </div>

                                    {/* Warnings Section (Over-scheduling detection) */}
                                    {exceededDays.length > 0 && (
                                        <div className="rounded-xl border border-error/20 bg-error-container/20 p-4 flex gap-3 text-sm text-error print:hidden">
                                            <AlertTriangle className="h-5 w-5 shrink-0 text-error animate-pulse" />
                                            <div>
                                                <p className="font-bold">Over-Scheduling Warning</p>
                                                <p className="mt-1">
                                                    This teacher exceeds their daily limit of <strong>{selectedTeacher.max_daily_classes}</strong> classes on:{" "}
                                                    <strong className="underline">{exceededDays.join(", ")}</strong>.
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Quick Metrics Bar */}
                                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 print:hidden">
                                        <div className="rounded-xl border border-outline-variant/30 bg-surface-container-low p-4 shadow-sm">
                                            <p className="font-label text-[10px] uppercase text-on-surface-variant tracking-wider">Weekly Assigned</p>
                                            <div className="mt-1 flex items-baseline gap-2">
                                                <span className="text-2xl font-bold text-primary">{totalWeeklyClasses}</span>
                                                <span className="text-xs text-on-surface-variant">classes/wk</span>
                                            </div>
                                        </div>
                                        <div className="rounded-xl border border-outline-variant/30 bg-surface-container-low p-4 shadow-sm">
                                            <p className="font-label text-[10px] uppercase text-on-surface-variant tracking-wider">Daily Limit</p>
                                            <div className="mt-1 flex items-baseline gap-2">
                                                <span className="text-2xl font-bold text-on-surface">{selectedTeacher.max_daily_classes}</span>
                                                <span className="text-xs text-on-surface-variant">classes/day</span>
                                            </div>
                                        </div>
                                        <div className="rounded-xl border border-outline-variant/30 bg-surface-container-low p-4 shadow-sm">
                                            <p className="font-label text-[10px] uppercase text-on-surface-variant tracking-wider">Employment</p>
                                            <div className="mt-1 flex items-baseline gap-2">
                                                <span className="text-lg font-bold text-on-surface capitalize">{selectedTeacher.employment_type}</span>
                                            </div>
                                        </div>
                                        <div className="rounded-xl border border-outline-variant/30 bg-surface-container-low p-4 shadow-sm">
                                            <p className="font-label text-[10px] uppercase text-on-surface-variant tracking-wider font-semibold">Conflict status</p>
                                            <div className="mt-1.5 flex items-center gap-1.5">
                                                {exceededDays.length > 0 ? (
                                                    <span className="inline-flex items-center gap-1 text-xs font-bold text-error bg-error/10 rounded-full px-2.5 py-0.5">
                                                        Overloaded
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-500/10 rounded-full px-2.5 py-0.5">
                                                        <UserCheck className="h-3 w-3" /> Balanced
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Print Header (Only visible during print) */}
                                    <div className="hidden print:block mb-6 border-b-2 border-primary/20 pb-4">
                                        <h1 className="text-3xl font-bold text-primary">EduSched AI Timetable</h1>
                                        <h2 className="text-xl font-semibold text-on-surface mt-1">
                                            Weekly Teaching Schedule: {selectedTeacher.full_name}
                                        </h2>
                                        <p className="text-xs text-on-surface-variant mt-1">
                                            Employment Type: {selectedTeacher.employment_type} | Weekly Loading: {totalWeeklyClasses} classes | Daily Limit: {selectedTeacher.max_daily_classes}
                                        </p>
                                    </div>

                                    {/* TIMETABLE ROUTINE GRID */}
                                    <div className="overflow-x-auto border border-outline-variant/20 rounded-2xl bg-surface shadow-inner">
                                        <div className="min-w-[800px]">
                                            {/* Header Row */}
                                            <div 
                                                className="grid border-b border-outline-variant/30 bg-surface-container-low text-on-surface font-semibold"
                                                style={{ gridTemplateColumns }}
                                            >
                                                <div className="px-4 py-3 font-label text-xs uppercase text-primary">Time Slot</div>
                                                {days.map((day) => (
                                                    <div
                                                        key={day.id}
                                                        className="border-l border-outline-variant/30 px-4 py-3 text-center font-label text-xs uppercase text-primary"
                                                    >
                                                        {day.label}
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Timetable Rows */}
                                            {timeSlots.map((slot) => {
                                                const isBlocked = slot.templateType !== "academic";

                                                return (
                                                    <div
                                                        key={slot.id}
                                                        className={`grid border-b border-outline-variant/10 ${
                                                            isBlocked
                                                                ? "schedule-stripes bg-surface-container-highest opacity-70"
                                                                : "bg-surface-container-lowest"
                                                        }`}
                                                        style={{ gridTemplateColumns }}
                                                    >
                                                        {/* Slot Label column */}
                                                        <div className="flex min-h-24 items-center px-4">
                                                            <div>
                                                                <div className="font-label text-xs text-on-surface font-bold">
                                                                    {slot.label}
                                                                </div>
                                                                {isBlocked && (
                                                                    <div className="mt-1 font-label text-[9px] uppercase tracking-wider text-primary font-bold">
                                                                        {slot.title}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* Day columns */}
                                                        {days.map((day) => {
                                                            const assignment = teacherSchedule[slot.id]?.[day.id];

                                                            if (isBlocked) {
                                                                return (
                                                                    <div
                                                                        key={`${slot.id}-${day.id}`}
                                                                        className="flex min-h-24 items-center justify-center border-l border-outline-variant/20 px-2 py-2"
                                                                    >
                                                                        <span className="rounded bg-primary/10 px-2 py-1 font-label text-[10px] uppercase text-primary font-bold">
                                                                            {slot.title}
                                                                        </span>
                                                                    </div>
                                                                );
                                                            }

                                                            return (
                                                                <div
                                                                    key={`${slot.id}-${day.id}`}
                                                                    className="min-h-24 border-l border-outline-variant/20 px-3 py-3"
                                                                >
                                                                    {assignment ? (
                                                                        <article className="h-full rounded-xl bg-primary/5 p-3 shadow-sm ring-1 ring-primary/25 border-l-4 border-primary transition-all hover:bg-primary/10 flex flex-col justify-between">
                                                                            <div>
                                                                                <h4 className="font-bold text-sm text-on-surface leading-snug">
                                                                                    {assignment.subject}
                                                                                </h4>
                                                                                <p className="mt-1 inline-flex items-center gap-1 text-[11px] font-bold text-primary uppercase">
                                                                                    <GraduationCap className="h-3 w-3 shrink-0" />
                                                                                    {assignment.gradeSection}
                                                                                </p>
                                                                            </div>
                                                                        </article>
                                                                    ) : (
                                                                        <div className="flex h-full items-center justify-center border border-dashed border-outline-variant/30 rounded-xl bg-background/30">
                                                                            <span className="font-label text-[10px] text-on-surface-variant/40 font-semibold uppercase tracking-wider">
                                                                                Free
                                                                            </span>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Availability & Notes Summary details card */}
                                    {selectedTeacher.ai_context_notes && (
                                        <div className="rounded-xl bg-surface-container-low p-4 border border-outline-variant/30 print:hidden">
                                            <h4 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                                <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                                                Staff Scheduling Rules & Context
                                            </h4>
                                            <p className="text-sm leading-relaxed text-on-surface">
                                                {selectedTeacher.ai_context_notes}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </section>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ClientTeacherRoutinePage;
