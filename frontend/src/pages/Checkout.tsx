import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Check, Package, CreditCard, MapPin } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/contexts/CartContext";
import { useAuth, Address } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import PromoBar from "@/components/PromoBar";
import Footer from "@/components/Footer";
import ShippingForm, { ShippingFormData } from "@/components/checkout/ShippingForm";
import PaymentForm from "@/components/checkout/PaymentForm";
import OrderSummary from "@/components/checkout/OrderSummary";
import SavedAddressSelector from "@/components/checkout/SavedAddressSelector";
import { createOrder } from "@/api/orderService";

type CheckoutStep = "shipping" | "payment";

const Checkout = () => {
    const navigate = useNavigate();
    const { cartItems, cartItemCount, clearCart, total, subtotal } = useCart();
    const { user, isAuthenticated, addAddress } = useAuth();
    const [currentStep, setCurrentStep] = useState<CheckoutStep>("shipping");
    const [shippingData, setShippingData] = useState<ShippingFormData | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
    const [useNewAddress, setUseNewAddress] = useState(false);

    // Auto-select default address when user is logged in
    useEffect(() => {
        if (isAuthenticated && user?.addresses && user.addresses.length > 0) {
            const defaultAddress = user.addresses.find((addr) => addr.isDefault) || user.addresses[0];
            setSelectedAddressId(defaultAddress.id);
        }
    }, [isAuthenticated, user?.addresses]);

    const convertAddressToShippingData = (address: Address): ShippingFormData => {
        return {
            firstName: address.firstName,
            lastName: address.lastName,
            email: user?.email || "",
            phone: address.phone || "",
            address: address.address,
            apartment: address.apartment,
            city: address.city,
            state: address.state,
            zipCode: address.zipCode,
            country: address.country || "United States",
        };
    };

    const handleSelectSavedAddress = (address: Address) => {
        setSelectedAddressId(address.id);
        setUseNewAddress(false);
    };

    const handleUseNewAddress = () => {
        setSelectedAddressId(null);
        setUseNewAddress(true);
    };

    const steps = [
        { id: "shipping", label: "Shipping", icon: MapPin },
        { id: "payment", label: "Payment", icon: CreditCard },
        { id: "confirmation", label: "Confirmation", icon: Package },
    ];

    const handleShippingSubmit = (data: ShippingFormData, saveAddress?: boolean) => {
        setShippingData(data);

        if (saveAddress && isAuthenticated && addAddress) {
            addAddress({
                firstName: data.firstName,
                lastName: data.lastName,
                address: data.address,
                apartment: data.apartment,
                city: data.city,
                state: data.state,
                zipCode: data.zipCode,
                country: data.country,
                phone: data.phone,
                isDefault: !user?.addresses?.length, // Make default if no addresses exist
            });
            toast.success("Address saved to your profile");
        }

        setCurrentStep("payment");
        toast.success("Shipping information saved");
    };

    const handleUseSavedAddress = () => {
        if (selectedAddressId && user?.addresses) {
            const selectedAddress = user.addresses.find((addr) => addr.id === selectedAddressId);
            if (selectedAddress) {
                const shippingData = convertAddressToShippingData(selectedAddress);
                setShippingData(shippingData);
                setCurrentStep("payment");
                toast.success("Using saved address");
            }
        }
    };

    const handlePaymentSubmit = async () => {
        setIsProcessing(true);

        try {
            // Prepare order items for backend
            const orderItems = cartItems.map((item) => {
                const productId = item.id || (item as any)._id;
                if (!productId) {
                    console.error("Missing product ID for item:", item);
                    throw new Error(`Product ID is missing for ${item.name}`);
                }
                return {
                    name: item.name,
                    qty: item.quantity,
                    image: item.image,
                    price: item.price,
                    product: productId,
                };
            });

            console.log("Submitting Order Payload:", {
                orderItems,
                shippingAddress: {
                    address: shippingData!.address,
                    city: shippingData!.city,
                    postalCode: shippingData!.zipCode,
                    country: shippingData!.country,
                },
                itemsPrice: subtotal,
                totalPrice: total
            });

            // Create order on backend
            const createdOrder = await createOrder({
                orderItems,
                shippingAddress: {
                    address: shippingData!.address,
                    city: shippingData!.city,
                    postalCode: shippingData!.zipCode, // Map zipCode to postalCode
                    country: shippingData!.country,
                } as any,
                paymentMethod: "Credit Card",
                itemsPrice: subtotal,
                taxPrice: 0,
                shippingPrice: 15,
                totalPrice: total,
            });

            // Clear cart and navigate to confirmation
            clearCart();
            navigate(`/order-confirmation/${createdOrder._id}`, {
                state: {
                    orderNumber: createdOrder._id,
                    shippingData,
                    total,
                    itemCount: cartItemCount,
                },
            });
            toast.success("Order placed successfully!");
        } catch (error) {
            console.error("Order creation error:", error);
            toast.error("Failed to place order. Please try again.");
        } finally {
            setIsProcessing(false);
        }
    };

    if (cartItems.length === 0 && currentStep === "shipping") {
        return (
            <div className="min-h-screen bg-background">
                <PromoBar />
                <Navbar cartItemCount={0} onCartClick={() => { }} />
                <main className="container mx-auto px-4 py-16 text-center">
                    <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <h1 className="font-display text-3xl font-semibold mb-4">Your cart is empty</h1>
                    <p className="text-muted-foreground mb-8">Add some items to continue to checkout</p>
                    <button
                        onClick={() => navigate("/")}
                        className="btn-gold px-8 py-3 rounded-lg"
                    >
                        Continue Shopping
                    </button>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <PromoBar />
            <Navbar cartItemCount={cartItemCount} onCartClick={() => { }} />

            <main className="container mx-auto px-4 py-8">
                {/* Progress Steps */}
                <div className="max-w-2xl mx-auto mb-12">
                    <div className="flex items-center justify-center">
                        {steps.map((step, index) => {
                            const Icon = step.icon;
                            const isActive = step.id === currentStep;
                            const isCompleted =
                                (step.id === "shipping" && currentStep === "payment") ||
                                step.id === "confirmation";

                            return (
                                <div key={step.id} className="flex items-center">
                                    <div className="flex flex-col items-center">
                                        <div
                                            className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isActive
                                                ? "bg-primary text-primary-foreground"
                                                : isCompleted
                                                    ? "bg-accent text-accent-foreground"
                                                    : "bg-secondary text-muted-foreground"
                                                }`}
                                        >
                                            {isCompleted && step.id !== "confirmation" ? (
                                                <Check className="h-5 w-5" />
                                            ) : (
                                                <Icon className="h-5 w-5" />
                                            )}
                                        </div>
                                        <span
                                            className={`mt-2 text-sm ${isActive ? "text-foreground font-medium" : "text-muted-foreground"
                                                }`}
                                        >
                                            {step.label}
                                        </span>
                                    </div>
                                    {index < steps.length - 1 && (
                                        <div
                                            className={`w-16 sm:w-24 h-0.5 mx-2 ${isCompleted ? "bg-accent" : "bg-border"
                                                }`}
                                        />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Main Content */}
                <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    <div className="lg:col-span-2">
                        <div className="bg-card border border-border rounded-xl p-6 sm:p-8">
                            {currentStep === "shipping" && (
                                <>
                                    <h1 className="font-display text-2xl font-semibold mb-6">
                                        Shipping Information
                                    </h1>

                                    {isAuthenticated && user?.addresses && user.addresses.length > 0 && (
                                        <>
                                            <SavedAddressSelector
                                                addresses={user.addresses}
                                                selectedAddressId={selectedAddressId}
                                                onSelectAddress={handleSelectSavedAddress}
                                                onUseNewAddress={handleUseNewAddress}
                                                useNewAddress={useNewAddress}
                                            />

                                            {selectedAddressId && !useNewAddress && (
                                                <button
                                                    onClick={handleUseSavedAddress}
                                                    className="w-full btn-gold h-12 uppercase tracking-widest rounded-lg mb-6"
                                                >
                                                    Continue with this address
                                                </button>
                                            )}
                                        </>
                                    )}

                                    {(useNewAddress || !isAuthenticated || !user?.addresses?.length) && (
                                        <ShippingForm
                                            onSubmit={handleShippingSubmit}
                                            defaultValues={shippingData || undefined}
                                            showSaveOption={isAuthenticated}
                                        />
                                    )}
                                </>
                            )}

                            {currentStep === "payment" && (
                                <>
                                    <h1 className="font-display text-2xl font-semibold mb-6">
                                        Payment Details
                                    </h1>

                                    {/* Shipping Summary */}
                                    {shippingData && (
                                        <div className="bg-secondary/30 rounded-lg p-4 mb-6">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="text-sm text-muted-foreground mb-1">Shipping to:</p>
                                                    <p className="font-medium">
                                                        {shippingData.firstName} {shippingData.lastName}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {shippingData.address}
                                                        {shippingData.apartment && `, ${shippingData.apartment}`}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {shippingData.city}, {shippingData.state} {shippingData.zipCode}
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={() => setCurrentStep("shipping")}
                                                    className="text-sm text-accent hover:underline"
                                                >
                                                    Edit
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    <PaymentForm
                                        onSubmit={handlePaymentSubmit}
                                        onBack={() => setCurrentStep("shipping")}
                                        isProcessing={isProcessing}
                                    />
                                </>
                            )}
                        </div>
                    </div>

                    <div className="lg:col-span-1">
                        <OrderSummary />
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Checkout;
