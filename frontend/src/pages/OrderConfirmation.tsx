import { useLocation, useNavigate, useParams } from "react-router-dom";
import { CheckCircle, Package, Truck, Mail, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Navbar from "@/components/Navbar";
import PromoBar from "@/components/PromoBar";
import Footer from "@/components/Footer";
import { useCart } from "@/contexts/CartContext";

const OrderConfirmation = () => {
    const navigate = useNavigate();
    const { orderNumber } = useParams();
    const location = useLocation();
    const { cartItemCount } = useCart();

    const orderData = location.state as {
        orderNumber: string;
        shippingData: {
            firstName: string;
            lastName: string;
            email: string;
            address: string;
            apartment?: string;
            city: string;
            state: string;
            zipCode: string;
        };
        total: number;
        itemCount: number;
    } | null;

    if (!orderData) {
        return (
            <div className="min-h-screen bg-background">
                <PromoBar />
                <Navbar cartItemCount={cartItemCount} onCartClick={() => { }} />
                <main className="container mx-auto px-4 py-16 text-center">
                    <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <h1 className="font-display text-3xl font-semibold mb-4">Order not found</h1>
                    <p className="text-muted-foreground mb-8">
                        The order you're looking for doesn't exist or has expired.
                    </p>
                    <Button onClick={() => navigate("/")} className="btn-gold">
                        Return to Shop
                    </Button>
                </main>
                <Footer />
            </div>
        );
    }

    const estimatedDelivery = new Date();
    estimatedDelivery.setDate(estimatedDelivery.getDate() + 5);

    const timeline = [
        {
            icon: CheckCircle,
            title: "Order Confirmed",
            description: "Your order has been placed successfully",
            date: new Date().toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
            }),
            completed: true,
        },
        {
            icon: Package,
            title: "Processing",
            description: "Your order is being prepared",
            date: "In progress",
            completed: false,
        },
        {
            icon: Truck,
            title: "Shipped",
            description: "Your order is on its way",
            date: estimatedDelivery.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
            }),
            completed: false,
        },
    ];

    return (
        <div className="min-h-screen bg-background">
            <PromoBar />
            <Navbar cartItemCount={cartItemCount} onCartClick={() => { }} />

            <main className="container mx-auto px-4 py-12">
                <div className="max-w-3xl mx-auto">
                    {/* Success Header */}
                    <div className="text-center mb-12">
                        <div className="w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="h-10 w-10 text-accent" />
                        </div>
                        <h1 className="font-display text-3xl sm:text-4xl font-semibold mb-3">
                            Thank You for Your Order!
                        </h1>
                        <p className="text-muted-foreground text-lg">
                            Your order has been confirmed and will be shipped soon.
                        </p>
                    </div>

                    {/* Order Details Card */}
                    <div className="bg-card border border-border rounded-xl p-6 sm:p-8 mb-8">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                            <div>
                                <p className="text-sm text-muted-foreground mb-1">Order Number</p>
                                <p className="font-display text-xl font-semibold">{orderNumber}</p>
                            </div>
                            <div className="text-left sm:text-right">
                                <p className="text-sm text-muted-foreground mb-1">Order Total</p>
                                <p className="font-display text-xl font-semibold">
                                    ${orderData.total.toFixed(2)}
                                </p>
                            </div>
                        </div>

                        <Separator className="mb-6" />

                        {/* Email Confirmation */}
                        <div className="bg-secondary/30 rounded-lg p-4 flex items-center gap-3 mb-6">
                            <Mail className="h-5 w-5 text-muted-foreground" />
                            <p className="text-sm">
                                A confirmation email has been sent to{" "}
                                <span className="font-medium">{orderData.shippingData.email}</span>
                            </p>
                        </div>

                        {/* Shipping Address */}
                        <div className="mb-6">
                            <h3 className="font-medium mb-2">Shipping Address</h3>
                            <div className="text-muted-foreground text-sm space-y-1">
                                <p>
                                    {orderData.shippingData.firstName} {orderData.shippingData.lastName}
                                </p>
                                <p>
                                    {orderData.shippingData.address}
                                    {orderData.shippingData.apartment && `, ${orderData.shippingData.apartment}`}
                                </p>
                                <p>
                                    {orderData.shippingData.city}, {orderData.shippingData.state}{" "}
                                    {orderData.shippingData.zipCode}
                                </p>
                            </div>
                        </div>

                        <Separator className="mb-6" />

                        {/* Order Timeline */}
                        <h3 className="font-medium mb-4">Order Status</h3>
                        <div className="space-y-4">
                            {timeline.map((step, index) => {
                                const Icon = step.icon;
                                return (
                                    <div key={index} className="flex gap-4">
                                        <div className="flex flex-col items-center">
                                            <div
                                                className={`w-10 h-10 rounded-full flex items-center justify-center ${step.completed
                                                        ? "bg-accent text-accent-foreground"
                                                        : "bg-secondary text-muted-foreground"
                                                    }`}
                                            >
                                                <Icon className="h-5 w-5" />
                                            </div>
                                            {index < timeline.length - 1 && (
                                                <div
                                                    className={`w-0.5 h-8 ${step.completed ? "bg-accent" : "bg-border"
                                                        }`}
                                                />
                                            )}
                                        </div>
                                        <div className="pb-4">
                                            <p className="font-medium">{step.title}</p>
                                            <p className="text-sm text-muted-foreground">{step.description}</p>
                                            <p className="text-xs text-muted-foreground mt-1">{step.date}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button
                            variant="outline"
                            className="h-12 px-8"
                            onClick={() => navigate("/")}
                        >
                            Continue Shopping
                        </Button>
                        <Button
                            className="btn-gold h-12 px-8 group"
                            onClick={() => navigate("/")}
                        >
                            Track Order
                            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Button>
                    </div>

                    {/* Help Section */}
                    <div className="mt-12 text-center">
                        <p className="text-muted-foreground">
                            Need help?{" "}
                            <a href="#" className="text-accent hover:underline">
                                Contact our support team
                            </a>
                        </p>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default OrderConfirmation;
