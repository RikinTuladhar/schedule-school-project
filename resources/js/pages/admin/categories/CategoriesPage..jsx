import { Home, List, Pencil, Plus, RefreshCw, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
    deleteCategory,
    getAllCategories,
} from "../../../apis/categories/categoriesApi";

const CategoriesPage = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Extract title from path, e.g., /admin/catalog/products -> Products
    const pathParts = location.pathname.split("/");
    const title = pathParts[pathParts.length - 1]
        .replace(/-/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());
    const parent = pathParts[pathParts.length - 2]
        ?.replace(/-/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedIds, setSelectedIds] = useState([]);
    const [deleting, setDeleting] = useState(false);

    // Fetch categories on mount
    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const response = await getAllCategories({ language_id: 1 });
            if (response.success) {
                // Transform API data to match component structure
                const categories = response.data.data.map((cat) => ({
                    id: cat.category_id,
                    name: cat.description?.name || "Unnamed Category",
                    sortOrder: cat.sort_order,
                    image: cat.image,
                    status: cat.status,
                    top: cat.top,
                }));
                setData(categories);
            }
        } catch (error) {
            console.error("Failed to fetch categories:", error);
            alert("Failed to load categories. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedIds(data.map((item) => item.id));
        } else {
            setSelectedIds([]);
        }
    };

    const handleSelectOne = (id) => {
        setSelectedIds((prev) =>
            prev.includes(id)
                ? prev.filter((itemId) => itemId !== id)
                : [...prev, id]
        );
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this category?")) {
            return;
        }

        setDeleting(true);
        try {
            const response = await deleteCategory(id);
            if (response.success) {
                alert("Category deleted successfully!");
                fetchCategories(); // Refresh the list
            }
        } catch (error) {
            console.error("Failed to delete category:", error);
            alert(
                error.response?.data?.message ||
                    "Failed to delete category. Please try again."
            );
        } finally {
            setDeleting(false);
        }
    };

    const handleBulkDelete = async () => {
        if (selectedIds.length === 0) {
            alert("Please select at least one category to delete.");
            return;
        }

        if (
            !confirm(
                `Are you sure you want to delete ${selectedIds.length} selected categories?`
            )
        ) {
            return;
        }

        setDeleting(true);
        try {
            // Delete all selected categories
            await Promise.all(selectedIds.map((id) => deleteCategory(id)));
            alert("Selected categories deleted successfully!");
            setSelectedIds([]);
            fetchCategories(); // Refresh the list
        } catch (error) {
            console.error("Failed to delete categories:", error);
            alert("Failed to delete some categories. Please try again.");
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-600">
                        {title}
                    </h1>
                    <nav className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                        <Link to="/admin" className="hover:text-blue-500">
                            <Home size={12} />
                        </Link>
                        <span className="mx-1">›</span>
                        {parent && (
                            <>
                                <Link
                                    to="/admin/catalog/categories/add"
                                    className="text-gray-500 hover:text-blue-500"
                                >
                                    {parent}
                                </Link>
                                <span className="mx-1">›</span>
                            </>
                        )}
                        <span className="text-gray-500">{title}</span>
                    </nav>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() =>
                            navigate("/admin/catalog/categories/add")
                        }
                        className="bg-[#1e91cf] text-white p-2.5 rounded hover:bg-[#1978ab] shadow-sm transition-colors"
                        title="Add New"
                    >
                        <Plus size={16} strokeWidth={3} />
                    </button>
                    <button
                        onClick={fetchCategories}
                        disabled={loading}
                        className="bg-white text-gray-600 border border-gray-300 p-2.5 rounded hover:bg-gray-50 shadow-sm transition-colors disabled:opacity-50"
                        title="Rebuild"
                    >
                        <RefreshCw
                            size={16}
                            className={loading ? "animate-spin" : ""}
                        />
                    </button>
                    <button
                        onClick={handleBulkDelete}
                        disabled={selectedIds.length === 0 || deleting}
                        className="bg-[#d9534f] text-white p-2.5 rounded hover:bg-[#c9302c] shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Delete Selected"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>

            <div className="bg-white rounded shadow-sm border border-gray-200">
                <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                    <h3 className="font-semibold text-gray-600 flex items-center gap-2 text-sm">
                        <List size={16} className="text-[#1e91cf]" />
                        {title} List
                    </h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-gray-600 bg-white border-b border-gray-200">
                            <tr>
                                <th className="px-4 py-3 w-1">
                                    <input
                                        type="checkbox"
                                        className="rounded border-gray-300"
                                        checked={
                                            selectedIds.length ===
                                                data.length && data.length > 0
                                        }
                                        onChange={handleSelectAll}
                                    />
                                </th>
                                <th className="px-4 py-3 font-medium hover:underline cursor-pointer text-[#1e91cf]">
                                    {title} Name
                                </th>
                                <th className="px-4 py-3 font-medium text-right hover:underline cursor-pointer text-[#1e91cf]">
                                    Sort Order
                                </th>
                                <th className="px-4 py-3 font-medium text-right">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td
                                        colSpan="4"
                                        className="px-4 py-8 text-center text-gray-500"
                                    >
                                        <RefreshCw
                                            size={20}
                                            className="animate-spin inline-block"
                                        />
                                        <span className="ml-2">
                                            Loading categories...
                                        </span>
                                    </td>
                                </tr>
                            ) : data.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan="4"
                                        className="px-4 py-8 text-center text-gray-500"
                                    >
                                        No results!
                                    </td>
                                </tr>
                            ) : (
                                data.map((item) => (
                                    <tr
                                        key={item.id}
                                        className="hover:bg-gray-50 transition-colors"
                                    >
                                        <td className="px-4 py-3">
                                            <input
                                                type="checkbox"
                                                className="rounded border-gray-300"
                                                checked={selectedIds.includes(
                                                    item.id
                                                )}
                                                onChange={() =>
                                                    handleSelectOne(item.id)
                                                }
                                            />
                                        </td>
                                        <td className="px-4 py-3 text-gray-600">
                                            {item.name}
                                        </td>
                                        <td className="px-4 py-3 text-right text-gray-600">
                                            {item.sortOrder}
                                        </td>
                                        <td className="px-4 py-3 text-right flex gap-2 justify-end">
                                            <button
                                                onClick={() =>
                                                    navigate(
                                                        `/admin/catalog/categories/edit/${item.id}`
                                                    )
                                                }
                                                className="bg-[#1e91cf] text-white p-2 rounded hover:bg-[#1978ab] shadow-sm transition-colors"
                                                title="Edit"
                                            >
                                                <Pencil
                                                    size={14}
                                                    fill="currentColor"
                                                />
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleDelete(item.id)
                                                }
                                                disabled={deleting}
                                                className="bg-[#d9534f] text-white p-2 rounded hover:bg-[#c9302c] shadow-sm transition-colors disabled:opacity-50"
                                                title="Delete"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="p-4 border-t border-gray-200 text-xs text-gray-500 flex justify-between items-center">
                    <div>
                        Showing 1 to {data.length} of {data.length} (
                        {Math.ceil(data.length / 20) || 1} Pages)
                    </div>
                    <div>Showing {data.length} results</div>
                </div>
            </div>
        </div>
    );
};

export default CategoriesPage;
