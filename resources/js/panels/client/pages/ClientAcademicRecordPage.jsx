import { getApiErrorMessage } from "@/apis/auth/client.api";
import { useGetGradeData } from "@/apis/grade/get.api";
import { useGetSubjects } from "@/apis/subject/get.api";
import { useGetTeachers } from "@/apis/teacher/get.api";
import { useGetScheduleTemplates } from "@/apis/schedule-template/get.api";
import { 
    AlertCircle, 
    BookOpen, 
    Calendar, 
    ChevronRight, 
    ClipboardList, 
    GraduationCap, 
    Info, 
    Search, 
    Sparkles, 
    User, 
    X 
} from "lucide-react";
import { useMemo, useState } from "react";

const ClientAcademicRecordPage = () => {
    const gradeDataQuery = useGetGradeData();
    const teachersQuery = useGetTeachers();
    const subjectsQuery = useGetSubjects({ status: "active" });
    const templatesQuery = useGetScheduleTemplates();

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedGradeSection, setSelectedGradeSection] = useState(null);

    // Lookups
    const subjectMap = useMemo(() => {
        const list = subjectsQuery.data ?? [];
        return new Map(list.map((s) => [String(s.id), s.name]));
    }, [subjectsQuery.data]);

    const templateMap = useMemo(() => {
        const list = templatesQuery.data ?? [];
        return new Map(list.map((t) => [String(t.id), t.name]));
    }, [templatesQuery.data]);

    // Compute metrics for each grade section
    const computedGradeSections = useMemo(() => {
        const sections = gradeDataQuery.data?.gradeSections ?? [];
        const teachers = teachersQuery.data ?? [];

        return sections.map((gs) => {
            // Find all teacher assignments for this grade section
            const assignments = [];
            teachers.forEach((teacher) => {
                const teacherAssignments = Array.isArray(teacher.assignments) ? teacher.assignments : [];
                teacherAssignments.forEach((assign) => {
                    if (String(assign.grade_section_id) === String(gs.id)) {
                        assignments.push({
                            teacher,
                            subjectId: String(assign.subject_id),
                            subjectName: subjectMap.get(String(assign.subject_id)) || `Subject #${assign.subject_id}`,
                            sessionsPerWeek: assign.sessions_per_week ?? 5,
                            maxSessionsPerDay: assign.max_sessions_per_day ?? 1,
                        });
                    }
                });
            });

            const uniqueTeachers = new Set(assignments.map((a) => a.teacher.id));
            const uniqueSubjects = new Set(assignments.map((a) => a.subjectId));

            return {
                ...gs,
                assignments,
                teachersCount: uniqueTeachers.size,
                subjectsCount: uniqueSubjects.size,
            };
        });
    }, [gradeDataQuery.data, teachersQuery.data, subjectMap]);

    // Filtered grade sections based on search query
    const filteredGradeSections = useMemo(() => {
        if (!searchQuery.trim()) return computedGradeSections;
        const normalizedQuery = searchQuery.toLowerCase();
        return computedGradeSections.filter((gs) => 
            gs.name?.toLowerCase().includes(normalizedQuery)
        );
    }, [computedGradeSections, searchQuery]);

    // Detailed assignments view for the selected grade section
    const selectedDetails = useMemo(() => {
        if (!selectedGradeSection) return null;
        
        // Retrieve full computed details of selected section
        const sectionInfo = computedGradeSections.find(
            (gs) => String(gs.id) === String(selectedGradeSection.id)
        );
        if (!sectionInfo) return null;

        // Determine which active subjects are NOT assigned to this grade section
        const assignedSubjectIds = new Set(sectionInfo.assignments.map((a) => a.subjectId));
        const allSubjects = subjectsQuery.data ?? [];
        const unassignedSubjects = allSubjects.filter(
            (s) => !assignedSubjectIds.has(String(s.id))
        );

        return {
            ...sectionInfo,
            unassignedSubjects,
        };
    }, [selectedGradeSection, computedGradeSections, subjectsQuery.data]);

    const isLoading = 
        gradeDataQuery.isLoading || 
        teachersQuery.isLoading || 
        subjectsQuery.isLoading || 
        templatesQuery.isLoading;

    const hasError = 
        gradeDataQuery.isError || 
        teachersQuery.isError || 
        subjectsQuery.isError || 
        templatesQuery.isError;

    const error = 
        gradeDataQuery.error || 
        teachersQuery.error || 
        subjectsQuery.error || 
        templatesQuery.error;

    return (
        <div className="min-h-screen rounded-xl bg-background p-1 text-on-surface">
            <div className="mx-auto max-w-[1440px] space-y-6">
                {/* Header */}
                <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <p className="font-label text-xs uppercase tracking-wider text-primary">Academic Module</p>
                        <h1 className="mt-2 text-3xl font-semibold text-on-surface">Academic Record</h1>
                        <p className="mt-2 max-w-2xl text-sm leading-6 text-primary">
                            Explore curriculum layout mapping. Click any grade section below to see active subject and teacher assignments.
                        </p>
                    </div>
                </section>

                {/* Search Bar */}
                <div className="relative max-w-md">
                    <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-primary" />
                    <input
                        type="text"
                        placeholder="Search grade level or section..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full rounded-full border border-primary/20 bg-surface-container-low py-3 pl-12 pr-4 text-sm text-on-surface outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                </div>

                {/* States */}
                {isLoading ? (
                    <div className="flex h-64 items-center justify-center">
                        <div className="flex flex-col items-center gap-3">
                            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                            <p className="text-sm font-medium text-primary">Loading academic information...</p>
                        </div>
                    </div>
                ) : hasError ? (
                    <div className="rounded-xl border border-error/20 bg-error-container/20 p-4 text-sm text-error">
                        {getApiErrorMessage(error, "Failed to load academic records.")}
                    </div>
                ) : filteredGradeSections.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-outline-variant/50 p-12 text-center">
                        <ClipboardList className="mx-auto h-12 w-12 text-primary/40" />
                        <h3 className="mt-4 text-lg font-semibold text-on-surface">No Academic Records Found</h3>
                        <p className="mt-2 text-sm text-on-surface-variant max-w-md mx-auto">
                            No grade sections match your search or exist in the system yet. Ensure you configure grades in Grade Management.
                        </p>
                    </div>
                ) : (
                    /* Grade Grid */
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {filteredGradeSections.map((gs) => (
                            <div
                                key={gs.id}
                                onClick={() => setSelectedGradeSection(gs)}
                                className="group relative cursor-pointer overflow-hidden rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-6 shadow-sm transition hover:border-primary/50 hover:shadow-md hover:-translate-y-1"
                            >
                                <div className="absolute right-0 top-0 h-24 w-24 translate-x-8 -translate-y-8 rounded-full bg-primary/5 transition group-hover:scale-125" />
                                
                                <div className="flex items-center gap-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-container text-on-primary-container">
                                        <GraduationCap className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-on-surface">{gs.name}</h3>
                                        <p className="text-xs text-on-surface-variant">
                                            Template: {templateMap.get(String(gs.schedule_template_id)) || "Default"}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-6 grid grid-cols-2 gap-4 border-t border-outline-variant/20 pt-4">
                                    <div>
                                        <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Subjects</p>
                                        <div className="mt-1 flex items-center gap-1.5">
                                            <BookOpen className="h-4 w-4 text-primary" />
                                            <span className="text-sm font-bold text-on-surface">{gs.subjectsCount}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Teachers</p>
                                        <div className="mt-1 flex items-center gap-1.5">
                                            <User className="h-4 w-4 text-primary" />
                                            <span className="text-sm font-bold text-on-surface">{gs.teachersCount}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-4 flex items-center justify-between text-xs font-semibold text-primary">
                                    <span>View curriculum details</span>
                                    <ChevronRight className="h-4 w-4 transition group-hover:translate-x-1" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Side sheet Drawer for Detail View */}
            {selectedDetails && (
                <div className="fixed inset-0 z-50 flex justify-end">
                    {/* Glassmorphic backdrop */}
                    <div 
                        className="absolute inset-0 bg-inverse-surface/35 backdrop-blur-sm"
                        onClick={() => setSelectedGradeSection(null)}
                    />
                    
                    {/* Drawer Content */}
                    <aside className="relative flex h-full w-full max-w-xl flex-col bg-surface p-6 shadow-2xl animate-in slide-in-from-right duration-300">
                        {/* Close button */}
                        <button
                            onClick={() => setSelectedGradeSection(null)}
                            className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full text-on-surface-variant transition hover:bg-surface-variant"
                        >
                            <X className="h-5 w-5" />
                        </button>

                        {/* Title Section */}
                        <div className="mb-6">
                            <div className="flex items-center gap-2">
                                <GraduationCap className="h-6 w-6 text-primary" />
                                <h2 className="text-2xl font-bold text-on-surface">{selectedDetails.name} Curriculum</h2>
                            </div>
                            <p className="mt-1 text-xs text-on-surface-variant">
                                Schedule Template: <strong className="text-primary">{templateMap.get(String(selectedDetails.schedule_template_id)) || "Default"}</strong>
                            </p>
                        </div>

                        {/* Scrolling Content Area */}
                        <div className="flex-1 overflow-y-auto space-y-6 pr-2">
                            
                            {/* Assigned Subjects & Teachers */}
                            <div>
                                <h3 className="text-sm font-bold uppercase tracking-wider text-on-surface-variant mb-3">
                                    Assigned Staff ({selectedDetails.assignments.length})
                                </h3>
                                {selectedDetails.assignments.length === 0 ? (
                                    <div className="rounded-xl border border-dashed border-outline-variant/50 p-6 text-center text-sm text-on-surface-variant">
                                        No subjects or teachers have been assigned to this grade section yet.
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {selectedDetails.assignments.map((item, idx) => (
                                            <article 
                                                key={idx}
                                                className="rounded-xl border border-outline-variant/30 bg-surface-container-low p-4 shadow-sm"
                                            >
                                                <div className="flex flex-wrap items-center justify-between gap-2">
                                                    <h4 className="font-bold text-on-surface text-base">{item.subjectName}</h4>
                                                    <div className="flex gap-1.5">
                                                        <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                                                            <Calendar className="h-3.5 w-3.5" />
                                                            {item.sessionsPerWeek} periods/wk
                                                        </span>
                                                        <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-0.5 text-xs font-semibold text-on-secondary">
                                                            Limit: {item.maxSessionsPerDay}/day
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="mt-3 flex items-center gap-3 border-t border-outline-variant/10 pt-3">
                                                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-container-high text-primary">
                                                        <User className="h-5 w-5" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-semibold text-on-surface">
                                                            {item.teacher.full_name}
                                                        </p>
                                                        <p className="text-[11px] text-on-surface-variant capitalize">
                                                            {item.teacher.employment_type} &bull; {item.teacher.email}
                                                        </p>
                                                    </div>
                                                </div>

                                                {item.teacher.ai_context_notes && (
                                                    <div className="mt-3 flex items-start gap-1.5 rounded-lg bg-surface-container-highest px-3 py-2 text-xs text-on-surface-variant">
                                                        <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary animate-pulse" />
                                                        <span>
                                                            <strong>Teacher Context Note:</strong> {item.teacher.ai_context_notes}
                                                        </span>
                                                    </div>
                                                )}
                                            </article>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Unassigned Subjects */}
                            <div>
                                <h3 className="text-sm font-bold uppercase tracking-wider text-on-surface-variant mb-3">
                                    Unassigned Subjects ({selectedDetails.unassignedSubjects.length})
                                </h3>
                                {selectedDetails.unassignedSubjects.length === 0 ? (
                                    <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-300">
                                        All curriculum subjects are fully assigned to teachers for this grade.
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                        {selectedDetails.unassignedSubjects.map((subject) => (
                                            <div 
                                                key={subject.id}
                                                className="flex items-center gap-2 rounded-lg border border-outline-variant/20 bg-surface-container-lowest px-3 py-2.5 text-sm text-on-surface"
                                            >
                                                <AlertCircle className="h-4 w-4 text-warning" />
                                                <span className="font-medium truncate">{subject.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                        </div>
                    </aside>
                </div>
            )}
        </div>
    );
};

export default ClientAcademicRecordPage;
