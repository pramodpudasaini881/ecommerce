import apiClient from "./apiClient";

export interface Product {
    _id: string;
    name: string;
    description: string;
    price: number;
    countInStock: number;
    image: string;
    images?: string[];
    category: any;
    rating: number;
    numReviews: number;
    reviews: any[];
    brand?: string;
    sizes?: string[];
    colors?: string[];
}

export interface ProductsResponse {
    products: Product[];
    page: number;
    pages: number;
}

export const getProducts = async (keyword = "", category = "", sale = false, sort = "") => {
    let url = `/products?keyword=${keyword}`;
    if (category) url += `&category=${category}`;
    if (sale) url += `&sale=true`;
    if (sort) url += `&sort=${sort}`;
    const { data } = await apiClient.get<ProductsResponse>(url);
    return data;
};

export const getProductById = async (id: string) => {
    const { data } = await apiClient.get<Product>(`/products/${id}`);
    return data;
};

export const createProductReview = async (productId: string, review: { rating: number; comment: string }) => {
    const { data } = await apiClient.post(`/products/${productId}/reviews`, review);
    return data;
};

export const createProduct = async (productData: any) => {
    const { data } = await apiClient.post<Product>("/products", productData);
    return data;
};

export const updateProduct = async (id: string, productData: any) => {
    const { data } = await apiClient.put<Product>(`/products/${id}`, productData);
    return data;
};

export const deleteProduct = async (id: string) => {
    const { data } = await apiClient.delete(`/products/${id}`);
    return data;
};

export const uploadImage = async (formData: FormData) => {
    const { data } = await apiClient.post("/upload", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return data;
};
