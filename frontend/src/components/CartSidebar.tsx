import { useNavigate } from "react-router-dom";
import { Plus, Minus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";

interface CartItem {
    id: number;
    name: string;
    price: number;
    image: string;
    quantity: number;
    category: string;
}

interface CartSidebarProps {
    isOpen: boolean;
    onClose: () => void;
    items: CartItem[];
    onUpdateQuantity: (id: number, quantity: number) => void;
    onRemoveItem: (id: number) => void;
}

const CartSidebar = ({
    isOpen,
    onClose,
    items,
    onUpdateQuantity,
    onRemoveItem,
}: CartSidebarProps) => {
    const navigate = useNavigate();
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = subtotal > 200 ? 0 : 15;
    const total = subtotal + shipping;

    const handleCheckout = () => {
        onClose();
        navigate("/checkout");
    };

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className="w-full sm:max-w-lg flex flex-col bg-card">
                <SheetHeader className="border-b border-border pb-4">
                    <SheetTitle className="font-display text-2xl">
                        Shopping Bag ({items.length})
                    </SheetTitle>
                </SheetHeader>

                {items.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center">
                        <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center mb-4">
                            <svg
                                className="w-10 h-10 text-muted-foreground"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                                />
                            </svg>
                        </div>
                        <h3 className="font-display text-xl font-semibold mb-2">
                            Your bag is empty
                        </h3>
                        <p className="text-muted-foreground mb-6">
                            Add items to get started
                        </p>
                        <Button className="btn-gold" onClick={onClose}>
                            Continue Shopping
                        </Button>
                    </div>
                ) : (
                    <>
                        {/* Cart Items */}
                        <div className="flex-1 overflow-y-auto py-4 space-y-4">
                            {items.map((item) => (
                                <div key={item.id} className="flex gap-4">
                                    <div className="w-24 h-28 rounded-lg overflow-hidden bg-secondary flex-shrink-0">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="text-xs text-muted-foreground uppercase tracking-widest">
                                                    {item.category}
                                                </p>
                                                <h4 className="font-medium text-foreground mt-1 truncate">
                                                    {item.name}
                                                </h4>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                                onClick={() => onRemoveItem(item.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        <div className="flex items-center justify-between mt-3">
                                            <div className="flex items-center border border-border rounded-lg">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8"
                                                    onClick={() =>
                                                        onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))
                                                    }
                                                >
                                                    <Minus className="h-3 w-3" />
                                                </Button>
                                                <span className="w-8 text-center text-sm font-medium">
                                                    {item.quantity}
                                                </span>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8"
                                                    onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                                                >
                                                    <Plus className="h-3 w-3" />
                                                </Button>
                                            </div>
                                            <span className="font-display font-semibold">
                                                ${(item.price * item.quantity).toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Cart Summary */}
                        <div className="border-t border-border pt-4 space-y-4">
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Subtotal</span>
                                    <span>${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Shipping</span>
                                    <span>
                                        {shipping === 0 ? (
                                            <span className="text-accent">Free</span>
                                        ) : (
                                            `$${shipping.toFixed(2)}`
                                        )}
                                    </span>
                                </div>
                                {subtotal < 200 && (
                                    <p className="text-xs text-muted-foreground">
                                        Add ${(200 - subtotal).toFixed(2)} more for free shipping
                                    </p>
                                )}
                            </div>
                            <Separator />
                            <div className="flex justify-between font-display text-lg font-semibold">
                                <span>Total</span>
                                <span>${total.toFixed(2)}</span>
                            </div>
                            <Button
                                className="w-full btn-gold h-12 text-sm uppercase tracking-widest"
                                onClick={handleCheckout}
                            >
                                Proceed to Checkout
                            </Button>
                            <Button
                                variant="ghost"
                                className="w-full text-sm text-muted-foreground"
                                onClick={onClose}
                            >
                                Continue Shopping
                            </Button>
                        </div>
                    </>
                )}
            </SheetContent>
        </Sheet>
    );
};

export default CartSidebar;
