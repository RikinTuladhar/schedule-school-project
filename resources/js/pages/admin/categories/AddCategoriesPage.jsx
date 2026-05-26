import { Image, Save, Undo } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { addCategory } from "../../../apis/categories/categoriesApi";
import TextEditor from "../../../components/admin/TextEditor";

const AddCategoriesPage = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("general");
    const [submitting, setSubmitting] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        meta_title: "",
        meta_description: "",
        meta_keyword: "",
        parent_id: 0,
        image: null, // Changed to null for file object
        top: false,
        sort_order: 0,
        status: true,
    });

    const [imagePreview, setImagePreview] = useState(null);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData((prev) => ({ ...prev, image: file }));
            // Create preview URL
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!formData.name.trim()) {
            alert("Category name is required!");
            setActiveTab("general");
            return;
        }

        setSubmitting(true);
        try {
            // Create FormData for multipart/form-data
            const formDataToSend = new FormData();

            // Append basic fields
            formDataToSend.append(
                "parent_id",
                parseInt(formData.parent_id) || 0
            );
            formDataToSend.append("top", formData.top ? 1 : 0);
            formDataToSend.append(
                "sort_order",
                parseInt(formData.sort_order) || 0
            );
            formDataToSend.append("status", formData.status ? 1 : 0);

            // Append image file if exists
            if (formData.image) {
                formDataToSend.append("image", formData.image);
            }

            // Append descriptions as JSON string
            const descriptions = [
                {
                    language_id: 1, // English
                    name: formData.name,
                    description: formData.description || null,
                    meta_title: formData.meta_title || null,
                    meta_description: formData.meta_description || null,
                    meta_keyword: formData.meta_keyword || null,
                },
            ];
            formDataToSend.append("descriptions", JSON.stringify(descriptions));

            const response = await addCategory(formDataToSend);

            if (response.success) {
                alert("Category added successfully!");
                navigate("/admin/catalog/categories");
            } else {
                alert("Failed to add category. Please try again.");
            }
        } catch (error) {
            console.error("Failed to add category:", error);
            alert(
                error.response?.data?.message ||
                    "Failed to add category. Please try again."
            );
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-600">
                        Categories
                    </h1>
                    <nav className="text-xs text-gray-500 mt-1">
                        <Link to="/admin" className="hover:text-blue-500">
                            Home
                        </Link>
                        <span className="mx-1">›</span>
                        <Link
                            to="/admin/catalog/categories"
                            className="hover:text-blue-500"
                        >
                            Categories
                        </Link>
                        <span className="mx-1">›</span>
                        <span>Add Category</span>
                    </nav>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={handleSubmit}
                        disabled={submitting}
                        className="bg-[#1e91cf] text-white p-2 rounded hover:bg-[#1978ab] disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Save"
                    >
                        <Save size={18} />
                    </button>
                    <Link
                        to="/admin/catalog/categories"
                        className="bg-gray-100 text-gray-600 border border-gray-300 p-2 rounded hover:bg-gray-200"
                        title="Cancel"
                    >
                        <Undo size={18} />
                    </Link>
                </div>
            </div>

            <div className="bg-white rounded shadow border border-gray-200">
                <div className="px-4 py-3 bg-gray-50 border-b flex items-center gap-2">
                    <span className="text-gray-500">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                    </span>
                    <h3 className="font-semibold text-gray-600">
                        Add Category
                    </h3>
                </div>

                <div className="p-4">
                    <div className="border-b border-gray-200 mb-6">
                        <ul className="flex flex-wrap -mb-px text-sm font-medium text-center text-gray-500">
                            <li className="mr-2">
                                <button
                                    onClick={() => setActiveTab("general")}
                                    className={`inline-block p-4 border-t-2 rounded-t-lg ${
                                        activeTab === "general"
                                            ? "text-[#1e91cf] border-[#1e91cf] border-x border-x-gray-200 bg-white -mb-[1px]"
                                            : "border-transparent hover:text-gray-600 hover:border-gray-300"
                                    }`}
                                >
                                    General
                                </button>
                            </li>
                            <li className="mr-2">
                                <button
                                    onClick={() => setActiveTab("data")}
                                    className={`inline-block p-4 border-t-2 rounded-t-lg ${
                                        activeTab === "data"
                                            ? "text-[#1e91cf] border-[#1e91cf] border-x border-x-gray-200 bg-white -mb-[1px]"
                                            : "border-transparent hover:text-gray-600 hover:border-gray-300"
                                    }`}
                                >
                                    Data
                                </button>
                            </li>
                            <li className="mr-2">
                                <button
                                    onClick={() => setActiveTab("seo")}
                                    className={`inline-block p-4 border-t-2 rounded-t-lg ${
                                        activeTab === "seo"
                                            ? "text-[#1e91cf] border-[#1e91cf] border-x border-x-gray-200 bg-white -mb-[1px]"
                                            : "border-transparent hover:text-gray-600 hover:border-gray-300"
                                    }`}
                                >
                                    SEO
                                </button>
                            </li>
                        </ul>
                    </div>

                    <form onSubmit={handleSubmit}>
                        {/* General Tab */}
                        <div
                            className={
                                activeTab === "general" ? "block" : "hidden"
                            }
                        >
                            <div className="mb-4 grid grid-cols-12 gap-4 items-center">
                                <label className="col-span-2 text-right text-sm font-medium text-gray-700">
                                    <span className="text-red-500 font-bold">
                                        *
                                    </span>{" "}
                                    Category Name
                                </label>
                                <div className="col-span-10">
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-[#1e91cf]"
                                        placeholder="Category Name"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="mb-4 grid grid-cols-12 gap-4 items-start">
                                <label className="col-span-2 text-right text-sm font-medium text-gray-700 mt-2">
                                    Description
                                </label>
                                <div className="col-span-10">
                                    <TextEditor
                                        placeholder="Description"
                                        value={formData.description}
                                        onChange={(value) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                description: value,
                                            }))
                                        }
                                    />
                                </div>
                            </div>

                            <div className="mb-4 grid grid-cols-12 gap-4 items-center">
                                <label className="col-span-2 text-right text-sm font-medium text-gray-700">
                                    Meta Tag Title
                                </label>
                                <div className="col-span-10">
                                    <input
                                        type="text"
                                        name="meta_title"
                                        value={formData.meta_title}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-[#1e91cf]"
                                        placeholder="Meta Tag Title"
                                    />
                                </div>
                            </div>

                            <div className="mb-4 grid grid-cols-12 gap-4 items-center">
                                <label className="col-span-2 text-right text-sm font-medium text-gray-700">
                                    Meta Tag Description
                                </label>
                                <div className="col-span-10">
                                    <textarea
                                        name="meta_description"
                                        value={formData.meta_description}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-[#1e91cf]"
                                        rows="3"
                                        placeholder="Meta Tag Description"
                                    ></textarea>
                                </div>
                            </div>

                            <div className="mb-4 grid grid-cols-12 gap-4 items-center">
                                <label className="col-span-2 text-right text-sm font-medium text-gray-700">
                                    Meta Tag Keywords
                                </label>
                                <div className="col-span-10">
                                    <textarea
                                        name="meta_keyword"
                                        value={formData.meta_keyword}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-[#1e91cf]"
                                        rows="3"
                                        placeholder="Meta Tag Keywords"
                                    ></textarea>
                                </div>
                            </div>
                        </div>

                        {/* Data Tab */}
                        <div
                            className={
                                activeTab === "data" ? "block" : "hidden"
                            }
                        >
                            <div className="mb-4 grid grid-cols-12 gap-4 items-center">
                                <label className="col-span-2 text-right text-sm font-medium text-gray-700">
                                    Parent
                                </label>
                                <div className="col-span-10">
                                    <input
                                        type="number"
                                        name="parent_id"
                                        value={formData.parent_id}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-[#1e91cf]"
                                        placeholder="0 for top-level category"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        Enter 0 for top-level category or parent
                                        category ID
                                    </p>
                                </div>
                            </div>

                            <div className="mb-4 grid grid-cols-12 gap-4 items-center">
                                <label className="col-span-2 text-right text-sm font-medium text-gray-700">
                                    Image
                                </label>
                                <div className="col-span-10">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-[#1e91cf] mb-2"
                                    />
                                    <p className="text-xs text-gray-500 mb-2">
                                        Upload an image (JPEG, PNG, GIF, WebP -
                                        Max 2MB)
                                    </p>
                                    {imagePreview && (
                                        <div className="w-32 h-32 border border-gray-300 flex items-center justify-center bg-gray-50">
                                            <img
                                                src={imagePreview}
                                                alt="Preview"
                                                className="max-w-full max-h-full object-contain"
                                            />
                                        </div>
                                    )}
                                    {!imagePreview && (
                                        <div className="w-32 h-32 border border-gray-300 flex items-center justify-center bg-gray-50">
                                            <Image
                                                size={32}
                                                className="text-gray-400"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="mb-4 grid grid-cols-12 gap-4 items-center">
                                <label className="col-span-2 text-right text-sm font-medium text-gray-700">
                                    Top
                                </label>
                                <div className="col-span-10">
                                    <input
                                        type="checkbox"
                                        name="top"
                                        checked={formData.top}
                                        onChange={handleInputChange}
                                        className="w-4 h-4"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        Display in the top menu bar. Only works
                                        for the top parent categories.
                                    </p>
                                </div>
                            </div>

                            <div className="mb-4 grid grid-cols-12 gap-4 items-center">
                                <label className="col-span-2 text-right text-sm font-medium text-gray-700">
                                    Sort Order
                                </label>
                                <div className="col-span-10">
                                    <input
                                        type="number"
                                        name="sort_order"
                                        value={formData.sort_order}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-[#1e91cf]"
                                        placeholder="0"
                                    />
                                </div>
                            </div>

                            <div className="mb-4 grid grid-cols-12 gap-4 items-center">
                                <label className="col-span-2 text-right text-sm font-medium text-gray-700">
                                    Status
                                </label>
                                <div className="col-span-10">
                                    <select
                                        name="status"
                                        value={formData.status ? "1" : "0"}
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                status: e.target.value === "1",
                                            }))
                                        }
                                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-[#1e91cf]"
                                    >
                                        <option value="1">Enabled</option>
                                        <option value="0">Disabled</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* SEO Tab */}
                        <div
                            className={activeTab === "seo" ? "block" : "hidden"}
                        >
                            <div className="mb-4 grid grid-cols-12 gap-4 items-center">
                                <label className="col-span-2 text-right text-sm font-medium text-gray-700">
                                    SEO Title
                                </label>
                                <div className="col-span-10">
                                    <input
                                        type="text"
                                        name="meta_title"
                                        value={formData.meta_title}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-[#1e91cf]"
                                        placeholder="SEO Title (same as Meta Tag Title)"
                                    />
                                </div>
                            </div>

                            <div className="mb-4 grid grid-cols-12 gap-4 items-center">
                                <label className="col-span-2 text-right text-sm font-medium text-gray-700">
                                    SEO Description
                                </label>
                                <div className="col-span-10">
                                    <textarea
                                        name="meta_description"
                                        value={formData.meta_description}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-[#1e91cf]"
                                        rows="3"
                                        placeholder="SEO Description (same as Meta Tag Description)"
                                    ></textarea>
                                </div>
                            </div>

                            <div className="mb-4 grid grid-cols-12 gap-4 items-center">
                                <label className="col-span-2 text-right text-sm font-medium text-gray-700">
                                    SEO Keywords
                                </label>
                                <div className="col-span-10">
                                    <textarea
                                        name="meta_keyword"
                                        value={formData.meta_keyword}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-[#1e91cf]"
                                        rows="3"
                                        placeholder="SEO Keywords (same as Meta Tag Keywords)"
                                    ></textarea>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddCategoriesPage;
