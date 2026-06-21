import { getApiErrorMessage } from "@/apis/auth/client.api";
import { useGetGradeData } from "@/apis/grade/get.api";
import { useGetLatestMasterScheduleRun } from "@/apis/master-schedule/get.api";
import { useGenerateMasterSchedule, useAssignTeacherToSlot, useDeleteTeacherFromSlot, useToggleFixedEntry } from "@/apis/master-schedule/post.api";
import { useGetScheduleTemplates } from "@/apis/schedule-template/get.api";
import { useGetTeachers } from "@/apis/teacher/get.api";
import { useGetSubjects } from "@/apis/subject/get.api";
import { BookOpen, Clock3, LoaderCircle, Sparkles, Users, X, Info, Lock, Unlock, Download } from "lucide-react";
import { useEffect, useMemo, useState, useRef } from "react";
import { useReactToPrint } from "react-to-print";

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

const runningStatuses = new Set(["pending", "processing"]);

const formatLevel = (level) => {
    if (!level) {
        return "Template";
    }

    return `${level.charAt(0).toUpperCase()}${level.slice(1)} Template`;
};

const formatPeriodType = (type) => {
    const normalized = String(type || "academic").toLowerCase();
    return normalized.charAt(0).toUpperCase() + normalized.slice(1);
};

const normalizeSubjectKey = (subject) => String(subject || "").trim().toLowerCase();

const formatWeeklyCount = (count) => `${count} ${count === 1 ? "session" : "sessions"}/week`;

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

const formatTimeSlotLabel = (timeSlot) => {
    const value = String(timeSlot || "").trim();
    const parts = value.split(/\s*-\s*/);

    if (parts.length === 2) {
        return formatTimeRange(parts[0], parts[1]);
    }

    return formatClockTime(value);
};

const subjectHighlightPalette = [
    {
        row: "bg-sky-50",
        card: "border border-sky-500/70 bg-sky-50 ring-sky-400/60 shadow-md",
        button: "border-sky-500 bg-sky-600 text-white shadow-sm",
        badge: "bg-white text-sky-700",
        swatch: "bg-sky-500",
    },
    {
        row: "bg-emerald-50",
        card: "border border-emerald-500/70 bg-emerald-50 ring-emerald-400/60 shadow-md",
        button: "border-emerald-500 bg-emerald-600 text-white shadow-sm",
        badge: "bg-white text-emerald-700",
        swatch: "bg-emerald-500",
    },
    {
        row: "bg-amber-50",
        card: "border border-amber-500/70 bg-amber-50 ring-amber-400/60 shadow-md",
        button: "border-amber-500 bg-amber-500 text-slate-950 shadow-sm",
        badge: "bg-white text-amber-800",
        swatch: "bg-amber-500",
    },
    {
        row: "bg-rose-50",
        card: "border border-rose-500/70 bg-rose-50 ring-rose-400/60 shadow-md",
        button: "border-rose-500 bg-rose-600 text-white shadow-sm",
        badge: "bg-white text-rose-700",
        swatch: "bg-rose-500",
    },
    {
        row: "bg-cyan-50",
        card: "border border-cyan-500/70 bg-cyan-50 ring-cyan-400/60 shadow-md",
        button: "border-cyan-500 bg-cyan-600 text-white shadow-sm",
        badge: "bg-white text-cyan-700",
        swatch: "bg-cyan-500",
    },
    {
        row: "bg-lime-50",
        card: "border border-lime-500/70 bg-lime-50 ring-lime-400/60 shadow-md",
        button: "border-lime-500 bg-lime-500 text-slate-950 shadow-sm",
        badge: "bg-white text-lime-800",
        swatch: "bg-lime-500",
    },
];

const subjectHighlightStyleFor = (subjectKey, subjects) => {
    const index = Math.max(
        0,
        subjects.findIndex((subject) => subject.key === subjectKey),
    );

    return subjectHighlightPalette[index % subjectHighlightPalette.length];
};

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

const buildScheduleMap = (run, selectedGradeId) => {
    const schedule = {};
    const gradeSchedule = run?.schedules?.find(
        (item) => String(item.grade_section_id) === String(selectedGradeId),
    );

    (gradeSchedule?.entries ?? []).forEach((entry) => {
        if (!schedule[entry.time_slot]) {
            schedule[entry.time_slot] = {};
        }

        schedule[entry.time_slot][entry.day] = {
            id: entry.id,
            subject: entry.subject,
            teacher: entry.teacher,
            metadata: entry.metadata,
        };
    });

    return schedule;
};

const buildGradeGroups = (gradeSections, templatesById) => {
    const groups = new Map();

    gradeSections.forEach((gradeSection) => {
        const embeddedTemplate = gradeSection.schedule_template ?? gradeSection.scheduleTemplate ?? null;
        const templateId = gradeSection.schedule_template_id
            ? String(gradeSection.schedule_template_id)
            : embeddedTemplate?.id
              ? String(embeddedTemplate.id)
              : "";
        const template = embeddedTemplate ?? templatesById[templateId];
        const groupKey = templateId || "unassigned";
        const label = template ? `${template.name} (${formatLevel(template.level)})` : "Unassigned Template";

        if (!groups.has(groupKey)) {
            groups.set(groupKey, {
                id: groupKey,
                label,
                grades: [],
            });
        }

        groups.get(groupKey).grades.push({
            id: String(gradeSection.id),
            name: gradeSection.name || [gradeSection.grade, gradeSection.section].filter(Boolean).join(" "),
            templateId,
            template,
        });
    });

    return Array.from(groups.values()).map((group) => ({
        ...group,
        grades: group.grades.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true })),
    }));
};

