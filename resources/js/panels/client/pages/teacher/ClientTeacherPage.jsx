import { getApiErrorMessage } from "@/apis/auth/client.api";
import { useDeleteTeacher } from "@/apis/teacher/delete.api";
import { useGetTeachers } from "@/apis/teacher/get.api";
import { useCreateTeacher } from "@/apis/teacher/post.api";
import { useUpdateTeacher } from "@/apis/teacher/update.api";
import ManagementDataTable from "@/panels/client/components/ManagementDataTable";
import { CalendarDays, Plus, Save, Trash2, UserRound, X } from "lucide-react";
import { useRef, useState } from "react";

const inputClassName =
    "w-full rounded-xl border border-[#52616B] bg-[#F0F5F9] px-4 py-3 text-sm text-[#1E2022] outline-none transition focus:border-[#52616B] focus:ring-2 focus:ring-[#52616B]";

const sectionClassName = "rounded-xl border border-[#52616B]/20 bg-[#C9D6DF] p-5 shadow-sm";

const subjects = [
    { id: "math", name: "Mathematics" },
    { id: "english", name: "English Language" },
    { id: "science", name: "Science" },
    { id: "ict", name: "ICT" },
    { id: "physics", name: "Physics" },
    { id: "art", name: "Art" },
];

const gradeSections = [
    { id: "grade-1a", name: "Grade 1A" },
    { id: "grade-2b", name: "Grade 2B" },
    { id: "grade-3a", name: "Grade 3A" },
    { id: "grade-4c", name: "Grade 4C" },
    { id: "grade-8b", name: "Grade 8B" },
    { id: "grade-10a", name: "Grade 10A" },
];

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

