import axiosInstance from "../axiosInstance";

/**
 * Get all categories
 * @param {Object} params - Query parameters (language_id, per_page, etc.)
 * @returns {Promise} - Categories data
 */
export async function getAllCategories(params = {}) {
    try {
        const res = await axiosInstance.get("/categories", { params });
        const data = await res.data;
        return data;
    } catch (error) {
        throw error;
    }
}

/**
 * Get single category by ID
 * @param {number} id - Category ID
 * @param {Object} params - Query parameters (language_id, etc.)
 * @returns {Promise} - Category data
 */
export async function getCategoryById(id, params = {}) {
    try {
        const res = await axiosInstance.get(`/categories/${id}`, { params });
        const data = await res.data;
        return data;
    } catch (error) {
        throw error;
    }
}

/**
 * Add new category
 * @param {FormData} formData - Category data as FormData
 * @returns {Promise} - Created category data
 */
export async function addCategory(formData) {
    try {
        const res = await axiosInstance.post("/categories", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        const data = await res.data;
        return data;
    } catch (error) {
        throw error;
    }
}

/**
 * Update category
 * @param {number} id - Category ID
 * @param {FormData} formData - Updated category data as FormData
 * @returns {Promise} - Updated category data
 */
export async function updateCategory(id, formData) {
    try {
        // Laravel doesn't support PUT with multipart/form-data, so we use POST with _method
        formData.append("_method", "PUT");
        const res = await axiosInstance.post(`/categories/${id}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        const data = await res.data;
        return data;
    } catch (error) {
        throw error;
    }
}

/**
 * Delete category
 * @param {number} id - Category ID
 * @returns {Promise} - Delete response
 */
export async function deleteCategory(id) {
    try {
        const res = await axiosInstance.delete(`/categories/${id}`);
        const data = await res.data;
        return data;
    } catch (error) {
        throw error;
    }
}
