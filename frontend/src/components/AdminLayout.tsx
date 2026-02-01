import { Link, Outlet, useLocation } from "react-router-dom";
import {
    LayoutDashboard,
    Package,
    ShoppingBag,
    Users,
    ArrowLeft,
    LogOut,
    Layers
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

const AdminLayout = () => {
    const { pathname } = useLocation();
    const { logout } = useAuth();

    const menuItems = [
        { name: "Overview", icon: LayoutDashboard, path: "/admin/dashboard" },
        { name: "Products", icon: Package, path: "/admin/products" },
        { name: "Categories", icon: Layers, path: "/admin/categories" },
        { name: "Orders", icon: ShoppingBag, path: "/admin/orders" },
        { name: "Users", icon: Users, path: "/admin/users" },
    ];

    return (
        <div className="flex min-h-screen bg-secondary/30">
            {/* Sidebar */}
            <aside className="w-64 bg-background border-r flex flex-col hidden lg:flex">
                <div className="p-6 border-b">
                    <Link to="/" className="flex items-center gap-2">
                        Ecommerce App
                        <span className="text-[10px] bg-accent px-1.5 py-0.5 rounded text-accent-foreground font-bold uppercase">
                            Admin
                        </span>
                    </Link>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                                pathname === item.path
                                    ? "bg-accent text-accent-foreground"
                                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                            )}
                        >
                            <item.icon className="h-4 w-4" />
                            {item.name}
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t space-y-2">
                    <Link
                        to="/"
                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Shop
                    </Link>
                    <button
                        onClick={logout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
                    >
                        <LogOut className="h-4 w-4" />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden">
                <header className="h-16 border-b bg-background flex items-center justify-between px-8 lg:hidden">
                    <span className="font-display text-2xl font-bold text-primary">Ecommerce App</span>
                    {/* Mobile menu toggle would go here */}
                </header>

                <div className="flex-1 overflow-y-auto p-4 lg:p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
