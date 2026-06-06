import { Clock3, LoaderCircle, Sparkles, Users, X } from "lucide-react";
import { useMemo, useState } from "react";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

const timeSlots = [
    { id: "09:00", label: "09:00 - 10:00", templateType: "academic" },
    { id: "10:00", label: "10:00 - 11:00", templateType: "academic" },
    { id: "11:00", label: "11:00 - 11:20", templateType: "break", title: "Morning Break" },
    { id: "11:20", label: "11:20 - 12:20", templateType: "academic" },
    { id: "12:20", label: "12:20 - 13:00", templateType: "assembly", title: "Assembly / Advisory" },
    { id: "13:00", label: "13:00 - 14:00", templateType: "academic" },
    { id: "14:00", label: "14:00 - 15:00", templateType: "academic" },
];

const gradeGroups = [
    {
        label: "Junior Template (Grades 1-5)",
        grades: [
            { id: "grade-1a", name: "Grade 1A" },
            { id: "grade-1b", name: "Grade 1B" },
            { id: "grade-2a", name: "Grade 2A" },
            { id: "grade-4c", name: "Grade 4C" },
            { id: "grade-5a", name: "Grade 5A" },
        ],
    },
    {
        label: "Senior Template (Grades 6-10)",
        grades: [
            { id: "grade-6a", name: "Grade 6A" },
            { id: "grade-7b", name: "Grade 7B" },
            { id: "grade-8a", name: "Grade 8A" },
            { id: "grade-9c", name: "Grade 9C" },
            { id: "grade-10a", name: "Grade 10A" },
        ],
    },
];

const baseSchedule = {
    "grade-1a": {
        "09:00": {
            Monday: { subject: "Mathematics", teacher: "Ms. Evelyn Hart" },
            Tuesday: { subject: "English", teacher: "Mr. Caleb Ross" },
            Wednesday: { subject: "Science", teacher: "Dr. Nora Kim" },
            Thursday: { subject: "Mathematics", teacher: "Ms. Evelyn Hart" },
            Friday: { subject: "Art", teacher: "Ms. Priya Shah" },
        },
        "10:00": {
            Monday: { subject: "English", teacher: "Mr. Caleb Ross" },
            Wednesday: { subject: "ICT", teacher: "Mr. Omar Blake" },
            Thursday: { subject: "Science", teacher: "Dr. Nora Kim" },
        },
        "11:20": {
            Monday: { subject: "Social Studies", teacher: "Mrs. Lina Cole" },
            Tuesday: { subject: "Mathematics", teacher: "Ms. Evelyn Hart" },
            Friday: { subject: "English", teacher: "Mr. Caleb Ross" },
        },
        "13:00": {
            Tuesday: { subject: "Science Lab", teacher: "Dr. Nora Kim" },
            Wednesday: { subject: "Mathematics", teacher: "Ms. Evelyn Hart" },
            Friday: { subject: "Music", teacher: "Mr. Daniel Yu" },
        },
        "14:00": {
            Monday: { subject: "Reading", teacher: "Mrs. Lina Cole" },
            Thursday: { subject: "ICT", teacher: "Mr. Omar Blake" },
        },
    },
    "grade-6a": {
        "09:00": {
            Monday: { subject: "Algebra", teacher: "Mr. Simon Dale" },
            Tuesday: { subject: "Physics", teacher: "Dr. Asha Menon" },
            Thursday: { subject: "English", teacher: "Ms. Rachel Lin" },
        },
        "10:00": {
            Monday: { subject: "English", teacher: "Ms. Rachel Lin" },
            Wednesday: { subject: "Biology", teacher: "Dr. Asha Menon" },
            Friday: { subject: "Algebra", teacher: "Mr. Simon Dale" },
        },
        "11:20": {
            Tuesday: { subject: "History", teacher: "Mr. Idris Khan" },
            Wednesday: { subject: "ICT", teacher: "Ms. Mina Park" },
            Thursday: { subject: "Physics", teacher: "Dr. Asha Menon" },
        },
        "13:00": {
            Monday: { subject: "ICT", teacher: "Ms. Mina Park" },
            Wednesday: { subject: "English", teacher: "Ms. Rachel Lin" },
            Friday: { subject: "History", teacher: "Mr. Idris Khan" },
        },
    },
};

const suggestions = [
    { name: "Ms. Evelyn Hart", match: 96, reason: "Subject load and availability match" },
    { name: "Mr. Caleb Ross", match: 91, reason: "No back-to-back conflict detected" },
    { name: "Dr. Nora Kim", match: 87, reason: "Meets grade-level preference" },
];

const getScheduleForGrade = (gradeId) => {
    if (baseSchedule[gradeId]) {
        return baseSchedule[gradeId];
    }

    return gradeId.startsWith("grade-1") || gradeId.startsWith("grade-2") || gradeId.startsWith("grade-4")
        ? baseSchedule["grade-1a"]
        : baseSchedule["grade-6a"];
};

