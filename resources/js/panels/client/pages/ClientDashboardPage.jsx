import { getApiErrorMessage } from "@/apis/auth/client.api";
import { useGetGradeData } from "@/apis/grade/get.api";
import { useGetLatestMasterScheduleRun } from "@/apis/master-schedule/get.api";
import { useGenerateMasterSchedule } from "@/apis/master-schedule/post.api";
import { useGetScheduleTemplates } from "@/apis/schedule-template/get.api";
import { Clock3, LoaderCircle, Sparkles, Users, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const defaultDayOrder = ["M", "T", "W", "Th", "F"];

const dayLabels = {
    M: "Monday",
    T: "Tuesday",
    W: "Wednesday",
    Th: "Thursday",
    F: "Friday",
};

const suggestions = [
    { name: "Available Teacher A", match: 96, reason: "Subject load and availability match" },
    { name: "Available Teacher B", match: 91, reason: "No back-to-back conflict detected" },
    { name: "Available Teacher C", match: 87, reason: "Meets grade-level preference" },
];

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
            subject: entry.subject,
            teacher: entry.teacher,
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

    const [selectedGradeId, setSelectedGradeId] = useState("");
    const [activeSlot, setActiveSlot] = useState(null);

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

                <main className="overflow-hidden rounded-xl border border-outline-variant/30 bg-surface-container-lowest shadow-sm">
                    <div className="flex flex-col justify-between gap-3 border-b border-outline-variant/30 px-5 py-4 md:flex-row md:items-center">
                        <div>
                            <h3 className="text-2xl font-semibold text-on-surface">
                                {selectedGrade?.name ?? "Selected Grade"} Timetable
                            </h3>
                            <p className="text-sm text-on-surface-variant">
                                Schedule rows come from the assigned template periods.
                            </p>
                        </div>
                        <div className="rounded-lg bg-secondary px-3 py-2 font-label text-xs text-on-secondary">
                            Empty cells are Copilot-enabled drop zones
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
                                                            <article className="h-full rounded-xl bg-white p-4 shadow-sm ring-1 ring-outline-variant/30">
                                                                <h4 className="font-semibold text-on-surface">
                                                                    {assignment.subject}
                                                                </h4>
                                                                <p className="mt-2 text-sm text-on-surface-variant">
                                                                    {assignment.teacher}
                                                                </p>
                                                            </article>
                                                        ) : (
                                                            <button
                                                                type="button"
                                                                className="flex h-full min-h-20 w-full items-center justify-center rounded-xl border border-dashed border-primary bg-surface-container-lowest px-3 py-4 text-center font-label text-xs uppercase text-primary transition hover:bg-surface-container-highest"
                                                                onClick={() =>
                                                                    setActiveSlot({
                                                                        day: day.label,
                                                                        time: slot.label,
                                                                        grade: selectedGrade?.name ?? "Selected Grade",
                                                                    })
                                                                }
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
                    <section className="w-full max-w-lg rounded-xl bg-surface-container-lowest p-6 shadow-xl">
                        <div className="mb-5 flex items-start justify-between gap-4">
                            <div className="flex gap-3">
                                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-on-primary">
                                    <Users className="h-5 w-5" aria-hidden="true" />
                                </span>
                                <div>
                                    <h3 className="text-xl font-semibold text-on-surface">Suggest Teacher</h3>
                                    <p className="mt-1 text-sm text-on-surface-variant">
                                        {activeSlot.grade}, {activeSlot.day}, {activeSlot.time}
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

                        <div className="space-y-3">
                            {suggestions.map((teacher) => (
                                <article
                                    key={teacher.name}
                                    className="flex flex-col justify-between gap-3 rounded-xl border border-outline-variant/30 bg-white p-4 shadow-sm sm:flex-row sm:items-center"
                                >
                                    <div>
                                        <div className="flex flex-wrap items-center gap-2">
                                            <h4 className="font-semibold text-on-surface">{teacher.name}</h4>
                                            <span className="rounded-full bg-secondary px-2.5 py-1 font-label text-xs font-semibold text-on-secondary">
                                                {teacher.match}% match
                                            </span>
                                        </div>
                                        <p className="mt-1 text-sm text-on-surface-variant">{teacher.reason}</p>
                                    </div>
                                    <button
                                        type="button"
                                        className="rounded-lg bg-primary px-4 py-2 font-label text-xs font-semibold text-on-primary transition hover:bg-primary/90"
                                        onClick={() => setActiveSlot(null)}
                                    >
                                        Assign
                                    </button>
                                </article>
                            ))}
                        </div>
                    </section>
                </div>
            ) : null}
        </div>
    );
};

export default ClientDashboardPage;
