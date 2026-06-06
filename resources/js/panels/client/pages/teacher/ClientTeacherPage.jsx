import { getApiErrorMessage } from "@/apis/auth/client.api";
import { useGetGradeData } from "@/apis/grade/get.api";
import { useGetSubjects } from "@/apis/subject/get.api";
import { useDeleteTeacher } from "@/apis/teacher/delete.api";
import { useGetTeachers } from "@/apis/teacher/get.api";
import { useCreateTeacher } from "@/apis/teacher/post.api";
import { useUpdateTeacher } from "@/apis/teacher/update.api";
import ManagementDataTable from "@/panels/client/components/ManagementDataTable";
import { CalendarDays, Check, Plus, Save, Search, Trash2, UserRound, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

const inputClassName =
    "w-full rounded-xl border border-primary bg-background px-4 py-3 text-sm text-on-surface outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20";

const sectionClassName = "rounded-xl border border-primary/20 bg-surface-container p-5 shadow-sm";

const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

const createRowId = () => globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;

const createInitialAvailability = () =>
    weekdays.reduce((days, day) => {
        days[day] = {
            active: ["Monday", "Tuesday", "Wednesday", "Thursday"].includes(day),
            start_time: "09:30",
            end_time: "15:00",
        };
        return days;
    }, {});

const createAssignment = (gradeSectionId = "", subjectId = "") => ({
    id: createRowId(),
    subject_id: subjectId,
    grade_section_ids: gradeSectionId ? [gradeSectionId] : [],
    sessions_per_week: 5,
    max_sessions_per_day: 1,
});

const createInitialProfile = () => ({
    full_name: "",
    employment_type: "full-time",
    max_daily_classes: 6,
    ai_context_notes: "",
});

const normalizeAvailability = (availability) => ({
    ...createInitialAvailability(),
    ...(availability && typeof availability === "object" ? availability : {}),
});

const normalizeAssignments = (assignments, fallbackGradeSectionId = "", fallbackSubjectId = "") => {
    if (!Array.isArray(assignments) || assignments.length === 0) {
        return [createAssignment(fallbackGradeSectionId, fallbackSubjectId)];
    }

    const groupedAssignments = new Map();

    assignments.forEach((assignment) => {
        const subjectId = assignment.subject_id ? String(assignment.subject_id) : fallbackSubjectId;
        const sessionsPerWeek = assignment.sessions_per_week ?? 5;
        const maxSessionsPerDay = assignment.max_sessions_per_day ?? 1;
        const key = [subjectId, sessionsPerWeek, maxSessionsPerDay].join("|");
        const gradeSectionId = assignment.grade_section_id ? String(assignment.grade_section_id) : fallbackGradeSectionId;

        if (!groupedAssignments.has(key)) {
            groupedAssignments.set(key, {
                id: assignment.id ?? createRowId(),
                subject_id: subjectId,
                grade_section_ids: [],
                sessions_per_week: sessionsPerWeek,
                max_sessions_per_day: maxSessionsPerDay,
            });
        }

        if (gradeSectionId) {
            groupedAssignments.get(key).grade_section_ids.push(gradeSectionId);
        }
    });

    return Array.from(groupedAssignments.values()).map((assignment) => ({
        ...assignment,
        grade_section_ids: Array.from(new Set(assignment.grade_section_ids)),
    }));
};

const buildTeacherPayload = (profile, availability, assignments) => ({
    full_name: profile.full_name.trim(),
    employment_type: profile.employment_type,
    max_daily_classes: Number(profile.max_daily_classes),
    ai_context_notes: profile.ai_context_notes?.trim() || null,
    availability,
    assignments: assignments.flatMap((assignment) =>
        assignment.grade_section_ids.map((gradeSectionId) => ({
            subject_id: assignment.subject_id,
            grade_section_id: gradeSectionId,
            sessions_per_week: Number(assignment.sessions_per_week),
            max_sessions_per_day: Number(assignment.max_sessions_per_day),
        })),
    ),
});

const SearchableSelect = ({ disabled = false, emptyLabel, label, loadingLabel, options, value, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState("");
    const selectedOption = options.find((option) => option.id === value);
    const filteredOptions = options.filter((option) => option.name.toLowerCase().includes(query.trim().toLowerCase()));

    return (
        <div className="relative">
            <span className="mb-2 block text-sm font-semibold">{label}</span>
            <button
                type="button"
                className={`${inputClassName} flex min-h-12 items-center justify-between text-left disabled:cursor-not-allowed disabled:opacity-70`}
                disabled={disabled}
                onClick={() => setIsOpen((current) => !current)}
            >
                <span className={selectedOption ? "" : "text-primary/70"}>
                    {selectedOption?.name ?? (disabled ? loadingLabel || emptyLabel : emptyLabel)}
                </span>
                <Search className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
            </button>

            {isOpen ? (
                <div className="absolute z-30 mt-2 w-full rounded-xl border border-primary/30 bg-surface-container-lowest p-2 shadow-lg">
                    <div className="relative">
                        <Search
                            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary"
                            aria-hidden="true"
                        />
                        <input
                            className="w-full rounded-lg border border-outline-variant bg-background py-2 pl-9 pr-3 text-sm text-on-surface outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                            value={query}
                            onChange={(event) => setQuery(event.target.value)}
                            placeholder="Search..."
                            autoFocus
                        />
                    </div>
                    <div className="mt-2 max-h-56 overflow-y-auto">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((option) => (
                                <button
                                    key={option.id}
                                    type="button"
                                    className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition hover:bg-surface-container"
                                    onClick={() => {
                                        onChange(option.id);
                                        setIsOpen(false);
                                        setQuery("");
                                    }}
                                >
                                    <span>{option.name}</span>
                                    {option.id === value ? <Check className="h-4 w-4 text-primary" /> : null}
                                </button>
                            ))
                        ) : (
                            <p className="px-3 py-4 text-center text-sm text-primary">No matching options.</p>
                        )}
                    </div>
                </div>
            ) : null}
        </div>
    );
};

