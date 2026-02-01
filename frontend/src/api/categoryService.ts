import apiClient from "./apiClient";

export interface Category {
    _id: string;
    name: string;
    description?: string;
}

export const getAllCategories = async () => {
    const { data } = await apiClient.get<Category[]>("/categories");
    return data;
};

export const getCategoryById = async (id: string) => {
    const { data } = await apiClient.get<Category>(`/categories/${id}`);
    return data;
};

export const createCategory = async (categoryData: Partial<Category>) => {
    const { data } = await apiClient.post<Category>("/categories", categoryData);
    return data;
};

export const updateCategory = async (id: string, categoryData: Partial<Category>) => {
    const { data } = await apiClient.put<Category>(`/categories/${id}`, categoryData);
    return data;
};

export const deleteCategory = async (id: string) => {
    const { data } = await apiClient.delete(`/categories/${id}`);
    return data;
};
