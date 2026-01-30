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

export const getProducts = async (keyword = "", category = "", pageNumber = "") => {
    const { data } = await apiClient.get<ProductsResponse>(
        `/products?keyword=${keyword}&category=${category}&pageNumber=${pageNumber}`
    );
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