const MultiSearchableSelect = ({ disabled = false, emptyLabel, label, loadingLabel, options, values, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState("");
    const selectedIds = new Set(values);
    const selectedOptions = options.filter((option) => selectedIds.has(option.id));
    const filteredOptions = options.filter((option) => option.name.toLowerCase().includes(query.trim().toLowerCase()));

    const toggleOption = (optionId) => {
        if (selectedIds.has(optionId)) {
            onChange(values.filter((value) => value !== optionId));
            return;
        }

        onChange([...values, optionId]);
    };

    return (
        <div className="relative">
            <span className="mb-2 block text-sm font-semibold">{label}</span>
            <button
                type="button"
                className={`${inputClassName} flex min-h-12 items-center justify-between text-left disabled:cursor-not-allowed disabled:opacity-70`}
                disabled={disabled}
                onClick={() => setIsOpen((current) => !current)}
            >
                <span className={selectedOptions.length > 0 ? "" : "text-primary/70"}>
                    {selectedOptions.length > 0
                        ? `${selectedOptions.length} selected`
                        : disabled
                          ? loadingLabel || emptyLabel
                          : emptyLabel}
                </span>
                <Search className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
            </button>

            {selectedOptions.length > 0 ? (
                <div className="mt-2 flex flex-wrap gap-2">
                    {selectedOptions.map((option) => (
                        <span
                            key={option.id}
                            className="inline-flex items-center gap-2 rounded-full bg-secondary-container px-3 py-1 text-xs font-semibold text-on-secondary-container"
                        >
                            {option.name}
                            <button
                                type="button"
                                className="text-on-secondary-container/70 hover:text-on-secondary-container"
                                aria-label={`Remove ${option.name}`}
                                onClick={() => toggleOption(option.id)}
                            >
                                <X className="h-3 w-3" aria-hidden="true" />
                            </button>
                        </span>
                    ))}
                </div>
            ) : null}

            {isOpen ? (
                <div className="absolute z-30 mt-2 w-full rounded-xl border border-primary/30 bg-surface-container-lowest p-2 shadow-lg">
                    <div className="relative">
                        <Search
                            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary"
                            aria-hidden="true"
                        />
                        <input
                            className="w-full rounded-lg border border-outline-variant bg-background py-2 pl-9 pr-3 text-sm text-on-surface outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                            value={query}
                            onChange={(event) => setQuery(event.target.value)}
                            placeholder="Search..."
                            autoFocus
                        />
                    </div>
                    <div className="mt-2 max-h-64 overflow-y-auto">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((option) => (
                                <button
                                    key={option.id}
                                    type="button"
                                    className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition hover:bg-surface-container"
                                    onClick={() => toggleOption(option.id)}
                                >
                                    <span>{option.name}</span>
                                    {selectedIds.has(option.id) ? <Check className="h-4 w-4 text-primary" /> : null}
                                </button>
                            ))
                        ) : (
                            <p className="px-3 py-4 text-center text-sm text-primary">No matching options.</p>
                        )}
                    </div>
                </div>
            ) : null}
        </div>
    );
};

