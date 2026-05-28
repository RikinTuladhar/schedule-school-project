import { ChevronRight, Coffee, GripVertical, Lightbulb, Plus, Save, Trash2 } from "lucide-react";

const days = ["M", "T", "W", "Th", "F"];

const periodTypes = [
    { value: "class", label: "Academic Class" },
    { value: "break", label: "Break / Recess" },
    { value: "assembly", label: "Assembly" },
    { value: "special", label: "Specialty (Art/PE)" },
];

const periods = [
    { id: 1, start: "08:00", end: "09:00", type: "class" },
    { id: 2, start: "09:00", end: "10:00", type: "class" },
    { id: 3, start: "10:00", end: "10:30", type: "break" },
    { id: 4, start: "10:30", end: "11:30", type: "class" },
];

const ClientAssignmentGridPage = () => {
    return (
        <div className="mx-auto max-w-[1440px]">
            <section className="mb-8 flex flex-col justify-between gap-6 md:flex-row md:items-end">
                <div>
                    <div className="mb-2 flex items-center gap-2 text-on-surface-variant">
                        <span className="font-label text-xs uppercase tracking-wider">Elementary Division</span>
                        <ChevronRight className="h-4 w-4" aria-hidden="true" />
                        <span className="font-label text-xs uppercase tracking-wider">Grade 4</span>
                    </div>
                    <h2 className="mb-2 text-4xl font-bold text-on-surface md:text-5xl">Grade 4C Template</h2>
                    <p className="max-w-2xl text-lg leading-7 text-on-surface-variant">
                        Define the daily structural flow for this cohort. Specify academic blocks, transitions, and
                        mandatory breaks.
                    </p>
                </div>

                <div className="flex flex-wrap gap-3">
                    <button
                        type="button"
                        className="rounded-lg border border-outline-variant/30 bg-surface-container-highest px-6 py-2.5 font-label text-sm text-on-surface transition-colors hover:bg-surface-variant active:scale-[0.98]"
                    >
                        Discard Draft
                    </button>
                    <button
                        type="button"
                        className="flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 font-label text-sm text-on-primary shadow-sm transition-colors hover:bg-primary/90 active:scale-[0.98]"
                    >
                        <Save className="h-4 w-4" aria-hidden="true" />
                        Save Template
                    </button>
                </div>
            </section>

            <section className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                <div className="space-y-6 lg:col-span-4">
                    <section className="rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-6 shadow-sm">
                        <h3 className="mb-6 border-b border-outline-variant/30 pb-4 text-2xl font-semibold text-on-surface">
                            Template Settings
                        </h3>

                        <div className="space-y-5">
                            <div>
                                <label
                                    className="mb-1.5 block font-label text-xs uppercase text-on-surface-variant"
                                    htmlFor="template-name"
                                >
                                    Template Name
                                </label>
                                <input
                                    id="template-name"
                                    className="input-focus-glow w-full rounded-lg border border-outline-variant/50 bg-surface px-4 py-2.5 text-on-surface transition-all"
                                    type="text"
                                    defaultValue="Standard G4 Fall"
                                />
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <label
                                        className="mb-1.5 block font-label text-xs uppercase text-on-surface-variant"
                                        htmlFor="template-start-time"
                                    >
                                        Start Time
                                    </label>
                                    <input
                                        id="template-start-time"
                                        className="input-focus-glow w-full rounded-lg border border-outline-variant/50 bg-surface px-4 py-2.5 text-on-surface transition-all"
                                        type="time"
                                        defaultValue="08:00"
                                    />
                                </div>
                                <div>
                                    <label
                                        className="mb-1.5 block font-label text-xs uppercase text-on-surface-variant"
                                        htmlFor="template-end-time"
                                    >
                                        End Time
                                    </label>
                                    <input
                                        id="template-end-time"
                                        className="input-focus-glow w-full rounded-lg border border-outline-variant/50 bg-surface px-4 py-2.5 text-on-surface transition-all"
                                        type="time"
                                        defaultValue="15:00"
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="mb-1.5 block font-label text-xs uppercase text-on-surface-variant">
                                    Applicable Days
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {days.map((day) => (
                                        <button
                                            key={day}
                                            type="button"
                                            className="flex h-10 w-10 items-center justify-center rounded-full bg-primary font-label text-sm text-on-primary transition-colors hover:bg-primary/90"
                                            aria-pressed="true"
                                        >
                                            {day}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>

                    <aside className="relative overflow-hidden rounded-xl border border-outline-variant/30 bg-surface-container-low p-5">
                        <div className="absolute right-0 top-0 h-32 w-32 -translate-y-1/2 translate-x-1/2 rounded-full bg-primary/5 blur-2xl" />
                        <div className="relative z-10 flex gap-4">
                            <Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                            <div>
                                <h4 className="mb-1 font-medium text-on-surface">AI Recommendation</h4>
                                <p className="text-sm leading-5 text-on-surface-variant">
                                    Grade 4 cohorts show 18% better focus when Math blocks are scheduled before 11:00
                                    AM. Consider adjusting block 3.
                                </p>
                            </div>
                        </div>
                    </aside>
                </div>

                <div className="lg:col-span-8">
                    <section className="overflow-hidden rounded-xl border border-outline-variant/30 bg-surface-container-lowest shadow-[0_4px_20px_rgba(82,97,107,0.03)]">
                        <div className="hidden grid-cols-[80px_minmax(220px,1fr)_minmax(180px,1fr)_112px] gap-4 border-b border-outline-variant/30 bg-surface/50 px-6 py-4 md:grid">
                            <div className="font-label text-xs uppercase text-on-surface-variant">Index</div>
                            <div className="font-label text-xs uppercase text-on-surface-variant">Time Slot</div>
                            <div className="font-label text-xs uppercase text-on-surface-variant">Period Type</div>
                            <div className="text-right font-label text-xs uppercase text-on-surface-variant">
                                Actions
                            </div>
                        </div>

                        <div className="divide-y divide-outline-variant/20" id="period-list">
                            {periods.map((period) => {
                                const isBreak = period.type === "break";

                                return (
                                    <div
                                        key={period.id}
                                        className={[
                                            "group grid gap-4 px-4 py-4 transition-colors md:grid-cols-[80px_minmax(220px,1fr)_minmax(180px,1fr)_112px] md:items-center md:px-6",
                                            isBreak
                                                ? "schedule-stripes bg-surface-container-high/40"
                                                : "hover:bg-surface-container-low",
                                        ].join(" ")}
                                    >
                                        <div className="flex items-center justify-between gap-3 md:block">
                                            <span className="font-label text-xs uppercase text-on-surface-variant md:hidden">
                                                Index
                                            </span>
                                            <span
                                                className={[
                                                    "inline-flex h-8 w-8 items-center justify-center rounded-full font-label text-sm",
                                                    isBreak
                                                        ? "bg-surface-container-highest text-on-surface-variant"
                                                        : "bg-surface-variant text-on-surface-variant",
                                                ].join(" ")}
                                            >
                                                {period.id}
                                            </span>
                                        </div>

                                        <div>
                                            <span className="mb-2 block font-label text-xs uppercase text-on-surface-variant md:hidden">
                                                Time Slot
                                            </span>
                                            <div className="flex flex-wrap items-center gap-2">
                                                <input
                                                    className="w-24 rounded border border-transparent bg-transparent px-2 py-1 font-label text-sm text-on-surface transition-all hover:border-outline-variant/50 focus:border-primary focus:outline-none"
                                                    aria-label={`Period ${period.id} start time`}
                                                    type="time"
                                                    defaultValue={period.start}
                                                />
                                                <span className="text-on-surface-variant">-</span>
                                                <input
                                                    className="w-24 rounded border border-transparent bg-transparent px-2 py-1 font-label text-sm text-on-surface transition-all hover:border-outline-variant/50 focus:border-primary focus:outline-none"
                                                    aria-label={`Period ${period.id} end time`}
                                                    type="time"
                                                    defaultValue={period.end}
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label
                                                className="mb-2 block font-label text-xs uppercase text-on-surface-variant md:hidden"
                                                htmlFor={`period-type-${period.id}`}
                                            >
                                                Period Type
                                            </label>
                                            <div className="relative max-w-[220px]">
                                                {isBreak ? (
                                                    <Coffee
                                                        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary"
                                                        aria-hidden="true"
                                                    />
                                                ) : null}
                                                <select
                                                    id={`period-type-${period.id}`}
                                                    className={[
                                                        "input-focus-glow w-full cursor-pointer appearance-none rounded-lg border border-outline-variant/30 px-3 py-2 text-sm text-on-surface",
                                                        isBreak
                                                            ? "bg-surface-container-lowest pl-9"
                                                            : "bg-surface",
                                                    ].join(" ")}
                                                    defaultValue={period.type}
                                                >
                                                    {periodTypes.map((periodType) => (
                                                        <option key={periodType.value} value={periodType.value}>
                                                            {periodType.label}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        <div className="flex justify-end gap-2 opacity-100 transition-opacity md:opacity-0 md:group-hover:opacity-100">
                                            <button
                                                type="button"
                                                className="flex h-8 w-8 items-center justify-center rounded-md text-on-surface-variant transition-colors hover:bg-primary/10 hover:text-primary"
                                                aria-label={`Drag period ${period.id}`}
                                                title="Drag"
                                            >
                                                <GripVertical className="h-4 w-4" aria-hidden="true" />
                                            </button>
                                            <button
                                                type="button"
                                                className="flex h-8 w-8 items-center justify-center rounded-md text-on-surface-variant transition-colors hover:bg-error/10 hover:text-error"
                                                aria-label={`Delete period ${period.id}`}
                                                title="Delete"
                                            >
                                                <Trash2 className="h-4 w-4" aria-hidden="true" />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="flex justify-center border-t border-outline-variant/30 bg-surface/30 p-4">
                            <button
                                type="button"
                                className="flex w-full max-w-sm items-center justify-center gap-2 rounded-lg border border-dashed border-outline-variant px-4 py-2 font-label text-sm text-on-surface-variant transition-colors hover:bg-surface-variant hover:text-on-surface"
                            >
                                <Plus className="h-4 w-4" aria-hidden="true" />
                                Add Block
                            </button>
                        </div>
                    </section>
                </div>
            </section>
        </div>
    );
};

export default ClientAssignmentGridPage