const getQueueStatus = (run, isQueueing) => {
    if (isQueueing) {
        return "Status: Queueing master schedule job...";
    }

    if (!run) {
        return "Status: Ready for generation";
    }

    const progress = run.total_sections ? `${run.processed_sections + run.failed_sections}/${run.total_sections}` : "0/0";

    if (runningStatuses.has(run.status)) {
        return `Status: Polling background queue... ${progress}`;
    }

    if (run.status === "completed") {
        return `Status: Latest schedule generated successfully (${progress})`;
    }

    if (run.status === "completed_with_errors") {
        return `Status: Generated with validation errors (${progress})`;
    }

    if (run.status === "failed") {
        return "Status: Generation failed";
    }

    return `Status: ${run.status}`;
};

const ClientDashboardPage = () => {
    const gradeDataQuery = useGetGradeData();
    const templatesQuery = useGetScheduleTemplates();
    const latestRunQuery = useGetLatestMasterScheduleRun({
        refetchInterval: 4000,
    });
    const generateMutation = useGenerateMasterSchedule();
    const assignMutation = useAssignTeacherToSlot();
    const deleteMutation = useDeleteTeacherFromSlot();
    const toggleFixedMutation = useToggleFixedEntry();
    const teachersQuery = useGetTeachers();
    const subjectsQuery = useGetSubjects({ status: "active" });

    const [selectedGradeId, setSelectedGradeId] = useState("");
    const [activeSlot, setActiveSlot] = useState(null);
    const [markAsFixed, setMarkAsFixed] = useState(false);
    const [suggestionSearchQuery, setSuggestionSearchQuery] = useState("");
    const [selectedSubjectKeys, setSelectedSubjectKeys] = useState([]);
    const contentRef = useRef(null);

    const templatesById = useMemo(() => {
        return (templatesQuery.data ?? []).reduce((lookup, template) => {
            lookup[String(template.id)] = template;
            return lookup;
        }, {});
    }, [templatesQuery.data]);

    const gradeGroups = useMemo(() => {
        return buildGradeGroups(gradeDataQuery.data?.gradeSections ?? [], templatesById);
    }, [gradeDataQuery.data?.gradeSections, templatesById]);

    const gradeOptions = useMemo(() => gradeGroups.flatMap((group) => group.grades), [gradeGroups]);

    useEffect(() => {
        if (gradeOptions.length === 0) {
            setSelectedGradeId("");
            return;
        }

        if (!gradeOptions.some((grade) => grade.id === selectedGradeId)) {
            setSelectedGradeId(gradeOptions[0].id);
        }
    }, [gradeOptions, selectedGradeId]);

    const selectedGrade = useMemo(() => {
        return gradeOptions.find((grade) => grade.id === selectedGradeId);
    }, [gradeOptions, selectedGradeId]);

    const selectedTemplate = selectedGrade?.template ?? (selectedGrade?.templateId ? templatesById[selectedGrade.templateId] : null);
    const days = useMemo(() => buildDays(selectedTemplate), [selectedTemplate]);
    const timeSlots = useMemo(() => buildTimeSlots(selectedTemplate), [selectedTemplate]);
    const gridTemplateColumns = `150px repeat(${Math.max(days.length, 1)}, minmax(170px, 1fr))`;
    const latestRun = latestRunQuery.data;
    const schedule = useMemo(() => buildScheduleMap(latestRun, selectedGradeId), [latestRun, selectedGradeId]);
    const selectedGradeEntries = useMemo(() => {
        const gradeSchedule = latestRun?.schedules?.find(
            (item) => String(item.grade_section_id) === String(selectedGradeId),
        );

        return gradeSchedule?.entries ?? [];
    }, [latestRun, selectedGradeId]);
    const subjectWeeklyCounts = useMemo(() => {
        const counts = new Map();

        selectedGradeEntries.forEach((entry) => {
            const subject = String(entry.subject || "").trim();
            const key = normalizeSubjectKey(subject);

            if (!key) {
                return;
            }

            const existing = counts.get(key) ?? {
                key,
                name: subject,
                count: 0,
            };

            counts.set(key, {
                ...existing,
                count: existing.count + 1,
            });
        });

        return Array.from(counts.values()).sort((a, b) => {
            if (b.count !== a.count) {
                return b.count - a.count;
            }

            return a.name.localeCompare(b.name, undefined, { numeric: true });
        });
    }, [selectedGradeEntries]);
    const selectedSubjectSet = useMemo(() => new Set(selectedSubjectKeys), [selectedSubjectKeys]);
    const selectedSubjects = useMemo(() => {
        return subjectWeeklyCounts.filter((subject) => selectedSubjectSet.has(subject.key));
    }, [selectedSubjectSet, subjectWeeklyCounts]);
    const selectedSubjectsWeeklyTotal = useMemo(() => {
        return selectedSubjects.reduce((total, subject) => total + subject.count, 0);
    }, [selectedSubjects]);
    const totalWeeklyAssignedSessions = useMemo(() => {
        return selectedGradeEntries.filter((entry) => normalizeSubjectKey(entry.subject)).length;
    }, [selectedGradeEntries]);
    const isGenerating = generateMutation.isPending || runningStatuses.has(latestRun?.status);
    const queueStatus = getQueueStatus(latestRun, generateMutation.isPending);
    const scheduleError = generateMutation.error || latestRunQuery.error || gradeDataQuery.error || templatesQuery.error;

    useEffect(() => {
        const validKeys = new Set(subjectWeeklyCounts.map((subject) => subject.key));
        const filteredKeys = selectedSubjectKeys.filter((key) => validKeys.has(key));

        if (filteredKeys.length !== selectedSubjectKeys.length) {
            setSelectedSubjectKeys(filteredKeys);
        }
    }, [selectedSubjectKeys, subjectWeeklyCounts]);

    const handleGenerate = () => {
        generateMutation.mutate();
    };

    const handleDownloadPdf = useReactToPrint({
        contentRef,
        documentTitle: `${selectedGrade?.name || 'Schedule'}_Timetable`,
        pageStyle: `
            @page { size: landscape; margin: 0.5in; }
            @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
        `,
    });

    const subjectMap = useMemo(() => {
        return (subjectsQuery.data ?? []).reduce((acc, sub) => {
            acc[String(sub.id)] = sub.name;
            return acc;
        }, {});
    }, [subjectsQuery.data]);

    const computedSuggestions = useMemo(() => {
        if (!activeSlot || !teachersQuery.data) {
            return [];
        }

        const { dayId, dayLabel, slotId, gradeId } = activeSlot;
        const teachers = teachersQuery.data;

        // 1. Calculate stats for each teacher from the latest run's schedules
        const teacherStats = {};
        (latestRun?.schedules ?? []).forEach((sectionSchedule) => {
            (sectionSchedule.entries ?? []).forEach((entry) => {
                const tName = entry.teacher;
                if (!tName) return;

                if (!teacherStats[tName]) {
                    teacherStats[tName] = {
                        isBookedAtSlot: false,
                        bookedAtSlot: null,
                        dailyClassCount: 0,
                        scheduledEntries: [],
                    };
                }

                if (entry.day === dayId) {
                    teacherStats[tName].dailyClassCount += 1;
                    if (entry.time_slot === slotId) {
                        teacherStats[tName].isBookedAtSlot = true;
                        teacherStats[tName].bookedAtSlot = {
                            ...entry,
                            grade_section: sectionSchedule.grade_section,
                            grade_section_id: sectionSchedule.grade_section_id,
                        };
                    }
                }
                teacherStats[tName].scheduledEntries.push(entry);
            });
        });

        // 2. Identify which subjects are already scheduled in this grade section on this day.
        // This is a subject/day warning, not a teacher double-booking warning.
        const scheduledSubjectsInGradeOnDay = new Map();
        const currentGradeSchedule = latestRun?.schedules?.find(
            (item) => String(item.grade_section_id) === String(gradeId),
        );
        (currentGradeSchedule?.entries ?? []).forEach((entry) => {
            if (entry.day === dayId && entry.subject) {
                scheduledSubjectsInGradeOnDay.set(entry.subject.toLowerCase(), entry);
            }
        });

        const list = [];

        teachers.forEach((teacher) => {
            const stats = teacherStats[teacher.full_name] ?? {
                isBookedAtSlot: false,
                bookedAtSlot: null,
                dailyClassCount: 0,
                scheduledEntries: [],
            };

            // Check availability according to profile settings
            const isAvailableByProfile = (() => {
                if (!teacher.availability || !teacher.availability[dayLabel]) {
                    return true;
                }
                const dayAvail = teacher.availability[dayLabel];
                if (dayAvail.active === false) {
                    return false;
                }

                if (dayAvail.start_time && dayAvail.end_time) {
                    try {
                        const timeToMinutes = (tStr) => {
                            if (!tStr) return 0;
                            const [h, m] = tStr.split(":").map(Number);
                            return h * 60 + m;
                        };
                        const [slotStartStr, slotEndStr] = slotId.split("-").map((s) => s.trim());
                        const slotStart = timeToMinutes(slotStartStr);
                        const slotEnd = timeToMinutes(slotEndStr);

                        const availStart = timeToMinutes(dayAvail.start_time);
                        const availEnd = timeToMinutes(dayAvail.end_time);

                        return slotStart >= availStart && slotEnd <= availEnd;
                    } catch (e) {
                        return true;
                    }
                }
                return true;
            })();

            // If the teacher is already teaching at this slot (double-booked), mark as conflict
            // UNLESS allow_multiple_sessions is true
            const isDoubleBookedConflict = stats.isBookedAtSlot && !teacher.allow_multiple_sessions;
            const bookedAtSlot = stats.bookedAtSlot;
            const bookedAtSlotLabel = bookedAtSlot
                ? `${bookedAtSlot.subject} in ${bookedAtSlot.grade_section ?? "another grade"} on ${
                      dayLabels[bookedAtSlot.day] ?? bookedAtSlot.day
                  } at ${formatTimeSlotLabel(bookedAtSlot.time_slot)}`
                : "another class at this exact time";

            const teacherAssignments = teacher.assignments ?? [];

            // Filter assignments that match the current grade section
            const gradeAssignments = teacherAssignments.filter(
                (a) => String(a.grade_section_id) === String(gradeId),
            );

            const hasGradeAssignment = gradeAssignments.length > 0;
            const maxDailyClasses = Number(teacher.max_daily_classes ?? 6);
            const reachedDailyLimit = stats.dailyClassCount >= maxDailyClasses;

            if (hasGradeAssignment) {
                gradeAssignments.forEach((assignment) => {
                    const subjectName = subjectMap[assignment.subject_id] || "Unknown Subject";
                    const scheduledSubjectEntry = scheduledSubjectsInGradeOnDay.get(subjectName.toLowerCase());
                    const isSubjectAlreadyScheduled = Boolean(scheduledSubjectEntry);

                    let match = 95;
                    let reason = "";
                    let badge = "";
                    let priority = 1; // 1 = First Priority (Not Assigned), 2 = Limit reached, 3 = Conflict/Profile issue

                    if (isDoubleBookedConflict) {
                        match -= 40;
                        reason = `${teacher.full_name} is already assigned to ${bookedAtSlotLabel}.`;
                        badge = "Already Booked";
                        priority = 3;
                    } else if (!isAvailableByProfile) {
                        match -= 30;
                        reason = "Slot is outside teacher's profile availability hours.";
                        badge = "Outside Hours";
                        priority = 3;
                    } else if (isSubjectAlreadyScheduled) {
                        match -= 25;
                        reason = `${subjectName} is already scheduled for this grade on ${dayLabel} at ${formatTimeSlotLabel(scheduledSubjectEntry.time_slot)} with ${scheduledSubjectEntry.teacher}. Assigning here would create another ${subjectName} class on the same day.`;
                        badge = "Already Today";
                        priority = 3;
                    } else if (reachedDailyLimit) {
                        match -= 15;
                        reason = `Teacher reached max daily classes limit (${stats.dailyClassCount}/${maxDailyClasses}).`;
                        badge = "Limit Reached";
                        priority = 2;
                    } else {
                        reason = `Assigned to teach ${subjectName}. Availability: ${stats.dailyClassCount}/${maxDailyClasses} classes today.`;
                        badge = "Available";
                        priority = 1;
                    }

                    list.push({
                        teacherName: teacher.full_name,
                        subjectName,
                        match,
                        reason,
                        priority,
                        badge,
                        teacher,
                        aiNotes: teacher.ai_context_notes,
                    });
                });
            } else {
                // Other recommendations: teacher has no assignment for this grade, but is free
                let match = 60;
                let reason = "No teaching assignment defined for this grade/section.";
                let priority = 4; // Lower priority

                if (isDoubleBookedConflict) {
                    match -= 30;
                    reason += ` Teacher is already assigned to ${bookedAtSlotLabel}.`;
                    priority = 5;
                }
                if (!isAvailableByProfile) {
                    match -= 20;
                    reason += " Also outside profile availability hours.";
                }

                list.push({
                    teacherName: teacher.full_name,
                    subjectName: "No Assignment",
                    match,
                    reason,
                    priority,
                    badge: "No Assignment",
                    teacher,
                    aiNotes: teacher.ai_context_notes,
                });
            }
        });

        // Sort: Priority first (1 is highest), then Match percentage descending
        return list.sort((a, b) => {
            if (a.priority !== b.priority) {
                return a.priority - b.priority;
            }
            return b.match - a.match;
        });
    }, [activeSlot, teachersQuery.data, latestRun, subjectMap]);

    return (
        <div className="mx-auto max-w-[1600px] space-y-6">
            <header className="rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-5 shadow-sm">
                <div className="flex flex-col justify-between gap-5 xl:flex-row xl:items-center">
                    <div>
                        <p className="font-label text-xs uppercase tracking-wider text-primary">
                            AI-Powered School Scheduling
                        </p>
                        <h2 className="mt-2 text-3xl font-semibold text-on-surface md:text-4xl">
                            Master Schedule Dashboard
                        </h2>
                        <p className="mt-2 max-w-3xl text-sm leading-6 text-on-surface-variant">
                            Review grade-level timetables, inspect hard template blocks, and use Copilot suggestions to
                            fill open teaching slots.
                        </p>
                    </div>

                    <div className="flex flex-col gap-3 sm:items-end">
                        <button
                            type="button"
                            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 font-label text-sm font-semibold text-on-primary shadow-sm transition hover:bg-primary/90 disabled:cursor-wait disabled:opacity-80"
                            disabled={isGenerating}
                            onClick={handleGenerate}
                        >
                            {isGenerating ? (
                                <>
                                    <LoaderCircle className="h-5 w-5 animate-spin" aria-hidden="true" />
                                    AI is calculating optimal placements...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="h-5 w-5" aria-hidden="true" />
                                    Generate Master Schedule (Autopilot)
                                </>
                            )}
                        </button>
                        <div className="flex items-center gap-2 text-sm text-on-surface-variant">
                            <Clock3 className="h-4 w-4 text-primary" aria-hidden="true" />
                            {queueStatus}
                        </div>
                        {scheduleError ? (
                            <p className="max-w-md text-right text-sm text-error">
                                {getApiErrorMessage(scheduleError, "Unable to load master schedule data.")}
                            </p>
                        ) : null}
                    </div>
                </div>
            </header>

            <section className="space-y-4">
                <aside className="rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-4 shadow-sm">
                    <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                        <h3 className="text-xl font-semibold text-on-surface">Grades</h3>
                        <p className="text-sm text-on-surface-variant">Select a grade to inspect its schedule.</p>
                    </div>

                    <div className="overflow-x-auto pb-1">
                        {gradeDataQuery.isLoading || templatesQuery.isLoading ? (
                            <div className="rounded-lg bg-surface-container px-4 py-3 text-sm text-on-surface-variant">
                                Loading grades...
                            </div>
                        ) : null}

                        {!gradeDataQuery.isLoading && gradeGroups.length === 0 ? (
                            <div className="rounded-lg bg-surface-container px-4 py-3 text-sm text-on-surface-variant">
                                No grade sections found.
                            </div>
                        ) : null}

                        <div className="flex min-w-max gap-3">
                            {gradeGroups.map((group) => (
                                <div key={group.id} className="flex items-center gap-2 rounded-lg bg-surface-container px-2 py-2">
                                    <div className="whitespace-nowrap px-2 font-label text-xs uppercase tracking-wider text-primary">
                                        {group.label}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {group.grades.map((grade) => {
                                            const isSelected = grade.id === selectedGradeId;

                                            return (
                                                <button
                                                    key={grade.id}
                                                    type="button"
                                                    className={`inline-flex min-h-10 items-center justify-center gap-2 whitespace-nowrap rounded-lg px-4 py-2 text-sm font-semibold transition ${
                                                        isSelected
                                                            ? "bg-primary text-on-primary"
                                                            : "text-on-surface hover:bg-surface-container-highest"
                                                    }`}
                                                    onClick={() => setSelectedGradeId(grade.id)}
                                                >
                                                    {grade.name}
                                                    {isSelected ? (
                                                        <span className="rounded-full bg-on-primary px-2 py-0.5 font-label text-[10px] uppercase text-primary">
                                                            Active
                                                        </span>
                                                    ) : null}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </aside>

                <main ref={contentRef} id="schedule-pdf-content" className="overflow-hidden rounded-xl border border-outline-variant/30 bg-surface-container-lowest shadow-sm print:shadow-none print:border-none">
                    <div className="flex flex-col justify-between gap-3 border-b border-outline-variant/30 px-5 py-4 md:flex-row md:items-center print:border-none">
                        <div>
                            <h3 className="text-2xl font-semibold text-on-surface">
                                {selectedGrade?.name ?? "Selected Grade"} Timetable
                            </h3>
                            <p className="text-sm text-on-surface-variant">
                                Schedule rows come from the assigned template periods.
                            </p>
                        </div>
                        <div className="flex items-center gap-3 print:hidden" data-html2canvas-ignore>
                            <button
                                type="button"
                                onClick={handleDownloadPdf}
                                className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 font-label text-xs text-on-primary shadow-sm transition hover:bg-primary/90"
                            >
                                <Download className="h-4 w-4" />
                                Download PDF
                            </button>
                            <div className="rounded-lg bg-secondary px-3 py-2 font-label text-xs text-on-secondary">
                                Empty cells are Copilot-enabled drop zones
                            </div>
                        </div>
                    </div>

                    {gradeOptions.length === 0 ? (
                        <div className="flex min-h-[420px] items-center justify-center px-6 text-sm text-on-surface-variant">
                            Create grade-section links before generating a master schedule.
                        </div>
                    ) : timeSlots.length === 0 ? (
                        <div className="flex min-h-[420px] items-center justify-center px-6 text-sm text-on-surface-variant">
                            Assign a schedule template with periods to this grade section.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <div className="min-w-[980px]">
                                <div
                                    className="grid border-b border-outline-variant/30 bg-surface-container"
                                    style={{ gridTemplateColumns }}
                                >
                                    <div className="px-4 py-3 font-label text-xs uppercase text-primary">Time</div>
                                    {days.map((day) => (
                                        <div
                                            key={day.id}
                                            className="border-l border-outline-variant/30 px-4 py-3 text-center font-label text-xs uppercase text-primary"
                                        >
                                            {day.label}
                                        </div>
                                    ))}
                                </div>

                                {timeSlots.map((slot) => {
                                    const isBlocked = slot.templateType !== "academic";
                                    const rowSelectedSubjectKey = days
                                        .map((day) => normalizeSubjectKey(schedule[slot.id]?.[day.id]?.subject))
                                        .find((subjectKey) => selectedSubjectSet.has(subjectKey));
                                    const rowHighlightStyle = rowSelectedSubjectKey
                                        ? subjectHighlightStyleFor(rowSelectedSubjectKey, subjectWeeklyCounts)
                                        : null;

                                    return (
                                        <div
                                            key={slot.id}
                                            className={`grid border-b border-outline-variant/20 ${
                                                isBlocked
                                                    ? "schedule-stripes bg-surface-container-highest opacity-80"
                                                    : rowHighlightStyle
                                                      ? rowHighlightStyle.row
                                                    : "bg-background"
                                            }`}
                                            style={{ gridTemplateColumns }}
                                        >
                                            <div className="flex min-h-28 items-center px-4">
                                                <div>
                                                    <div className="font-label text-sm text-on-surface">
                                                        {slot.label}
                                                    </div>
                                                    {isBlocked ? (
                                                        <div className="mt-1 font-label text-xs uppercase text-primary">
                                                            {slot.title}
                                                        </div>
                                                    ) : null}
                                                </div>
                                            </div>

                                            {days.map((day) => {
                                                const assignment = schedule[slot.id]?.[day.id];

                                                if (isBlocked) {
                                                    return (
                                                        <div
                                                            key={`${slot.id}-${day.id}`}
                                                            className="flex min-h-28 items-center justify-center border-l border-outline-variant/30 px-3 py-3"
                                                        >
                                                            <span className="rounded-lg bg-white/70 px-3 py-2 font-label text-xs uppercase text-primary">
                                                                Not droppable
                                                            </span>
                                                        </div>
                                                    );
                                                }

                                                return (
                                                    <div
                                                        key={`${slot.id}-${day.id}`}
                                                        className="min-h-28 border-l border-outline-variant/30 px-3 py-3"
                                                    >
                                                                                        {assignment ? (
                                                            (() => {
                                                                const isFixed = assignment.metadata?.is_fixed === true;
                                                                const assignmentSubjectKey = normalizeSubjectKey(assignment.subject);
                                                                const assignmentHighlightStyle = subjectHighlightStyleFor(
                                                                    assignmentSubjectKey,
                                                                    subjectWeeklyCounts,
                                                                );
                                                                const isHighlightedSubject =
                                                                    selectedSubjectSet.has(assignmentSubjectKey);
                                                                const isMutedBySubjectFilter =
                                                                    selectedSubjectSet.size > 0 && !isHighlightedSubject;
                                                                const assignmentToneClass = isHighlightedSubject
                                                                    ? assignmentHighlightStyle.card
                                                                    : isMutedBySubjectFilter
                                                                      ? "bg-white opacity-50 ring-outline-variant/20"
                                                                      : isFixed
                                                                        ? "bg-amber-50/40 border border-amber-300/60 ring-amber-300/40"
                                                                        : "bg-white ring-outline-variant/30";
                                                                const lockButtonClass = isFixed
                                                                    ? isHighlightedSubject
                                                                        ? "border border-slate-900/20 bg-white/80 text-slate-950 hover:bg-white"
                                                                        : "bg-amber-100 text-amber-700 hover:bg-amber-200"
                                                                    : "bg-surface-container text-on-surface-variant hover:bg-primary/10 hover:text-primary";
                                                                const fixedLockIconClass = isHighlightedSubject
                                                                    ? "text-slate-950"
                                                                    : "text-amber-600";

                                                                return (
                                                                    <article className={`relative group h-full rounded-xl p-4 pr-8 shadow-sm ring-1 transition ${assignmentToneClass}`}>
                                                                        <button
                                                                            type="button"
                                                                            className="absolute right-2 top-2 z-20 flex h-5 w-5 items-center justify-center rounded-full bg-error/10 text-error hover:bg-error hover:text-white transition disabled:opacity-50 pointer-events-auto cursor-pointer"
                                                                            title="Remove allocation"
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                console.log("Remove allocation clicked, assignment:", assignment);
                                                                                if (!assignment.id) {
                                                                                    alert("Error: Assignment ID is missing. Please reload the page.");
                                                                                    return;
                                                                                }
                                                                                if (window.confirm(`Remove assignment of ${assignment.teacher} for ${assignment.subject}?`)) {
                                                                                    deleteMutation.mutate(assignment.id, {
                                                                                        onSuccess: () => {
                                                                                            latestRunQuery.refetch();
                                                                                        },
                                                                                        onError: (err) => {
                                                                                            console.error("Deletion failed:", err);
                                                                                            alert(getApiErrorMessage(err, "Failed to remove allocation."));
                                                                                        }
                                                                                    });
                                                                                }
                                                                            }}
                                                                            disabled={deleteMutation.isPending}
                                                                        >
                                                                            <X className="h-3 w-3" />
                                                                        </button>

                                                                        <button
                                                                            type="button"
                                                                            className={`absolute right-2 top-8 z-20 flex h-5 w-5 items-center justify-center rounded-full transition pointer-events-auto cursor-pointer ${lockButtonClass}`}
                                                                            title={isFixed ? "Unlock entry" : "Lock entry"}
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                toggleFixedMutation.mutate(assignment.id, {
                                                                                    onSuccess: () => {
                                                                                        latestRunQuery.refetch();
                                                                                    },
                                                                                    onError: (err) => {
                                                                                        alert(getApiErrorMessage(err, "Failed to toggle lock."));
                                                                                    }
                                                                                });
                                                                            }}
                                                                            disabled={toggleFixedMutation.isPending}
                                                                        >
                                                                            {isFixed ? (
                                                                                <Lock className="h-3 w-3" />
                                                                            ) : (
                                                                                <Unlock className="h-3 w-3" />
                                                                            )}
                                                                        </button>

                                                                        <div className="flex items-center gap-1.5 flex-wrap">
                                                                            <h4 className="font-semibold text-on-surface">
                                                                                {assignment.subject}
                                                                            </h4>
                                                                            {isFixed && (
                                                                                <Lock className={`h-3.5 w-3.5 shrink-0 ${fixedLockIconClass}`} title="Fixed/Locked schedule entry" />
                                                                            )}
                                                                        </div>
                                                                        <p className="mt-2 text-sm text-on-surface-variant">
                                                                            {assignment.teacher}
                                                                        </p>
                                                                    </article>
                                                                );
                                                            })()
                                                        ) : (
                                                            <button
                                                                type="button"
                                                                className="flex h-full min-h-20 w-full items-center justify-center rounded-xl border border-dashed border-error/40 bg-error-container/20 px-3 py-4 text-center font-label text-xs uppercase text-error transition hover:bg-error-container/30"
                                                                onClick={() => {
                                                                    setMarkAsFixed(false);
                                                                    setActiveSlot({
                                                                        dayId: day.id,
                                                                        dayLabel: day.label,
                                                                        slotId: slot.id,
                                                                        slotLabel: slot.label,
                                                                        gradeId: selectedGradeId,
                                                                        gradeName: selectedGrade?.name ?? "Selected Grade",
                                                                    });
                                                                    setSuggestionSearchQuery("");
                                                                }}
                                                            >
                                                                Empty Slot
                                                            </button>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {gradeOptions.length > 0 && timeSlots.length > 0 ? (
                        <section className="border-t border-outline-variant/30 px-5 py-5 print:hidden">
                            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                                <div className="flex items-start gap-3">
                                    <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                        <BookOpen className="h-5 w-5" aria-hidden="true" />
                                    </span>
                                    <div>
                                        <h4 className="text-lg font-semibold text-on-surface">Subject Weekly Counts</h4>
                                        <p className="mt-1 text-sm text-on-surface-variant">
                                            {selectedSubjects.length === 1
                                                ? `${selectedSubjects[0].name}: ${formatWeeklyCount(selectedSubjects[0].count)} highlighted`
                                                : selectedSubjects.length > 1
                                                  ? `${selectedSubjects.length} subjects highlighted, ${formatWeeklyCount(selectedSubjectsWeeklyTotal)} total`
                                                : `${formatWeeklyCount(totalWeeklyAssignedSessions)} assigned in this timetable`}
                                        </p>
                                    </div>
                                </div>

                                {selectedSubjects.length > 0 ? (
                                    <button
                                        type="button"
                                        className="inline-flex items-center justify-center gap-2 rounded-lg border border-outline-variant/40 bg-background px-3 py-2 font-label text-xs font-semibold uppercase text-primary transition hover:border-primary/60 hover:bg-primary/5"
                                        onClick={() => setSelectedSubjectKeys([])}
                                    >
                                        <X className="h-4 w-4" aria-hidden="true" />
                                        Clear Highlights
                                    </button>
                                ) : null}
                            </div>

                            {subjectWeeklyCounts.length === 0 ? (
                                <div className="mt-4 rounded-lg border border-dashed border-outline-variant/50 bg-background px-4 py-5 text-sm text-on-surface-variant">
                                    No subjects are assigned in this timetable yet.
                                </div>
                            ) : (
                                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                                    {subjectWeeklyCounts.map((subject) => {
                                        const isSelected = selectedSubjectSet.has(subject.key);
                                        const subjectStyle = subjectHighlightStyleFor(subject.key, subjectWeeklyCounts);

                                        return (
                                            <button
                                                key={subject.key}
                                                type="button"
                                                aria-pressed={isSelected}
                                                className={`flex min-h-12 items-center justify-between gap-3 rounded-lg border px-4 py-3 text-left transition ${
                                                    isSelected
                                                        ? subjectStyle.button
                                                        : "border-outline-variant/40 bg-background text-on-surface hover:border-primary/60 hover:bg-primary/5"
                                                }`}
                                                onClick={() =>
                                                    setSelectedSubjectKeys((current) =>
                                                        current.includes(subject.key)
                                                            ? current.filter((key) => key !== subject.key)
                                                            : [...current, subject.key],
                                                    )
                                                }
                                            >
                                                <span className="flex min-w-0 items-center gap-2 text-sm font-semibold">
                                                    <span
                                                        className={`h-3 w-3 shrink-0 rounded-full ${subjectStyle.swatch}`}
                                                        aria-hidden="true"
                                                    />
                                                    <span className="truncate">{subject.name}</span>
                                                </span>
                                                <span
                                                    className={`shrink-0 rounded-full px-2.5 py-1 font-label text-[11px] uppercase ${
                                                        isSelected
                                                            ? subjectStyle.badge
                                                            : "bg-surface-container text-primary"
                                                    }`}
                                                >
                                                    {formatWeeklyCount(subject.count)}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </section>
                    ) : null}
                </main>
            </section>

            {activeSlot ? (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-inverse-surface/40 px-4">
                    <section className="w-full max-w-lg rounded-xl bg-surface-container-lowest p-6 shadow-xl max-h-[90vh] flex flex-col">
                        <div className="mb-5 flex items-start justify-between gap-4 shrink-0">
                            <div className="flex gap-3">
                                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-on-primary">
                                    <Users className="h-5 w-5" aria-hidden="true" />
                                </span>
                                <div>
                                    <h3 className="text-xl font-semibold text-on-surface">Suggest Teacher</h3>
                                    <p className="mt-1 text-sm text-on-surface-variant">
                                        {activeSlot.gradeName}, {activeSlot.dayLabel}, {activeSlot.slotLabel}
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                className="flex h-9 w-9 items-center justify-center rounded-lg text-on-surface-variant transition hover:bg-surface-container-highest"
                                aria-label="Close suggestions"
                                onClick={() => {
                                    setActiveSlot(null);
                                    setSuggestionSearchQuery("");
                                }}
                            >
                                <X className="h-5 w-5" aria-hidden="true" />
                            </button>
                        </div>

                        <div className="mb-4 shrink-0 px-1 border-b border-outline-variant/10 pb-3">
                            <label className="flex items-center gap-2 text-sm text-on-surface-variant cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    checked={markAsFixed}
                                    onChange={(e) => setMarkAsFixed(e.target.checked)}
                                    className="rounded border-outline-variant text-primary focus:ring-primary h-4 w-4"
                                />
                                <span>Lock/Fix this schedule entry (AI and Algorithm won't change this)</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Search by teacher or subject..."
                                className="mt-3 w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2 text-sm text-on-surface outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                                value={suggestionSearchQuery}
                                onChange={(e) => setSuggestionSearchQuery(e.target.value)}
                            />
                        </div>

                        <div className="space-y-3 overflow-y-auto pr-1 flex-1">
                            {teachersQuery.isLoading || subjectsQuery.isLoading ? (
                                <div className="flex flex-col items-center justify-center py-12 text-sm text-on-surface-variant gap-3">
                                    <LoaderCircle className="h-6 w-6 animate-spin text-primary" />
                                    <span>Analyzing teacher availabilities...</span>
                                </div>
                            ) : computedSuggestions.length === 0 ? (
                                <div className="text-center py-12 text-sm text-on-surface-variant">
                                    No available teachers found for this slot.
                                </div>
                            ) : (
                                computedSuggestions
                                    .filter((s) => {
                                        if (!suggestionSearchQuery.trim()) return true;
                                        const q = suggestionSearchQuery.toLowerCase();
                                        return s.teacherName.toLowerCase().includes(q) || s.subjectName.toLowerCase().includes(q);
                                    })
                                    .map((suggestion, idx) => {
                                        const isPriority1 = suggestion.priority === 1;
                                    const isPriority2 = suggestion.priority === 2;

                                    let badgeColor = "bg-slate-100 text-slate-700 border-slate-200/80";
                                    if (isPriority1) {
                                        badgeColor = "bg-emerald-50 text-emerald-700 border-emerald-200/80";
                                    } else if (isPriority2) {
                                        badgeColor = "bg-amber-50 text-amber-700 border-amber-200/80";
                                    }

                                    return (
                                        <article
                                            key={`${suggestion.teacherName}-${suggestion.subjectName}-${idx}`}
                                            className="flex flex-col justify-between gap-3 rounded-xl border border-outline-variant/30 bg-white p-4 shadow-sm sm:flex-row sm:items-start transition hover:border-primary/50"
                                        >
                                            <div className="space-y-2">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <h4 className="font-semibold text-on-surface">{suggestion.teacherName}</h4>
                                                    <span className={`rounded-full px-2.5 py-0.5 border text-[11px] font-semibold tracking-wide capitalize ${badgeColor}`}>
                                                        {suggestion.badge}
                                                    </span>
                                                    <span className="rounded-full bg-secondary px-2.5 py-0.5 font-label text-[11px] font-semibold text-on-secondary">
                                                        {suggestion.match}% match
                                                    </span>
                                                </div>
                                                <p className="text-sm font-medium text-primary">
                                                    Subject: {suggestion.subjectName}
                                                </p>
                                                <p className="text-xs text-on-surface-variant leading-relaxed">
                                                    {suggestion.reason}
                                                </p>
                                                {suggestion.aiNotes && (
                                                    <div className="mt-2 flex items-start gap-1.5 rounded-lg bg-surface-container px-2.5 py-1.5 text-[11px] text-on-surface-variant">
                                                        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                                                        <span>
                                                            <strong>AI Note:</strong> {suggestion.aiNotes}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                            <button
                                                type="button"
                                                className="rounded-lg bg-primary px-4 py-2 font-label text-xs font-semibold text-on-primary transition hover:bg-primary/90 shrink-0 flex items-center gap-1.5 disabled:opacity-85 disabled:cursor-wait"
                                                disabled={assignMutation.isPending}
                                                onClick={() => {
                                                    assignMutation.mutate({
                                                        grade_section_id: Number(activeSlot.gradeId),
                                                        day: activeSlot.dayId,
                                                        time_slot: activeSlot.slotId,
                                                        teacher: suggestion.teacherName,
                                                        subject: suggestion.subjectName,
                                                        is_fixed: markAsFixed,
                                                    }, {
                                                        onSuccess: () => {
                                                            setActiveSlot(null);
                                                            setSuggestionSearchQuery("");
                                                        },
                                                        onError: (err) => {
                                                            alert(getApiErrorMessage(err, "Failed to assign teacher."));
                                                        }
                                                    });
                                                }}
                                            >
                                                {assignMutation.isPending ? (
                                                    <LoaderCircle className="h-3 w-3 animate-spin" />
                                                ) : null}
                                                Assign
                                            </button>
                                        </article>
                                    );
                                })
                            )}
                        </div>
                    </section>
                </div>
            ) : null}
        </div>
    );
};

export default ClientDashboardPage;
