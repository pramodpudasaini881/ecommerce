import apiClient from "./apiClient";

export interface User {
    _id: string;
    name: string;
    email: string;
    isAdmin: boolean;
    token: string;
    addresses?: any[];
}

export const login = async (email: string, password: string) => {
    const { data } = await apiClient.post<User>("/users/login", { email, password });
    return data;
};

export const signup = async (email: string, password: string, name: string) => {
    const { data } = await apiClient.post("/users/register", { email, password, name });
    return data;
};

export const getUserProfile = async () => {
    const { data } = await apiClient.get<User>("/users/profile");
    return data;
};

export const updateUserProfile = async (user: Partial<User>) => {
    const { data } = await apiClient.put<User>("/users/profile", user);
    return data;
};
