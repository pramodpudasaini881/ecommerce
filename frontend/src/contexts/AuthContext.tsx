import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "sonner";
import * as authService from "@/api/authService";

export interface User {
    _id: string;
    email: string;
    name: string;
    isAdmin: boolean;
    token: string;
    addresses: Address[];
    orders?: Order[];
}

export interface Address {
    id: string;
    firstName: string;
    lastName: string;
    address: string;
    apartment?: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    phone?: string;
    isDefault: boolean;
}

interface Order {
    id: string;
    orderNumber: string;
    date: string;
    status: "processing" | "shipped" | "delivered";
    total: number;
    items: { name: string; quantity: number; price: number }[];
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    signup: (email: string, password: string, name: string) => Promise<string | null>;
    logout: () => void;
    updateProfile: (data: Partial<User>) => void;
    addAddress: (address: Omit<Address, "id">) => void;
    removeAddress: (id: string) => void;
    setDefaultAddress: (id: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("userInfo");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const saveUser = (userData: any) => {
        const userToSave = {
            ...userData,
            addresses: userData.addresses || [],
            orders: userData.orders || []
        };
        localStorage.setItem("userInfo", JSON.stringify(userToSave));
        setUser(userToSave);
    };

    const login = async (email: string, password: string): Promise<boolean> => {
        try {
            const userData = await authService.login(email, password);
            saveUser(userData);
            return true;
        } catch (error) {
            console.error("Login error:", error);
            return false;
        }
    };

    const signup = async (email: string, password: string, name: string): Promise<string | null> => {
        try {
            const data = await authService.signup(email, password, name);
            saveUser(data);
            return null; // No error
        } catch (err: any) {
            console.error("Signup error:", err);
            return err.response?.data?.message || "An account with this email already exists.";
        }
    };

    const logout = () => {
        localStorage.removeItem("userInfo");
        setUser(null);
    };

    const updateProfile = async (data: Partial<User>) => {
        try {
            const updatedUser = await authService.updateUserProfile(data);
            saveUser(updatedUser);
            toast.success("Profile updated successfully");
        } catch (error) {
            console.error("Update profile error:", error);
            toast.error("Failed to update profile");
        }
    };

    const addAddress = async (address: Omit<Address, "id">) => {
        if (user) {
            try {
                const updatedAddresses = [...user.addresses, { ...address, _id: crypto.randomUUID() }];
                const updatedUser = await authService.updateUserProfile({ addresses: updatedAddresses } as any);
                saveUser(updatedUser);
                toast.success("Address added");
            } catch (error) {
                console.error("Add address error:", error);
                toast.error("Failed to add address");
            }
        }
    };

    const removeAddress = async (id: string) => {
        if (user) {
            try {
                const updatedAddresses = user.addresses.filter((a: any) => (a._id || a.id) !== id);
                const updatedUser = await authService.updateUserProfile({ addresses: updatedAddresses } as any);
                saveUser(updatedUser);
                toast.success("Address removed");
            } catch (error) {
                console.error("Remove address error:", error);
                toast.error("Failed to remove address");
            }
        }
    };

    const setDefaultAddress = async (id: string) => {
        if (user) {
            try {
                const updatedAddresses = user.addresses.map((a: any) => ({
                    ...a,
                    isDefault: (a._id || a.id) === id,
                }));
                const updatedUser = await authService.updateUserProfile({ addresses: updatedAddresses } as any);
                saveUser(updatedUser);
                toast.success("Default address set");
            } catch (error) {
                console.error("Set default address error:", error);
                toast.error("Failed to set default address");
            }
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                login,
                signup,
                logout,
                updateProfile,
                addAddress,
                removeAddress,
                setDefaultAddress,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
