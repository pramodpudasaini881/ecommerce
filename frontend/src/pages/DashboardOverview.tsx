import { useQuery } from "@tanstack/react-query";
import {
    DollarSign,
    ShoppingBag,
    Users,
    Package,
    TrendingUp,
    ArrowUpRight,
    ArrowDownRight
} from "lucide-react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area
} from "recharts";
import {
    getDashboardStats,
    getSalesAnalytics,
    getRecentOrders
} from "@/api/adminService";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const DashboardOverview = () => {
    const { data: stats, isLoading: statsLoading } = useQuery({
        queryKey: ["adminStats"],
        queryFn: getDashboardStats,
    });

    const { data: salesData, isLoading: salesLoading } = useQuery({
        queryKey: ["salesAnalytics"],
        queryFn: getSalesAnalytics,
    });

    const { data: recentOrders, isLoading: ordersLoading } = useQuery({
        queryKey: ["recentOrders"],
        queryFn: getRecentOrders,
    });

    const statCards = [
        {
            title: "Total Revenue",
            value: `$${stats?.totalSales.toLocaleString() || "0"}`,
            icon: DollarSign,
            trend: "+12.5%",
            trendUp: true,
            description: "from last month"
        },
        {
            title: "Total Orders",
            value: stats?.totalOrders.toString() || "0",
            icon: ShoppingBag,
            trend: "+5.2%",
            trendUp: true,
            description: "from last month"
        },
        {
            title: "Total Users",
            value: stats?.totalUsers.toString() || "0",
            icon: Users,
            trend: "+3.1%",
            trendUp: true,
            description: "from last month"
        },
        {
            title: "Total Products",
            value: stats?.totalProducts.toString() || "0",
            icon: Package,
            trend: "0%",
            trendUp: true,
            description: "from last month"
        },
    ];

    if (statsLoading || salesLoading || ordersLoading) {
        return <div className="p-8">Loading dashboard analytics...</div>;
    }

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
                <p className="text-muted-foreground">
                    Welcome back! Here's what's happening in your shop today.
                </p>
            </div>

            {/* Stat Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {statCards.map((stat, index) => (
                    <Card key={index} className="overflow-hidden border-none shadow-sm bg-background">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                {stat.title}
                            </CardTitle>
                            <div className="h-8 w-8 rounded-lg bg-secondary/50 flex items-center justify-center">
                                <stat.icon className="h-4 w-4 text-primary" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <div className="flex items-center gap-1 mt-1">
                                {stat.trendUp ? (
                                    <ArrowUpRight className="h-3 w-3 text-green-500" />
                                ) : (
                                    <ArrowDownRight className="h-3 w-3 text-red-500" />
                                )}
                                <span className={stat.trendUp ? "text-green-500 text-xs font-medium" : "text-red-500 text-xs font-medium"}>
                                    {stat.trend}
                                </span>
                                <span className="text-muted-foreground text-[10px] ml-1">
                                    {stat.description}
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                {/* Sales Chart */}
                <Card className="lg:col-span-4 border-none shadow-sm bg-background">
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-primary" />
                            Sales Analytics
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="h-[350px] pl-2">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={salesData}>
                                <defs>
                                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#D4AF37" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis
                                    dataKey="_id"
                                    stroke="#888888"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis
                                    stroke="#888888"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(value) => `$${value}`}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#fff',
                                        borderRadius: '8px',
                                        border: '1px solid #f0f0f0',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                                    }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="totalSales"
                                    stroke="#D4AF37"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorSales)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Recent Orders */}
                <Card className="lg:col-span-3 border-none shadow-sm bg-background">
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold">Recent Orders</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {(recentOrders || []).map((order) => (
                                <div key={order._id} className="flex items-center justify-between">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium">{order.user?.name || "Guest"}</span>
                                        <span className="text-xs text-muted-foreground">{order.user?.email}</span>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className="text-sm font-bold text-primary">
                                            ${order.totalPrice.toFixed(2)}
                                        </span>
                                        <span className={cn(
                                            "text-[10px] px-2 py-0.5 rounded-full font-medium uppercase",
                                            order.isDelivered ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                                        )}>
                                            {order.isDelivered ? "Delivered" : "Processing"}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default DashboardOverview;
