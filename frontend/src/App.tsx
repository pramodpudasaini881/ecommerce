import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import ProductDetail from "./pages/ProductDetail";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import Sale from "./pages/Sale";
import StaticPage from "./pages/StaticPage";
import AdminRoute from "./components/AdminRoute";
import AdminLayout from "./components/AdminLayout";
import DashboardOverview from "./pages/DashboardOverview";
import AdminProducts from "./pages/AdminProducts";
import AdminCategories from "./pages/AdminCategories";
import AdminOrders from "./pages/AdminOrders";
import AdminUsers from "./pages/AdminUsers";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
    <QueryClientProvider client={queryClient}>
        <TooltipProvider>
            <AuthProvider>
                <CartProvider>
                    <Toaster />
                    <Sonner />
                    <BrowserRouter>
                        <Routes>
                            <Route path="/" element={<Index />} />
                            <Route path="/product/:id" element={<ProductDetail />} />
                            <Route path="/checkout" element={<Checkout />} />
                            <Route path="/order-confirmation/:orderNumber" element={<OrderConfirmation />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/signup" element={<Signup />} />
                            <Route path="/profile" element={<Profile />} />

                            <Route path="/profile" element={<Profile />} />
                            <Route path="/sale" element={<Sale />} />
                            <Route path="/page/:slug" element={<StaticPage />} />

                            {/* Admin Routes */}
                            <Route element={<AdminRoute />}>
                                <Route element={<AdminLayout />}>
                                    <Route path="/admin/dashboard" element={<DashboardOverview />} />
                                    <Route path="/admin/categories" element={<AdminCategories />} />
                                    <Route path="/admin/products" element={<AdminProducts />} />
                                    <Route path="/admin/orders" element={<AdminOrders />} />
                                    <Route path="/admin/users" element={<AdminUsers />} />
                                </Route>
                            </Route>

                            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                            <Route path="*" element={<NotFound />} />
                        </Routes>
                    </BrowserRouter>
                </CartProvider>
            </AuthProvider>
        </TooltipProvider>
    </QueryClientProvider>
);

export default App;
