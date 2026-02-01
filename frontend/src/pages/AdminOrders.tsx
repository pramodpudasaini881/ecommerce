import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    ShoppingBag,
    Search,
    Eye,
    Truck,
    CheckCircle2,
    Clock,
    AlertCircle,
    CreditCard
} from "lucide-react";
import { toast } from "sonner";
import { getAllOrders, deliverOrder, markOrderAsPaid } from "@/api/adminService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

const AdminOrders = () => {
    const queryClient = useQueryClient();

    const { data: orders, isLoading } = useQuery({
        queryKey: ["adminOrders"],
        queryFn: getAllOrders,
    });

    const deliverMutation = useMutation({
        mutationFn: (id: string) => deliverOrder(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["adminOrders"] });
            toast.success("Order marked as delivered");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to update order");
        }
    });

    const payMutation = useMutation({
        mutationFn: (id: string) => markOrderAsPaid(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["adminOrders"] });
            toast.success("Order marked as paid");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to update order");
        }
    });

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
                <p className="text-muted-foreground">
                    Monitor and fulfill customer orders.
                </p>
            </div>

            <Card className="border-none shadow-sm overflow-hidden">
                <CardHeader className="bg-background pb-0">
                    <div className="flex items-center gap-4 py-2">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Search orders by ID or user..." className="pl-10 h-10 bg-secondary/20 border-transparent focus:border-input focus:bg-background transition-all" />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent border-b border-border/50">
                                <TableHead>Order ID</TableHead>
                                <TableHead>Customer</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Total</TableHead>
                                <TableHead>Paid</TableHead>
                                <TableHead>Delivered</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-24 text-center">
                                        Loading orders...
                                    </TableCell>
                                </TableRow>
                            ) : (orders || []).length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                                        <div className="flex flex-col items-center justify-center gap-2">
                                            <ShoppingBag className="h-8 w-8 opacity-50" />
                                            <span>No orders found.</span>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                (orders || []).map((order: any) => (
                                    <TableRow key={order._id} className="group hover:bg-secondary/30 transition-colors">
                                        <TableCell className="font-mono text-xs">
                                            {order._id.substring(0, 10)}...
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium">{order.user?.name || "Guest"}</span>
                                                <span className="text-xs text-muted-foreground">{order.user?.email}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-sm">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="font-semibold">
                                            ${order.totalPrice.toFixed(2)}
                                        </TableCell>
                                        <TableCell>
                                            {order.isPaid ? (
                                                <div className="flex items-center gap-1.5 text-green-600">
                                                    <CheckCircle2 className="h-4 w-4" />
                                                    <span className="text-xs font-medium">Yes</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-1.5 text-blue-600 bg-blue-50/50 px-2 py-1 rounded w-fit">
                                                    <Clock className="h-3.5 w-3.5" />
                                                    <span className="text-xs font-medium">Pending</span>
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {order.isDelivered ? (
                                                <div className="flex items-center gap-1.5 text-green-600">
                                                    <CheckCircle2 className="h-4 w-4" />
                                                    <span className="text-xs font-medium">
                                                        {new Date(order.deliveredAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-1.5 text-amber-600 bg-amber-50/50 px-2 py-1 rounded w-fit">
                                                    <AlertCircle className="h-3.5 w-3.5" />
                                                    <span className="text-xs font-medium">Pending</span>
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {!order.isPaid && (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="h-8 gap-1 border-blue-200 hover:bg-blue-50 text-blue-700"
                                                        onClick={() => payMutation.mutate(order._id)}
                                                    >
                                                        <CreditCard className="h-3 w-3" />
                                                        Mark Paid
                                                    </Button>
                                                )}
                                                {!order.isDelivered && order.isPaid && (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="h-8 gap-1 border-green-200 hover:bg-green-50 text-green-700"
                                                        onClick={() => deliverMutation.mutate(order._id)}
                                                    >
                                                        <Truck className="h-3 w-3" />
                                                        Mark Delivered
                                                    </Button>
                                                )}
                                                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-secondary">
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default AdminOrders;