const ClientTeacherPage = () => {
    const formRef = useRef(null);
    const teachersQuery = useGetTeachers();
    const gradeDataQuery = useGetGradeData();
    const subjectsQuery = useGetSubjects({ status: "active" });
    const createTeacherMutation = useCreateTeacher();
    const updateTeacherMutation = useUpdateTeacher();
    const deleteTeacherMutation = useDeleteTeacher();

    const [editingTeacherId, setEditingTeacherId] = useState(null);
    const [profile, setProfile] = useState(createInitialProfile);
    const [availability, setAvailability] = useState(createInitialAvailability);
    const [assignments, setAssignments] = useState(() => [createAssignment()]);
    const [statusMessage, setStatusMessage] = useState(null);

    const teachers = teachersQuery.data ?? [];
    const subjectOptions = useMemo(() => {
        return (subjectsQuery.data ?? []).map((subject) => ({
            id: String(subject.id),
            name: subject.name || `Subject ${subject.id}`,
        }));
    }, [subjectsQuery.data]);
    const gradeSectionOptions = useMemo(() => {
        return (gradeDataQuery.data?.gradeSections ?? []).map((gradeSection) => ({
            id: String(gradeSection.id),
            name:
                gradeSection.name ||
                [gradeSection.grade, gradeSection.section].filter(Boolean).join(" ") ||
                `Class ${gradeSection.id}`,
        }));
    }, [gradeDataQuery.data?.gradeSections]);
    const defaultSubjectId = subjectOptions[0]?.id ?? "";
    const defaultGradeSectionId = gradeSectionOptions[0]?.id ?? "";
    const hasSubjectOptions = subjectOptions.length > 0;
    const hasGradeSectionOptions = gradeSectionOptions.length > 0;
    const isSaving = createTeacherMutation.isPending || updateTeacherMutation.isPending;
    const formError = createTeacherMutation.error || updateTeacherMutation.error;
    const hasValidAssignments = assignments.every(
        (assignment) => assignment.subject_id && assignment.grade_section_ids.length > 0,
    );

    useEffect(() => {
        if (!defaultGradeSectionId && !defaultSubjectId) {
            return;
        }

        setAssignments((current) =>
            current.map((assignment) =>
                assignment.grade_section_ids.length > 0 && assignment.subject_id
                    ? assignment
                    : {
                          ...assignment,
                          grade_section_ids:
                              assignment.grade_section_ids.length > 0
                                  ? assignment.grade_section_ids
                                  : defaultGradeSectionId
                                    ? [defaultGradeSectionId]
                                    : [],
                          subject_id: assignment.subject_id || defaultSubjectId,
                      },
            ),
        );
    }, [defaultGradeSectionId, defaultSubjectId]);

    const resetForm = () => {
        setEditingTeacherId(null);
        setProfile(createInitialProfile());
        setAvailability(createInitialAvailability());
        setAssignments([createAssignment(defaultGradeSectionId, defaultSubjectId)]);
    };

    const updateProfile = (field, value) => {
        setProfile((current) => ({ ...current, [field]: value }));
    };

    const updateAvailability = (day, patch) => {
        setAvailability((current) => ({
            ...current,
            [day]: {
                ...current[day],
                ...patch,
            },
        }));
    };

    const updateAssignment = (id, field, value) => {
        setAssignments((current) =>
            current.map((assignment) => (assignment.id === id ? { ...assignment, [field]: value } : assignment)),
        );
    };

    const removeAssignment = (id) => {
        setAssignments((current) =>
            current.length === 1 ? current : current.filter((assignment) => assignment.id !== id),
        );
    };

    const startEditing = (teacher) => {
        setEditingTeacherId(teacher.id);
        setStatusMessage(null);
        setProfile({
            full_name: teacher.full_name ?? "",
            employment_type: teacher.employment_type ?? "full-time",
            max_daily_classes: teacher.max_daily_classes ?? 6,
            ai_context_notes: teacher.ai_context_notes ?? "",
        });
        setAvailability(normalizeAvailability(teacher.availability));
        setAssignments(normalizeAssignments(teacher.assignments, defaultGradeSectionId, defaultSubjectId));
        formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    const handleDelete = (teacher) => {
        const shouldDelete = window.confirm(`Delete ${teacher.full_name}?`);

        if (!shouldDelete) {
            return;
        }

        deleteTeacherMutation.mutate(teacher.id, {
            onSuccess: () => {
                if (editingTeacherId === teacher.id) {
                    resetForm();
                }

                setStatusMessage("Teacher deleted.");
            },
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        const payload = buildTeacherPayload(profile, availability, assignments);
        const mutationOptions = {
            onSuccess: () => {
                setStatusMessage(editingTeacherId ? "Teacher profile updated." : "Teacher profile saved.");
                resetForm();
            },
        };

        if (editingTeacherId) {
            updateTeacherMutation.mutate({ teacherId: editingTeacherId, payload }, mutationOptions);
            return;
        }

        createTeacherMutation.mutate(payload, mutationOptions);
    };

    return (
        <div className="min-h-screen rounded-xl bg-background p-1 text-on-surface">
            <div className="mx-auto max-w-[1440px] space-y-6">
                <section>
                    <p className="font-label text-xs uppercase tracking-wider text-primary">Master Data</p>
                    <h1 className="mt-2 text-3xl font-semibold text-on-surface">Teacher Onboarding</h1>
                    <p className="mt-2 max-w-3xl text-sm leading-6 text-primary">
                        Capture human limits, hard scheduling constraints, and soft AI preferences. School scope is
                        inherited from the active tenant session.
                    </p>
                </section>

                {teachersQuery.isError ? (
                    <div className="rounded-xl border border-primary bg-surface-container p-4 text-sm text-on-surface shadow-sm">
                        {getApiErrorMessage(teachersQuery.error, "Unable to load teachers.")}
                    </div>
                ) : null}

                {deleteTeacherMutation.isError ? (
                    <div className="rounded-xl border border-primary bg-surface-container p-4 text-sm text-on-surface shadow-sm">
                        {getApiErrorMessage(deleteTeacherMutation.error, "Unable to delete teacher.")}
                    </div>
                ) : null}

                {gradeDataQuery.isError ? (
                    <div className="rounded-xl border border-primary bg-surface-container p-4 text-sm text-on-surface shadow-sm">
                        {getApiErrorMessage(gradeDataQuery.error, "Unable to load grade and section data.")}
                    </div>
                ) : null}

                {subjectsQuery.isError ? (
                    <div className="rounded-xl border border-primary bg-surface-container p-4 text-sm text-on-surface shadow-sm">
                        {getApiErrorMessage(subjectsQuery.error, "Unable to load subject data.")}
                    </div>
                ) : null}

                {statusMessage ? (
                    <div className="rounded-xl border border-primary bg-surface-container p-4 text-sm font-semibold text-on-surface shadow-sm">
                        {statusMessage}
                    </div>
                ) : null}

                <ManagementDataTable
                    title="Teacher Directory"
                    description={
                        teachersQuery.isLoading
                            ? "Loading teacher records..."
                            : "Search teachers by name or filter by contract type. The table displays 10 records per page."
                    }
                    records={teachers}
                    searchPlaceholder="Search teachers..."
                    filterLabel="Contract Type"
                    filterOptions={[
                        { label: "All", value: "all" },
                        { label: "Full-Time", value: "full-time" },
                        { label: "Part-Time", value: "part-time" },
                    ]}
                    getFilterValue={(record) => record.employment_type}
                    getSearchText={(record) => record.full_name}
                    onDelete={handleDelete}
                    onEdit={startEditing}
                    columns={[
                        { key: "full_name", label: "Teacher Name" },
                        {
                            key: "employment_type",
                            label: "Type",
                            render: (record) => (
                                <span className="rounded-xl border border-primary px-3 py-1 text-xs font-semibold capitalize text-primary">
                                    {(record.employment_type ?? "full-time").replace("-", " ")}
                                </span>
                            ),
                        },
                        { key: "max_daily_classes", label: "Max Daily Classes" },
                        { key: "assignments_count", label: "Assignments" },
                    ]}
                />

                <form ref={formRef} className="space-y-6 rounded-xl bg-surface-container p-5 shadow-sm" onSubmit={handleSubmit}>
                    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                        <div className="flex items-center gap-3">
                            <span className="rounded-xl bg-primary p-2 text-on-primary">
                                <UserRound className="h-5 w-5" aria-hidden="true" />
                            </span>
                            <div>
                                <h2 className="text-2xl font-semibold">
                                    {editingTeacherId ? "Edit Teacher Profile" : "Master Teacher Profile"}
                                </h2>
                                <p className="text-sm text-primary">
                                    This profile becomes input for deterministic constraints and AI schedule ranking.
                                </p>
                            </div>
                        </div>

                        {editingTeacherId ? (
                            <button
                                type="button"
                                className="inline-flex items-center justify-center gap-2 rounded-xl border border-primary px-4 py-3 text-sm font-semibold text-on-surface transition hover:bg-background"
                                onClick={resetForm}
                            >
                                <X className="h-4 w-4" aria-hidden="true" />
                                Cancel Edit
                            </button>
                        ) : null}
                    </div>

                    {formError ? (
                        <div className="rounded-xl border border-primary bg-background p-4 text-sm text-on-surface">
                            {getApiErrorMessage(formError, "Unable to save teacher profile.")}
                        </div>
                    ) : null}

                    <section className={sectionClassName}>
                        <h3 className="text-lg font-semibold">Section A: Basic Profile & Human Limits</h3>
                        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
                            <label className="block lg:col-span-1">
                                <span className="mb-2 block text-sm font-semibold">Full Name</span>
                                <input
                                    className={inputClassName}
                                    value={profile.full_name}
                                    onChange={(event) => updateProfile("full_name", event.target.value)}
                                    placeholder="Dr. Jane Morris"
                                    required
                                />
                            </label>

                            <label className="block">
                                <span className="mb-2 block text-sm font-semibold">Contract Type</span>
                                <select
                                    className={inputClassName}
                                    value={profile.employment_type}
                                    onChange={(event) => updateProfile("employment_type", event.target.value)}
                                >
                                    <option value="full-time">Full-Time</option>
                                    <option value="part-time">Part-Time</option>
                                </select>
                            </label>

                            <label className="block">
                                <span className="mb-2 block text-sm font-semibold">max_daily_classes</span>
                                <input
                                    className={inputClassName}
                                    value={profile.max_daily_classes}
                                    onChange={(event) => updateProfile("max_daily_classes", event.target.value)}
                                    min="1"
                                    type="number"
                                    required
                                />
                                <span className="mt-2 block text-xs leading-5 text-primary">
                                    Hard constraint: Maximum total blocks this teacher can work in a single day.
                                </span>
                            </label>
                        </div>
                    </section>

                    <section className={sectionClassName}>
                        <h3 className="text-lg font-semibold">Section B: AI Context (Soft Constraints)</h3>
                        <label className="mt-4 block">
                            <span className="mb-2 block text-sm font-semibold">ai_context_notes</span>
                            <textarea
                                className={`${inputClassName} min-h-36 resize-y`}
                                value={profile.ai_context_notes}
                                onChange={(event) => updateProfile("ai_context_notes", event.target.value)}
                                placeholder="Prefers teaching junior grades before lunch."
                            />
                            <span className="mt-2 block text-xs leading-5 text-primary">
                                Provide instructions to the LLM (e.g., 'Prefers teaching junior grades before lunch').
                            </span>
                        </label>
                    </section>

                    <section className={sectionClassName}>
                        <div className="flex items-center gap-3">
                            <CalendarDays className="h-5 w-5 text-primary" aria-hidden="true" />
                            <div>
                                <h3 className="text-lg font-semibold">
                                    Section C: Teacher Availability (Part-Time Constraints)
                                </h3>
                                <p className="text-sm text-primary">
                                    Toggle active days and define available time windows.
                                </p>
                            </div>
                        </div>

                        <div className="mt-5 grid grid-cols-1 gap-4 xl:grid-cols-5">
                            {weekdays.map((day) => {
                                const dayAvailability = availability[day];

                                return (
                                    <div key={day} className="rounded-xl border border-primary bg-background p-4">
                                        <button
                                            type="button"
                                            className={`mb-4 w-full rounded-xl border border-primary px-3 py-2 text-sm font-semibold ${
                                                dayAvailability.active
                                                    ? "bg-primary text-on-primary"
                                                    : "bg-surface-container text-on-surface"
                                            }`}
                                            aria-pressed={dayAvailability.active}
                                            onClick={() =>
                                                updateAvailability(day, { active: !dayAvailability.active })
                                            }
                                        >
                                            {day}
                                        </button>

                                        {dayAvailability.active ? (
                                            <div className="space-y-3">
                                                <label className="block">
                                                    <span className="mb-1 block text-xs font-semibold text-primary">
                                                        start_time
                                                    </span>
                                                    <input
                                                        className={inputClassName}
                                                        type="time"
                                                        value={dayAvailability.start_time}
                                                        onChange={(event) =>
                                                            updateAvailability(day, {
                                                                start_time: event.target.value,
                                                            })
                                                        }
                                                    />
                                                </label>
                                                <label className="block">
                                                    <span className="mb-1 block text-xs font-semibold text-primary">
                                                        end_time
                                                    </span>
                                                    <input
                                                        className={inputClassName}
                                                        type="time"
                                                        value={dayAvailability.end_time}
                                                        onChange={(event) =>
                                                            updateAvailability(day, {
                                                                end_time: event.target.value,
                                                            })
                                                        }
                                                    />
                                                </label>
                                            </div>
                                        ) : (
                                            <p className="text-sm text-primary">Unavailable</p>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </section>

                    <section className={sectionClassName}>
                        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                            <div>
                                <h3 className="text-lg font-semibold">Section D: Teaching Assignments</h3>
                                <p className="text-sm text-primary">
                                    Add subject and class targets used by weekly quota balancing.
                                </p>
                                {!hasGradeSectionOptions ? (
                                    <p className="mt-2 text-sm text-primary">
                                        {gradeDataQuery.isLoading
                                            ? "Loading grade and section data from the backend..."
                                            : "Create grade-section class links first to assign teachers."}
                                    </p>
                                ) : null}
                                {!hasSubjectOptions ? (
                                    <p className="mt-2 text-sm text-primary">
                                        {subjectsQuery.isLoading
                                            ? "Loading subject data from the backend..."
                                            : "Create active subjects first to assign teachers."}
                                    </p>
                                ) : null}
                            </div>
                            <button
                                type="button"
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-on-primary shadow-sm transition hover:bg-primary/90"
                                disabled={!hasGradeSectionOptions || !hasSubjectOptions}
                                onClick={() =>
                                    setAssignments((current) => [
                                        ...current,
                                        createAssignment(defaultGradeSectionId, defaultSubjectId),
                                    ])
                                }
                            >
                                <Plus className="h-4 w-4" aria-hidden="true" />
                                Add Subject Assignment
                            </button>
                        </div>

                        <div className="mt-5 space-y-4">
                            {assignments.map((assignment, index) => (
                                <div
                                    key={assignment.id}
                                    className="grid grid-cols-1 gap-4 rounded-xl border border-primary bg-background p-4 xl:grid-cols-[1fr_1.4fr_160px_180px_auto]"
                                >
                                    <SearchableSelect
                                        label="Select Subject"
                                        value={assignment.subject_id}
                                        options={subjectOptions}
                                        disabled={!hasSubjectOptions}
                                        emptyLabel="No active subjects available"
                                        loadingLabel={subjectsQuery.isLoading ? "Loading subjects..." : null}
                                        onChange={(value) => updateAssignment(assignment.id, "subject_id", value)}
                                    />

                                    <MultiSearchableSelect
                                        label="Select Grade/Section"
                                        values={assignment.grade_section_ids}
                                        options={gradeSectionOptions}
                                        disabled={!hasGradeSectionOptions}
                                        emptyLabel="No grade sections available"
                                        loadingLabel={gradeDataQuery.isLoading ? "Loading grade sections..." : null}
                                        onChange={(value) => updateAssignment(assignment.id, "grade_section_ids", value)}
                                    />

                                    <label className="block">
                                        <span className="mb-2 block text-sm font-semibold">sessions_per_week</span>
                                        <input
                                            className={inputClassName}
                                            min="1"
                                            type="number"
                                            value={assignment.sessions_per_week}
                                            onChange={(event) =>
                                                updateAssignment(
                                                    assignment.id,
                                                    "sessions_per_week",
                                                    event.target.value,
                                                )
                                            }
                                        />
                                    </label>

                                    <label className="block">
                                        <span className="mb-2 block text-sm font-semibold">max_sessions_per_day</span>
                                        <input
                                            className={inputClassName}
                                            min="1"
                                            type="number"
                                            value={assignment.max_sessions_per_day}
                                            onChange={(event) =>
                                                updateAssignment(
                                                    assignment.id,
                                                    "max_sessions_per_day",
                                                    event.target.value,
                                                )
                                            }
                                        />
                                    </label>

                                    <div className="flex items-end">
                                        <button
                                            type="button"
                                            className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-primary text-primary transition hover:bg-surface-container"
                                            aria-label={`Remove assignment ${index + 1}`}
                                            onClick={() => removeAssignment(assignment.id)}
                                        >
                                            <Trash2 className="h-4 w-4" aria-hidden="true" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {!hasValidAssignments ? (
                            <p className="mt-4 text-sm font-semibold text-primary">
                                Select one subject and at least one grade/section for every assignment row.
                            </p>
                        ) : null}
                    </section>

                    <div className="sticky bottom-0 rounded-xl bg-surface-container py-4">
                        <button
                            type="submit"
                            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-4 text-sm font-semibold text-on-primary shadow-sm transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
                            disabled={isSaving || !hasGradeSectionOptions || !hasSubjectOptions || !hasValidAssignments}
                        >
                            <Save className="h-4 w-4" aria-hidden="true" />
                            {isSaving ? "Saving..." : editingTeacherId ? "Update Profile/Data" : "Save Profile/Data"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ClientTeacherPage;