const createAssignment = () => ({
    id: createRowId(),
    subject_id: subjects[0].id,
    grade_section_id: gradeSections[0].id,
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

const normalizeAssignments = (assignments) => {
    if (!Array.isArray(assignments) || assignments.length === 0) {
        return [createAssignment()];
    }

    return assignments.map((assignment) => ({
        id: assignment.id ?? createRowId(),
        subject_id: assignment.subject_id ?? subjects[0].id,
        grade_section_id: assignment.grade_section_id ?? gradeSections[0].id,
        sessions_per_week: assignment.sessions_per_week ?? 5,
        max_sessions_per_day: assignment.max_sessions_per_day ?? 1,
    }));
};

const buildTeacherPayload = (profile, availability, assignments) => ({
    full_name: profile.full_name.trim(),
    employment_type: profile.employment_type,
    max_daily_classes: Number(profile.max_daily_classes),
    ai_context_notes: profile.ai_context_notes?.trim() || null,
    availability,
    assignments: assignments.map((assignment) => ({
        subject_id: assignment.subject_id,
        grade_section_id: assignment.grade_section_id,
        sessions_per_week: Number(assignment.sessions_per_week),
        max_sessions_per_day: Number(assignment.max_sessions_per_day),
    })),
});

const ClientTeacherPage = () => {
    const formRef = useRef(null);
    const teachersQuery = useGetTeachers();
    const createTeacherMutation = useCreateTeacher();
    const updateTeacherMutation = useUpdateTeacher();
    const deleteTeacherMutation = useDeleteTeacher();

    const [editingTeacherId, setEditingTeacherId] = useState(null);
    const [profile, setProfile] = useState(createInitialProfile);
    const [availability, setAvailability] = useState(createInitialAvailability);
    const [assignments, setAssignments] = useState([createAssignment()]);
    const [statusMessage, setStatusMessage] = useState(null);

    const teachers = teachersQuery.data ?? [];
    const isSaving = createTeacherMutation.isPending || updateTeacherMutation.isPending;
    const formError = createTeacherMutation.error || updateTeacherMutation.error;

    const resetForm = () => {
        setEditingTeacherId(null);
        setProfile(createInitialProfile());
        setAvailability(createInitialAvailability());
        setAssignments([createAssignment()]);
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
        setAssignments(normalizeAssignments(teacher.assignments));
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
        <div className="min-h-screen rounded-xl bg-[#F0F5F9] p-1 text-[#1E2022]">
            <div className="mx-auto max-w-[1440px] space-y-6">
                <section>
                    <p className="font-label text-xs uppercase tracking-wider text-[#52616B]">Master Data</p>
                    <h1 className="mt-2 text-3xl font-semibold text-[#1E2022]">Teacher Onboarding</h1>
                    <p className="mt-2 max-w-3xl text-sm leading-6 text-[#52616B]">
                        Capture human limits, hard scheduling constraints, and soft AI preferences. School scope is
                        inherited from the active tenant session.
                    </p>
                </section>

                {teachersQuery.isError ? (
                    <div className="rounded-xl border border-[#52616B] bg-[#C9D6DF] p-4 text-sm text-[#1E2022] shadow-sm">
                        {getApiErrorMessage(teachersQuery.error, "Unable to load teachers.")}
                    </div>
                ) : null}

                {deleteTeacherMutation.isError ? (
                    <div className="rounded-xl border border-[#52616B] bg-[#C9D6DF] p-4 text-sm text-[#1E2022] shadow-sm">
                        {getApiErrorMessage(deleteTeacherMutation.error, "Unable to delete teacher.")}
                    </div>
                ) : null}

                {statusMessage ? (
                    <div className="rounded-xl border border-[#52616B] bg-[#C9D6DF] p-4 text-sm font-semibold text-[#1E2022] shadow-sm">
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
                                <span className="rounded-xl border border-[#52616B] px-3 py-1 text-xs font-semibold capitalize text-[#52616B]">
                                    {(record.employment_type ?? "full-time").replace("-", " ")}
                                </span>
                            ),
                        },
                        { key: "max_daily_classes", label: "Max Daily Classes" },
                        { key: "assignments_count", label: "Assignments" },
                    ]}
                />

                <form ref={formRef} className="space-y-6 rounded-xl bg-[#C9D6DF] p-5 shadow-sm" onSubmit={handleSubmit}>
                    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                        <div className="flex items-center gap-3">
                            <span className="rounded-xl bg-[#52616B] p-2 text-[#F0F5F9]">
                                <UserRound className="h-5 w-5" aria-hidden="true" />
                            </span>
                            <div>
                                <h2 className="text-2xl font-semibold">
                                    {editingTeacherId ? "Edit Teacher Profile" : "Master Teacher Profile"}
                                </h2>
                                <p className="text-sm text-[#52616B]">
                                    This profile becomes input for deterministic constraints and AI schedule ranking.
                                </p>
                            </div>
                        </div>

                        {editingTeacherId ? (
                            <button
                                type="button"
                                className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#52616B] px-4 py-3 text-sm font-semibold text-[#1E2022] transition hover:bg-[#F0F5F9]"
                                onClick={resetForm}
                            >
                                <X className="h-4 w-4" aria-hidden="true" />
                                Cancel Edit
                            </button>
                        ) : null}
                    </div>

                    {formError ? (
                        <div className="rounded-xl border border-[#52616B] bg-[#F0F5F9] p-4 text-sm text-[#1E2022]">
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
                                <span className="mt-2 block text-xs leading-5 text-[#52616B]">
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
                            <span className="mt-2 block text-xs leading-5 text-[#52616B]">
                                Provide instructions to the LLM (e.g., 'Prefers teaching junior grades before lunch').
                            </span>
                        </label>
                    </section>

                    <section className={sectionClassName}>
                        <div className="flex items-center gap-3">
                            <CalendarDays className="h-5 w-5 text-[#52616B]" aria-hidden="true" />
                            <div>
                                <h3 className="text-lg font-semibold">
                                    Section C: Teacher Availability (Part-Time Constraints)
                                </h3>
                                <p className="text-sm text-[#52616B]">
                                    Toggle active days and define available time windows.
                                </p>
                            </div>
                        </div>

                        <div className="mt-5 grid grid-cols-1 gap-4 xl:grid-cols-5">
                            {weekdays.map((day) => {
                                const dayAvailability = availability[day];

                                return (
                                    <div key={day} className="rounded-xl border border-[#52616B] bg-[#F0F5F9] p-4">
                                        <button
                                            type="button"
                                            className={`mb-4 w-full rounded-xl border border-[#52616B] px-3 py-2 text-sm font-semibold ${
                                                dayAvailability.active
                                                    ? "bg-[#52616B] text-[#F0F5F9]"
                                                    : "bg-[#C9D6DF] text-[#1E2022]"
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
                                                    <span className="mb-1 block text-xs font-semibold text-[#52616B]">
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
                                                    <span className="mb-1 block text-xs font-semibold text-[#52616B]">
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
                                            <p className="text-sm text-[#52616B]">Unavailable</p>
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
                                <p className="text-sm text-[#52616B]">
                                    Add subject and class targets used by weekly quota balancing.
                                </p>
                            </div>
                            <button
                                type="button"
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#52616B] px-4 py-3 text-sm font-semibold text-[#F0F5F9] shadow-sm transition hover:bg-[#52616B]"
                                onClick={() => setAssignments((current) => [...current, createAssignment()])}
                            >
                                <Plus className="h-4 w-4" aria-hidden="true" />
                                Add Subject Assignment
                            </button>
                        </div>

                        <div className="mt-5 space-y-4">
                            {assignments.map((assignment, index) => (
                                <div
                                    key={assignment.id}
                                    className="grid grid-cols-1 gap-4 rounded-xl border border-[#52616B] bg-[#F0F5F9] p-4 xl:grid-cols-[1fr_1fr_160px_180px_auto]"
                                >
                                    <label className="block">
                                        <span className="mb-2 block text-sm font-semibold">Select Subject</span>
                                        <select
                                            className={inputClassName}
                                            value={assignment.subject_id}
                                            onChange={(event) =>
                                                updateAssignment(assignment.id, "subject_id", event.target.value)
                                            }
                                        >
                                            {subjects.map((subject) => (
                                                <option key={subject.id} value={subject.id}>
                                                    {subject.name}
                                                </option>
                                            ))}
                                        </select>
                                    </label>

                                    <label className="block">
                                        <span className="mb-2 block text-sm font-semibold">Select Grade/Section</span>
                                        <select
                                            className={inputClassName}
                                            value={assignment.grade_section_id}
                                            onChange={(event) =>
                                                updateAssignment(
                                                    assignment.id,
                                                    "grade_section_id",
                                                    event.target.value,
                                                )
                                            }
                                        >
                                            {gradeSections.map((gradeSection) => (
                                                <option key={gradeSection.id} value={gradeSection.id}>
                                                    {gradeSection.name}
                                                </option>
                                            ))}
                                        </select>
                                    </label>

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
                                            className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-[#52616B] text-[#52616B] transition hover:bg-[#C9D6DF]"
                                            aria-label={`Remove assignment ${index + 1}`}
                                            onClick={() => removeAssignment(assignment.id)}
                                        >
                                            <Trash2 className="h-4 w-4" aria-hidden="true" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <div className="sticky bottom-0 rounded-xl bg-[#C9D6DF] py-4">
                        <button
                            type="submit"
                            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#52616B] px-5 py-4 text-sm font-semibold text-[#F0F5F9] shadow-sm transition hover:bg-[#52616B] disabled:cursor-not-allowed disabled:opacity-70"
                            disabled={isSaving}
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
