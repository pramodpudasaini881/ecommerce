import apiClient from "./apiClient";

export interface OrderItem {
    name: string;
    qty: number;
    image: string;
    price: number;
    product: string;
}

export interface ShippingAddress {
    address: string;
    city: string;
    zipCode: string;
    country: string;
}

export interface Order {
    _id: string;
    orderItems: OrderItem[];
    shippingAddress: ShippingAddress;
    paymentMethod: string;
    itemsPrice: number;
    taxPrice: number;
    shippingPrice: number;
    totalPrice: number;
    isPaid: boolean;
    paidAt?: string;
    isDelivered: boolean;
    deliveredAt?: string;
    createdAt: string;
}

export const createOrder = async (order: Omit<Order, "_id" | "isPaid" | "isDelivered" | "createdAt">) => {
    const { data } = await apiClient.post<Order>("/orders", order);
    return data;
};

export const getOrderDetails = async (id: string) => {
    const { data } = await apiClient.get<Order>(`/orders/${id}`);
    return data;
};

export const getMyOrders = async () => {
    const { data } = await apiClient.get<Order[]>("/orders/myorders");
    return data;
};
