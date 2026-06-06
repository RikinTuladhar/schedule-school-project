import { ChevronLeft, ChevronRight, Pencil, Search, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const PAGE_SIZE = 10;

const inputClassName =
    "rounded-xl border border-primary bg-background px-4 py-2 text-sm text-on-surface outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20";

const ManagementDataTable = ({
    title,
    description,
    records,
    columns,
    filterLabel = "Filter",
    filterOptions = [{ label: "All", value: "all" }],
    getFilterValue = () => "all",
    getSearchText = (record) => record.name ?? "",
    onDelete,
    onEdit,
    searchPlaceholder = "Search by name...",
}) => {
    const [searchValue, setSearchValue] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [filterValue, setFilterValue] = useState("all");
    const [page, setPage] = useState(1);

    useEffect(() => {
        const timer = window.setTimeout(() => {
            setDebouncedSearch(searchValue.trim().toLowerCase());
        }, 250);

        return () => window.clearTimeout(timer);
    }, [searchValue]);

    useEffect(() => {
        setPage(1);
    }, [debouncedSearch, filterValue]);

    const filteredRecords = useMemo(() => {
        return records.filter((record) => {
            const matchesSearch = getSearchText(record).toLowerCase().includes(debouncedSearch);
            const matchesFilter = filterValue === "all" || getFilterValue(record) === filterValue;

            return matchesSearch && matchesFilter;
        });
    }, [debouncedSearch, filterValue, getFilterValue, getSearchText, records]);

    const totalEntries = filteredRecords.length;
    const totalPages = Math.max(1, Math.ceil(totalEntries / PAGE_SIZE));
    const safePage = Math.min(page, totalPages);
    const pageStartIndex = (safePage - 1) * PAGE_SIZE;
    const pageRecords = filteredRecords.slice(pageStartIndex, pageStartIndex + PAGE_SIZE);
    const firstEntry = totalEntries === 0 ? 0 : pageStartIndex + 1;
    const lastEntry = Math.min(pageStartIndex + PAGE_SIZE, totalEntries);
    const isDebouncing = searchValue.trim().toLowerCase() !== debouncedSearch;

    return (
        <section className="rounded-xl bg-surface-container p-5 text-on-surface shadow-sm">
            <div className="mb-5 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
                <div>
                    <h2 className="text-2xl font-semibold text-on-surface">{title}</h2>
                    {description ? <p className="mt-1 text-sm text-primary">{description}</p> : null}
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                    <label className="relative min-w-0 sm:w-72">
                        <span className="sr-only">Search records</span>
                        <Search
                            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary"
                            aria-hidden="true"
                        />
                        <input
                            className={`${inputClassName} w-full pl-10`}
                            value={searchValue}
                            onChange={(event) => setSearchValue(event.target.value)}
                            placeholder={searchPlaceholder}
                            type="search"
                        />
                        {isDebouncing ? (
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-primary">
                                Searching
                            </span>
                        ) : null}
                    </label>

                    <label className="min-w-0 sm:w-48">
                        <span className="sr-only">{filterLabel}</span>
                        <select
                            className={`${inputClassName} w-full`}
                            value={filterValue}
                            onChange={(event) => setFilterValue(event.target.value)}
                        >
                            {filterOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </label>
                </div>
            </div>

            <div className="overflow-hidden rounded-xl shadow-sm">
                <div className="overflow-x-auto">
                    <table className="min-w-full border-collapse bg-surface-container text-left text-sm text-on-surface">
                        <thead className="bg-surface-container">
                            <tr>
                                {columns.map((column) => (
                                    <th key={column.key} className="px-4 py-3 font-semibold text-on-surface">
                                        {column.label}
                                    </th>
                                ))}
                                <th className="px-4 py-3 text-right font-semibold text-on-surface">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pageRecords.length > 0 ? (
                                pageRecords.map((record) => (
                                    <tr
                                        key={record.id}
                                        className="border-b border-primary/20 transition hover:bg-background"
                                    >
                                        {columns.map((column) => (
                                            <td key={column.key} className="px-4 py-3">
                                                {column.render ? column.render(record) : record[column.key]}
                                            </td>
                                        ))}
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    type="button"
                                                    className="inline-flex items-center gap-2 rounded-xl bg-primary px-3 py-2 text-xs font-semibold text-on-primary transition hover:bg-primary/90"
                                                    onClick={() => onEdit?.(record)}
                                                >
                                                    <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                                                    Edit
                                                </button>
                                                {onDelete ? (
                                                    <button
                                                        type="button"
                                                        className="inline-flex items-center gap-2 rounded-xl border border-primary px-3 py-2 text-xs font-semibold text-primary transition hover:bg-background"
                                                        onClick={() => onDelete(record)}
                                                    >
                                                        <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                                                        Delete
                                                    </button>
                                                ) : null}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={columns.length + 1} className="px-4 py-10 text-center text-primary">
                                        No matching records found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="mt-5 flex flex-col justify-between gap-3 text-sm text-primary sm:flex-row sm:items-center">
                <p>
                    Showing {firstEntry} to {lastEntry} of {totalEntries} entries
                </p>
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        className="inline-flex items-center gap-2 rounded-xl border border-primary px-3 py-2 text-on-surface transition disabled:cursor-not-allowed disabled:text-primary"
                        disabled={safePage === 1}
                        onClick={() => setPage((current) => Math.max(1, current - 1))}
                    >
                        <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                        Previous
                    </button>
                    <span className="rounded-xl bg-background px-3 py-2 text-on-surface">
                        {safePage} / {totalPages}
                    </span>
                    <button
                        type="button"
                        className="inline-flex items-center gap-2 rounded-xl border border-primary px-3 py-2 text-on-surface transition disabled:cursor-not-allowed disabled:text-primary"
                        disabled={safePage === totalPages}
                        onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                    >
                        Next
                        <ChevronRight className="h-4 w-4" aria-hidden="true" />
                    </button>
                </div>
            </div>
        </section>
    );
};

export default ManagementDataTable;

