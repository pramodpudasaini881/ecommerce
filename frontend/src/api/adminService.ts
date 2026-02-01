import apiClient from "./apiClient";

export interface DashboardStats {
    totalSales: number;
    totalOrders: number;
    totalUsers: number;
    totalProducts: number;
}

export interface SalesData {
    _id: string; // date string YYYY-MM
    totalSales: number;
    count: number;
}

export interface CategoryDistribution {
    _id: string;
    count: number;
    name: string;
}

// Stats & Analytics
export const getDashboardStats = async () => {
    const { data } = await apiClient.get<DashboardStats>("/dashboard/stats");
    return data;
};

export const getSalesAnalytics = async () => {
    const { data } = await apiClient.get<SalesData[]>("/dashboard/sales");
    return data;
};

export const getCategoryDistribution = async () => {
    const { data } = await apiClient.get<CategoryDistribution[]>("/dashboard/categories");
    return data;
};

export const getRecentOrders = async () => {
    const { data } = await apiClient.get<any[]>("/dashboard/recent-orders");
    return data;
};

// User Management
export const getAllUsers = async () => {
    const { data } = await apiClient.get<any[]>("/users");
    return data;
};

export const deleteUser = async (id: string) => {
    const { data } = await apiClient.delete(`/users/${id}`);
    return data;
};

export const updateUser = async (id: string, userData: any) => {
    const { data } = await apiClient.put(`/users/${id}`, userData);
    return data;
};

// Order Management
export const getAllOrders = async () => {
    const { data } = await apiClient.get<any[]>("/orders");
    return data;
};

export const deliverOrder = async (orderId: string) => {
    const { data } = await apiClient.put(`/orders/${orderId}/deliver`);
    return data;
};

export const markOrderAsPaid = async (orderId: string) => {
    const { data } = await apiClient.put(`/orders/${orderId}/pay`, {
        id: "MANUAL_ADMIN",
        status: "COMPLETED",
        update_time: new Date().toISOString(),
        payer: { email_address: "admin@example.com" }
    });
    return data;
};
