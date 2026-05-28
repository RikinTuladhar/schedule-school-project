import { getApiErrorMessage } from "@/apis/auth/client.api";
import { useDeleteSubject } from "@/apis/subject/delete.api";
import { useGetSubjects } from "@/apis/subject/get.api";
import { useCreateSubject } from "@/apis/subject/post.api";
import { useUpdateSubject } from "@/apis/subject/update.api";
import ManagementDataTable from "@/panels/client/components/ManagementDataTable";
import { BookOpen, Plus, Save, X } from "lucide-react";
import { useState } from "react";

const inputClassName =
    "w-full rounded-xl border border-[#52616B] bg-[#F0F5F9] px-4 py-3 text-sm text-[#1E2022] outline-none transition focus:border-[#52616B] focus:ring-2 focus:ring-[#52616B]";

const ClientSubjectPage = () => {
    const subjectsQuery = useGetSubjects();
    const createSubjectMutation = useCreateSubject();
    const updateSubjectMutation = useUpdateSubject();
    const deleteSubjectMutation = useDeleteSubject();

    const [subjectName, setSubjectName] = useState("");
    const [subjectStatus, setSubjectStatus] = useState("active");
    const [editingSubjectId, setEditingSubjectId] = useState(null);
    const [statusMessage, setStatusMessage] = useState(null);

    const subjects = subjectsQuery.data ?? [];
    const isSaving = createSubjectMutation.isPending || updateSubjectMutation.isPending;
    const formError = createSubjectMutation.error || updateSubjectMutation.error;

    const resetForm = () => {
        setEditingSubjectId(null);
        setSubjectName("");
        setSubjectStatus("active");
    };

    const handleAddSubject = (event) => {
        event.preventDefault();
        const trimmed = subjectName.trim();

        if (!trimmed) {
            return;
        }

        const payload = {
            name: trimmed,
            status: subjectStatus,
        };

        const mutationOptions = {
            onSuccess: () => {
                setStatusMessage(editingSubjectId ? "Subject updated." : "Subject saved.");
                resetForm();
            },
        };

        if (editingSubjectId) {
            updateSubjectMutation.mutate(
                {
                    subjectId: editingSubjectId,
                    payload,
                },
                mutationOptions,
            );
            return;
        }

        createSubjectMutation.mutate(payload, mutationOptions);
    };

    const handleEditSubject = (subject) => {
        setEditingSubjectId(subject.id);
        setSubjectName(subject.name ?? "");
        setSubjectStatus(subject.status ?? "active");
        setStatusMessage(null);
    };

    const handleDeleteSubject = (subject) => {
        const shouldDelete = window.confirm(`Delete ${subject.name}?`);

        if (!shouldDelete) {
            return;
        }

        deleteSubjectMutation.mutate(subject.id, {
            onSuccess: () => {
                if (editingSubjectId === subject.id) {
                    resetForm();
                }

                setStatusMessage("Subject deleted.");
            },
        });
    };

    return (
        <div className="min-h-screen rounded-xl bg-[#F0F5F9] p-1 text-[#1E2022]">
            <div className="mx-auto max-w-[1440px] space-y-6">
                <section>
                    <p className="font-label text-xs uppercase tracking-wider text-[#52616B]">Master Data</p>
                    <h1 className="mt-2 text-3xl font-semibold text-[#1E2022]">Subject Management</h1>
                    <p className="mt-2 max-w-3xl text-sm leading-6 text-[#52616B]">
                        Maintain the subject catalog used by class templates, teacher assignments, and AI scheduling
                        constraints. School scope is inherited from the active tenant session.
                    </p>
                </section>

                {subjectsQuery.isError ? (
                    <div className="rounded-xl border border-[#52616B] bg-[#C9D6DF] p-4 text-sm text-[#1E2022] shadow-sm">
                        {getApiErrorMessage(subjectsQuery.error, "Unable to load subjects.")}
                    </div>
                ) : null}

                {formError ? (
                    <div className="rounded-xl border border-[#52616B] bg-[#C9D6DF] p-4 text-sm text-[#1E2022] shadow-sm">
                        {getApiErrorMessage(formError, "Unable to save subject.")}
                    </div>
                ) : null}

                {deleteSubjectMutation.isError ? (
                    <div className="rounded-xl border border-[#52616B] bg-[#C9D6DF] p-4 text-sm text-[#1E2022] shadow-sm">
                        {getApiErrorMessage(deleteSubjectMutation.error, "Unable to delete subject.")}
                    </div>
                ) : null}

                {statusMessage ? (
                    <div className="rounded-xl border border-[#52616B] bg-[#C9D6DF] p-4 text-sm font-semibold text-[#1E2022] shadow-sm">
                        {statusMessage}
                    </div>
                ) : null}

                <form className="rounded-xl bg-[#C9D6DF] p-5 shadow-sm" onSubmit={handleAddSubject}>
                    <div className="mb-5 flex flex-col justify-between gap-4 md:flex-row md:items-start">
                        <div className="flex items-center gap-3">
                            <span className="rounded-xl bg-[#52616B] p-2 text-[#F0F5F9]">
                                <BookOpen className="h-5 w-5" aria-hidden="true" />
                            </span>
                            <div>
                                <h2 className="text-xl font-semibold">
                                    {editingSubjectId ? "Edit Subject" : "Add New Subject"}
                                </h2>
                                <p className="text-sm text-[#52616B]">Subject name is required. Status defaults active.</p>
                            </div>
                        </div>

                        {editingSubjectId ? (
                            <button
                                type="button"
                                className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#52616B] px-4 py-3 text-sm font-semibold text-[#1E2022] shadow-sm transition hover:bg-[#F0F5F9]"
                                onClick={resetForm}
                            >
                                <X className="h-4 w-4" aria-hidden="true" />
                                Cancel Edit
                            </button>
                        ) : null}
                    </div>

                    <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_220px_auto]">
                        <label>
                            <span className="sr-only">Subject Name</span>
                            <input
                                className={inputClassName}
                                value={subjectName}
                                onChange={(event) => setSubjectName(event.target.value)}
                                placeholder="ICT"
                                required
                            />
                        </label>

                        <label>
                            <span className="sr-only">Subject Status</span>
                            <select
                                className={inputClassName}
                                value={subjectStatus}
                                onChange={(event) => setSubjectStatus(event.target.value)}
                            >
                                <option value="active">Active</option>
                                <option value="archived">Archived</option>
                            </select>
                        </label>

                        <button
                            type="submit"
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#52616B] px-5 py-3 text-sm font-semibold text-[#F0F5F9] shadow-sm transition hover:bg-[#52616B] disabled:cursor-not-allowed disabled:opacity-70"
                            disabled={isSaving}
                        >
                            <Plus className="h-4 w-4" aria-hidden="true" />
                            {isSaving ? "Saving..." : editingSubjectId ? "Update Subject" : "Add Subject"}
                        </button>
                    </div>

                    <div className="sticky bottom-0 mt-5 flex justify-end bg-[#C9D6DF] pt-4">
                        <button
                            type="submit"
                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#52616B] px-4 py-3 text-sm font-semibold text-[#1E2022] shadow-sm transition hover:bg-[#F0F5F9] disabled:cursor-not-allowed disabled:opacity-70"
                            disabled={isSaving}
                        >
                            <Save className="h-4 w-4" aria-hidden="true" />
                            Save Data
                        </button>
                    </div>
                </form>

                <ManagementDataTable
                    title="Saved Subjects"
                    description={
                        subjectsQuery.isLoading
                            ? "Loading subjects..."
                            : "Search subjects by name. The table displays 10 records per page."
                    }
                    records={subjects}
                    searchPlaceholder="Search subjects..."
                    filterLabel="Subject Status"
                    filterOptions={[
                        { label: "All", value: "all" },
                        { label: "Active", value: "active" },
                        { label: "Archived", value: "archived" },
                    ]}
                    getFilterValue={(record) => record.status}
                    getSearchText={(record) => record.name}
                    onEdit={handleEditSubject}
                    onDelete={handleDeleteSubject}
                    columns={[
                        { key: "name", label: "Subject Name" },
                        {
                            key: "status",
                            label: "Status",
                            render: (record) => (
                                <span className="rounded-xl border border-[#52616B] px-3 py-1 text-xs font-semibold capitalize text-[#52616B]">
                                    {record.status}
                                </span>
                            ),
                        },
                    ]}
                />
            </div>
        </div>
    );
};

export default ClientSubjectPage;