const ClientDashboardPage = () => {
    const [selectedGradeId, setSelectedGradeId] = useState("grade-1a");
    const [isGenerating, setIsGenerating] = useState(false);
    const [queueStatus, setQueueStatus] = useState("Status: Ready for generation");
    const [activeSlot, setActiveSlot] = useState(null);

    const selectedGrade = useMemo(() => {
        return gradeGroups.flatMap((group) => group.grades).find((grade) => grade.id === selectedGradeId);
    }, [selectedGradeId]);

    const schedule = getScheduleForGrade(selectedGradeId);

    const handleGenerate = () => {
        setIsGenerating(true);
        setQueueStatus("Status: Polling background queue...");

        window.setTimeout(() => {
            setIsGenerating(false);
            setQueueStatus("Status: Latest schedule generated successfully");
        }, 2200);
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
                            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#52616B] px-6 py-3 font-label text-sm font-semibold text-white shadow-sm transition hover:opacity-95 disabled:cursor-wait"
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
                        {gradeGroups.map((group) => (
                            <div key={group.label}>
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
                                                        ? "bg-[#52616B] text-white"
                                                        : "text-on-surface hover:bg-[#C9D6DF]"
                                                }`}
                                                onClick={() => setSelectedGradeId(grade.id)}
                                            >
                                                {grade.name}
                                                {isSelected ? (
                                                    <span className="rounded-full bg-white px-2 py-0.5 font-label text-[10px] uppercase text-[#52616B]">
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
                                Monday to Friday schedule with hard template constraints.
                            </p>
                        </div>
                        <div className="rounded-lg bg-[#C9D6DF] px-3 py-2 font-label text-xs text-[#52616B]">
                            Empty cells are Copilot-enabled drop zones
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <div className="min-w-[980px]">
                            <div className="grid grid-cols-[150px_repeat(5,minmax(170px,1fr))] border-b border-outline-variant/30 bg-surface-container">
                                <div className="px-4 py-3 font-label text-xs uppercase text-primary">Time</div>
                                {days.map((day) => (
                                    <div
                                        key={day}
                                        className="border-l border-outline-variant/30 px-4 py-3 text-center font-label text-xs uppercase text-primary"
                                    >
                                        {day}
                                    </div>
                                ))}
                            </div>

                            {timeSlots.map((slot) => {
                                const isBlocked = slot.templateType !== "academic";

                                return (
                                    <div
                                        key={slot.id}
                                        className={`grid grid-cols-[150px_repeat(5,minmax(170px,1fr))] border-b border-outline-variant/20 ${
                                            isBlocked ? "schedule-stripes bg-[#C9D6DF]/70 opacity-80" : "bg-background"
                                        }`}
                                    >
                                        <div className="flex min-h-28 items-center px-4">
                                            <div>
                                                <div className="font-label text-sm text-on-surface">{slot.label}</div>
                                                {isBlocked ? (
                                                    <div className="mt-1 font-label text-xs uppercase text-[#52616B]">
                                                        {slot.title}
                                                    </div>
                                                ) : null}
                                            </div>
                                        </div>

                                        {days.map((day) => {
                                            const assignment = schedule[slot.id]?.[day];

                                            if (isBlocked) {
                                                return (
                                                    <div
                                                        key={`${slot.id}-${day}`}
                                                        className="flex min-h-28 items-center justify-center border-l border-outline-variant/30 px-3 py-3"
                                                    >
                                                        <span className="rounded-lg bg-white/70 px-3 py-2 font-label text-xs uppercase text-[#52616B]">
                                                            Not droppable
                                                        </span>
                                                    </div>
                                                );
                                            }

                                            return (
                                                <div
                                                    key={`${slot.id}-${day}`}
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
                                                            className="flex h-full min-h-20 w-full items-center justify-center rounded-xl border border-dashed border-[#52616B] bg-surface-container-lowest px-3 py-4 text-center font-label text-xs uppercase text-[#52616B] transition hover:bg-[#C9D6DF]"
                                                            onClick={() =>
                                                                setActiveSlot({
                                                                    day,
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
                </main>
            </section>

            {activeSlot ? (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-inverse-surface/40 px-4">
                    <section className="w-full max-w-lg rounded-xl bg-surface-container-lowest p-6 shadow-xl">
                        <div className="mb-5 flex items-start justify-between gap-4">
                            <div className="flex gap-3">
                                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#52616B] text-white">
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
                                className="flex h-9 w-9 items-center justify-center rounded-lg text-on-surface-variant transition hover:bg-[#C9D6DF]"
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
                                            <span className="rounded-full bg-[#C9D6DF] px-2.5 py-1 font-label text-xs font-semibold text-[#52616B]">
                                                {teacher.match}% match
                                            </span>
                                        </div>
                                        <p className="mt-1 text-sm text-on-surface-variant">{teacher.reason}</p>
                                    </div>
                                    <button
                                        type="button"
                                        className="rounded-lg bg-[#52616B] px-4 py-2 font-label text-xs font-semibold text-white transition hover:opacity-95"
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
