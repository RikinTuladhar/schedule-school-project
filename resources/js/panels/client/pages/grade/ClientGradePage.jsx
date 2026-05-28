import { getApiErrorMessage } from "@/apis/auth/client.api";
import { useDeleteGradeSection } from "@/apis/grade/delete.api";
import { useGetGradeData } from "@/apis/grade/get.api";
import { useCreateGrade, useCreateGradeSection, useCreateSection } from "@/apis/grade/post.api";
import { useUpdateGradeSection } from "@/apis/grade/update.api";
import ManagementDataTable from "@/panels/client/components/ManagementDataTable";
import { Layers, Link2, Plus, Save, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const inputClassName =
    "w-full rounded-xl border border-[#52616B] bg-[#F0F5F9] px-4 py-3 text-sm text-[#1E2022] outline-none transition focus:border-[#52616B] focus:ring-2 focus:ring-[#52616B]";

const buttonClassName =
    "inline-flex items-center justify-center gap-2 rounded-xl bg-[#52616B] px-4 py-3 text-sm font-semibold text-[#F0F5F9] shadow-sm transition hover:bg-[#52616B] disabled:cursor-not-allowed disabled:opacity-70";

const templates = [
    { id: "tpl-elem-standard", name: "Elementary Standard Day" },
    { id: "tpl-middle-lab", name: "Middle School Lab Rotation" },
    { id: "tpl-senior-block", name: "Senior Block Schedule" },
];

const createInitialMatrixForm = () => ({
    grade_id: "",
    section_id: "",
    schedule_template_id: templates[0].id,
});

const ClientGradePage = () => {
    const gradeDataQuery = useGetGradeData();
    const createGradeMutation = useCreateGrade();
    const createSectionMutation = useCreateSection();
    const createGradeSectionMutation = useCreateGradeSection();
    const updateGradeSectionMutation = useUpdateGradeSection();
    const deleteGradeSectionMutation = useDeleteGradeSection();

    const [gradeName, setGradeName] = useState("");
    const [sectionName, setSectionName] = useState("");
    const [matrixForm, setMatrixForm] = useState(createInitialMatrixForm);
    const [editingGradeSectionId, setEditingGradeSectionId] = useState(null);
    const [statusMessage, setStatusMessage] = useState(null);

    const grades = gradeDataQuery.data?.grades ?? [];
    const sections = gradeDataQuery.data?.sections ?? [];
    const gradeSections = gradeDataQuery.data?.gradeSections ?? [];
    const isSavingGradeSection = createGradeSectionMutation.isPending || updateGradeSectionMutation.isPending;
    const formError =
        createGradeMutation.error ||
        createSectionMutation.error ||
        createGradeSectionMutation.error ||
        updateGradeSectionMutation.error;

    const templateById = useMemo(() => {
        return templates.reduce((lookup, template) => {
            lookup[template.id] = template.name;
            return lookup;
        }, {});
    }, []);

    useEffect(() => {
        setMatrixForm((current) => ({
            ...current,
            grade_id: current.grade_id || grades[0]?.id || "",
            section_id: current.section_id || sections[0]?.id || "",
        }));
    }, [grades, sections]);

    const resetMatrixForm = () => {
        setEditingGradeSectionId(null);
        setMatrixForm({
            grade_id: grades[0]?.id || "",
            section_id: sections[0]?.id || "",
            schedule_template_id: templates[0].id,
        });
    };

    const handleAddGrade = (event) => {
        event.preventDefault();
        const trimmed = gradeName.trim();

        if (!trimmed) {
            return;
        }

        createGradeMutation.mutate(
            { name: trimmed },
            {
                onSuccess: () => {
                    setGradeName("");
                    setStatusMessage("Grade saved.");
                },
            },
        );
    };

    const handleAddSection = (event) => {
        event.preventDefault();
        const trimmed = sectionName.trim().toUpperCase();

        if (!trimmed) {
            return;
        }

        createSectionMutation.mutate(
            { name: trimmed },
            {
                onSuccess: () => {
                    setSectionName("");
                    setStatusMessage("Section saved.");
                },
            },
        );
    };

    const handleCreateClass = (event) => {
        event.preventDefault();

        if (!matrixForm.grade_id || !matrixForm.section_id) {
            setStatusMessage("Add at least one grade and one section before creating a class link.");
            return;
        }

        const payload = {
            grade_id: Number(matrixForm.grade_id),
            section_id: Number(matrixForm.section_id),
            schedule_template_id: matrixForm.schedule_template_id,
        };

        const mutationOptions = {
            onSuccess: () => {
                setStatusMessage(editingGradeSectionId ? "Class link updated." : "Class link saved.");
                resetMatrixForm();
            },
        };

        if (editingGradeSectionId) {
            updateGradeSectionMutation.mutate(
                {
                    gradeSectionId: editingGradeSectionId,
                    payload,
                },
                mutationOptions,
            );
            return;
        }

        createGradeSectionMutation.mutate(payload, mutationOptions);
    };

    const handleEditClass = (record) => {
        setEditingGradeSectionId(record.id);
        setMatrixForm({
            grade_id: record.grade_id,
            section_id: record.section_id,
            schedule_template_id: record.schedule_template_id,
        });
        setStatusMessage(null);
    };

    const handleDeleteClass = (record) => {
        const shouldDelete = window.confirm(`Delete ${record.name}?`);

        if (!shouldDelete) {
            return;
        }

        deleteGradeSectionMutation.mutate(record.id, {
            onSuccess: () => {
                if (editingGradeSectionId === record.id) {
                    resetMatrixForm();
                }

                setStatusMessage("Class link deleted.");
            },
        });
    };

    return (
        <div className="min-h-screen rounded-xl bg-[#F0F5F9] p-1 text-[#1E2022]">
            <div className="mx-auto max-w-[1440px] space-y-6">
                <section>
                    <p className="font-label text-xs uppercase tracking-wider text-[#52616B]">Master Data</p>
                    <h1 className="mt-2 text-3xl font-semibold text-[#1E2022]">Grade & Section Management</h1>
                    <p className="mt-2 max-w-3xl text-sm leading-6 text-[#52616B]">
                        Define grade levels, section letters, and class links mapped to schedule templates. School scope
                        is inherited from the active tenant session.
                    </p>
                </section>

                {gradeDataQuery.isError ? (
                    <div className="rounded-xl border border-[#52616B] bg-[#C9D6DF] p-4 text-sm text-[#1E2022] shadow-sm">
                        {getApiErrorMessage(gradeDataQuery.error, "Unable to load grade data.")}
                    </div>
                ) : null}

                {formError ? (
                    <div className="rounded-xl border border-[#52616B] bg-[#C9D6DF] p-4 text-sm text-[#1E2022] shadow-sm">
                        {getApiErrorMessage(formError, "Unable to save grade data.")}
                    </div>
                ) : null}

                {deleteGradeSectionMutation.isError ? (
                    <div className="rounded-xl border border-[#52616B] bg-[#C9D6DF] p-4 text-sm text-[#1E2022] shadow-sm">
                        {getApiErrorMessage(deleteGradeSectionMutation.error, "Unable to delete class link.")}
                    </div>
                ) : null}

                {statusMessage ? (
                    <div className="rounded-xl border border-[#52616B] bg-[#C9D6DF] p-4 text-sm font-semibold text-[#1E2022] shadow-sm">
                        {statusMessage}
                    </div>
                ) : null}

                <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                    <form className="rounded-xl bg-[#C9D6DF] p-5 shadow-sm" onSubmit={handleAddGrade}>
                        <div className="mb-5 flex items-center gap-3">
                            <span className="rounded-xl bg-[#52616B] p-2 text-[#F0F5F9]">
                                <Layers className="h-5 w-5" aria-hidden="true" />
                            </span>
                            <div>
                                <h2 className="text-xl font-semibold">Grades</h2>
                                <p className="text-sm text-[#52616B]">Add grade levels such as Grade 1 or Grade 10.</p>
                            </div>
                        </div>
                        <label className="block">
                            <span className="mb-2 block text-sm font-semibold">Grade Level</span>
                            <input
                                className={inputClassName}
                                value={gradeName}
                                onChange={(event) => setGradeName(event.target.value)}
                                placeholder="Grade 4"
                                required
                            />
                        </label>
                        <button
                            type="submit"
                            className={`${buttonClassName} mt-4 w-full`}
                            disabled={createGradeMutation.isPending}
                        >
                            <Plus className="h-4 w-4" aria-hidden="true" />
                            {createGradeMutation.isPending ? "Saving..." : "Add Grade"}
                        </button>
                    </form>

                    <form className="rounded-xl bg-[#C9D6DF] p-5 shadow-sm" onSubmit={handleAddSection}>
                        <div className="mb-5 flex items-center gap-3">
                            <span className="rounded-xl bg-[#52616B] p-2 text-[#F0F5F9]">
                                <Layers className="h-5 w-5" aria-hidden="true" />
                            </span>
                            <div>
                                <h2 className="text-xl font-semibold">Sections</h2>
                                <p className="text-sm text-[#52616B]">Add section letters such as A, B, or C.</p>
                            </div>
                        </div>
                        <label className="block">
                            <span className="mb-2 block text-sm font-semibold">Section Letter</span>
                            <input
                                className={inputClassName}
                                value={sectionName}
                                onChange={(event) => setSectionName(event.target.value)}
                                placeholder="C"
                                maxLength={10}
                                required
                            />
                        </label>
                        <button
                            type="submit"
                            className={`${buttonClassName} mt-4 w-full`}
                            disabled={createSectionMutation.isPending}
                        >
                            <Plus className="h-4 w-4" aria-hidden="true" />
                            {createSectionMutation.isPending ? "Saving..." : "Add Section"}
                        </button>
                    </form>

                    <form className="rounded-xl bg-[#C9D6DF] p-5 shadow-sm" onSubmit={handleCreateClass}>
                        <div className="mb-5 flex items-start justify-between gap-3">
                            <div className="flex items-center gap-3">
                                <span className="rounded-xl bg-[#52616B] p-2 text-[#F0F5F9]">
                                    <Link2 className="h-5 w-5" aria-hidden="true" />
                                </span>
                                <div>
                                    <h2 className="text-xl font-semibold">
                                        {editingGradeSectionId ? "Edit Class Link" : "Grade-Section Matrix"}
                                    </h2>
                                    <p className="text-sm text-[#52616B]">Create an actual class like Grade 4C.</p>
                                </div>
                            </div>

                            {editingGradeSectionId ? (
                                <button
                                    type="button"
                                    className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#52616B] text-[#52616B] transition hover:bg-[#F0F5F9]"
                                    aria-label="Cancel edit"
                                    onClick={resetMatrixForm}
                                >
                                    <X className="h-4 w-4" aria-hidden="true" />
                                </button>
                            ) : null}
                        </div>

                        <div className="space-y-4">
                            <label className="block">
                                <span className="mb-2 block text-sm font-semibold">Select Grade</span>
                                <select
                                    className={inputClassName}
                                    value={matrixForm.grade_id}
                                    onChange={(event) =>
                                        setMatrixForm((current) => ({ ...current, grade_id: event.target.value }))
                                    }
                                    required
                                >
                                    <option value="">Select grade</option>
                                    {grades.map((grade) => (
                                        <option key={grade.id} value={grade.id}>
                                            {grade.name}
                                        </option>
                                    ))}
                                </select>
                            </label>

                            <label className="block">
                                <span className="mb-2 block text-sm font-semibold">Select Section</span>
                                <select
                                    className={inputClassName}
                                    value={matrixForm.section_id}
                                    onChange={(event) =>
                                        setMatrixForm((current) => ({ ...current, section_id: event.target.value }))
                                    }
                                    required
                                >
                                    <option value="">Select section</option>
                                    {sections.map((section) => (
                                        <option key={section.id} value={section.id}>
                                            {section.name}
                                        </option>
                                    ))}
                                </select>
                            </label>

                            <label className="block">
                                <span className="mb-2 block text-sm font-semibold">schedule_template_id</span>
                                <select
                                    className={inputClassName}
                                    value={matrixForm.schedule_template_id}
                                    onChange={(event) =>
                                        setMatrixForm((current) => ({
                                            ...current,
                                            schedule_template_id: event.target.value,
                                        }))
                                    }
                                    required
                                >
                                    {templates.map((template) => (
                                        <option key={template.id} value={template.id}>
                                            {template.name}
                                        </option>
                                    ))}
                                </select>
                            </label>
                        </div>

                        <div className="sticky bottom-0 mt-5 bg-[#C9D6DF] pt-4">
                            <button type="submit" className={`${buttonClassName} w-full`} disabled={isSavingGradeSection}>
                                <Save className="h-4 w-4" aria-hidden="true" />
                                {isSavingGradeSection
                                    ? "Saving..."
                                    : editingGradeSectionId
                                      ? "Update Class Link"
                                      : "Save Class Link"}
                            </button>
                        </div>
                    </form>
                </section>

                <ManagementDataTable
                    title="Class Matrix"
                    description={
                        gradeDataQuery.isLoading
                            ? "Loading class links..."
                            : "Exactly 10 records are shown per page. Search by class name or filter by template."
                    }
                    records={gradeSections}
                    searchPlaceholder="Search classes..."
                    filterLabel="Schedule Template"
                    filterOptions={[
                        { label: "All Templates", value: "all" },
                        ...templates.map((template) => ({ label: template.name, value: template.id })),
                    ]}
                    getFilterValue={(record) => record.schedule_template_id}
                    getSearchText={(record) => record.name ?? ""}
                    onEdit={handleEditClass}
                    onDelete={handleDeleteClass}
                    columns={[
                        { key: "name", label: "Class" },
                        { key: "grade", label: "Grade" },
                        { key: "section", label: "Section" },
                        {
                            key: "schedule_template_id",
                            label: "schedule_template_id",
                            render: (record) => templateById[record.schedule_template_id] ?? record.schedule_template_id,
                        },
                    ]}
                />
            </div>
        </div>
    );
};

export default ClientGradePage;
