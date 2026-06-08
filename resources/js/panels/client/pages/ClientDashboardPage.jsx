import { getApiErrorMessage } from "@/apis/auth/client.api";
import { useGetGradeData } from "@/apis/grade/get.api";
import { useGetLatestMasterScheduleRun } from "@/apis/master-schedule/get.api";
import { useGenerateMasterSchedule, useAssignTeacherToSlot, useDeleteTeacherFromSlot, useToggleFixedEntry } from "@/apis/master-schedule/post.api";
import { useGetScheduleTemplates } from "@/apis/schedule-template/get.api";
import { useGetTeachers } from "@/apis/teacher/get.api";
import { useGetSubjects } from "@/apis/subject/get.api";
import { Clock3, LoaderCircle, Sparkles, Users, X, Info, Lock, Unlock, Download } from "lucide-react";
import { useEffect, useMemo, useState, useRef } from "react";
import { useReactToPrint } from "react-to-print";

const defaultDayOrder = ["M", "T", "W", "Th", "F"];

const dayLabels = {
    M: "Monday",
    T: "Tuesday",
    W: "Wednesday",
    Th: "Thursday",
    F: "Friday",
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

const buildDays = (template) => {
    const days = Array.isArray(template?.days) && template.days.length > 0 ? template.days : defaultDayOrder;

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
            label: `${period.start} - ${period.end}`,
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
    const isGenerating = generateMutation.isPending || runningStatuses.has(latestRun?.status);
    const queueStatus = getQueueStatus(latestRun, generateMutation.isPending);
    const scheduleError = generateMutation.error || latestRunQuery.error || gradeDataQuery.error || templatesQuery.error;

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
                        dailyClassCount: 0,
                        scheduledEntries: [],
                    };
                }

                if (entry.day === dayId) {
                    teacherStats[tName].dailyClassCount += 1;
                    if (entry.time_slot === slotId) {
                        teacherStats[tName].isBookedAtSlot = true;
                    }
                }
                teacherStats[tName].scheduledEntries.push(entry);
            });
        });

        // 2. Identify which subjects are already scheduled in this grade section on this day
        // to respect constraint: max one subject session per day per class
        const scheduledSubjectsInGradeOnDay = new Set();
        const currentGradeSchedule = latestRun?.schedules?.find(
            (item) => String(item.grade_section_id) === String(gradeId),
        );
        (currentGradeSchedule?.entries ?? []).forEach((entry) => {
            if (entry.day === dayId && entry.subject) {
                scheduledSubjectsInGradeOnDay.add(entry.subject.toLowerCase());
            }
        });

        const list = [];

        teachers.forEach((teacher) => {
            const stats = teacherStats[teacher.full_name] ?? {
                isBookedAtSlot: false,
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

            // If the teacher is already teaching at this slot (double-booked), exclude them
            if (stats.isBookedAtSlot) {
                return;
            }

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
                    const isSubjectAlreadyScheduled = scheduledSubjectsInGradeOnDay.has(subjectName.toLowerCase());

                    let match = 95;
                    let reason = "";
                    let priority = 1; // 1 = First Priority (Not Assigned), 2 = Limit reached, 3 = Conflict/Profile issue

                    if (!isAvailableByProfile) {
                        match -= 30;
                        reason = "Slot is outside teacher's profile availability hours.";
                        priority = 3;
                    } else if (isSubjectAlreadyScheduled) {
                        match -= 25;
                        reason = `Subject ${subjectName} is already scheduled in this grade today.`;
                        priority = 3;
                    } else if (reachedDailyLimit) {
                        match -= 15;
                        reason = `Teacher reached max daily classes limit (${stats.dailyClassCount}/${maxDailyClasses}).`;
                        priority = 2;
                    } else {
                        reason = `Assigned to teach ${subjectName}. Availability: ${stats.dailyClassCount}/${maxDailyClasses} classes today.`;
                        priority = 1;
                    }

                    list.push({
                        teacherName: teacher.full_name,
                        subjectName,
                        match,
                        reason,
                        priority,
                        badge: priority === 1 ? "Not Assigned" : priority === 2 ? "Limit Reached" : "Conflict/Inactive",
                        teacher,
                        aiNotes: teacher.ai_context_notes,
                    });
                });
            } else {
                // Other recommendations: teacher has no assignment for this grade, but is free
                let match = 60;
                let reason = "No teaching assignment defined for this grade/section.";
                let priority = 4; // Lower priority

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

            <section className="grid grid-cols-1 gap-6 xl:grid-cols-[300px_minmax(0,1fr)]">
                <aside className="max-h-[calc(100vh-180px)] overflow-y-auto rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-4 shadow-sm">
                    <div className="mb-4">
                        <h3 className="text-xl font-semibold text-on-surface">Grades</h3>
                        <p className="text-sm text-on-surface-variant">Select a grade to inspect its schedule.</p>
                    </div>

                    <div className="space-y-6">
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

                        {gradeGroups.map((group) => (
                            <div key={group.id}>
                                <div className="mb-2 px-2 font-label text-xs uppercase tracking-wider text-primary">
                                    {group.label}
                                </div>
                                <div className="space-y-2">
                                    {group.grades.map((grade) => {
                                        const isSelected = grade.id === selectedGradeId;

                                        return (
                                            <button
                                                key={grade.id}
                                                type="button"
                                                className={`flex w-full items-center justify-between rounded-lg px-4 py-3 text-left text-sm font-semibold transition ${
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

                                    return (
                                        <div
                                            key={slot.id}
                                            className={`grid border-b border-outline-variant/20 ${
                                                isBlocked
                                                    ? "schedule-stripes bg-surface-container-highest opacity-80"
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
                                                                return (
                                                                    <article className={`relative group h-full rounded-xl p-4 pr-8 shadow-sm ring-1 transition ${
                                                                        isFixed
                                                                            ? "bg-amber-50/40 border border-amber-300/60 ring-amber-300/40"
                                                                            : "bg-white ring-outline-variant/30"
                                                                    }`}>
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
                                                                            className={`absolute right-2 top-8 z-20 flex h-5 w-5 items-center justify-center rounded-full transition pointer-events-auto cursor-pointer ${
                                                                                isFixed
                                                                                    ? "bg-amber-100 text-amber-700 hover:bg-amber-200"
                                                                                    : "bg-surface-container text-on-surface-variant hover:bg-primary/10 hover:text-primary"
                                                                            }`}
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
                                                                                <Lock className="h-3.5 w-3.5 text-amber-600 shrink-0" title="Fixed/Locked schedule entry" />
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
                                                                className="flex h-full min-h-20 w-full items-center justify-center rounded-xl border border-dashed border-primary bg-surface-container-lowest px-3 py-4 text-center font-label text-xs uppercase text-primary transition hover:bg-surface-container-highest"
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
                                onClick={() => setActiveSlot(null)}
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
                                computedSuggestions.map((suggestion, idx) => {
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
                                                        metadata: { is_fixed: markAsFixed }
                                                    }, {
                                                        onSuccess: () => {
                                                            setActiveSlot(null);
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

