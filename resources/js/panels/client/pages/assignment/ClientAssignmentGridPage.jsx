import { getApiErrorMessage } from "@/apis/auth/client.api";
import { useGetGradeData } from "@/apis/grade/get.api";
import { useDeleteScheduleTemplate } from "@/apis/schedule-template/delete.api";
import { useGetScheduleTemplates } from "@/apis/schedule-template/get.api";
import { useCreateScheduleTemplate } from "@/apis/schedule-template/post.api";
import { useUpdateScheduleTemplate } from "@/apis/schedule-template/update.api";
import { Coffee, GraduationCap, Layers, Plus, Save, Search, Trash2, X } from "lucide-react";
import { useMemo, useState } from "react";

const days = ["M", "T", "W", "Th", "F"];

const levelOptions = [
    { value: "elementary", label: "Elementary" },
    { value: "secondary", label: "Secondary" },
    { value: "high", label: "High Level" },
];

const periodTypes = [
    { value: "academic", label: "Academic Class" },
    { value: "break", label: "Break" },
    { value: "assembly", label: "Assembly" },
];

const inputClassName =
    "w-full rounded-xl border border-primary bg-background px-4 py-3 text-sm text-on-surface outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20";

const createPeriod = (index = 0) => ({
    id: globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`,
    start: index === 0 ? "08:00" : "09:00",
    end: index === 0 ? "09:00" : "10:00",
    type: "academic",
});

const createInitialForm = () => ({
    name: "",
    level: "elementary",
    grade_ids: [],
    days,
    start_time: "08:00",
    end_time: "15:00",
    periods: [createPeriod(0)],
});

const normalizeTemplateForm = (template) => ({
    name: template.name ?? "",
    level: template.level ?? "elementary",
    grade_ids: (template.grade_ids ?? []).map(String),
    days: template.days ?? days,
    start_time: template.start_time?.slice(0, 5) ?? "08:00",
    end_time: template.end_time?.slice(0, 5) ?? "15:00",
    periods:
        Array.isArray(template.periods) && template.periods.length > 0
            ? template.periods.map((period, index) => ({
                  id: period.id ?? `${template.id}-${index}`,
                  start: period.start?.slice(0, 5) ?? "08:00",
                  end: period.end?.slice(0, 5) ?? "09:00",
                  type: period.type ?? "academic",
              }))
            : [createPeriod(0)],
});

const buildPayload = (form) => ({
    name: form.name.trim(),
    level: form.level,
    grade_ids: form.grade_ids.map(Number),
    days: form.days,
    start_time: form.start_time,
    end_time: form.end_time,
    periods: form.periods.map((period) => ({
        start: period.start,
        end: period.end,
        type: period.type,
    })),
});

const ClientAssignmentGridPage = () => {
    const [filterLevel, setFilterLevel] = useState("all");
    const [searchValue, setSearchValue] = useState("");
    const [editingTemplateId, setEditingTemplateId] = useState(null);
    const [form, setForm] = useState(createInitialForm);
    const [statusMessage, setStatusMessage] = useState(null);

    const templatesQuery = useGetScheduleTemplates({ level: filterLevel });
    const gradeDataQuery = useGetGradeData();
    const createTemplateMutation = useCreateScheduleTemplate();
    const updateTemplateMutation = useUpdateScheduleTemplate();
    const deleteTemplateMutation = useDeleteScheduleTemplate();

    const templates = templatesQuery.data ?? [];
    const grades = gradeDataQuery.data?.grades ?? [];
    const selectedGradeIds = new Set(form.grade_ids);
    const formError = createTemplateMutation.error || updateTemplateMutation.error;
    const isSaving = createTemplateMutation.isPending || updateTemplateMutation.isPending;
    const hasRequiredData = form.name.trim() && form.grade_ids.length > 0 && form.days.length > 0 && form.periods.length > 0;

    const filteredTemplates = useMemo(() => {
        const query = searchValue.trim().toLowerCase();

        if (!query) {
            return templates;
        }

        return templates.filter((template) => template.name?.toLowerCase().includes(query));
    }, [searchValue, templates]);

    const gradeNameById = useMemo(() => {
        return grades.reduce((lookup, grade) => {
            lookup[String(grade.id)] = grade.name;
            return lookup;
        }, {});
    }, [grades]);

    const updateForm = (field, value) => {
        setForm((current) => ({ ...current, [field]: value }));
    };

    const updatePeriod = (periodId, field, value) => {
        setForm((current) => ({
            ...current,
            periods: current.periods.map((period) => (period.id === periodId ? { ...period, [field]: value } : period)),
        }));
    };

    const toggleGrade = (gradeId) => {
        const stringId = String(gradeId);
        updateForm(
            "grade_ids",
            selectedGradeIds.has(stringId)
                ? form.grade_ids.filter((id) => id !== stringId)
                : [...form.grade_ids, stringId],
        );
    };

    const toggleDay = (day) => {
        updateForm("days", form.days.includes(day) ? form.days.filter((item) => item !== day) : [...form.days, day]);
    };

    const resetForm = () => {
        setEditingTemplateId(null);
        setForm(createInitialForm());
        setStatusMessage(null);
    };

    const startEditing = (template) => {
        setEditingTemplateId(template.id);
        setForm(normalizeTemplateForm(template));
        setStatusMessage(null);
    };

    const handleDelete = (template) => {
        const shouldDelete = window.confirm(`Delete ${template.name}?`);

        if (!shouldDelete) {
            return;
        }

        deleteTemplateMutation.mutate(template.id, {
            onSuccess: () => {
                if (editingTemplateId === template.id) {
                    resetForm();
                }

                setStatusMessage("Template deleted.");
            },
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        const payload = buildPayload(form);
        const mutationOptions = {
            onSuccess: () => {
                setStatusMessage(editingTemplateId ? "Template updated." : "Template created.");
                resetForm();
            },
        };

        if (editingTemplateId) {
            updateTemplateMutation.mutate({ templateId: editingTemplateId, payload }, mutationOptions);
            return;
        }

        createTemplateMutation.mutate(payload, mutationOptions);
    };

    return (
        <div className="mx-auto max-w-[1440px] space-y-6">
            <section className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
                <div>
                    <p className="font-label text-xs uppercase tracking-wider text-primary">Template Builder</p>
                    <h2 className="mt-2 text-4xl font-bold text-on-surface md:text-5xl">Schedule Templates</h2>
                    <p className="mt-2 max-w-3xl text-base leading-7 text-on-surface-variant">
                        Create reusable elementary, secondary, or high-level templates, assign grades, and define each
                        period as academic class time or break time.
                    </p>
                </div>
                <button
                    type="button"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 font-label text-sm text-on-primary shadow-sm transition hover:bg-primary/90"
                    onClick={resetForm}
                >
                    <Plus className="h-4 w-4" aria-hidden="true" />
                    Create Template
                </button>
            </section>

            {statusMessage ? (
                <div className="rounded-xl border border-primary/30 bg-surface-container p-4 text-sm font-semibold text-on-surface">
                    {statusMessage}
                </div>
            ) : null}

            {templatesQuery.isError || gradeDataQuery.isError || deleteTemplateMutation.isError ? (
                <div className="rounded-xl border border-error/30 bg-error-container p-4 text-sm text-on-error-container">
                    {getApiErrorMessage(
                        templatesQuery.error || gradeDataQuery.error || deleteTemplateMutation.error,
                        "Unable to load template data.",
                    )}
                </div>
            ) : null}

            <section className="grid grid-cols-1 gap-6 xl:grid-cols-[380px_1fr]">
                <aside className="rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-5 shadow-sm">
                    <div className="mb-5 flex items-center justify-between gap-3">
                        <div>
                            <h3 className="text-2xl font-semibold text-on-surface">Templates</h3>
                            <p className="text-sm text-on-surface-variant">{filteredTemplates.length} records</p>
                        </div>
                        <Layers className="h-6 w-6 text-primary" aria-hidden="true" />
                    </div>

                    <div className="mb-4 space-y-3">
                        <label className="relative block">
                            <span className="sr-only">Search templates</span>
                            <Search
                                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary"
                                aria-hidden="true"
                            />
                            <input
                                className={`${inputClassName} pl-10`}
                                value={searchValue}
                                onChange={(event) => setSearchValue(event.target.value)}
                                placeholder="Search templates..."
                                type="search"
                            />
                        </label>

                        <select
                            className={inputClassName}
                            value={filterLevel}
                            onChange={(event) => setFilterLevel(event.target.value)}
                        >
                            <option value="all">All template types</option>
                            {levelOptions.map((level) => (
                                <option key={level.value} value={level.value}>
                                    {level.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-3">
                        {templatesQuery.isLoading ? (
                            <p className="rounded-xl bg-surface-container p-4 text-sm text-primary">Loading templates...</p>
                        ) : null}

                        {!templatesQuery.isLoading && filteredTemplates.length === 0 ? (
                            <p className="rounded-xl bg-surface-container p-4 text-sm text-primary">
                                No templates yet. Create the first one from the form.
                            </p>
                        ) : null}

                        {filteredTemplates.map((template) => {
                            const templateGrades = (template.grade_ids ?? [])
                                .map((id) => gradeNameById[String(id)])
                                .filter(Boolean);
                            const levelLabel =
                                levelOptions.find((level) => level.value === template.level)?.label ?? template.level;

                            return (
                                <article
                                    key={template.id}
                                    className={`rounded-xl border p-4 transition ${
                                        editingTemplateId === template.id
                                            ? "border-primary bg-primary-fixed"
                                            : "border-outline-variant/30 bg-surface-container hover:border-primary/40"
                                    }`}
                                >
                                    <button type="button" className="w-full text-left" onClick={() => startEditing(template)}>
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <h4 className="font-semibold text-on-surface">{template.name}</h4>
                                                <p className="mt-1 text-sm text-primary">{levelLabel}</p>
                                            </div>
                                            <span className="rounded-full bg-secondary-container px-3 py-1 text-xs font-semibold text-on-secondary-container">
                                                {(template.periods ?? []).length} periods
                                            </span>
                                        </div>
                                        <p className="mt-3 text-sm text-on-surface-variant">
                                            {templateGrades.length > 0 ? templateGrades.join(", ") : "No grades linked"}
                                        </p>
                                    </button>
                                    <button
                                        type="button"
                                        className="mt-4 inline-flex items-center gap-2 rounded-lg border border-error/30 px-3 py-2 text-xs font-semibold text-error transition hover:bg-error/10"
                                        onClick={() => handleDelete(template)}
                                    >
                                        <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                                        Delete
                                    </button>
                                </article>
                            );
                        })}
                    </div>
                </aside>

                <form
                    className="rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-5 shadow-sm"
                    onSubmit={handleSubmit}
                >
                    <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-start">
                        <div>
                            <h3 className="text-2xl font-semibold text-on-surface">
                                {editingTemplateId ? "Edit Template" : "Create Template"}
                            </h3>
                            <p className="text-sm text-on-surface-variant">
                                Pick the template type, attach grades, then define the day structure.
                            </p>
                        </div>
                        {editingTemplateId ? (
                            <button
                                type="button"
                                className="inline-flex items-center justify-center gap-2 rounded-xl border border-primary px-4 py-3 text-sm font-semibold text-primary transition hover:bg-surface-container"
                                onClick={resetForm}
                            >
                                <X className="h-4 w-4" aria-hidden="true" />
                                Cancel Edit
                            </button>
                        ) : null}
                    </div>

                    {formError ? (
                        <div className="mb-5 rounded-xl border border-error/30 bg-error-container p-4 text-sm text-on-error-container">
                            {getApiErrorMessage(formError, "Unable to save template.")}
                        </div>
                    ) : null}

                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                        <label>
                            <span className="mb-2 block text-sm font-semibold">Template Name</span>
                            <input
                                className={inputClassName}
                                value={form.name}
                                onChange={(event) => updateForm("name", event.target.value)}
                                placeholder="Elementary Standard Day"
                                required
                            />
                        </label>

                        <label>
                            <span className="mb-2 block text-sm font-semibold">Template Type</span>
                            <select
                                className={inputClassName}
                                value={form.level}
                                onChange={(event) => updateForm("level", event.target.value)}
                            >
                                {levelOptions.map((level) => (
                                    <option key={level.value} value={level.value}>
                                        {level.label}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <div className="grid grid-cols-2 gap-3">
                            <label>
                                <span className="mb-2 block text-sm font-semibold">Start</span>
                                <input
                                    className={inputClassName}
                                    type="time"
                                    value={form.start_time}
                                    onChange={(event) => updateForm("start_time", event.target.value)}
                                />
                            </label>
                            <label>
                                <span className="mb-2 block text-sm font-semibold">End</span>
                                <input
                                    className={inputClassName}
                                    type="time"
                                    value={form.end_time}
                                    onChange={(event) => updateForm("end_time", event.target.value)}
                                />
                            </label>
                        </div>
                    </div>

                    <section className="mt-6 rounded-xl border border-primary/20 bg-surface-container p-5">
                        <div className="mb-4 flex items-center gap-3">
                            <GraduationCap className="h-5 w-5 text-primary" aria-hidden="true" />
                            <div>
                                <h4 className="font-semibold text-on-surface">Grades Under This Template</h4>
                                <p className="text-sm text-primary">Select every grade that should use this template.</p>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {gradeDataQuery.isLoading ? <p className="text-sm text-primary">Loading grades...</p> : null}
                            {!gradeDataQuery.isLoading && grades.length === 0 ? (
                                <p className="text-sm text-primary">Create grades first before building templates.</p>
                            ) : null}
                            {grades.map((grade) => {
                                const isSelected = selectedGradeIds.has(String(grade.id));

                                return (
                                    <button
                                        key={grade.id}
                                        type="button"
                                        className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                                            isSelected
                                                ? "border-primary bg-primary text-on-primary"
                                                : "border-primary/30 bg-background text-primary hover:bg-primary-fixed"
                                        }`}
                                        aria-pressed={isSelected}
                                        onClick={() => toggleGrade(grade.id)}
                                    >
                                        {grade.name}
                                    </button>
                                );
                            })}
                        </div>
                    </section>

                    <section className="mt-6 rounded-xl border border-primary/20 bg-surface-container p-5">
                        <h4 className="mb-4 font-semibold text-on-surface">Applicable Days</h4>
                        <div className="flex flex-wrap gap-2">
                            {days.map((day) => {
                                const isSelected = form.days.includes(day);

                                return (
                                    <button
                                        key={day}
                                        type="button"
                                        className={`flex h-10 w-10 items-center justify-center rounded-full font-label text-sm transition ${
                                            isSelected
                                                ? "bg-primary text-on-primary"
                                                : "bg-background text-primary ring-1 ring-primary/30"
                                        }`}
                                        aria-pressed={isSelected}
                                        onClick={() => toggleDay(day)}
                                    >
                                        {day}
                                    </button>
                                );
                            })}
                        </div>
                    </section>

                    <section className="mt-6 overflow-hidden rounded-xl border border-outline-variant/30 bg-background">
                        <div className="grid grid-cols-[64px_minmax(180px,1fr)_minmax(180px,1fr)_56px] gap-3 border-b border-outline-variant/30 bg-surface-container px-4 py-3">
                            <span className="font-label text-xs uppercase text-primary">No.</span>
                            <span className="font-label text-xs uppercase text-primary">Time Slot</span>
                            <span className="font-label text-xs uppercase text-primary">Period Type</span>
                            <span className="text-right font-label text-xs uppercase text-primary">Del</span>
                        </div>

                        <div className="divide-y divide-outline-variant/20">
                            {form.periods.map((period, index) => {
                                const isBlocked = period.type === "break" || period.type === "assembly";

                                return (
                                    <div
                                        key={period.id}
                                        className={`grid grid-cols-1 gap-3 px-4 py-4 md:grid-cols-[64px_minmax(180px,1fr)_minmax(180px,1fr)_56px] md:items-center ${
                                            isBlocked ? "schedule-stripes bg-secondary-container/40" : "bg-background"
                                        }`}
                                    >
                                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-surface-container font-label text-sm text-primary">
                                            {index + 1}
                                        </span>

                                        <div className="flex flex-wrap items-center gap-2">
                                            <input
                                                className="w-28 rounded-lg border border-outline-variant/50 bg-surface px-3 py-2 text-sm text-on-surface outline-none focus:border-primary"
                                                type="time"
                                                value={period.start}
                                                onChange={(event) => updatePeriod(period.id, "start", event.target.value)}
                                                required
                                            />
                                            <span className="text-primary">to</span>
                                            <input
                                                className="w-28 rounded-lg border border-outline-variant/50 bg-surface px-3 py-2 text-sm text-on-surface outline-none focus:border-primary"
                                                type="time"
                                                value={period.end}
                                                onChange={(event) => updatePeriod(period.id, "end", event.target.value)}
                                                required
                                            />
                                        </div>

                                        <label className="relative block max-w-xs">
                                            {isBlocked ? (
                                                period.type === "assembly" ? (
                                                    <GraduationCap
                                                        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary"
                                                        aria-hidden="true"
                                                    />
                                                ) : (
                                                    <Coffee
                                                        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary"
                                                        aria-hidden="true"
                                                    />
                                                )
                                            ) : null}
                                            <select
                                                className={`${inputClassName} ${isBlocked ? "pl-9" : ""}`}
                                                value={period.type}
                                                onChange={(event) => updatePeriod(period.id, "type", event.target.value)}
                                            >
                                                {periodTypes.map((periodType) => (
                                                    <option key={periodType.value} value={periodType.value}>
                                                        {periodType.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </label>

                                        <button
                                            type="button"
                                            className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-error transition hover:bg-error/10 disabled:cursor-not-allowed disabled:opacity-40"
                                            disabled={form.periods.length === 1}
                                            aria-label={`Delete period ${index + 1}`}
                                            onClick={() =>
                                                updateForm(
                                                    "periods",
                                                    form.periods.filter((item) => item.id !== period.id),
                                                )
                                            }
                                        >
                                            <Trash2 className="h-4 w-4" aria-hidden="true" />
                                        </button>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="border-t border-outline-variant/30 bg-surface-container-low p-4">
                            <button
                                type="button"
                                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-primary px-4 py-3 font-label text-sm text-primary transition hover:bg-primary-fixed"
                                onClick={() => updateForm("periods", [...form.periods, createPeriod(form.periods.length)])}
                            >
                                <Plus className="h-4 w-4" aria-hidden="true" />
                                Add Period
                            </button>
                        </div>
                    </section>

                    {!hasRequiredData ? (
                        <p className="mt-4 text-sm font-semibold text-primary">
                            Template name, at least one grade, one day, and one period are required.
                        </p>
                    ) : null}

                    <div className="sticky bottom-0 mt-6 rounded-xl bg-surface-container-lowest py-4">
                        <button
                            type="submit"
                            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-4 text-sm font-semibold text-on-primary shadow-sm transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
                            disabled={isSaving || !hasRequiredData}
                        >
                            <Save className="h-4 w-4" aria-hidden="true" />
                            {isSaving ? "Saving..." : editingTemplateId ? "Update Template" : "Create Template"}
                        </button>
                    </div>
                </form>
            </section>
        </div>
    );
};

export default ClientAssignmentGridPage;
